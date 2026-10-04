"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { PROFILE } from "@/lib/data";
import { asset } from "@/lib/asset";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

export default function Hero() {
  // Poster is the LCP element — fetch it with high priority.
  preload(asset("/hero/poster.webp"), { as: "image", fetchPriority: "high" });
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const userMuted = useRef(false);
  const visible = useRef(true);
  const reduced = useRef(false);

  // Autoplay: try with sound, fall back to muted, unlock on first gesture.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    reduced.current = prefersReducedMotion();

    const tryPlay = async (withSound: boolean) => {
      v.muted = !withSound;
      try {
        await v.play();
        setSoundOn(withSound);
        return true;
      } catch {
        return false;
      }
    };

    if (!reduced.current) {
      tryPlay(true).then(async (ok) => {
        if (ok) return setBlocked(false);
        setBlocked(true);
        await tryPlay(false);
      });
    }

    const unlock = (e: Event) => {
      if (btnRef.current && e.target instanceof Node && btnRef.current.contains(e.target)) return;
      if (userMuted.current || reduced.current) return cleanup();
      v.muted = false;
      if (visible.current) {
        v.play()
          .then(() => {
            setSoundOn(true);
            setBlocked(false);
          })
          .catch(() => {
            v.muted = true;
          });
      } else {
        setSoundOn(true);
        setBlocked(false);
      }
      cleanup();
    };
    const evs = ["pointerdown", "keydown", "touchend"] as const;
    const cleanup = () => evs.forEach((ev) => window.removeEventListener(ev, unlock, true));
    evs.forEach((ev) => window.addEventListener(ev, unlock, { capture: true, passive: true }));
    return cleanup;
  }, []);

  // Pause when < 35 % of the hero is visible; resume on return.
  useEffect(() => {
    const el = sectionRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio >= 0.35;
        if (!visible.current) v.pause();
        else if (!reduced.current || !v.muted) v.play().catch(() => {});
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    if (soundOn) {
      v.muted = true;
      userMuted.current = true;
      setSoundOn(false);
      if (reduced.current) v.pause();
    } else {
      userMuted.current = false;
      v.muted = false;
      v.play()
        .then(() => {
          setSoundOn(true);
          setBlocked(false);
        })
        .catch(() => {});
    }
  };

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToTarget(id);
  };

  return (
    <section id="hero" ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <style>{CSS}</style>
      <p className="hero-ghost" aria-hidden="true">
        {PROFILE.firstName.toUpperCase()}
      </p>

      <div className="hero-grid wrap">
        <div className="hero-copy">
          <p className="tag hero-in" style={{ "--d": "0ms" } as React.CSSProperties}>
            <b>{PROFILE.name}</b>
            <span aria-hidden="true">·</span>
            <span>{PROFILE.location}</span>
          </p>
          <h1 id="hero-title" className="hero-title">
            <span className="hero-line">
              <span style={{ "--d": "80ms" } as React.CSSProperties}>Data &amp; Research</span>
            </span>
            <span className="hero-line">
              <span style={{ "--d": "180ms" } as React.CSSProperties}>
                <span className="serif-i">Analyst.</span>
              </span>
            </span>
          </h1>
          <p className="hero-sub hero-in" style={{ "--d": "300ms" } as React.CSSProperties}>
            {PROFILE.focus}
          </p>
          {PROFILE.introTranscript && (
            <details className="hero-transcript hero-in" style={{ "--d": "460ms" } as React.CSSProperties}>
              <summary className="mono">Read the intro transcript</summary>
              <p>{PROFILE.introTranscript}</p>
            </details>
          )}
          <div className="hero-ctas hero-in" style={{ "--d": "400ms" } as React.CSSProperties}>
            <a href="#work" className="btn btn-primary" onClick={(e) => go(e, "work")}>
              Explore work
            </a>
            <a href="#contact" className="btn btn-ghost" onClick={(e) => go(e, "contact")}>
              Let&apos;s talk
            </a>
            <a href={asset(PROFILE.resume)} download className="btn btn-ghost">
              Résumé <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="hero-stage">
          <video
            ref={videoRef}
            className="hero-video"
            muted
            loop
            playsInline
            preload="auto"
            poster={asset("/hero/poster.webp")}
            aria-label={`${PROFILE.name} introducing himself to camera`}
            width={768}
            height={960}
          >
            <source src={asset("/hero/hero.webm")} type="video/webm" />
            <source src={asset("/hero/hero.mp4")} type="video/mp4" />
          </video>
        </div>

        <div className="hero-side hero-in" style={{ "--d": "520ms" } as React.CSSProperties}>
          <button
            ref={btnRef}
            type="button"
            className={`hero-sound ${blocked && !soundOn ? "is-blocked" : ""}`}
            onClick={toggleSound}
            aria-label={soundOn ? "Mute the introduction" : "Play the introduction with sound"}
            aria-pressed={soundOn}
          >
            {soundOn ? (
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <rect x="3" y="2" width="3.4" height="12" rx="1" fill="currentColor" />
                <rect x="9.6" y="2" width="3.4" height="12" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M4 2.2v11.6c0 .6.7 1 1.2.7l9-5.8c.5-.3.5-1 0-1.4l-9-5.8C4.7 1.2 4 1.6 4 2.2Z" fill="currentColor" />
              </svg>
            )}
          </button>
          <p className="hero-note mono">
            <span>Intro</span>
            <span className="hero-note-dim">0:09 · loop</span>
          </p>
        </div>
      </div>

      <a href="#about" className="hero-scroll mono" onClick={(e) => go(e, "about")}>
        <span aria-hidden="true" className="hero-scroll-line" />
        Scroll
      </a>
    </section>
  );
}

