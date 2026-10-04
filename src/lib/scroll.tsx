"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "./hooks";

const LenisCtx = createContext<{ current: Lenis | null }>({ current: null });

let lenisSingleton: Lenis | null = null;

/** Smooth-scroll to an element id (or "top"), via Lenis when available. */
export function scrollToTarget(target: string, opts: { offset?: number } = {}) {
  const offset = opts.offset ?? 0;
  if (target === "top") {
    if (lenisSingleton) lenisSingleton.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    return;
  }
  const el = document.getElementById(target);
  if (!el) return;
  if (lenisSingleton) lenisSingleton.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  // Move focus for keyboard and screen-reader users without a second jump.
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<Lenis | null>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, easing: (t) => 1 - Math.pow(1 - t, 4) });
    ref.current = lenis;
    lenisSingleton = lenis;
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisSingleton = null;
      ref.current = null;
    };
  }, []);
  return <LenisCtx.Provider value={ref}>{children}</LenisCtx.Provider>;
}

export function useLenis() {
  return useContext(LenisCtx);
}

export function lockScroll(lock: boolean) {
  if (lenisSingleton) {
    if (lock) lenisSingleton.stop();
    else lenisSingleton.start();
  }
  document.documentElement.style.overflow = lock ? "hidden" : "";
}
