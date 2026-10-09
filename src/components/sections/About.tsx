import { EDUCATION, EXPERIENCE, ID_CARD, PROFILE } from "@/lib/data";
import { asset } from "@/lib/asset";
import SectionHead from "../ui/SectionHead";
import IdCard from "../ui/IdCard";

export default function About() {
  const current = EXPERIENCE[EXPERIENCE.length - 1];
  const degree = EDUCATION[EDUCATION.length - 1];
  const facts = [
    { k: "Location", v: PROFILE.location },
    { k: "Education", v: `${degree.title}, ${degree.place}` },
    { k: "Current role", v: `${current.title.split(",")[0]} · ${current.place}` },
    { k: "Email", v: PROFILE.email, href: `mailto:${PROFILE.email}` },
  ];

  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <style>{CSS}</style>
      <div className="wrap">
        <div className="about-grid">
          <div className="about-left">
            <SectionHead id="about" label="About" lead="Hi, I'm" accent={`${PROFILE.firstName}.`} />
            <p className="about-summary rv" style={{ "--i": 1 } as React.CSSProperties}>
              {PROFILE.resumeSummary}
            </p>
            <p className="about-extra rv" style={{ "--i": 2 } as React.CSSProperties}>
              {PROFILE.extraLine}
            </p>
            <div className="about-btns rv" style={{ "--i": 3 } as React.CSSProperties}>
              <a className="btn btn-primary btn-sm" href={asset(PROFILE.resume)} download>
                Resume <span aria-hidden="true">↓</span>
              </a>
              {PROFILE.github && (
                <a className="btn btn-ghost btn-sm" href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              )}
              {PROFILE.linkedin && (
                <a className="btn btn-ghost btn-sm" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>

          <div className="about-center">
            <IdCard
              name={PROFILE.name}
              role={PROFILE.role}
              band={ID_CARD.band}
              rows={ID_CARD.rows}
              back={ID_CARD.back}
              email={PROFILE.email}
              portrait={asset("/portrait-bust.webp")}
            />
          </div>

          <div className="about-right">
            <p className="tag rv">Quick facts</p>
            <dl className="facts">
              {facts.map((f, i) => (
                <div key={f.k} className="fact rv" style={{ "--i": i + 1 } as React.CSSProperties}>
                  <dt className="mono">{f.k}</dt>
                  <dd>{f.href ? <a href={f.href}>{f.v}</a> : f.v}</dd>
                </div>
              ))}
            </dl>
            <figure className="about-quote rv" style={{ "--i": 6 } as React.CSSProperties}>
              <blockquote>
                <span aria-hidden="true" className="q">“</span>
                {PROFILE.quote}
              </blockquote>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.about{overflow:hidden}
.about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(28px,4vw,64px);align-items:stretch}
.about-left,.about-right{display:flex;flex-direction:column;min-width:0}
.about-summary{margin:28px 0 0;font-size:clamp(15px,1.1vw,17px);line-height:1.62;color:var(--ink-2)}
.about-extra{margin:16px 0 0;font-size:15px;line-height:1.6;color:var(--mute)}
.about-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
.about-center{position:relative;min-height:600px}
.about-right{padding-top:8px;justify-content:flex-start}
.facts{margin:20px 0 0;border-top:1px solid var(--line)}
.fact{display:grid;grid-template-columns:110px minmax(0,1fr);gap:16px;padding:18px 0;border-bottom:1px solid var(--line)}
.fact dt{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);padding-top:3px}
.fact dd{margin:0;font-size:15px;line-height:1.45;overflow-wrap:anywhere}
.fact dd a{background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .5s var(--ease)}
.fact dd a:hover{background-size:100% 1px}
.about-quote{margin:auto 0 0;padding-top:40px}
.about-quote blockquote{margin:0;font-family:var(--font-serif);font-style:italic;font-size:clamp(30px,2.8vw,42px);line-height:1.05;letter-spacing:-.01em}
.about-quote .q{display:block;font-size:1.6em;line-height:.6;color:var(--faint)}
.about-quote figcaption{margin-top:14px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
@media (max-width: 1099px){
  .about-grid{grid-template-columns:minmax(0,1fr) 320px}
  .about-right{grid-column:1 / -1}
}
@media (max-width: 759px){
  .about-grid{grid-template-columns:minmax(0,1fr)}
  .about-center{min-height:600px;margin-top:8px}
  .about-right{grid-column:auto}
}
`;
