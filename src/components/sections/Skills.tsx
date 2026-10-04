"use client";

import { useState } from "react";
import { ALL_SKILLS, SKILL_GROUPS, type SkillFamily } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";
import TechLogo, { BRAND, isBrand } from "../ui/TechLogo";

export default function Skills() {
  const [filter, setFilter] = useState<SkillFamily | "All">("All");
  const [active, setActive] = useState(0);
  const [gridRef, inView] = useInView<HTMLUListElement>({ threshold: 0.12 });
  const skill = ALL_SKILLS[active];
  const brand = isBrand(skill.logo) ? BRAND[skill.logo] : null;

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <style>{CSS}</style>
      <div className="wrap">
        <SectionHead id="skills" label="Skills" lead="The periodic table of my" accent="stack.">
          <p className="sk-intro rv" style={{ "--i": 1 } as React.CSSProperties}>
            {ALL_SKILLS.length} elements from my résumé, grouped into {SKILL_GROUPS.length} families. Hover or focus a tile to
            inspect it.
          </p>
        </SectionHead>

        <div className="sk-filters rv" role="group" aria-label="Filter skills by family" style={{ "--i": 2 } as React.CSSProperties}>
          {(["All", ...SKILL_GROUPS.map((g) => g.family)] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`sk-chip ${filter === f ? "is-on" : ""}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="sk-layout">
          <ul ref={gridRef} className={`sk-grid ${inView ? "is-in" : ""}`} aria-label="Skills">
            {ALL_SKILLS.map((s, i) => {
              const dim = filter !== "All" && s.family !== filter;
              return (
                <li key={s.name}>
                <button
                  type="button"
                  className={`sk-tile ${active === i ? "is-active" : ""} ${dim ? "is-dim" : ""}`}
                  style={
                    {
                      "--r8": Math.floor(i / 8),
                      "--c8": i % 8,
                      "--r4": Math.floor(i / 4),
                      "--c4": i % 4,
                    } as React.CSSProperties
                  }
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-label={`${s.name}, ${s.family}`}
                  aria-current={active === i ? "true" : undefined}
                >
                  <span className="sk-num mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="sk-sym">{s.symbol}</span>
                  <span className="sk-name">{s.name}</span>
                  <span className="sk-fam mono">{SKILL_GROUPS.find((g) => g.family === s.family)?.short}</span>
                </button>
                </li>
              );
            })}
          </ul>

          <aside className="sk-inspector card is-active" aria-live="polite" aria-label="Skill inspector">
            <div className="sk-ins-top mono">
              <span>No. {String(active + 1).padStart(2, "0")}</span>
              <span>{skill.symbol}</span>
            </div>
            <div
              key={skill.name}
              className={`sk-logo ${brand ? "is-brand" : ""}`}
              style={{ "--tint": brand?.tint ?? "#0d0d0d" } as React.CSSProperties}
            >
              <TechLogo name={skill.name} logo={skill.logo} size={150} />
            </div>
            <h3 className="sk-ins-name">{skill.name}</h3>
            <p className="sk-ins-fam mono">{skill.family}</p>
            <div className="sk-ins-used">
              <p className="mono">Named in</p>
              {skill.usedIn.length ? (
                <ul>
                  {skill.usedIn.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              ) : (
                <p className="sk-ins-none">Listed under {skill.family} on my résumé.</p>
              )}
            </div>
            {!brand && <p className="sk-ins-note mono">Line icon · no official mark used</p>}
          </aside>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.sk-intro{margin:20px 0 0;color:var(--mute);max-width:52ch;font-size:16px;line-height:1.55}
.sk-filters{display:flex;flex-wrap:wrap;gap:8px;margin-top:36px}
.sk-chip{height:36px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.16);
  color:var(--ink-2);transition:background .45s var(--ease),color .45s var(--ease),box-shadow .45s var(--ease)}
.sk-chip:hover{box-shadow:inset 0 0 0 1px var(--ink);color:var(--ink)}
.sk-chip.is-on{background:var(--ink);color:#fff;box-shadow:inset 0 0 0 1px var(--ink)}
.sk-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:clamp(20px,2.4vw,36px);margin-top:28px;align-items:start}
.sk-grid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px}
.sk-grid li{min-width:0}
.sk-tile{position:relative;width:100%;aspect-ratio:1/1.08;border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);
  display:flex;flex-direction:column;align-items:flex-start;text-align:left;padding:9px 10px;min-width:0;
  opacity:0;transform:translateY(16px) scale(.96);
  transition:opacity .7s var(--ease),transform .8s var(--ease),background .35s var(--ease),color .35s var(--ease),box-shadow .35s var(--ease);
  transition-delay:calc((var(--r8) + var(--c8)) * 40ms),calc((var(--r8) + var(--c8)) * 40ms),0s,0s,0s}
.sk-grid.is-in .sk-tile{opacity:1;transform:none}
.sk-grid.is-in .sk-tile.is-dim{opacity:.22}
.sk-tile:hover{box-shadow:inset 0 0 0 1px var(--ink)}
.sk-tile.is-active{background:var(--ink);color:#fff;box-shadow:0 14px 30px -16px rgba(13,13,13,.6)}
.sk-num{font-size:10px;color:var(--faint)}
.sk-tile.is-active .sk-num,.sk-tile.is-active .sk-fam{color:rgba(255,255,255,.6)}
.sk-sym{font-weight:700;font-size:clamp(20px,2.1vw,32px);letter-spacing:-.04em;line-height:1;margin-top:auto}
.sk-name{font-size:11px;line-height:1.2;margin-top:4px;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sk-fam{font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin-top:2px}
.sk-inspector{position:sticky;top:96px;padding:22px;border-radius:26px;display:flex;flex-direction:column}
.sk-ins-top{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.08em;color:var(--mute)}
.sk-logo{position:relative;height:200px;display:grid;place-items:center;margin-top:8px;color:var(--ink);animation:pop .7s var(--ease) both}
.sk-logo::before{content:"";position:absolute;width:190px;height:190px;border-radius:50%;
  background:radial-gradient(closest-side,color-mix(in srgb,var(--tint) 16%,transparent),transparent);z-index:0}
.sk-logo:not(.is-brand)::before{background:radial-gradient(closest-side,rgba(13,13,13,.06),transparent)}
.sk-logo>*{position:relative;z-index:1}
@keyframes pop{0%{opacity:0;transform:scale(.7)}60%{opacity:1;transform:scale(1.05)}100%{transform:none}}
.sk-ins-name{margin:10px 0 0;font-size:28px;font-weight:700;letter-spacing:-.035em;line-height:1.05}
.sk-ins-fam{margin:6px 0 0;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.sk-ins-used{margin-top:18px;padding-top:14px;border-top:1px solid var(--line)}
.sk-ins-used>.mono{margin:0 0 6px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint)}
.sk-ins-used ul{list-style:none;margin:0;padding:0}
.sk-ins-used li{font-size:14px;padding:5px 0;line-height:1.35}
.sk-ins-used li::before{content:"→ ";color:var(--faint)}
.sk-ins-none{margin:0;font-size:14px;color:var(--ink-2)}
.sk-ins-note{margin:14px 0 0;font-size:9.5px;letter-spacing:.06em;color:var(--faint);text-transform:uppercase}
@media (max-width: 1023px){
  .sk-layout{grid-template-columns:minmax(0,1fr)}
  .sk-inspector{position:relative;top:0}
  .sk-logo{height:180px}
}
@media (max-width: 639px){
  .sk-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
  .sk-tile{transition-delay:calc((var(--r4) + var(--c4)) * 40ms),calc((var(--r4) + var(--c4)) * 40ms),0s,0s,0s}
  .sk-sym{font-size:24px}
}
`;
