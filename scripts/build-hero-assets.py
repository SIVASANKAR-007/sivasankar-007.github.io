#!/usr/bin/env python3
"""
build-hero-assets.py
--------------------
Turns the raw talking-head intro video into a seamless, looping hero clip and
derives the still images the site needs.

Outputs (written to ./public):
  hero/poster.webp     first frame of the loop (video poster)
  hero/hero.mp4        H.264 yuv420p, CRF 24, AAC 96k, +faststart
  hero/hero.webm       VP9 CRF 36, Opus 80k
  portrait-bust.webp   480x600 head-to-shirt crop (from --photo if given, else the clearest video frame)
  og.jpg               1200x630 social card

Requirements: ffmpeg/ffprobe on PATH, Python 3.9+, numpy, Pillow.

Usage:
  python scripts/build-hero-assets.py --video intro.mp4 [--photo portrait.png]
         [--loop 10] [--fade 0.5] [--crop W:H:X:Y] [--width 768]

How the seamless loop works
  Let L = loop length, X = cross-fade length. We play clip[X .. L] and, during
  its last X seconds, cross-fade into clip[0 .. X]. The output therefore starts
  on frame clip[X] and ends on (a blend that lands on) clip[X] — so when the
  <video loop> wraps around there is no visible jump. Output length is L - X.
  The audio gets the identical treatment, sample-accurately, in numpy
  (equal-power curve), so there is no click. Nothing is stretched or retimed,
  which keeps the lips in sync.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
SR = 48000


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    print("  $", " ".join(str(c) for c in cmd)[:240])
    return subprocess.run(cmd, check=True, **kw)


def probe(path: Path) -> dict:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(path)],
        check=True, capture_output=True,
    ).stdout
    info = json.loads(out)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    num, den = (int(x) for x in v["r_frame_rate"].split("/"))
    return {
        "w": int(v["width"]),
        "h": int(v["height"]),
        "fps": num / den,
        "fps_str": v["r_frame_rate"],
        "dur": float(info["format"]["duration"]),
        "has_audio": any(s["codec_type"] == "audio" for s in info["streams"]),
    }


def grab_gray_frames(path: Path, w: int, h: int, count: int, dur: float) -> np.ndarray:
    """Decode `count` evenly spaced grayscale frames as a (n, h, w) uint8 array."""
    rate = max(count / max(dur, 0.1), 0.1)
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-vf", f"fps={rate:.4f},format=gray",
         "-frames:v", str(count), "-f", "rawvideo", "-"],
        check=True, capture_output=True,
    ).stdout
    n = len(raw) // (w * h)
    return np.frombuffer(raw[: n * w * h], dtype=np.uint8).reshape(n, h, w)


def detect_person_crop(path: Path, meta: dict, aspect: float) -> tuple[int, int, int, int]:
    """Find the union bounding box of 'non-background' pixels across frames and
    return a crop (w, h, x, y) with the requested aspect (w/h), centred on the person."""
    frames = grab_gray_frames(path, meta["w"], meta["h"], 12, meta["dur"])
    bg = np.median(frames[:, :, : max(8, meta["w"] // 20)])  # left edge = backdrop
    mask = (frames.astype(np.int16) < bg - 30).any(axis=0)
    # ignore isolated noise
    cols = np.where(mask.sum(axis=0) > 4)[0]
    rows = np.where(mask.sum(axis=1) > 4)[0]
    if len(cols) == 0 or len(rows) == 0:
        sys.exit("Could not detect the person. Pass --crop W:H:X:Y explicitly.")
    x0, x1, y0, y1 = cols.min(), cols.max(), rows.min(), rows.max()
    print(f"  person bbox x={x0}..{x1} y={y0}..{y1} (backdrop ≈ {bg:.0f})")
    pad = int((y1 - y0) * 0.06)
    ch = min(meta["h"], (y1 - y0) + 2 * pad)
    ch -= ch % 2
    cw = int(round(ch * aspect))
    cw -= cw % 2
    if cw > meta["w"]:
        cw = meta["w"] - meta["w"] % 2
        ch = int(round(cw / aspect)) // 2 * 2
    cx = (x0 + x1) / 2
    cy = (y0 + y1) / 2
    x = int(np.clip(round(cx - cw / 2), 0, meta["w"] - cw))
    y = int(np.clip(round(cy - ch / 2), 0, meta["h"] - ch))
    return cw, ch, x, y


def read_audio(path: Path, seconds: float) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-t", f"{seconds + 0.2}", "-vn",
         "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
        check=True, capture_output=True,
    ).stdout
    a = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()
    need = int(round(seconds * SR))
    if len(a) < need:  # pad with silence if the audio track is slightly short
        a = np.vstack([a, np.zeros((need - len(a), 2), np.float32)])
    return a[:need]


def loop_audio(a: np.ndarray, fade_s: float) -> np.ndarray:
    """Equal-power cross-fade: play a[X:], and over its last X seconds blend into a[:X]."""
    n = int(round(fade_s * SR))
    body = a[n:]
    head = a[:n]
    t = np.linspace(0.0, 1.0, n, endpoint=False, dtype=np.float32)[:, None]
    fade_out = np.cos(t * np.pi / 2)
    fade_in = np.sin(t * np.pi / 2)
    tail = body[-n:] * fade_out + head * fade_in
    out = np.vstack([body[:-n], tail])
    return np.clip(out, -1.0, 1.0)


def write_wav(path: Path, a: np.ndarray) -> None:
    pcm = (a * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def clearest_frame(path: Path, meta: dict, crop: tuple[int, int, int, int]) -> np.ndarray:
    """Pick the sharpest frame (variance of a simple Laplacian on the face area)."""
    frames = grab_gray_frames(path, meta["w"], meta["h"], 24, meta["dur"])
    cw, ch, x, y = crop
    best, best_i = -1.0, 0
    for i, f in enumerate(frames):
        face = f[y : y + ch // 4, x : x + cw].astype(np.float32)
        lap = (-4 * face[1:-1, 1:-1] + face[:-2, 1:-1] + face[2:, 1:-1] + face[1:-1, :-2] + face[1:-1, 2:])
        v = float(lap.var())
        if v > best:
            best, best_i = v, i
    return best_i * meta["dur"] / len(frames)


def make_stills(args, meta, crop) -> None:
    from PIL import Image, ImageOps

    PUBLIC.mkdir(parents=True, exist_ok=True)
    if args.photo:
        src = Image.open(args.photo).convert("RGB")
        w, h = src.size
        # head-to-shirt: keep the top ~92% and centre horizontally at 4:5
        ch = int(h * 0.92)
        cw = int(ch * 0.8)
        if cw > w:
            cw, ch = w, int(w / 0.8)
        left = (w - cw) // 2
        bust = src.crop((left, 0, left + cw, ch))
    else:
        t = clearest_frame(args.video, meta, crop)
        tmp = Path(tempfile.mkdtemp()) / "still.png"
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", str(args.video), "-frames:v", "1", str(tmp)])
        src = Image.open(tmp).convert("RGB")
        cw, ch, x, y = crop
        bh = ch // 3
        bw = int(bh * 0.8)
        cx = x + cw // 2
        bust = src.crop((cx - bw // 2, y, cx + bw // 2, y + bh))
    bust = ImageOps.fit(bust, (480, 600), Image.LANCZOS, centering=(0.5, 0.3))
    bust = ImageOps.grayscale(bust).convert("RGB") if args.gray else bust
    bust.save(PUBLIC / "portrait-bust.webp", "WEBP", quality=82, method=6)
    print("  wrote public/portrait-bust.webp")

    # OG card: paper background, portrait on the right
    og = Image.new("RGB", (1200, 630), (244, 242, 238))
    face = ImageOps.fit(bust, (420, 525), Image.LANCZOS)
    og.paste(face, (1200 - 420 - 70, 52))
    try:
        from PIL import ImageDraw, ImageFont

        d = ImageDraw.Draw(og)
        font_dir = ROOT / "scripts" / "og-fonts"
        big = ImageFont.truetype(str(font_dir / "InterTight-Bold.ttf"), 76) if (font_dir / "InterTight-Bold.ttf").exists() else ImageFont.load_default()
        mid = ImageFont.truetype(str(font_dir / "InterTight-Regular.ttf"), 30) if (font_dir / "InterTight-Regular.ttf").exists() else ImageFont.load_default()
        d.text((70, 200), args.og_name, fill=(13, 13, 13), font=big)
        y = 300
        for line in args.og_role.split("|"):
            d.text((72, y), line.strip(), fill=(119, 117, 111), font=mid)
            y += 44
        d.line((72, 470, 560, 470), fill=(13, 13, 13), width=2)
        d.text((72, 490), args.og_footer, fill=(58, 58, 58), font=mid)
    except Exception as e:  # pragma: no cover - fonts are optional
        print("  (OG text skipped:", e, ")")
    og.save(PUBLIC / "og.jpg", "JPEG", quality=86, optimize=True, progressive=True)
    print("  wrote public/og.jpg")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--video", type=Path, required=True)
    ap.add_argument("--photo", type=Path, help="optional portrait photo for the ID card / OG image")
    ap.add_argument("--loop", type=float, default=10.0, help="seconds of the intro to use")
    ap.add_argument("--fade", type=float, default=0.5, help="cross-fade seconds")
    ap.add_argument("--crop", help="explicit crop W:H:X:Y (skips detection)")
    ap.add_argument("--width", type=int, default=768)
    ap.add_argument("--gray", action="store_true", help="grayscale the portrait")
    ap.add_argument("--og-name", default="Sivasankar T")
    ap.add_argument("--og-role", default="Data & Research Analyst | Business Intelligence & Workforce Analytics")
    ap.add_argument("--og-footer", default="Chennai, India")
    args = ap.parse_args()

    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            sys.exit(f"{tool} not found on PATH")

    meta = probe(args.video)
    print(f"source: {meta['w']}x{meta['h']} @ {meta['fps']:.3f} fps, {meta['dur']:.2f}s, audio={meta['has_audio']}")
    aspect = 768 / 960

    if args.crop:
        cw, ch, x, y = (int(v) for v in args.crop.split(":"))
    else:
        cw, ch, x, y = detect_person_crop(args.video, meta, aspect)
    crop = (cw, ch, x, y)
    print(f"crop={cw}:{ch}:{x}:{y}")

    fps = meta["fps"]
    L = min(args.loop, meta["dur"])
    N = int(np.floor(L * fps + 1e-6))  # frames used
    XF = int(round(args.fade * fps))  # cross-fade frames
    L = N / fps
    X = XF / fps
    out_h = int(round(args.width / aspect)) // 2 * 2
    print(f"loop: {N} frames ({L:.3f}s), fade {XF} frames ({X:.3f}s) -> output {L - X:.3f}s")

    base = (
        f"crop={cw}:{ch}:{x}:{y},scale={args.width}:{out_h}:flags=lanczos,"
        f"colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,format=yuv420p"
    )
    fc = (
        f"[0:v]{base},split[s1][s2];"
        f"[s1]trim=start_frame={XF}:end_frame={N},setpts=PTS-STARTPTS[body];"
        f"[s2]trim=start_frame=0:end_frame={XF},setpts=PTS-STARTPTS[head];"
        f"[body][head]xfade=transition=fade:duration={X:.6f}:offset={(N - 2 * XF) / fps:.6f},format=yuv420p[v]"
    )

    tmp = Path(tempfile.mkdtemp())
    wav = tmp / "loop.wav"
    if meta["has_audio"]:
        a = read_audio(args.video, L)
        write_wav(wav, loop_audio(a, X))
    else:
        write_wav(wav, np.zeros((int(round((L - X) * SR)), 2), np.float32))

    out = PUBLIC / "hero"
    out.mkdir(parents=True, exist_ok=True)
    common = ["ffmpeg", "-v", "error", "-y", "-i", str(args.video), "-i", str(wav),
              "-filter_complex", fc, "-map", "[v]", "-map", "1:a", "-r", meta["fps_str"]]
    run(common + ["-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p",
                  "-profile:v", "high", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart",
                  "-shortest", str(out / "hero.mp4")])
    run(common + ["-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-deadline", "good",
                  "-cpu-used", "2", "-pix_fmt", "yuv420p", "-c:a", "libopus", "-b:a", "80k",
                  "-shortest", str(out / "hero.webm")])
    # Poster = first frame of the loop (shown until the video can play; good for LCP)
    run(["ffmpeg", "-v", "error", "-y", "-i", str(out / "hero.mp4"), "-frames:v", "1",
         "-c:v", "libwebp", "-quality", "78", str(out / "poster.webp")])
    for f in ("hero.mp4", "hero.webm", "poster.webp"):
        print(f"  wrote public/hero/{f} ({(out / f).stat().st_size / 1024:.0f} KB)")

    make_stills(args, meta, crop)
    print("done.")


if __name__ == "__main__":
    main()
