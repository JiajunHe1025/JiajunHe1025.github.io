"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent, TransitionEvent } from "react";
import styles from "./WebsitePet.module.css";

const outfits = ["summer", "spring", "autumn", "winter", "formal"] as const;
type Outfit = (typeof outfits)[number];
type PetAction = "idle" | "runRight" | "runLeft" | "wave" | "dribble" | "sad" | "think" | "walk";

const actionRows: Record<PetAction, number> = {
  idle: 0,
  runRight: 1,
  runLeft: 2,
  wave: 3,
  dribble: 4,
  sad: 5,
  think: 6,
  walk: 7,
};

const actionSpeeds: Record<PetAction, string> = {
  idle: "1.45s",
  runRight: "0.56s",
  runLeft: "0.56s",
  wave: "0.9s",
  dribble: "0.68s",
  sad: "1.2s",
  think: "1.2s",
  walk: "0.92s",
};

const copy = {
  zh: {
    label: "篮球网页宠物",
    hint: "拖动我四处走走，双击可以运球。",
    hello: ["嗨，欢迎来逛！", "要不要一起看看技术笔记？", "今天也要保持好奇心。"],
    dribble: "来一球！",
    think: "这个问题值得再想一想……",
    sad: "休息一下，再继续。",
    hide: "隐藏宠物",
    wake: "叫回宠物",
    outfit: "切换服装",
    outfitNames: { summer: "夏日运动装", spring: "春装", autumn: "秋装", winter: "冬装", formal: "正式装" },
  },
  en: {
    label: "Basketball web pet",
    hint: "Drag me around. Double-click to dribble.",
    hello: ["Hi — welcome!", "Want to explore the technical notes?", "Stay curious today."],
    dribble: "Game on!",
    think: "That deserves another thought…",
    sad: "A short break, then we go again.",
    hide: "Hide pet",
    wake: "Bring pet back",
    outfit: "Change outfit",
    outfitNames: { summer: "Summer sports", spring: "Spring", autumn: "Autumn", winter: "Winter", formal: "Formal" },
  },
  ja: {
    label: "バスケットボールのウェブペット",
    hint: "ドラッグで移動、ダブルクリックでドリブルします。",
    hello: ["ようこそ！", "技術ノートも見てみませんか？", "今日も好奇心を大切に。"],
    dribble: "一本いこう！",
    think: "もう少し考えてみよう……",
    sad: "少し休んで、また進もう。",
    hide: "ペットを隠す",
    wake: "ペットを呼び戻す",
    outfit: "服を替える",
    outfitNames: { summer: "夏のスポーツ", spring: "春服", autumn: "秋服", winter: "冬服", formal: "フォーマル" },
  },
} as const;

type Position = { x: number; y: number };

const getLocale = () => {
  const lang = document.documentElement.lang.toLowerCase();
  if (lang.startsWith("ja")) return "ja";
  if (lang.startsWith("en")) return "en";
  return "zh";
};

const clampPosition = (position: Position, width = 118, height = 132): Position => ({
  x: Math.min(Math.max(10, position.x), Math.max(10, window.innerWidth - width - 10)),
  y: Math.min(Math.max(72, position.y), Math.max(72, window.innerHeight - height - 10)),
});

