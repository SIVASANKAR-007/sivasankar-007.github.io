"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

type Props = {
  name: string;
  role: string;
  band: string;
  rows: { k: string; v: string }[];
  back: string[];
  email: string;
  portrait: string;
};

/** Deterministic, decorative barcode widths derived from the name. */
function barcode(seed: string) {
  const out: number[] = [];
  for (let i = 0; out.length < 46; i++) {
    const c = seed.charCodeAt(i % seed.length) + i * 7;
    out.push(1 + (c % 3));
  }
  return out;
}

export default function IdCard({ name, role, band, rows, back, email, portrait }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [hover, setHover] = useState(false);
  const lastPointer = useRef<string>("mouse");
  const bars = useMemo(() => barcode(name + role), [name, role]);

  // Damped pendulum: pointer velocity → angular impulse; spring back with damping; idle sway.
  useEffect(() => {
    const root = rootRef.current;
    const swing = swingRef.current;
    if (!root || !swing) return;
    const section = root.closest("section") ?? root;
    if (prefersReducedMotion()) return;

    let theta = 0;
    let omega = 0;
    let lastX: number | null = null;
    let lastT = 0;
    let lastInput = -1e9;
    let raf = 0;
    let prev = 0;
    let running = false;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null) {
        const dt = Math.max(8, now - lastT);
        const vx = (e.clientX - lastX) / dt; // px per ms
        omega += Math.max(-0.9, Math.min(0.9, vx * 0.32));
        lastInput = now;
      }
      lastX = e.clientX;
      lastT = now;
    };
    const onLeave = () => {
      lastX = null;
    };

    const step = (t: number) => {
      const dt = Math.min(0.033, prev ? (t - prev) / 1000 : 0.016);
      prev = t;
      const idle = t - lastInput > 1600;
      const target = idle ? 0.03 * Math.sin(t / 1000 * 1.15) : 0;
      const k = 34;
      const c = idle ? 4.2 : 2.6;
      const alpha = -k * (theta - target) - c * omega;
      omega += alpha * dt;
      theta += omega * dt;
      theta = Math.max(-0.26, Math.min(0.26, theta));
      swing.style.transform = `rotate(${theta}rad)`;
      if (running) raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        prev = 0;
        raf = requestAnimationFrame(step);
      } else if (!e.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(root);
    section.addEventListener("pointermove", onMove as EventListener, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      section.removeEventListener("pointermove", onMove as EventListener);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const shown = flipped || hover;
  const strapText = `${name.toUpperCase()} · ${role.toUpperCase()} · `;

  return (
    <div className="idc" ref={rootRef}>
      <style>{CSS}</style>
      <div className="idc-swing" ref={swingRef}>
        <div className="idc-strap" aria-hidden="true">
          <div className="idc-strap-run">
            <span>{strapText.repeat(4)}</span>
            <span>{strapText.repeat(4)}</span>
          </div>
        </div>
        <div className="idc-clip" aria-hidden="true">
          <i />
        </div>
        <div
          className={`idc-card ${shown ? "is-flipped" : ""}`}
          role="button"
          tabIndex={0}
          aria-pressed={shown}
          aria-describedby="idc-hint"
          onPointerEnter={(e) => {
            lastPointer.current = e.pointerType;
            if (e.pointerType === "mouse") setHover(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setHover(false);
          }}
          onPointerDown={(e) => {
            lastPointer.current = e.pointerType;
          }}
          onClick={() => {
            if (lastPointer.current !== "mouse") setFlipped((f) => !f);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
        >
          <span id="idc-hint" className="sr-only">
            ID card. Press Enter or Space to flip it to the {shown ? "front" : "back"}.
          </span>
          <div className="idc-inner">
            {/* FRONT */}
            <div className="idc-face idc-front" aria-hidden={shown}>
              <div className="idc-band">
                <span className="mono">{band}</span>
                <span className="idc-hole" aria-hidden="true" />
              </div>
              <div className="idc-photo">
                <div className="idc-photo-ring">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={portrait} alt={`Portrait of ${name}`} width={128} height={156} loading="lazy" decoding="async" />
                </div>
              </div>
              <p className="idc-name">{name}</p>
              <p className="idc-role">{role}</p>
              <dl className="idc-rows">
                {rows.map((r) => (
                  <div key={r.k}>
                    <dt className="mono">{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="idc-foot">
                <svg className="idc-barcode" viewBox={`0 0 ${bars.reduce((a, b) => a + b + 1.4, 0)} 30`} preserveAspectRatio="none" aria-hidden="true">
                  {
                    bars.reduce<{ x: number; els: React.ReactNode[] }>(
                      (acc, w, i) => {
                        if (i % 2 === 0) acc.els.push(<rect key={i} x={acc.x} y="0" width={w} height="30" fill="#0d0d0d" />);
                        acc.x += w + 1.4;
                        return acc;
                      },
                      { x: 0, els: [] },
                    ).els
                  }
                </svg>
                <span className="idc-holo" aria-hidden="true" />
              </div>
            </div>

            {/* BACK */}
            <div className="idc-face idc-back" aria-hidden={!shown}>
              <div className="idc-band idc-band-light">
                <span className="mono">What I am</span>
                <span className="idc-hole" aria-hidden="true" />
              </div>
              <ol className="idc-list">
                {back.map((l, i) => (
                  <li key={l}>
                    <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                    {l}
                  </li>
                ))}
              </ol>
              <div className="idc-sign">
                <span className="idc-sig">{name}</span>
                <span className="idc-sig-line" />
                <span className="mono idc-sig-cap">Signature</span>
              </div>
              <p className="idc-found mono">
                If found, say hello · <span>{email}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.idc{position:absolute;inset:0;display:flex;justify-content:center;pointer-events:none}
.idc-swing{position:absolute;top:calc(var(--section-y) * -1);left:50%;width:300px;margin-left:-150px;transform-origin:50% 0;
  display:flex;flex-direction:column;align-items:center;will-change:transform}
.idc-strap{width:30px;height:calc(var(--section-y) + 56px);background:#1a1a1a;position:relative;overflow:hidden;
  box-shadow:inset 2px 0 0 rgba(255,255,255,.06),inset -2px 0 0 rgba(0,0,0,.4)}
.idc-strap::before,.idc-strap::after{content:"";position:absolute;top:0;bottom:0;width:1px;background:rgba(255,255,255,.18)}
.idc-strap::before{left:3px}.idc-strap::after{right:3px}
.idc-strap-run{position:absolute;left:0;right:0;top:0;display:flex;flex-direction:column;animation:strapRun 26s linear infinite}
.idc-strap-run span{writing-mode:vertical-rl;font:600 9px/30px var(--font-mono);letter-spacing:.24em;color:rgba(255,255,255,.72);white-space:nowrap;width:30px;text-align:center}
@keyframes strapRun{to{transform:translateY(-50%)}}
.idc-clip{width:44px;height:30px;margin-top:-4px;position:relative;z-index:2;border-radius:6px 6px 10px 10px;
  background:linear-gradient(180deg,#d9d9d9,#8f8f8f 55%,#c9c9c9);box-shadow:0 2px 4px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.8)}
.idc-clip i{position:absolute;left:50%;bottom:-14px;width:18px;height:20px;margin-left:-9px;border:3px solid #9a9a9a;border-top:0;border-radius:0 0 10px 10px}
.idc-card{pointer-events:auto;margin-top:6px;width:300px;height:420px;perspective:1400px;cursor:pointer;border-radius:22px;outline-offset:6px}
.idc-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 1s var(--ease)}
.idc-card.is-flipped .idc-inner{transform:rotateY(180deg)}
.idc-face{position:absolute;inset:0;border-radius:22px;background:#fff;overflow:hidden;-webkit-backface-visibility:hidden;backface-visibility:hidden;
  box-shadow:inset 0 0 0 1px var(--line),0 40px 70px -34px rgba(13,13,13,.4),0 12px 24px -16px rgba(13,13,13,.25);display:flex;flex-direction:column}
.idc-back{transform:rotateY(180deg)}
.idc-band{height:44px;flex:none;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 18px}
.idc-band .mono{font-size:11px;letter-spacing:.24em;font-weight:600}
.idc-band-light{background:var(--soft);color:var(--ink)}
.idc-hole{width:42px;height:8px;border-radius:8px;background:var(--paper);box-shadow:inset 0 1px 2px rgba(0,0,0,.35)}
.idc-photo{display:flex;justify-content:center;margin-top:14px;position:relative}
.idc-photo::before{content:"";position:absolute;top:50%;left:50%;width:210px;height:210px;transform:translate(-50%,-50%);
  background:radial-gradient(closest-side,rgba(13,13,13,.08),transparent);pointer-events:none}
.idc-photo-ring{position:relative;width:134px;height:162px;padding:3px;border-radius:18px;background:linear-gradient(160deg,#d6d3cd,#8d8a84 45%,#ecebe7)}
.idc-photo-ring img{display:block;width:128px;height:156px;object-fit:cover;object-position:50% 20%;border-radius:14px;
  transition:transform .9s var(--ease);background:var(--soft)}
.idc-card:hover .idc-photo-ring img{transform:scale(1.06)}
.idc-photo-ring{overflow:hidden}
.idc-name{margin:10px 0 0;text-align:center;font-weight:700;font-size:20px;letter-spacing:-.03em}
.idc-role{margin:2px 0 0;text-align:center;font-size:12.5px;color:var(--mute)}
.idc-rows{margin:10px 20px 0;padding:0;border-top:1px dashed var(--line)}
.idc-rows div{display:flex;justify-content:space-between;gap:10px;padding:4px 0;border-bottom:1px dashed var(--line);font-size:11.5px}
.idc-rows dt{color:var(--mute);font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding-top:1px}
.idc-rows dd{margin:0;font-weight:500;text-align:right}
.idc-foot{margin:auto 20px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.idc-barcode{width:150px;height:26px}
.idc-holo{width:40px;height:28px;border-radius:6px;background:conic-gradient(from 0deg,#f4f4f4,#bdbdbd,#fafafa,#9c9c9c,#ececec,#c4c4c4,#f4f4f4);
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.08);background-size:200% 200%;animation:holo 6s linear infinite;filter:contrast(1.05)}
@keyframes holo{to{filter:contrast(1.05) hue-rotate(0deg);background-position:100% 100%}}
.idc-list{list-style:none;margin:18px 20px 0;padding:0}
.idc-list li{display:flex;gap:12px;padding:9px 0;border-bottom:1px solid var(--line);font-size:13.5px;line-height:1.35;letter-spacing:-.01em}
.idc-list .mono{font-size:10px;color:var(--faint);padding-top:3px}
.idc-sign{margin:auto 20px 0;display:flex;flex-direction:column}
.idc-sig{font-family:var(--font-serif);font-style:italic;font-size:30px;line-height:1;transform:rotate(-4deg);transform-origin:left;margin-left:6px}
.idc-sig-line{height:1px;background:var(--ink);margin-top:2px}
.idc-sig-cap{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin-top:5px}
.idc-found{margin:12px 20px 16px;font-size:9.5px;letter-spacing:.04em;color:var(--mute);overflow-wrap:anywhere}
.idc-found span{color:var(--ink)}
@media (max-width: 759px){
  .idc-strap{height:calc(var(--section-y) * .4 + 40px)}
  .idc-swing{top:0}
}
`;
