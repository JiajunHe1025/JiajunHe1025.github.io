"use client";

import { useEffect, useRef } from "react";
import styles from "./ArtCursor.module.css";

export function ArtCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const cursor = cursorRef.current;
    if (!media.matches || !cursor) return;

    const root = document.documentElement;
    root.classList.add("has-art-cursor");

    const move = (event: PointerEvent) => {
      cursor.style.setProperty("--cursor-x", `${event.clientX}px`);
      cursor.style.setProperty("--cursor-y", `${event.clientY}px`);
      cursor.dataset.visible = "true";
      const target = event.target;
      cursor.dataset.interactive = String(
        target instanceof Element && Boolean(target.closest("a, button, input, textarea, select, summary, [role='button']")),
      );
    };
    const down = () => { cursor.dataset.pressed = "true"; };
    const up = () => { cursor.dataset.pressed = "false"; };
    const leave = () => { cursor.dataset.visible = "false"; };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("mouseleave", leave);

    return () => {
      root.classList.remove("has-art-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
      <span className={styles.trail} />
      <span className={styles.pointer} />
    </div>
  );
}
