"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "./content";

const localeTags: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en-US",
  ja: "ja-JP",
};

const weekDays: Record<Locale, string[]> = {
  zh: ["日", "一", "二", "三", "四", "五", "六"],
  en: ["S", "M", "T", "W", "T", "F", "S"],
  ja: ["日", "月", "火", "水", "木", "金", "土"],
};

const dockCopy: Record<
  Locale,
  {
    calendar: string;
    music: string;
    close: string;
    previousMonth: string;
    nextMonth: string;
    today: string;
    play: string;
    pause: string;
    track: string;
    description: string;
    blocked: string;
    volume: string;
    unsupported: string;
  }
> = {
  zh: {
    calendar: "日历",
    music: "音乐",
    close: "关闭",
    previousMonth: "上个月",
    nextMonth: "下个月",
    today: "今天",
    play: "播放",
    pause: "暂停",
    track: "凪のお暇 · メインテーマ",
    description: "PASCALS · 循环背景音乐",
    blocked: "浏览器已拦截自动播放；轻触页面或点击播放即可开始",
    volume: "音量",
    unsupported: "音乐加载失败，请稍后重试",
  },
  en: {
    calendar: "Calendar",
    music: "Music",
    close: "Close",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    today: "Today",
    play: "Play",
    pause: "Pause",
    track: "Nagi's Long Vacation · Main Theme",
    description: "PASCALS · Looping background music",
    blocked: "Autoplay was blocked; tap the page or press play to begin",
    volume: "Volume",
    unsupported: "The track could not be loaded. Please try again later",
  },
  ja: {
    calendar: "カレンダー",
    music: "音楽",
    close: "閉じる",
    previousMonth: "前の月",
    nextMonth: "次の月",
    today: "今日",
    play: "再生",
    pause: "一時停止",
    track: "凪のお暇 · メインテーマ",
    description: "PASCALS · ループ再生中のBGM",
    blocked: "自動再生がブロックされました。画面をタップするか再生を押してください",
    volume: "音量",
    unsupported: "音楽を読み込めませんでした。しばらくしてからお試しください",
  },
};

type DockPanel = "calendar" | "music" | null;

type CalendarCell = {
  date: Date;
  inCurrentMonth: boolean;
};

