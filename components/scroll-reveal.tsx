"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ScrollReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Content is visible by default, including when JavaScript is unavailable.
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    element.dataset.reveal = "pending";
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        delete element.dataset.reveal;
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="practice-reveal">{children}</div>;
}
