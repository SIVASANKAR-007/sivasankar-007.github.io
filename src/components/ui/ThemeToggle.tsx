"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { prefersReducedMotion } from "@/lib/hooks";

type Theme = "light" | "dark";

const META = { light: "#f4f2ee", dark: "#0f0f0e" };

function apply(t: Theme) {
  document.documentElement.dataset.theme = t;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", META[t]));
}

/** Round sun/moon button. Remembers the choice; otherwise follows the OS setting. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) || "light";
    setTheme(current);
    // Follow OS changes until the visitor picks a theme themselves.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("theme");
      } catch {}
      if (saved) return;
      const t: Theme = mq.matches ? "dark" : "light";
      apply(t);
      setTheme(t);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", next);
    } catch {}
    const run = () => {
      apply(next);
      setTheme(next);
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (!doc.startViewTransition || prefersReducedMotion()) return run();
    // Circular reveal that grows out of the button.
    const r = btn.current?.getBoundingClientRect();
    const x = r ? r.left + r.width / 2 : window.innerWidth;
    const y = r ? r.top + r.height / 2 : 0;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const root = document.documentElement.style;
    root.setProperty("--vt-x", `${x}px`);
    root.setProperty("--vt-y", `${y}px`);
    root.setProperty("--vt-r", `${radius}px`);
    doc.startViewTransition(() => flushSync(run));
  };

  const dark = theme === "dark";
  return (
    <button
      ref={btn}
      type="button"
      className={`theme-btn ${dark ? "is-dark" : ""}`}
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      title={dark ? "Light mode" : "Dark mode"}
    >
      <style>{CSS}</style>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <mask id="theme-moon-cut">
          <rect width="24" height="24" fill="#fff" />
          <circle className="theme-cut" cx="24" cy="4" r="7" fill="#000" />
        </mask>
        <circle className="theme-core" cx="12" cy="12" r="5" fill="currentColor" mask="url(#theme-moon-cut)" />
        <g className="theme-rays" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 1.5v2.2M12 20.3v2.2M1.5 12h2.2M20.3 12h2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
        </g>
      </svg>
    </button>
  );
}

const CSS = `
.theme-btn{pointer-events:auto;flex:none;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;color:var(--ink);
  background:rgba(var(--glass-rgb),.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);
  box-shadow:inset 0 0 0 1px var(--line);transition:transform .6s var(--ease),background .4s var(--ease)}
.theme-btn:hover{transform:rotate(-20deg) scale(1.05)}
.theme-btn svg{overflow:visible}
.theme-core{transition:r .6s var(--ease)}
.theme-cut{transition:cx .6s var(--ease),cy .6s var(--ease)}
.theme-rays{transform-origin:12px 12px;transition:transform .6s var(--ease),opacity .4s var(--ease)}
.theme-btn.is-dark .theme-core{r:8px}
.theme-btn.is-dark .theme-cut{cx:17px;cy:7px}
.theme-btn.is-dark .theme-rays{transform:rotate(45deg) scale(.4);opacity:0}
`;