export function AmbientDock({ locale }: { locale: Locale }) {
  const copy = dockCopy[locale];
  const [openPanel, setOpenPanel] = useState<DockPanel>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState<Date | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(34);
  const [audioUnsupported, setAudioUnsupported] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const manuallyPausedRef = useRef(false);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);
  const musicButtonRef = useRef<HTMLButtonElement>(null);

  const closePanel = () => {
    const trigger = openPanel === "calendar" ? calendarButtonRef : musicButtonRef;
    setOpenPanel(null);
    window.requestAnimationFrame(() => trigger.current?.focus());
  };

  useEffect(() => {
    const updateCurrentDate = () => {
      const current = new Date();
      setNow(current);
      setViewMonth((existing) => existing ?? new Date(current.getFullYear(), current.getMonth(), 1));
    };

    const initialTimer = window.setTimeout(updateCurrentDate, 0);
    const clockTimer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(clockTimer);
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openPanel) {
        const trigger = openPanel === "calendar" ? calendarButtonRef : musicButtonRef;
        setOpenPanel(null);
        window.requestAnimationFrame(() => trigger.current?.focus());
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [openPanel]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.34;
    let cancelled = false;

    const detachUnlockListeners = () => {
      document.removeEventListener("pointerdown", unlockPlayback, true);
      document.removeEventListener("keydown", unlockPlayback, true);
    };

    const attemptPlayback = () => {
      if (cancelled || manuallyPausedRef.current) return;

      try {
        void Promise.resolve(audio.play())
          .then(() => {
            if (cancelled) return;
            setAutoplayBlocked(false);
            detachUnlockListeners();
          })
          .catch(() => {
            if (!cancelled) setAutoplayBlocked(true);
          });
      } catch {
        if (!cancelled) setAutoplayBlocked(true);
      }
    };

    function unlockPlayback(event: Event) {
      if (event.target instanceof Element && event.target.closest("[data-music-play]")) return;
      attemptPlayback();
    }

    document.addEventListener("pointerdown", unlockPlayback, true);
    document.addEventListener("keydown", unlockPlayback, true);
    attemptPlayback();

    return () => {
      cancelled = true;
      detachUnlockListeners();
      audio.pause();
    };
  }, []);

  const calendarCells = useMemo<CalendarCell[]>(() => {
    if (!viewMonth) return [];
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(year, month, index - firstDay + 1);
      return { date, inCurrentMonth: date.getMonth() === month };
    });
  }, [viewMonth]);

  const monthLabel = viewMonth
    ? new Intl.DateTimeFormat(localeTags[locale], { year: "numeric", month: "long" }).format(viewMonth)
    : "";

  const calendarDateFormatter = useMemo(
    () => new Intl.DateTimeFormat(localeTags[locale], { year: "numeric", month: "long", day: "numeric" }),
    [locale],
  );

  const fullDateLabel = now
    ? new Intl.DateTimeFormat(localeTags[locale], {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(now)
    : copy.calendar;

  const isToday = (date: Date) =>
    Boolean(
      now &&
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate(),
    );

  const changeMonth = (amount: number) => {
    setViewMonth((current) =>
      current ? new Date(current.getFullYear(), current.getMonth() + amount, 1) : current,
    );
  };

  const returnToToday = () => {
    const current = new Date();
    setNow(current);
    setViewMonth(new Date(current.getFullYear(), current.getMonth(), 1));
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      manuallyPausedRef.current = false;
      void audio.play()
        .then(() => setAutoplayBlocked(false))
        .catch(() => setAutoplayBlocked(true));
    } else {
      manuallyPausedRef.current = true;
      audio.pause();
    }
  };

  const updateVolume = (nextVolume: number) => {
    setVolume(nextVolume);
    if (audioRef.current) audioRef.current.volume = nextVolume / 100;
  };

  const togglePanel = (panel: Exclude<DockPanel, null>) => {
    setOpenPanel((current) => (current === panel ? null : panel));
  };

  return (
    <div className="utility-dock">
      <audio
        ref={audioRef}
        className="background-audio"
        src="/audio/nagi-no-oitoma-theme.m4a"
        autoPlay
        loop
        playsInline
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setAudioUnsupported(true);
          setIsPlaying(false);
        }}
      />
      <div className="utility-actions" aria-label={`${copy.calendar} · ${copy.music}`}>
        <button
          ref={calendarButtonRef}
          type="button"
          aria-label={copy.calendar}
          aria-expanded={openPanel === "calendar"}
          aria-controls={openPanel === "calendar" ? "calendar-popover" : undefined}
          onClick={() => togglePanel("calendar")}
        >
          <span className="calendar-icon" aria-hidden="true">{now?.getDate() ?? "日"}</span>
        </button>
        <button
          ref={musicButtonRef}
          type="button"
          aria-label={copy.music}
          aria-expanded={openPanel === "music"}
          aria-controls={openPanel === "music" ? "music-popover" : undefined}
          onClick={() => togglePanel("music")}
        >
          <span className={isPlaying ? "music-icon is-playing" : "music-icon"} aria-hidden="true">♫</span>
        </button>
      </div>

      {openPanel === "calendar" ? (
        <section className="utility-popover calendar-popover" id="calendar-popover" aria-label={copy.calendar}>
          <div className="utility-popover-header">
            <div>
              <span>{copy.calendar}</span>
              <strong>{fullDateLabel}</strong>
            </div>
            <button type="button" onClick={closePanel} aria-label={copy.close}>×</button>
          </div>
          <div className="calendar-month-nav">
            <button type="button" onClick={() => changeMonth(-1)} aria-label={copy.previousMonth}>←</button>
            <strong aria-live="polite">{monthLabel}</strong>
            <button type="button" onClick={() => changeMonth(1)} aria-label={copy.nextMonth}>→</button>
          </div>
          <div className="calendar-weekdays" aria-hidden="true">
            {weekDays[locale].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
          </div>
          <div className="calendar-grid">
            {calendarCells.map(({ date, inCurrentMonth }) => (
              <time
                key={date.toISOString()}
                dateTime={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`}
                className={inCurrentMonth ? undefined : "outside-month"}
                aria-current={isToday(date) ? "date" : undefined}
                aria-label={calendarDateFormatter.format(date)}
              >
                {date.getDate()}
              </time>
            ))}
          </div>
          <button className="calendar-today" type="button" onClick={returnToToday}>{copy.today}</button>
        </section>
      ) : null}

      {openPanel === "music" ? (
        <section className="utility-popover music-popover" id="music-popover" aria-label={copy.music}>
          <div className="utility-popover-header">
            <div>
              <span>{copy.music}</span>
              <strong>{copy.track}</strong>
            </div>
            <button type="button" onClick={closePanel} aria-label={copy.close}>×</button>
          </div>
          <div className={isPlaying ? "ambient-visualizer is-playing" : "ambient-visualizer"} aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
          </div>
          <p role="status" aria-live="polite">
            {audioUnsupported ? copy.unsupported : autoplayBlocked && !isPlaying ? copy.blocked : copy.description}
          </p>
          <div className="music-controls">
            <button
              className="music-play"
              data-music-play
              type="button"
              onClick={toggleAudio}
              disabled={audioUnsupported}
              aria-label={isPlaying ? copy.pause : copy.play}
            >
              <span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
              <span>{isPlaying ? copy.pause : copy.play}</span>
            </button>
            <label>
              <span>{copy.volume}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(event) => updateVolume(Number(event.target.value))}
              />
            </label>
          </div>
        </section>
      ) : null}

    </div>
  );
}
