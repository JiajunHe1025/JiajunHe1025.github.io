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
    track: "专注环境声",
    description: "网站内生成的轻柔氛围，不会自动播放",
    volume: "音量",
    unsupported: "当前浏览器不支持音频播放",
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
    track: "Focus ambience",
    description: "A gentle in-browser soundscape that never autoplays",
    volume: "Volume",
    unsupported: "Audio is not supported in this browser",
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
    track: "集中アンビエンス",
    description: "ブラウザ内で生成する穏やかな音。自動再生はしません",
    volume: "音量",
    unsupported: "このブラウザでは音声を再生できません",
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
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const audioNodesRef = useRef<AudioScheduledSourceNode[]>([]);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      audioNodesRef.current.forEach((node) => {
        try {
          node.stop();
        } catch {
          // The node may already be stopped by the browser.
        }
      });
      void audioContextRef.current?.close().catch(() => undefined);
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

  const ensureAmbientAudio = () => {
    if (audioContextRef.current && masterGainRef.current) {
      return { context: audioContextRef.current, master: masterGainRef.current };
    }

    if (typeof window.AudioContext === "undefined") {
      setAudioUnsupported(true);
      return null;
    }

    const context = new window.AudioContext();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    master.gain.value = 0.0001;
    filter.type = "lowpass";
    filter.frequency.value = 920;
    filter.Q.value = 0.7;
    filter.connect(master);
    master.connect(context.destination);

    const oscillators = [130.81, 196, 261.63].map((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 1 ? "triangle" : "sine";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index === 0 ? -5 : index === 2 ? 4 : 0;
      gain.gain.value = index === 1 ? 0.24 : 0.16;
      oscillator.connect(gain);
      gain.connect(filter);
      oscillator.start();
      return oscillator;
    });

    const lfo = context.createOscillator();
    const lfoDepth = context.createGain();
    lfo.frequency.value = 0.07;
    lfoDepth.gain.value = 110;
    lfo.connect(lfoDepth);
    lfoDepth.connect(filter.frequency);
    lfo.start();

    audioContextRef.current = context;
    masterGainRef.current = master;
    audioNodesRef.current = [...oscillators, lfo];
    return { context, master };
  };

  const playAmbientAudio = () => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    const audio = ensureAmbientAudio();
    if (!audio) return;

    void audio.context.resume().catch(() => {
      setAudioUnsupported(true);
      setIsPlaying(false);
    });
    const targetVolume = Math.max(0.0001, (volume / 100) * 0.075);
    audio.master.gain.cancelScheduledValues(audio.context.currentTime);
    audio.master.gain.setValueAtTime(Math.max(audio.master.gain.value, 0.0001), audio.context.currentTime);
    audio.master.gain.linearRampToValueAtTime(targetVolume, audio.context.currentTime + 1.1);
    setIsPlaying(true);
  };

  const pauseAmbientAudio = () => {
    const context = audioContextRef.current;
    const master = masterGainRef.current;
    if (!context || !master) return;

    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), context.currentTime);
    master.gain.linearRampToValueAtTime(0.0001, context.currentTime + 0.55);
    setIsPlaying(false);
    pauseTimerRef.current = setTimeout(() => void context.suspend().catch(() => undefined), 620);
  };

  const toggleAudio = () => {
    if (isPlaying) pauseAmbientAudio();
    else playAmbientAudio();
  };

  const updateVolume = (nextVolume: number) => {
    setVolume(nextVolume);
    const context = audioContextRef.current;
    const master = masterGainRef.current;
    if (!context || !master || !isPlaying) return;
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), context.currentTime);
    master.gain.setTargetAtTime(Math.max(0.0001, (nextVolume / 100) * 0.075), context.currentTime, 0.12);
  };

  const togglePanel = (panel: Exclude<DockPanel, null>) => {
    setOpenPanel((current) => (current === panel ? null : panel));
  };

  return (
    <div className="utility-dock">
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
          <p>{audioUnsupported ? copy.unsupported : copy.description}</p>
          <div className="music-controls">
            <button
              className="music-play"
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
