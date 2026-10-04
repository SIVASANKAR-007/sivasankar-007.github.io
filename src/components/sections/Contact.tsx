"use client";

import { useRef, useState } from "react";
import { PROFILE, SECTION_INDEX } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

function Hop({ text, className = "" }: { text: string; className?: string }) {
  const hop = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    if (el.classList.contains("is-hop")) return;
    el.classList.add("is-hop");
  };
  return (
    <span className={className} aria-hidden="true">
      {Array.from(text).map((ch, i) =>
        ch === " " ? (
          <span key={i} className="hop-sp">
            {" "}
          </span>
        ) : (
          <span
            key={i}
            className="hop"
            onPointerEnter={hop}
            onAnimationEnd={(e) => e.currentTarget.classList.remove("is-hop")}
          >
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const year = new Date().getFullYear();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  };

  const links = [
    { k: "Phone", v: PROFILE.phone, href: PROFILE.phoneHref },
    PROFILE.github && { k: "GitHub", v: PROFILE.githubLabel ?? "GitHub", href: PROFILE.github, ext: true },
    PROFILE.linkedin && { k: "LinkedIn", v: PROFILE.linkedinLabel ?? "LinkedIn", href: PROFILE.linkedin, ext: true },
  ].filter(Boolean) as { k: string; v: string; href: string; ext?: boolean }[];

  return (
    <>
      <section id="contact" className="section contact" aria-labelledby="contact-title">
        <style>{CSS}</style>
        <div className="wrap">
          <p className="tag rv">
            <b>{SECTION_INDEX.contact}</b>
            <span aria-hidden="true">—</span>
            <span>Contact</span>
          </p>
          <h2 id="contact-title" className="ctc-title">
            <span className="sr-only">Let&apos;s build something together.</span>
            <span className="rv-mask">
              <span>
                <Hop text="Let's build" />
              </span>
            </span>
            <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
              <span>
                <Hop text="something " />
                <Hop text="together." className="serif-i" />
              </span>
            </span>
          </h2>

          <div className="ctc-row">
            <div className="ctc-main">
              <div className="ctc-email rv" style={{ "--i": 2 } as React.CSSProperties}>
                <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                <button type="button" className={`ctc-copy ${copied ? "is-done" : ""}`} onClick={copy}>
                  {copied ? "Copied ✓" : "Copy"}
                </button>
                <span className="sr-only" aria-live="polite">
                  {copied ? "Email address copied to clipboard" : ""}
                </span>
              </div>
              <ul className="ctc-links">
                {links.map((l, i) => (
                  <li key={l.k} className="rv" style={{ "--i": 3 + i } as React.CSSProperties}>
                    <span className="mono">{l.k}</span>
                    <a href={l.href} {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {l.v}
                      {l.ext && <span aria-hidden="true"> ↗</span>}
                    </a>
                  </li>
                ))}
                <li className="rv" style={{ "--i": 6 } as React.CSSProperties}>
                  <span className="mono">Based in</span>
                  <span>{PROFILE.location}</span>
                </li>
              </ul>
            </div>

            <a href={`mailto:${PROFILE.email}`} className="ctc-badge rv" style={{ "--i": 4 } as React.CSSProperties} aria-label={`Say hello — email ${PROFILE.email}`}>
              <svg viewBox="0 0 200 200" aria-hidden="true">
                <defs>
                  <path id="ctc-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                </defs>
                <text>
                  <textPath href="#ctc-circle" startOffset="0" textLength="486" lengthAdjust="spacing">
                    SAY HELLO · SAY HELLO · SAY HELLO ·
                  </textPath>
                </text>
              </svg>
              <span className="ctc-badge-core" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </section>

      <footer className="ftr">
        <div className="wrap ftr-row">
          <span>
            © {year} {PROFILE.name}
          </span>
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("top");
            }}
          >
            Back to top <span aria-hidden="true">↑</span>
          </a>
          <span className="mono">Built with Next.js</span>
        </div>
      </footer>
    </>
  );
}

const CSS = `
.contact{padding-bottom:clamp(64px,10vh,120px)}
.ctc-title{margin:22px 0 0;font-weight:700;letter-spacing:-.05em;line-height:.95;font-size:clamp(46px,9.4vw,156px)}
.ctc-title .serif-i{color:var(--mute);letter-spacing:-.02em}
.hop{display:inline-block;will-change:transform}
.hop.is-hop{animation:hop .7s var(--ease)}
@keyframes hop{0%{transform:none}30%{transform:translateY(-.16em)}55%{transform:translateY(.02em)}75%{transform:translateY(-.04em)}100%{transform:none}}
.ctc-row{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;margin-top:clamp(40px,7vh,80px)}
.ctc-main{min-width:0;flex:1}
.ctc-email{display:flex;align-items:center;flex-wrap:wrap;gap:14px 18px}
.ctc-email a{font-size:clamp(24px,3.6vw,52px);font-weight:600;letter-spacing:-.04em;line-height:1.1;overflow-wrap:anywhere;
  text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.16em;text-decoration-color:rgba(13,13,13,.25);
  transition:text-decoration-color .4s var(--ease)}
.ctc-email a:hover{text-decoration-color:var(--ink)}
.ctc-copy{height:34px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);
  transition:background .4s var(--ease),color .4s var(--ease),transform .4s var(--ease)}
.ctc-copy:hover{background:var(--ink);color:#fff;transform:translateY(-1px)}
.ctc-copy.is-done{background:var(--ink);color:#fff}
.ctc-links{list-style:none;margin:36px 0 0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,auto));justify-content:start;gap:18px 48px}
.ctc-links li{display:flex;flex-direction:column;gap:6px;font-size:15px;min-width:0}
.ctc-links .mono{font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}
.ctc-links a{overflow-wrap:anywhere;background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .5s var(--ease)}
.ctc-links a:hover{background-size:100% 1px}
.ctc-badge{position:relative;flex:none;width:168px;height:168px;display:grid;place-items:center;border-radius:50%}
.ctc-badge svg{position:absolute;inset:0;width:100%;height:100%;animation:spin 18s linear infinite}
.ctc-badge text{font:500 15px var(--font-mono);letter-spacing:.2em;fill:var(--ink)}
.ctc-badge-core{width:64px;height:64px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:22px;
  transition:transform .6s var(--ease)}
.ctc-badge:hover .ctc-badge-core{transform:rotate(45deg) scale(1.08)}
@keyframes spin{to{transform:rotate(360deg)}}
.ftr{border-top:1px solid var(--line)}
.ftr-row{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px 24px;padding-block:26px;font-size:13px;color:var(--mute)}
.ftr-row a{color:var(--ink)}
.ftr-row a:hover{text-decoration:underline;text-underline-offset:4px}
.ftr-row .mono{font-size:11px;letter-spacing:.06em}
@media (max-width: 1023px){ .ctc-links{grid-template-columns:repeat(2,minmax(0,1fr))} }
@media (max-width: 759px){
  .ctc-row{flex-direction:column;align-items:flex-start}
  .ctc-badge{width:132px;height:132px;align-self:flex-end}
  .ctc-links{grid-template-columns:minmax(0,1fr)}
}
`;
