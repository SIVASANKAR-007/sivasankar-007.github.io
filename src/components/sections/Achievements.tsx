"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, SECTION_INDEX, type Achievement } from "@/lib/data";
import { prefersReducedMotion, useScrollProgress } from "@/lib/hooks";
import TechLogo from "../ui/TechLogo";

const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

function CountUp({ a }: { a: Achievement }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setN(a.value);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 1400);
          const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
          setN(Math.round(a.value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [a.value]);
  return (
    <span ref={ref} className="ac-num" aria-hidden="true">
      {a.prefix && <small>{a.prefix}</small>}
      {n}
      {a.suffix && <small>{a.suffix}</small>}
    </span>
  );
}

export default function Achievements() {
  const [outerRef, progress] = useScrollProgress<HTMLElement>("pin");
  const trackRef = useRef<HTMLOListElement>(null);
  const [travel, setTravel] = useState(0);
  const [active, setActive] = useState(0);

  useIsoLayout(() => {
    const measure = () => {
      const t = trackRef.current;
      if (!t) return;
      setTravel(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Card nearest the viewport centre gets the "lifted" state.
  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const cx = window.innerWidth / 2;
    let best = 0;
    let bestD = Infinity;
    t.querySelectorAll<HTMLElement>(".ac-card").forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - cx);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setActive(best);
  }, [progress, travel]);

  const total = String(ACHIEVEMENTS.length).padStart(2, "0");

  return (
    <section
      id="achievements"
      ref={outerRef}
      className="ach"
      aria-labelledby="achievements-title"
      style={{ height: `calc(100svh + ${travel}px)` }}
    >
      <style>{CSS}</style>
      <div className="ac-pin">
        <div className="wrap ac-head">
          <div>
            <p className="tag rv">
              <b>{SECTION_INDEX.achievements}</b>
              <span aria-hidden="true">—</span>
              <span>Achievements</span>
            </p>
            <h2 id="achievements-title" className="h-section ac-title">
              <span className="rv-mask">
                <span>
                  By the <span className="serif-i">numbers.</span>
                </span>
              </span>
            </h2>
          </div>
          <div className="ac-progress" aria-hidden="true">
            <span className="mono">
              {String(active + 1).padStart(2, "0")} / {total}
            </span>
            <i>
              <b style={{ transform: `scaleX(${progress})` }} />
            </i>
          </div>
        </div>

        <ol ref={trackRef} className="ac-track" style={{ transform: `translate3d(${-progress * travel}px,0,0)` }}>
          {ACHIEVEMENTS.map((a, i) => (
            <li key={a.label} className={`ac-card ${active === i ? "is-active" : ""}`}>
              <div className="ac-top">
                <span className="ac-logo">
                  <TechLogo name={a.label} logo={a.icon} size={32} decorative />
                </span>
                <span className="ac-idx mono">
                  {String(i + 1).padStart(2, "0")} / {total}
                </span>
              </div>
              <div className="ac-bottom">
                <div className="ac-text">
                  <h3 className="ac-label">{a.label}</h3>
                  <p className="ac-cap mono">{a.caption}</p>
                  <p className="ac-detail">{a.detail}</p>
                </div>
                <CountUp a={a} />
                <span className="sr-only">
                  {a.prefix === "~" ? "roughly " : ""}
                  {a.value}
                  {a.suffix ?? ""}
                </span>
              </div>
            </li>
          ))}
          <li className="ac-end" aria-hidden="true">
            <span>
              and counting <span className="serif-i">→</span>
            </span>
          </li>
        </ol>
      </div>
    </section>
  );
}

const CSS = `
.ach{position:relative}
.ac-pin{position:sticky;top:0;height:100svh;overflow:hidden;display:flex;flex-direction:column;justify-content:center;gap:clamp(28px,5vh,56px)}
.ac-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px}
.ac-title{margin-top:18px}
.ac-progress{display:flex;flex-direction:column;align-items:flex-end;gap:10px;min-width:160px}
.ac-progress .mono{font-size:12px;color:var(--mute);letter-spacing:.06em}
.ac-progress i{display:block;width:160px;height:2px;background:var(--line);border-radius:2px;overflow:hidden}
.ac-progress b{display:block;height:100%;background:var(--ink);transform-origin:0 50%}
.ac-track{list-style:none;margin:0;display:flex;gap:18px;width:max-content;padding:20px max(var(--gutter),calc((100vw - 1320px)/2)) 30px;will-change:transform}
.ac-card{position:relative;flex:none;width:clamp(min(340px,calc(100vw - 36px)),40vw,540px);height:clamp(260px,36vh,310px);
  background:#fff;border-radius:28px;box-shadow:var(--hair),0 10px 30px -24px rgba(13,13,13,.25);padding:22px 24px;
  display:flex;flex-direction:column;justify-content:space-between;transition:transform .8s var(--ease),box-shadow .8s var(--ease)}
.ac-card.is-active{transform:translateY(-12px);box-shadow:var(--hair),0 40px 70px -30px rgba(13,13,13,.32),0 12px 24px -16px rgba(13,13,13,.16)}
.ac-top{display:flex;justify-content:space-between;align-items:flex-start}
.ac-logo{position:relative;width:72px;height:72px;border-radius:20px;background:var(--paper);display:grid;place-items:center;color:var(--ink);
  box-shadow:inset 0 0 0 1px var(--line)}
.ac-logo::before{content:"";position:absolute;inset:-14px;border-radius:50%;background:radial-gradient(closest-side,rgba(13,13,13,.07),transparent);
  opacity:.5;transition:opacity .8s var(--ease);z-index:-1}
.ac-card.is-active .ac-logo::before{opacity:1}
.ac-idx{font-size:11px;color:var(--faint);letter-spacing:.06em}
.ac-bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:16px}
.ac-text{min-width:0;max-width:56%}
.ac-label{margin:0;font-size:18px;font-weight:700;letter-spacing:-.03em;line-height:1.15}
.ac-cap{margin:6px 0 0;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.ac-detail{margin:8px 0 0;font-size:13px;line-height:1.45;color:var(--ink-2)}
.ac-num{font-weight:700;letter-spacing:-.06em;line-height:.82;font-size:clamp(76px,9vw,132px);font-variant-numeric:tabular-nums;white-space:nowrap}
.ac-num small{font-size:.42em;letter-spacing:-.02em;color:var(--mute);font-weight:600;vertical-align:top;margin-left:2px}
.ac-num small:first-child{margin:0 2px 0 0}
.ac-end{flex:none;display:flex;align-items:center;padding:0 clamp(24px,6vw,80px) 0 clamp(12px,3vw,40px)}
.ac-end>span{font-weight:700;letter-spacing:-.045em;font-size:clamp(32px,4vw,56px);white-space:nowrap}
@media (max-width: 639px){
  .ac-head{flex-direction:column;align-items:flex-start}
  .ac-progress{align-items:flex-start}
  .ac-text{max-width:60%}
  .ac-num{font-size:68px}
  .ac-card{padding:18px 18px}
  .ac-logo{width:60px;height:60px}
}
`;
