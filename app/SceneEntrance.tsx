"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./SceneEntrance.module.css";

/** Keeps the entrance turn separate from the artwork's pointer parallax. */
export function SceneEntrance({ children, ready }: { children: ReactNode; ready: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const image = layer?.querySelector("img");
    const artwork = layer?.parentElement?.parentElement;
    if (!layer || !image || !artwork || !ready) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = true;
    let decoded = false;
    let visible = false;
    let started = false;
    let frame = 0;

    function synchronize() {
      if (!active || !layer) return;
      if (motion.matches) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        started = true;
        layer.dataset.entrance = "done";
        return;
      }
      layer.dataset.paused = String(!visible || document.hidden);
      if (started || frame || !decoded || !visible || document.hidden) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (!active || motion.matches || !visible || document.hidden) return;
        started = true;
        layer.dataset.entrance = "playing";
      });
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      synchronize();
    }, { threshold: 0.15 });
    observer.observe(artwork);
    motion.addEventListener("change", synchronize);
    document.addEventListener("visibilitychange", synchronize);
    // A decode failure still leaves the ordinary image and hotspots usable.
    void image.decode().catch(() => undefined).then(() => {
      decoded = true;
      synchronize();
    });
    synchronize();

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener("change", synchronize);
      document.removeEventListener("visibilitychange", synchronize);
    };
  }, [ready]);

  return (
    <div ref={layerRef} className={styles.layer} data-entrance="waiting"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.dataset.entrance = "done";
      }}>
      {children}
    </div>
  );
}