export function WebsitePet() {
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 18, y: 420 });
  const [action, setAction] = useState<PetAction>("idle");
  const [outfit, setOutfit] = useState<Outfit>("summer");
  const [message, setMessage] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(position);
  const draggingRef = useRef(false);
  const actionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef({ pointerId: -1, offsetX: 0, offsetY: 0, startX: 0, startY: 0, moved: false });

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const showMessage = useCallback((nextMessage: string) => {
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    setMessage(nextMessage);
    messageTimerRef.current = setTimeout(() => setMessage(null), 4200);
  }, []);

  const performAction = useCallback((nextAction: PetAction, duration: number, nextMessage?: string) => {
    if (actionTimerRef.current) clearTimeout(actionTimerRef.current);
    setMoving(false);
    setAction(nextAction);
    if (nextMessage) showMessage(nextMessage);
    actionTimerRef.current = setTimeout(() => setAction("idle"), duration);
  }, [showMessage]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedPosition = window.localStorage.getItem("jiajun-web-pet-position");
      const storedOutfit = window.localStorage.getItem("jiajun-web-pet-outfit") as Outfit | null;
      const storedHidden = window.localStorage.getItem("jiajun-web-pet-hidden") === "true";
      const fallback = { x: 18, y: window.innerHeight - 172 };
      let initialPosition = fallback;

      if (storedPosition) {
        try {
          const parsed = JSON.parse(storedPosition) as Position;
          if (Number.isFinite(parsed.x) && Number.isFinite(parsed.y)) initialPosition = parsed;
        } catch {
          // Ignore malformed local preferences.
        }
      }

      setPosition(clampPosition(initialPosition));
      if (storedOutfit && outfits.includes(storedOutfit)) setOutfit(storedOutfit);
      setHidden(storedHidden);
      setReady(true);
      showMessage(copy[getLocale()].hint);
    }, 0);

    const handleResize = () => setPosition((current) => clampPosition(current));
    window.addEventListener("resize", handleResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      if (actionTimerRef.current) clearTimeout(actionTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, [showMessage]);

  useEffect(() => {
    if (!ready || hidden) return;

    const activityTimer = window.setInterval(() => {
      if (draggingRef.current || moving) return;
      const localeCopy = copy[getLocale()];
      const roll = Math.random();

      if (roll < 0.48) {
        const current = positionRef.current;
        const targetX = current.x < window.innerWidth / 2 ? window.innerWidth - 134 : 14;
        setAction(targetX > current.x ? "runRight" : "runLeft");
        setMoving(true);
        setPosition(clampPosition({ x: targetX, y: window.innerHeight - 172 }));
      } else if (roll < 0.68) {
        performAction("dribble", 2300, localeCopy.dribble);
      } else if (roll < 0.86) {
        performAction("think", 2200, localeCopy.think);
      } else {
        performAction("sad", 2100, localeCopy.sad);
      }
    }, 11_000);

    return () => window.clearInterval(activityTimer);
  }, [hidden, moving, performAction, ready]);

  const persistPosition = (nextPosition: Position) => {
    try {
      window.localStorage.setItem("jiajun-web-pet-position", JSON.stringify(nextPosition));
    } catch {
      // The pet still works when local storage is unavailable.
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    setMoving(false);
    setAction("walk");
    setPosition({ x: rect.left, y: rect.top });
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current || event.pointerId !== dragRef.current.pointerId) return;
    const distance = Math.hypot(event.clientX - dragRef.current.startX, event.clientY - dragRef.current.startY);
    if (distance > 5) dragRef.current.moved = true;
    setPosition(clampPosition({
      x: event.clientX - dragRef.current.offsetX,
      y: event.clientY - dragRef.current.offsetY,
    }));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerId !== dragRef.current.pointerId) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setAction("idle");
    const rect = rootRef.current?.getBoundingClientRect();
    const finalPosition = rect ? clampPosition({ x: rect.left, y: rect.top }) : positionRef.current;
    setPosition(finalPosition);
    positionRef.current = finalPosition;
    persistPosition(finalPosition);

    if (!dragRef.current.moved) {
      const localeCopy = copy[getLocale()];
      const greeting = localeCopy.hello[Math.floor(Math.random() * localeCopy.hello.length)];
      performAction("wave", 1800, greeting);
    }
  };

  const handleDoubleClick = () => {
    const localeCopy = copy[getLocale()];
    performAction("dribble", 2600, localeCopy.dribble);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performAction("wave", 1800, copy[getLocale()].hello[0]);
    }
    if (event.key === " ") {
      event.preventDefault();
      handleDoubleClick();
    }
  };

  const cycleOutfit = () => {
    const nextOutfit = outfits[(outfits.indexOf(outfit) + 1) % outfits.length];
    setOutfit(nextOutfit);
    performAction("wave", 1600, copy[getLocale()].outfitNames[nextOutfit]);
    try {
      window.localStorage.setItem("jiajun-web-pet-outfit", nextOutfit);
    } catch {
      // Ignore storage errors.
    }
  };

  const toggleHidden = (nextHidden: boolean) => {
    setHidden(nextHidden);
    setMoving(false);
    setAction("idle");
    try {
      window.localStorage.setItem("jiajun-web-pet-hidden", String(nextHidden));
    } catch {
      // Ignore storage errors.
    }
  };

  const localeCopy = typeof document === "undefined" ? copy.zh : copy[getLocale()];
  const spriteStyle = {
    "--pet-sheet": `url(/pet/outfits/${outfit}.png)`,
    "--pet-row": `${actionRows[action] * 10}%`,
    "--pet-speed": actionSpeeds[action],
    left: `${position.x}px`,
    top: `${position.y}px`,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={`${styles.petRoot} ${ready ? styles.ready : ""} ${moving ? styles.moving : ""}`}
      style={spriteStyle}
      onTransitionEnd={(event: TransitionEvent<HTMLDivElement>) => {
        if (event.propertyName !== "left") return;
        setMoving(false);
        setAction("idle");
        persistPosition(positionRef.current);
      }}
    >
      {hidden ? (
        <button className={styles.wakeButton} type="button" onClick={() => toggleHidden(false)} aria-label={localeCopy.wake}>
          <span className={styles.basketballIcon} aria-hidden="true" />
        </button>
      ) : (
        <>
          {message ? <div className={styles.speech} role="status" aria-live="polite">{message}</div> : null}
          <div className={styles.petControls}>
            <button type="button" onClick={cycleOutfit} aria-label={localeCopy.outfit}>✦</button>
            <button type="button" onClick={() => toggleHidden(true)} aria-label={localeCopy.hide}>‹</button>
          </div>
          <button
            className={styles.petButton}
            type="button"
            aria-label={`${localeCopy.label}。${localeCopy.hint}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDoubleClick={handleDoubleClick}
            onKeyDown={handleKeyDown}
          >
            <span className={styles.sprite} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
