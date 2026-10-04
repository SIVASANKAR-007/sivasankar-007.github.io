"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  // Scroll state + progress bar (written straight to the DOM — no re-render per frame)
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Active section
  useEffect(() => {
    const ids = ["hero", ...NAV.map((n) => n.id), "certifications"];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = e.target.id;
          // Certifications belongs to no nav item; keep "Work" lit while there.
          setActive(id === "hero" ? "" : id === "certifications" ? "work" : id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Sliding indicator
  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list || !active) return setPill(null);
    const a = list.querySelector<HTMLAnchorElement>(`a[data-id="${active}"]`);
    if (!a) return setPill(null);
    setPill({ x: a.offsetLeft, w: a.offsetWidth });
  }, [active]);
  useIsoLayout(measure, [measure, scrolled]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Mobile menu: Esc closes, scroll locked
  useEffect(() => {
    if (!open) return;
    const btn = menuBtn.current;
    lockScroll(true);
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    // let the overlay release scroll first
    requestAnimationFrame(() => scrollToTarget(id));
  };

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <style>{CSS}</style>
      <div className="nav-progress" aria-hidden="true">
        <div ref={barRef} />
      </div>
      <div className="nav-row">
        <a href="#hero" className="nav-brand" onClick={(e) => go(e, "top")}>
          <span className="nav-mark" aria-hidden="true">
            {PROFILE.initials}
          </span>
          <span className="nav-name">{PROFILE.name}</span>
          <span className="sr-only"> — back to top</span>
        </a>

        <nav aria-label="Primary" className="nav-desktop">
          <ul ref={listRef} className="nav-pill">
            {pill && (
              <li
                aria-hidden="true"
                className="nav-ind"
                style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
              />
            )}
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  data-id={n.id}
                  aria-current={active === n.id ? "true" : undefined}
                  className={active === n.id ? "is-active" : ""}
                  onClick={(e) => go(e, n.id)}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={menuBtn}
          type="button"
          className="nav-menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <i aria-hidden="true" />
        </button>
      </div>

      <div id="mobile-menu" className="nav-overlay" hidden={!open} role="dialog" aria-modal="true" aria-label="Menu">
        <ol>
          {NAV.map((n, i) => (
            <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
              <a ref={i === 0 ? firstLink : undefined} href={`#${n.id}`} onClick={(e) => go(e, n.id)}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                {n.label}
              </a>
            </li>
          ))}
        </ol>
        <p className="nav-overlay-foot mono">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <span>{PROFILE.location}</span>
        </p>
      </div>
    </header>
  );
}

const CSS = `
.nav{position:fixed;inset:0 0 auto 0;z-index:50;pointer-events:none}
.nav-progress{position:absolute;inset:0 0 auto 0;height:2px;z-index:3}
.nav-progress>div{height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(0)}
.nav-row{pointer-events:auto;display:flex;align-items:center;justify-content:space-between;gap:16px;
  max-width:calc(1320px + var(--gutter)*2);margin:0 auto;padding:16px var(--gutter);position:relative;z-index:2}
.nav-brand{display:flex;align-items:center;gap:12px;min-width:0}
.nav-mark{width:42px;height:42px;flex:none;border-radius:50%;display:grid;place-items:center;
  font:600 13px/1 var(--font-mono);letter-spacing:.02em;box-shadow:inset 0 0 0 1.5px var(--ink);
  background:transparent;color:var(--ink);transition:background .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
.nav-brand:hover .nav-mark{transform:rotate(360deg)}
.is-scrolled .nav-mark{background:var(--ink);color:#fff}
.nav-name{font-weight:600;letter-spacing:-.02em;font-size:15px;white-space:nowrap;transition:opacity .5s var(--ease),transform .5s var(--ease)}
.is-scrolled .nav-name{opacity:0;transform:translateX(-8px);pointer-events:none}
.nav-pill{list-style:none;margin:0;padding:5px;display:flex;gap:2px;position:relative;border-radius:999px;
  background:rgba(255,255,255,.55);box-shadow:inset 0 0 0 1px var(--line);
  transition:background .5s var(--ease),box-shadow .5s var(--ease)}
.is-scrolled .nav-pill{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);
  box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -18px rgba(13,13,13,.35)}
.nav-pill a{position:relative;z-index:1;display:block;padding:9px 16px;border-radius:999px;font-size:14px;font-weight:500;
  color:var(--ink-2);transition:color .45s var(--ease)}
.nav-pill a:hover{color:var(--ink)}
.nav-pill a.is-active{color:#fff}
.nav-ind{position:absolute;left:0;top:5px;bottom:5px;border-radius:999px;background:var(--ink);
  transition:transform .6s var(--ease),width .6s var(--ease)}
.nav-menu-btn{display:none;align-items:center;gap:10px;height:42px;padding:0 16px 0 18px;border-radius:999px;
  background:rgba(255,255,255,.75);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);
  box-shadow:inset 0 0 0 1px var(--line);font-weight:500;font-size:14px}
.nav-menu-btn i{width:16px;height:8px;position:relative}
.nav-menu-btn i::before,.nav-menu-btn i::after{content:"";position:absolute;left:0;right:0;height:1.5px;background:var(--ink);
  transition:transform .5s var(--ease),top .5s var(--ease)}
.nav-menu-btn i::before{top:0}.nav-menu-btn i::after{top:6px}
.is-open .nav-menu-btn{background:var(--ink);color:#fff}
.is-open .nav-menu-btn i::before{top:3px;transform:rotate(45deg);background:#fff}
.is-open .nav-menu-btn i::after{top:3px;transform:rotate(-45deg);background:#fff}
.nav-overlay{pointer-events:auto;position:fixed;inset:0;z-index:1;background:var(--paper);display:flex;flex-direction:column;
  justify-content:center;padding:96px var(--gutter) 32px;animation:navReveal .8s var(--ease) both}
.nav-overlay[hidden]{display:none}
@keyframes navReveal{from{clip-path:circle(0% at calc(100% - 50px) 36px)}to{clip-path:circle(150% at calc(100% - 50px) 36px)}}
.nav-overlay ol{list-style:none;margin:0;padding:0}
.nav-overlay li{overflow:hidden;border-bottom:1px solid var(--line)}
.nav-overlay li a{display:flex;align-items:baseline;gap:16px;padding:14px 0;font-weight:700;letter-spacing:-.045em;
  font-size:clamp(36px,11vw,64px);line-height:1;animation:navItem .8s var(--ease) both;animation-delay:calc(120ms + var(--i)*60ms)}
.nav-overlay li a .mono{font-size:12px;letter-spacing:.06em;color:var(--mute);font-weight:500}
@keyframes navItem{from{transform:translateY(110%)}to{transform:none}}
.nav-overlay-foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;margin-top:28px;font-size:12px;color:var(--mute)}
@media (max-width: 899px){
  .nav-desktop{display:none}
  .nav-menu-btn{display:inline-flex}
  .is-scrolled .nav-name{opacity:0}
}
@media (min-width: 900px){ .nav-overlay{display:none!important} }
`;
