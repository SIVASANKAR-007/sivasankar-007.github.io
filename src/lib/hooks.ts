"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** True when the user prefers reduced motion (safe on the server). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Observe an element; `once` keeps it true after the first intersection. */
export function useInView<T extends Element>(
  options: IntersectionObserverInit & { once?: boolean } = {},
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const { once = true, root, rootMargin, threshold } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { root, rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, root, rootMargin, threshold]);
  return [ref, inView];
}

/**
 * Progress (0 → 1) of an element scrolling through the viewport.
 * `start`/`end` are viewport fractions where progress is 0 and 1 for the element top/bottom.
 * Runs in a rAF loop only while the element is near the viewport.
 */
export function useScrollProgress<T extends HTMLElement>(
  mode: "through" | "pin" = "through",
): [RefObject<T | null>, number] {
  const ref = useRef<T | null>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let visible = false;
    let last = -1;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let v: number;
      if (mode === "pin") {
        const travel = r.height - vh;
        v = travel > 0 ? -r.top / travel : 0;
      } else {
        // 0 when the top hits 70% of the viewport, 1 when the bottom hits 70%
        v = (vh * 0.7 - r.top) / r.height;
      }
      v = Math.min(1, Math.max(0, v));
      if (Math.abs(v - last) > 0.0005) {
        last = v;
        setP(v);
      }
    };
    const loop = () => {
      measure();
      if (visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(loop);
        else measure();
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    io.observe(el);
    measure();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [mode]);
  return [ref, p];
}
