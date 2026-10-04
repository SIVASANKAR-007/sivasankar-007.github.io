import type { ProjectUI } from "@/lib/data";

/**
 * Grayscale, pure-CSS "illustrative UI" sketches that hint at what each project did.
 * They contain no real client data — only shapes and figures already stated in the résumé.
 */
export default function MiniUI({ kind }: { kind: ProjectUI }) {
  return (
    <div className="mui" aria-hidden="true">
      <style>{CSS}</style>
      <div className="mui-chrome">
        <i />
        <i />
        <i />
        <span className="mono">{TITLES[kind]}</span>
      </div>
      <div className="mui-body">{BODY[kind]}</div>
    </div>
  );
}

const TITLES: Record<ProjectUI, string> = {
  orgmap: "role-map / functions",
  taxonomy: "taxonomy / validate",
  buckets: "skills / classify",
  gap: "benchmark / gap",
  genai: "workloads / readiness",
};

const bar = (w: number, k: string, dark = false) => (
  <span key={k} className={`mui-bar ${dark ? "is-dark" : ""}`} style={{ width: `${w}%` }} />
);

const BODY: Record<ProjectUI, React.ReactNode> = {
  orgmap: (
    <div className="mui-orgmap">
      <div className="mui-col">
        <p className="mui-h mono">Legacy org</p>
        {[78, 62, 70, 54, 66].map((w, i) => (
          <div key={i} className="mui-node">
            {bar(w, "b")}
          </div>
        ))}
      </div>
      <svg className="mui-links" viewBox="0 0 60 200" preserveAspectRatio="none">
        {[18, 58, 98, 138, 178].map((y, i) => (
          <path key={i} d={`M0 ${y} C30 ${y} 30 ${[38, 78, 18, 158, 118][i]} 60 ${[38, 78, 18, 158, 118][i]}`} />
        ))}
      </svg>
      <div className="mui-col">
        <p className="mui-h mono">Technical roles</p>
        {[64, 80, 58, 72, 50].map((w, i) => (
          <div key={i} className="mui-node is-target">
            {bar(w, "b", true)}
          </div>
        ))}
      </div>
      <div className="mui-stat">
        <b>150+</b>
        <span className="mono">job functions</span>
      </div>
    </div>
  ),
  taxonomy: (
    <div className="mui-tax">
      {[0, 1, 1, 2, 2, 1, 2, 0, 1, 2].map((d, i) => (
        <div key={i} className="mui-row" style={{ paddingLeft: d * 18 }}>
          <span className={`mui-dot ${d === 0 ? "is-root" : ""}`} />
          {bar([60, 46, 52, 40, 55, 48, 36, 58, 44, 50][i], "b", d === 0)}
          <span className={`mui-check ${i % 4 === 3 ? "is-pending" : ""}`} />
        </div>
      ))}
      <div className="mui-foot mono">
        <span>150+ roles</span>
        <span className="mui-pill">validated</span>
      </div>
    </div>
  ),
  buckets: (
    <div className="mui-buckets">
      {["Emerging", "Core", "Traditional"].map((b, i) => (
        <div key={b} className="mui-bucket">
          <p className="mui-h mono">{b}</p>
          {Array.from({ length: [5, 7, 4][i] }).map((_, j) => (
            <span key={j} className={`mui-chip ${i === 0 ? "is-dark" : ""}`} style={{ width: `${48 + ((j * 17 + i * 11) % 44)}%` }} />
          ))}
        </div>
      ))}
      <div className="mui-stat is-wide">
        <b>500+</b>
        <span className="mono">skills sorted</span>
      </div>
    </div>
  ),
  gap: (
    <div className="mui-gap">
      <div className="mui-legend mono">
        <span>
          <i className="is-dark" /> Leading
        </span>
        <span>
          <i /> Ahead-of-transition
        </span>
      </div>
      {[
        [82, 58],
        [74, 66],
        [90, 44],
        [68, 60],
        [78, 50],
      ].map(([a, b], i) => (
        <div key={i} className="mui-pair">
          <span className="mui-lbl mono">RF-{i + 1}</span>
          <div className="mui-tracks">
            <span className="mui-bar is-dark" style={{ width: `${a}%` }} />
            <span className="mui-bar" style={{ width: `${b}%` }} />
            {a - b > 30 && <span className="mui-flag mono">widest gap</span>}
          </div>
        </div>
      ))}
    </div>
  ),
  genai: (
    <div className="mui-genai">
      <div className="mui-gauge">
        <svg viewBox="0 0 120 70">
          <path d="M10 64a50 50 0 0 1 100 0" className="trk" />
          <path d="M10 64a50 50 0 0 1 100 0" className="val" />
        </svg>
        <span className="mono">readiness</span>
      </div>
      <div className="mui-tasks">
        {["Task cluster", "Task cluster", "Task cluster", "Task cluster"].map((t, i) => (
          <div key={i} className="mui-task">
            <span className="mono">
              {t} {String.fromCharCode(65 + i)}
            </span>
            <div className="mui-meter">
              <span style={{ width: `${[72, 48, 86, 34][i]}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mui-prompt mono">
        <span>&gt;</span> map workloads → GenAI tools<i />
      </div>
    </div>
  ),
};

const CSS = `
.mui{position:relative;width:100%;height:100%;border-radius:18px;background:#fafaf8;box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;display:flex;flex-direction:column}
.mui-chrome{display:flex;align-items:center;gap:6px;height:34px;padding:0 12px;border-bottom:1px solid var(--line);background:#fff}
.mui-chrome i{width:8px;height:8px;border-radius:50%;background:#d9d6d0}
.mui-chrome .mono{margin-left:8px;font-size:10px;color:var(--mute);letter-spacing:.04em}
.mui-body{flex:1;min-height:0;padding:16px;position:relative}
.mui-h{margin:0 0 8px;font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}
.mui-bar{display:block;height:8px;border-radius:6px;background:#d8d5cf}
.mui-bar.is-dark{background:#3a3a3a}
.mui-orgmap{display:grid;grid-template-columns:1fr 46px 1fr;height:100%;align-items:start;align-content:center;padding-bottom:60px}
.mui-col{display:flex;flex-direction:column;gap:10px}
.mui-node{height:30px;border-radius:8px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);display:flex;align-items:center;padding:0 10px}
.mui-node.is-target{box-shadow:inset 0 0 0 1px rgba(13,13,13,.3)}
.mui-links{width:100%;height:200px;margin-top:22px}
.mui-links path{fill:none;stroke:#9a978f;stroke-width:1;stroke-dasharray:3 3;vector-effect:non-scaling-stroke}
.mui-stat{position:absolute;right:16px;bottom:16px;background:var(--ink);color:#fff;border-radius:12px;padding:10px 14px;display:flex;flex-direction:column}
.mui-stat b{font-size:26px;letter-spacing:-.04em;line-height:1}
.mui-stat .mono{font-size:9px;letter-spacing:.08em;text-transform:uppercase;opacity:.7;margin-top:3px}
.mui-tax{display:flex;flex-direction:column;gap:9px}
.mui-row{display:flex;align-items:center;gap:10px}
.mui-row .mui-bar{flex:none}
.mui-dot{width:8px;height:8px;border-radius:2px;background:#bdbab3;flex:none}
.mui-dot.is-root{background:var(--ink)}
.mui-check{margin-left:auto;width:14px;height:14px;border-radius:4px;background:var(--ink);position:relative;flex:none}
.mui-check::after{content:"";position:absolute;left:4px;top:2px;width:4px;height:7px;border:solid #fff;border-width:0 1.5px 1.5px 0;transform:rotate(45deg)}
.mui-check.is-pending{background:transparent;box-shadow:inset 0 0 0 1px #bdbab3}
.mui-check.is-pending::after{display:none}
.mui-foot{display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:10px;border-top:1px solid var(--line);font-size:10px;color:var(--mute)}
.mui-pill{background:var(--ink);color:#fff;border-radius:99px;padding:3px 9px;font-size:9px;letter-spacing:.08em;text-transform:uppercase}
.mui-buckets{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;height:100%}
.mui-bucket{background:#fff;border-radius:12px;box-shadow:inset 0 0 0 1px var(--line);padding:12px 10px;display:flex;flex-direction:column;gap:7px}
.mui-chip{display:block;height:16px;border-radius:99px;background:#e3e0da}
.mui-chip.is-dark{background:#3a3a3a}
.mui-stat.is-wide{left:auto}
.mui-gap{display:flex;flex-direction:column;gap:12px}
.mui-legend{display:flex;gap:16px;font-size:9.5px;color:var(--mute);letter-spacing:.04em}
.mui-legend i{display:inline-block;width:10px;height:10px;border-radius:3px;background:#d8d5cf;vertical-align:-1px;margin-right:4px}
.mui-legend i.is-dark{background:#3a3a3a}
.mui-pair{display:grid;grid-template-columns:44px minmax(0,1fr);align-items:center;gap:10px}
.mui-lbl{font-size:10px;color:var(--mute)}
.mui-tracks{position:relative;display:flex;flex-direction:column;gap:4px}
.mui-tracks .mui-bar{height:10px}
.mui-flag{position:absolute;right:0;top:50%;transform:translateY(-50%);font-size:8.5px;letter-spacing:.06em;text-transform:uppercase;
  background:#fff;box-shadow:inset 0 0 0 1px var(--ink);border-radius:99px;padding:2px 7px}
.mui-genai{display:grid;grid-template-columns:130px minmax(0,1fr);gap:16px;align-items:start}
.mui-gauge{display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:12px;box-shadow:inset 0 0 0 1px var(--line);padding:12px 8px}
.mui-gauge svg{width:100%}
.mui-gauge path{fill:none;stroke-width:9;stroke-linecap:round}
.mui-gauge .trk{stroke:#e3e0da}
.mui-gauge .val{stroke:var(--ink);stroke-dasharray:157;stroke-dashoffset:52}
.mui-gauge .mono{font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin-top:4px}
.mui-tasks{display:flex;flex-direction:column;gap:12px}
.mui-task .mono{font-size:10px;color:var(--ink-2)}
.mui-meter{height:8px;border-radius:6px;background:#e3e0da;margin-top:5px;overflow:hidden}
.mui-meter span{display:block;height:100%;background:#3a3a3a;border-radius:6px}
.mui-prompt{grid-column:1/-1;background:var(--ink);color:#e9e6e0;border-radius:10px;padding:10px 12px;font-size:11px}
.mui-prompt span{color:#8d8a84;margin-right:6px}
.mui-prompt i{display:inline-block;width:7px;height:12px;background:#e9e6e0;vertical-align:-2px;margin-left:4px;animation:blink 1.1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
`;
