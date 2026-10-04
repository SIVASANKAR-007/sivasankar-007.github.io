"use client";

import { useEffect, useRef, useState } from "react";
import { EXPERIENCE, TIMELINE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import SectionHead from "../ui/SectionHead";

export default function Experience() {
  const [listRef, progress] = useScrollProgress<HTMLDivElement>("through");
  const stopRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [offsets, setOffsets] = useState<number[]>([]);

  useEffect(() => {
    const measure = () => {
      const list = listRef.current;
      if (!list) return;
      const h = list.offsetHeight || 1;
      setOffsets(stopRefs.current.map((el) => (el ? (el.offsetTop + 18) / h : 1)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    return () => ro.disconnect();
  }, [listRef]);

  const stops = [...TIMELINE];

  return (
    <section id="experience" className="section exp" aria-labelledby="experience-title">
      <style>{CSS}</style>
      <div className="wrap">
        <SectionHead id="experience" label="Experience & education" lead="One continuous" accent="path.">
          <p className="ex-sub rv" style={{ "--i": 1 } as React.CSSProperties}>
            Education and work, in the order they happened.
          </p>
        </SectionHead>

        <div className="ex-track" ref={listRef}>
          <span className="ex-spine" aria-hidden="true">
            <span style={{ transform: `scaleY(${progress})` }} />
          </span>
          <ol className="ex-list">
          {stops.map((s, i) => {
            const lit = offsets[i] !== undefined && progress >= offsets[i];
            const work = EXPERIENCE.find((e) => e.title === s.title);
            return (
              <li
                key={s.title}
                ref={(el) => {
                  stopRefs.current[i] = el;
                }}
                className={`ex-stop ${lit ? "is-lit" : ""}`}
              >
                <span className="ex-dot" aria-hidden="true" />
                <p className="ex-year mono">
                  {s.year}
                  <span className="ex-kind">{s.kind === "work" ? "Work" : "Education"}</span>
                </p>
                <div className="ex-card">
                  <h3 className="ex-title">{s.title}</h3>
                  <p className="ex-place">
                    {s.place}
                    {work ? ` · ${work.location}` : ""}
                  </p>
                  <p className="ex-detail">{s.detail}</p>
                  {work && (
                    <ul className="ex-points">
                      {work.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
          <li className={`ex-stop ex-next ${progress > 0.97 ? "is-lit" : ""}`}>
            <span className="ex-dot" aria-hidden="true" />
            <p className="ex-year mono">Next</p>
            <a
              href="#contact"
              className="ex-card ex-next-card"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("contact");
              }}
            >
              <span className="ex-title">
                Next — <span className="serif-i">Your team?</span>
              </span>
              <span className="ex-next-go" aria-hidden="true">
                →
              </span>
            </a>
          </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.ex-sub{margin:18px 0 0;color:var(--mute);font-size:16px}
.ex-track{position:relative;margin-top:56px;max-width:980px}
.ex-list{list-style:none;margin:0;padding:0 0 0 clamp(36px,6vw,80px)}
.ex-spine{position:absolute;left:clamp(8px,2vw,24px);top:0;bottom:0;width:2px;background:var(--line);border-radius:2px}
.ex-spine>span{position:absolute;inset:0;background:var(--ink);transform-origin:50% 0;border-radius:2px}
.ex-stop{position:relative;display:grid;grid-template-columns:180px minmax(0,1fr);gap:24px;padding-bottom:clamp(36px,6vh,64px)}
.ex-dot{position:absolute;left:calc(clamp(8px,2vw,24px) - clamp(36px,6vw,80px) - 6px);top:12px;width:14px;height:14px;border-radius:50%;
  background:var(--paper);box-shadow:inset 0 0 0 2px var(--faint);transition:box-shadow .6s var(--ease),background .6s var(--ease),transform .6s var(--ease)}
.ex-stop.is-lit .ex-dot{background:var(--ink);box-shadow:inset 0 0 0 2px var(--ink),0 0 0 6px rgba(13,13,13,.08);transform:scale(1.1)}
.ex-year{margin:8px 0 0;font-size:12px;letter-spacing:.04em;color:var(--faint);display:flex;flex-direction:column;gap:4px;transition:color .6s var(--ease)}
.ex-kind{font-size:10px;letter-spacing:.12em;text-transform:uppercase}
.ex-stop.is-lit .ex-year{color:var(--ink)}
.ex-card{display:block;background:var(--card);border-radius:24px;box-shadow:var(--hair);padding:clamp(20px,2.4vw,30px);
  transform:translateX(12px);transition:transform .8s var(--ease),box-shadow .8s var(--ease)}
.ex-stop.is-lit .ex-card{transform:none;box-shadow:var(--hair),var(--shadow-lg)}
.ex-stop.is-lit .ex-next-card{box-shadow:none}
.ex-title{display:block;margin:0;font-size:clamp(20px,2vw,28px);font-weight:700;letter-spacing:-.035em;line-height:1.1}
.ex-place{margin:6px 0 0;font-size:14px;color:var(--mute)}
.ex-detail{margin:14px 0 0;font-size:15px;line-height:1.6;color:var(--ink-2)}
.ex-points{margin:10px 0 0;padding:0;list-style:none}
.ex-points li{position:relative;padding:8px 0 8px 18px;font-size:14px;line-height:1.55;color:var(--ink-2);border-top:1px solid var(--line)}
.ex-points li::before{content:"";position:absolute;left:0;top:17px;width:8px;height:1px;background:var(--ink)}
.ex-next{padding-bottom:0}
.ex-next-card{background:transparent;box-shadow:none;border:1.5px dashed rgba(13,13,13,.28);display:flex;align-items:center;justify-content:space-between;gap:16px}
.ex-next-card:hover{border-color:var(--ink)}
.ex-next-go{font-size:24px;transition:transform .5s var(--ease)}
.ex-next-card:hover .ex-next-go{transform:translateX(6px)}
@media (max-width: 759px){
  .ex-stop{grid-template-columns:minmax(0,1fr);gap:8px}
  .ex-year{flex-direction:row;gap:10px;margin-top:6px}
  .ex-dot{top:8px}
}
@media (prefers-reduced-motion: reduce){ .ex-card{transform:none} }
`;
