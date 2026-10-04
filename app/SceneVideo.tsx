"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "./content";
import type { SceneTheme } from "./sceneThemes";
import styles from "./SceneVideo.module.css";

const labels: Record<Locale, { controls: string; play: string; pause: string; replay: string }> = {
  zh: { controls: "场景视频控制", play: "播放", pause: "暂停", replay: "重播" },
  en: { controls: "Scene video controls", play: "Play", pause: "Pause", replay: "Replay" },
  ja: { controls: "風景動画の操作", play: "再生", pause: "一時停止", replay: "もう一度" },
  ko: { controls: "장면 영상 제어", play: "재생", pause: "일시 정지", replay: "다시 재생" },
};

type Playback = "paused" | "playing" | "ended" | "unavailable";
type Intent = "auto" | "play" | "pause" | "ended";

/** The scene key owns playback; language changes only update its controls. */
export function SceneVideo({ scene, locale, ready, description }: {
  scene: SceneTheme;
  locale: Locale;
  ready: boolean;
  description: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const intentRef = useRef<Intent>("auto");
  const autoplayBlockedRef = useRef(false);
  const [playback, setPlayback] = useState<Playback>("paused");
  const ui = labels[locale];
  const poster = `/videos/little-g-${scene}-poster.jpg`;

  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!video || !stage || !ready) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = true;
    let visible = false;
    // Keep SSR still, including reduced-motion users, until visibility is known.
    video.muted = true;
    function synchronize() {
      if (!active || !video) return;
      const intent = intentRef.current;
      const automatic = intent === "auto" && !motion.matches && !autoplayBlockedRef.current;
      video.autoplay = automatic && visible && !document.hidden;
      if (!visible || document.hidden || (!automatic && intent !== "play")) {
        video.pause();
        return;
      }
      if (video.ended || video.error || !video.paused) return;
      void video.play().catch((error: unknown) => {
        // A visibility change can interrupt a pending play; it can resume later.
        if (active && error instanceof DOMException && error.name === "NotAllowedError") {
          autoplayBlockedRef.current = true;
          video.autoplay = false;
        }
      });
    }
    function handleMotionChange() {
      // A newly enabled preference stops even a manually started scene. The
      // next explicit play click can opt in again without any automatic restart.
      if (motion.matches && intentRef.current !== "ended") intentRef.current = "pause";
      synchronize();
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      synchronize();
    }, { threshold: 0.15 });
    observer.observe(stage);
    motion.addEventListener("change", handleMotionChange);
    document.addEventListener("visibilitychange", synchronize);
    video.addEventListener("canplay", synchronize);
    return () => {
      active = false;
      observer.disconnect();
      motion.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", synchronize);
      video.removeEventListener("canplay", synchronize);
      video.autoplay = false;
      video.pause();
    };
  }, [ready]);

  function play(restart = false) {
    const video = videoRef.current;
    if (!video) return;
    // An explicit click also enables playback when reduced motion is requested.
    intentRef.current = "play";
    if (restart || video.ended) video.currentTime = 0;
    void video.play().catch(() => undefined);
  }

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused && !video.ended) {
      intentRef.current = "pause";
      video.autoplay = false;
      video.pause();
    } else play();
  }

  return (
    <div ref={stageRef} className={styles.stage} data-playback={playback}>
      <video
        ref={videoRef}
        className={styles.video}
        src={`/videos/little-g-${scene}.mp4`}
        poster={poster}
        width={1280}
        height={800}
        preload="metadata"
        muted
        playsInline
        aria-label={description}
        onPlay={(event) => {
          if (!event.currentTarget.paused && !event.currentTarget.ended) setPlayback("playing");
        }}
        onPause={(event) => {
          if (event.currentTarget.paused) setPlayback(event.currentTarget.ended ? "ended" : "paused");
        }}
        onEnded={(event) => {
          // Ignore an old queued end event if replay has already sought to zero.
          if (!event.currentTarget.ended) return;
          intentRef.current = "ended";
          event.currentTarget.autoplay = false;
          setPlayback("ended");
        }}
        onError={() => setPlayback("unavailable")}
      />
      <div className={styles.controls} role="group" aria-label={ui.controls}>
        <button type="button" data-video-toggle disabled={playback === "unavailable"} onClick={togglePlayback}>
          <svg viewBox="0 0 20 20" aria-hidden="true">{playback === "playing" ? <path d="M6 4v12M14 4v12" /> : <path d="m7 4 9 6-9 6Z" />}</svg>
          {playback === "playing" ? ui.pause : ui.play}
        </button>
        <span className={styles.divider} aria-hidden="true" />
        <button type="button" data-video-replay disabled={playback === "unavailable"} onClick={() => play(true)}>
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.2 6.2A6.3 6.3 0 1 1 4 12M5.2 2.8v3.9H1.3" /></svg>
          {ui.replay}
        </button>
      </div>
    </div>
  );
}