const CSS = `
.hero{position:relative;min-height:100svh;overflow:hidden;display:flex;align-items:flex-end}
.hero-ghost{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);margin:0;white-space:nowrap;
  font-weight:800;letter-spacing:-.06em;line-height:.8;font-size:clamp(88px,19vw,330px);color:transparent;
  -webkit-text-stroke:1.2px rgba(13,13,13,.13);user-select:none;pointer-events:none;
  animation:ghostIn 1.8s var(--ease) both}
@keyframes ghostIn{from{opacity:0;letter-spacing:.02em}to{opacity:1}}
.hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:end;gap:24px}
.hero-copy{grid-column:1;grid-row:1;align-self:end;padding-bottom:clamp(40px,9vh,96px);position:relative;z-index:2;min-width:0}
.hero-title{margin:22px 0 0;font-weight:700;letter-spacing:-.045em;line-height:.98;font-size:clamp(44px,4.6vw,78px)}
.hero-title .serif-i{color:var(--ink);font-size:1.08em}
.hero-line{display:block;overflow:hidden;padding-bottom:.06em;margin-bottom:-.06em}
.hero-line>span{display:block;animation:lineUp 1.2s var(--ease) both;animation-delay:var(--d)}
@keyframes lineUp{from{transform:translateY(105%)}to{transform:none}}
.hero-in{animation:fadeUp 1.1s var(--ease) both;animation-delay:var(--d)}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.hero-sub{margin:20px 0 0;color:var(--mute);font-size:clamp(15px,1.15vw,18px);max-width:30ch;line-height:1.45}
.hero-transcript{margin-top:16px;max-width:36ch;font-size:14px;color:var(--ink-2)}
.hero-transcript summary{cursor:pointer;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.hero-ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
.hero-stage{grid-column:2;grid-row:1;position:relative;height:min(96svh,1040px);aspect-ratio:768/960}
@keyframes stageIn{from{transform:translateY(30px) scale(.985)}to{transform:none}}
.hero-video{display:block;width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;background:transparent;animation:stageIn 1.6s var(--ease) both;
  -webkit-mask-image:linear-gradient(to right,transparent 0,#000 14%,#000 86%,transparent 100%),linear-gradient(to bottom,#000 0,#000 93%,transparent 100%);
  -webkit-mask-composite:source-in;mask-image:linear-gradient(to right,transparent 0,#000 14%,#000 86%,transparent 100%),linear-gradient(to bottom,#000 0,#000 93%,transparent 100%);mask-composite:intersect}
.hero-side{grid-column:3;grid-row:1;justify-self:end;align-self:end;padding-bottom:clamp(40px,9vh,96px);display:flex;align-items:center;gap:14px;position:relative;z-index:2}
.hero-sound{position:relative;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;
  transition:transform .5s var(--ease),box-shadow .5s var(--ease)}
.hero-sound:hover{transform:scale(1.06);box-shadow:0 10px 24px -12px rgba(13,13,13,.7)}
.hero-sound.is-blocked::before,.hero-sound.is-blocked::after{content:"";position:absolute;inset:0;border-radius:50%;
  box-shadow:0 0 0 1px rgba(13,13,13,.45);animation:ping 2.2s var(--ease) infinite}
.hero-sound.is-blocked::after{animation-delay:1.1s}
@keyframes ping{from{transform:scale(1);opacity:.9}to{transform:scale(1.9);opacity:0}}
.hero-note{display:flex;flex-direction:column;gap:2px;margin:0;font-size:11px;letter-spacing:.08em;text-transform:uppercase}
.hero-note-dim{color:var(--faint)}
.hero-scroll{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);z-index:3;display:flex;flex-direction:column;align-items:center;gap:8px;
  font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
.hero-scroll-line{width:1px;height:34px;background:linear-gradient(var(--line),var(--line));position:relative;overflow:hidden}
.hero-scroll-line::after{content:"";position:absolute;left:0;top:-40%;width:1px;height:40%;background:var(--ink);animation:drip 2s var(--ease) infinite}
@keyframes drip{to{top:100%}}
@media (max-width: 1099px){
  .hero{align-items:stretch}
  .hero-grid{grid-template-columns:minmax(0,1fr);justify-items:center;gap:0;padding-top:72px}
  .hero-stage{grid-column:1;grid-row:1;height:min(62svh,640px)}
  .hero-ghost{top:34%}
  .hero-copy{grid-column:1;grid-row:2;padding-bottom:72px;text-align:center;display:flex;flex-direction:column;align-items:center}
  .hero-copy .tag{justify-content:center}
  .hero-sub{margin-inline:auto}
  .hero-ctas{justify-content:center}
  .hero-side{grid-column:1;grid-row:1;align-self:end;justify-self:end;padding-bottom:16px;margin-right:clamp(0px,4vw,40px)}
  .hero-note{display:none}
  .hero-scroll{display:none}
  .hero-title{font-size:clamp(40px,9vw,64px)}
}
`;
