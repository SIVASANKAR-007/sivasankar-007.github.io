import { CERTIFICATIONS } from "@/lib/data";
import SectionHead from "../ui/SectionHead";

export default function Certifications() {
  const issuers = new Set(CERTIFICATIONS.map((c) => c.issuer)).size;
  return (
    <section id="certifications" className="section certs" aria-labelledby="certifications-title">
      <style>{CSS}</style>
      <div className="wrap ct-grid">
        <div className="ct-left">
          <div className="ct-sticky">
            <SectionHead id="certifications" label="Certifications" lead="Always" accent="learning." />
            <p className="ct-count rv mono" style={{ "--i": 2 } as React.CSSProperties}>
              <b>{String(CERTIFICATIONS.length).padStart(2, "0")}</b> certifications · {issuers} issuers
            </p>
          </div>
        </div>
        <ol className="ct-list">
          {CERTIFICATIONS.map((c, i) => {
            const inner = (
              <>
                <span className="ct-num mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="ct-title">{c.title}</span>
                <span className="ct-issuer mono">{c.issuer}</span>
                <span className="ct-arrow" aria-hidden="true">
                  {c.url ? "↗" : "→"}
                </span>
              </>
            );
            return (
              <li key={c.title} className="rv" style={{ "--i": i % 4 } as React.CSSProperties}>
                {c.url ? (
                  <a className="ct-row" href={c.url} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                ) : (
                  <div className="ct-row" tabIndex={0}>
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

const CSS = `
.certs{background:var(--card);border-block:1px solid var(--line)}
.ct-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.3fr);gap:clamp(32px,6vw,96px);align-items:start}
.ct-left{align-self:stretch}
.ct-sticky{position:sticky;top:120px}
.ct-count{margin:22px 0 0;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.ct-count b{color:var(--ink);font-weight:600}
.ct-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.ct-row{position:relative;display:grid;grid-template-columns:44px minmax(0,1fr) auto 28px;align-items:center;gap:16px;
  padding:22px 14px;border-bottom:1px solid var(--line);isolation:isolate;overflow:hidden;cursor:default;border-radius:0}
a.ct-row{cursor:pointer}
.ct-row::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;
  transition:transform .7s var(--ease)}
.ct-row:hover::before,.ct-row:focus-visible::before{transform:scaleX(1)}
.ct-row:focus-visible{outline:none}
.ct-row>*{transition:color .45s var(--ease),transform .6s var(--ease),opacity .45s var(--ease)}
.ct-num{font-size:12px;color:var(--faint)}
.ct-title{font-size:clamp(17px,1.6vw,22px);font-weight:600;letter-spacing:-.025em;line-height:1.2}
.ct-issuer{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);text-align:right}
.ct-arrow{font-size:18px;opacity:0;transform:translateX(-14px)}
.ct-row:hover>*,.ct-row:focus-visible>*{color:#fff}
.ct-row:hover .ct-num,.ct-row:focus-visible .ct-num,.ct-row:hover .ct-issuer,.ct-row:focus-visible .ct-issuer{color:rgba(255,255,255,.65)}
.ct-row:hover .ct-arrow,.ct-row:focus-visible .ct-arrow{opacity:1;transform:none}
@media (max-width: 859px){
  .ct-grid{grid-template-columns:minmax(0,1fr)}
  .ct-sticky{position:static}
  .ct-row{grid-template-columns:32px minmax(0,1fr) 20px;gap:4px 12px;padding:18px 6px}
  .ct-issuer{grid-column:2;grid-row:2;text-align:left}
  .ct-arrow{grid-column:3;grid-row:1 / span 2}
}
`;
