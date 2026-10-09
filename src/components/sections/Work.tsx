"use client";

import { useState } from "react";
import { PROJECTS } from "@/lib/data";
import SectionHead from "../ui/SectionHead";
import TechLogo from "../ui/TechLogo";
import MiniUI from "../ui/MiniUI";

export default function Work() {
  const [open, setOpen] = useState(0);

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <style>{CSS}</style>
      <div className="wrap">
        <div className="wk-head">
          <SectionHead id="work" label="Selected work" lead="Things I've" accent="mapped." />
          <p className="wk-sub rv" style={{ "--i": 2 } as React.CSSProperties}>
            {PROJECTS.length} key projects from my resume. Hover, focus or tap a panel to open it.
          </p>
        </div>

        <div className="wk-acc rv" style={{ "--i": 3 } as React.CSSProperties}>
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <article
                key={p.id}
                className={`wk-panel ${isOpen ? "is-open" : ""}`}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setOpen(i);
                }}
                aria-labelledby={`${p.id}-title`}
              >
                <button
                  type="button"
                  className="wk-spine"
                  aria-expanded={isOpen}
                  aria-controls={`${p.id}-body`}
                  onClick={() => setOpen(i)}
                  onFocus={() => setOpen(i)}
                >
                  <span className="wk-spine-num mono">{p.index}</span>
                  <span className="wk-spine-title" id={`${p.id}-title`}>
                    {p.title}
                  </span>
                  <span className="wk-plus" aria-hidden="true">
                    +
                  </span>
                </button>

                <div id={`${p.id}-body`} className="wk-body" inert={!isOpen} aria-hidden={!isOpen}>
                  <div className="wk-info">
                    <p className="wk-kicker mono">
                      <b>{p.index}</b> — {p.kicker}
                    </p>
                    <h3 className="wk-title">{p.title}</h3>
                    <p className="wk-desc">{p.description}</p>
                    <ul className="wk-feats">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <ul className="wk-tech" aria-label="Tools">
                      {p.tech.map((t) => (
                        <li key={t.name} className="chip">
                          <TechLogo name={t.name} logo={t.logo} size={15} decorative />
                          {t.name}
                        </li>
                      ))}
                    </ul>
                    {p.github && (
                      <a className="btn btn-primary btn-sm wk-gh" href={p.github} target="_blank" rel="noopener noreferrer">
                        View on GitHub <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                  <div className="wk-visual">
                    <span className="wk-visual-tag mono">Illustrative UI</span>
                    <MiniUI kind={p.ui} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const CSS = `
.wk-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:20px}
.wk-sub{margin:0;color:var(--mute);max-width:34ch;font-size:15px;line-height:1.5}
.wk-acc{display:flex;gap:10px;height:min(78svh,600px);margin-top:48px}
.wk-panel{position:relative;flex:1 1 0;min-width:0;border-radius:26px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);
  overflow:hidden;transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease)}
.wk-panel.is-open{flex-grow:8;box-shadow:inset 0 0 0 1px var(--line),var(--shadow-lg)}
.wk-spine{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:space-between;
  padding:22px 0;width:100%;text-align:center;transition:opacity .4s var(--ease)}
.wk-panel.is-open .wk-spine{opacity:0;pointer-events:none}
.wk-panel:has(.wk-spine:focus-visible){outline:2px solid var(--ink);outline-offset:3px}
.wk-spine:focus-visible{outline:none}
.wk-spine-num{font-size:12px;color:var(--mute)}
.wk-spine-title{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600;font-size:15px;letter-spacing:-.01em;white-space:nowrap;
  max-height:calc(100% - 110px);overflow:hidden;text-overflow:ellipsis}
.wk-plus{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 1px rgba(var(--ink-rgb),.2);
  font-size:20px;font-weight:300;transition:transform .6s var(--ease),background .4s var(--ease),color .4s var(--ease)}
.wk-panel:hover .wk-plus{transform:rotate(90deg);background:var(--ink);color:var(--on-ink)}
.wk-body{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(18px,2.4vw,36px);
  padding:clamp(22px,2.6vw,38px);opacity:0;transition:opacity .4s var(--ease);min-width:720px}
.wk-panel.is-open .wk-body{opacity:1;transition:opacity .7s var(--ease) .25s}
.wk-info{display:flex;flex-direction:column;min-width:0;overflow:auto;scrollbar-width:none}
.wk-kicker{margin:0;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.wk-kicker b{color:var(--ink);font-weight:600}
.wk-title{margin:14px 0 0;font-size:clamp(26px,2.5vw,38px);font-weight:700;letter-spacing:-.04em;line-height:1.02}
.wk-desc{margin:14px 0 0;font-size:14.5px;line-height:1.6;color:var(--ink-2)}
.wk-feats{list-style:none;padding:0;margin:18px 0 0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 18px}
.wk-feats li{font-size:13px;line-height:1.35;padding-left:16px;position:relative}
.wk-feats li::before{content:"";position:absolute;left:0;top:.5em;width:7px;height:7px;border-radius:2px;background:var(--ink)}
.wk-tech{list-style:none;padding:0;margin:auto 0 0;display:flex;flex-wrap:wrap;gap:6px;padding-top:20px}
.wk-tech .chip{height:30px;font-size:12px;background:var(--paper)}
.wk-gh{margin-top:16px;align-self:flex-start}
.wk-visual{position:relative;min-width:0;clip-path:inset(0 100% 0 0 round 18px);transition:clip-path 1s var(--ease)}
.wk-panel.is-open .wk-visual{clip-path:inset(0 0 0 0 round 18px);transition-delay:.35s}
.wk-visual-tag{position:absolute;z-index:2;right:12px;top:7px;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);
  background:var(--card);padding:3px 8px;border-radius:99px;box-shadow:inset 0 0 0 1px var(--line)}
@media (max-width: 1100px) and (min-width: 900px){
  .wk-body{min-width:560px;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr)}
}
@media (max-width: 899px){
  .wk-acc{flex-direction:column;height:auto;gap:10px}
  .wk-panel{flex:none}
  .wk-spine{position:relative;flex-direction:row;justify-content:flex-start;gap:14px;padding:18px 18px;text-align:left}
  .wk-panel.is-open .wk-spine{opacity:1;pointer-events:auto}
  .wk-spine-title{writing-mode:horizontal-tb;transform:none;white-space:normal;max-height:none;flex:1;font-size:16px}
  .wk-panel.is-open .wk-plus{transform:rotate(45deg);background:var(--ink);color:var(--on-ink)}
  .wk-panel:hover .wk-plus{transform:none;background:transparent;color:inherit}
  .wk-panel.is-open:hover .wk-plus{transform:rotate(45deg);background:var(--ink);color:var(--on-ink)}
  .wk-body{position:relative;inset:auto;min-width:0;grid-template-columns:minmax(0,1fr);display:none;padding:0 18px 20px}
  .wk-panel.is-open .wk-body{display:grid}
  .wk-title{display:none}
  .wk-visual{height:300px}
}
`;
