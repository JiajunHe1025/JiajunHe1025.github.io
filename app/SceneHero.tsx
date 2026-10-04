"use client";

/* eslint-disable @next/next/no-img-element -- Method diagrams retain their original source URLs. */

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { content, type Locale } from "./content";
import { sceneThemes, type SceneTheme } from "./sceneThemes";
import { SceneVideo } from "./SceneVideo";
import styles from "./SceneHero.module.css";

type SceneHeroProps = {
  locale: Locale;
  scene: SceneTheme;
  onSceneChange: (scene: SceneTheme) => void;
  entranceReady: boolean;
};

type HeroLabels = {
  themes: Record<SceneTheme, string>;
  headlines: Record<SceneTheme, readonly [string, string]>;
  greeting: (name: string) => string;
  sceneLabel: string;
  topicsLabel: string;
  explore: string;
  close: string;
  read: string;
  method: string;
  benchmark: string;
  stroll: string;
  shortTopics: readonly [string, string, string];
  artAlt: Record<SceneTheme, string>;
};

const labels: Record<Locale, HeroLabels> = {
  zh: {
    themes: { garden: "声音花园", cloud: "云端小岛", courtyard: "微缩庭院" },
    headlines: {
      garden: ["让机器，", "听懂更多。"],
      cloud: ["听见语言，", "也听见人。"],
      courtyard: ["听见语言，", "也听见你。"],
    },
    greeting: (name) => `你好，我是${name}。`,
    sceneLabel: "选择场景", topicsLabel: "探索研究方向", explore: "探索",
    close: "关闭研究说明", read: "阅读这项研究", method: "原论文方法图",
    benchmark: "该指标对应特定基准实验。", stroll: "沿着好奇心，继续走走",
    shortTopics: ["上下文识别", "多人对话", "情感理解"],
    artAlt: {
      garden: "绿色微缩舞台上，小G胖转身挥手，音响波形和植物轻轻摆动",
      cloud: "浅蓝色微缩舞台上，小G胖转身挥手，周围有耳机、书本和声音波形",
      courtyard: "暖色微缩舞台上，小G胖转身挥手，周围有书本、耳机和盆栽",
    },
  },
  en: {
    themes: { garden: "Garden", cloud: "Cloud", courtyard: "Courtyard" },
    headlines: {
      garden: ["Helping AI", "listen better."],
      cloud: ["Hear language.", "Hear people."],
      courtyard: ["Hear the words.", "Hear the person."],
    },
    greeting: (name) => `Hi, I'm ${name}.`,
    sceneLabel: "Choose a scene", topicsLabel: "Explore research", explore: "Explore",
    close: "Close research details", read: "Read about this research", method: "Original method figure",
    benchmark: "This result refers to a specific benchmark experiment.", stroll: "Follow a little curiosity",
    shortTopics: ["Context ASR", "Multi-talker", "Emotion"],
    artAlt: {
      garden: "Little G turns and waves on a green miniature stage with moving audio bars and leaves",
      cloud: "Little G turns and waves on a pale blue miniature stage with headphones, books, and audio bars",
      courtyard: "Little G turns and waves on a warm miniature stage with books, headphones, and plants",
    },
  },
  ja: {
    themes: { garden: "音の庭", cloud: "雲の島", courtyard: "小さな中庭" },
    headlines: {
      garden: ["もっと聴き、", "もっと理解する。"],
      cloud: ["言葉を聴き、", "人を理解する。"],
      courtyard: ["言葉を聴き、", "人に寄り添う。"],
    },
    greeting: (name) => `こんにちは、${name}です。`,
    sceneLabel: "風景を選ぶ", topicsLabel: "研究テーマを見る", explore: "詳しく見る",
    close: "研究の説明を閉じる", read: "この研究を読む", method: "原論文の手法図",
    benchmark: "この指標は特定のベンチマーク実験の結果です。", stroll: "好奇心のまま、もう少し先へ",
    shortTopics: ["文脈音声認識", "複数話者", "感情理解"],
    artAlt: {
      garden: "緑の小さな舞台で、小G胖が手を振り、音のバーと葉が揺れる動画",
      cloud: "淡い青の小さな舞台で、小G胖が手を振る動画。周りにはヘッドホン、本、音のバー",
      courtyard: "暖かな色の小さな舞台で、小G胖が手を振る動画。周りには本、ヘッドホン、鉢植え",
    },
  },
  ko: {
    themes: { garden: "소리 정원", cloud: "구름 섬", courtyard: "작은 안뜰" },
    headlines: {
      garden: ["더 잘 듣는", "언어 인공지능."],
      cloud: ["언어를 듣고,", "사람을 이해하다."],
      courtyard: ["말을 듣고,", "마음을 이해하다."],
    },
    greeting: (name) => `안녕하세요, ${name}입니다.`,
    sceneLabel: "장면 선택", topicsLabel: "연구 주제 살펴보기", explore: "살펴보기",
    close: "연구 설명 닫기", read: "이 연구 읽기", method: "원 논문의 방법 도표",
    benchmark: "이 지표는 특정 벤치마크 실험의 결과입니다.", stroll: "호기심을 따라 조금 더 멀리",
    shortTopics: ["문맥 인식", "다중 화자", "감정 이해"],
    artAlt: {
      garden: "초록빛 작은 무대에서 小G胖이 손을 흔들고 소리 막대와 잎이 움직이는 무음 영상",
      cloud: "옅은 파란색 무대에서 小G胖이 손을 흔드는 영상. 주변에는 헤드폰과 책, 소리 막대",
      courtyard: "따뜻한 색의 무대에서 小G胖이 손을 흔드는 영상. 주변에는 책과 헤드폰, 화분",
    },
  },
};

export function SceneHero({ locale, scene, onSceneChange, entranceReady }: SceneHeroProps) {
  const current = content[locale];
  const ui = labels[locale];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const selectedItem = selectedIndex === null ? null : current.research.items[selectedIndex];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotionRef.current = preference.matches;
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || selectedIndex === null) return;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [selectedIndex]);

  function openResearch(index: number, event: MouseEvent<HTMLButtonElement>) {
    triggerRef.current = event.currentTarget;
    restoreFocusRef.current = true;
    setSelectedIndex(index);
  }

  function handleDialogClose() {
    setSelectedIndex(null);
    if (restoreFocusRef.current && triggerRef.current?.isConnected) {
      triggerRef.current.focus({ preventScroll: true });
    }
    restoreFocusRef.current = true;
  }

  function handleResearchLink(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(`research-${selectedIndex}`);
    if (target) restoreFocusRef.current = false;
    dialogRef.current?.close();
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotionRef.current ? "auto" : "smooth", block: "start" });
    // A temporary tabindex allows focus to follow the reading link without a new tab stop.
    const previousTabIndex = target.getAttribute("tabindex");
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (previousTabIndex === null) target.removeAttribute("tabindex");
    else target.setAttribute("tabindex", previousTabIndex);
    window.history.replaceState(null, "", `#research-${selectedIndex}`);
  }

  return (
    <section
      id="scene-hero"
      className={styles.sceneHero}
      data-scene={scene}
      data-locale={locale}
      aria-labelledby="hero-title"
    >
      <div className={styles.art}>
        <SceneVideo key={scene} scene={scene} locale={locale} ready={entranceReady} description={ui.artAlt[scene]} />
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.copyShell}>
        <div className={styles.themeSwitcher} role="group" aria-label={ui.sceneLabel}>
          {sceneThemes.map((theme) => (
            <button key={theme} type="button" data-scene-target={theme} aria-pressed={scene === theme} onClick={() => onSceneChange(theme)}>
              <span className={styles.themeDot} data-theme={theme} aria-hidden="true" />{ui.themes[theme]}
            </button>
          ))}
        </div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{current.hero.eyebrow}</p>
          <p className={styles.greeting}>{ui.greeting(current.hero.name)}</p>
          <h1 id="hero-title" className={styles.headline}>
            {ui.headlines[scene].map((line) => <span key={line}>{line}</span>)}
          </h1>
          <p className={styles.current}>{current.hero.current}</p>
          <p className={styles.description}>{current.hero.headline}</p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#research">{current.hero.primaryCta}<span aria-hidden="true">↘</span></a>
            <a className={styles.secondary} href="#publications">{current.hero.secondaryCta}<span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
      <a className={styles.stroll} href="#research">{ui.stroll}<span aria-hidden="true">↓</span></a>
      <div className={styles.researchTopics} role="group" aria-label={ui.topicsLabel}>
        {ui.shortTopics.map((title, index) => (
          <button key={index} type="button" data-research-index={index} aria-label={`${ui.explore}: ${current.research.items[index].title}`} aria-haspopup="dialog" aria-controls="scene-research-dialog" onClick={(event) => openResearch(index, event)}><span className={styles.topicNumber} aria-hidden="true">0{index + 1}</span>{title}<span className={styles.topicPlus} aria-hidden="true">＋</span></button>
        ))}
      </div>
      <span className={styles.srOnly} aria-live="polite">{ui.sceneLabel}: {ui.themes[scene]}</span>
      <dialog
        id="scene-research-dialog"
        className={styles.dialog}
        ref={dialogRef}
        aria-labelledby="scene-dialog-title"
        aria-describedby="scene-dialog-description"
        onClose={handleDialogClose}
        onClick={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.target === event.currentTarget && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) event.currentTarget.close();
        }}
      >
        <button type="button" className={styles.dialogClose} aria-label={ui.close} onClick={() => dialogRef.current?.close()}>×</button>
        {selectedItem && <>
          <p className={styles.dialogEyebrow}>{selectedItem.paper}</p>
          <h2 className={styles.dialogTitle} id="scene-dialog-title">{selectedItem.title}</h2>
          <p className={styles.dialogDescription} id="scene-dialog-description">{selectedItem.description}</p>
          <figure className={styles.methodFigure}><img src={selectedItem.figure} alt={selectedItem.figureAlt} /><figcaption>{ui.method}</figcaption></figure>
          <div className={styles.benchmark}><strong>{selectedItem.metric}</strong><span>{selectedItem.metricLabel}</span></div>
          <p className={styles.benchmarkNote}>{ui.benchmark}</p>
          <a className={styles.dialogLink} href={`#research-${selectedIndex}`} onClick={handleResearchLink}>{ui.read}<span aria-hidden="true">↗</span></a>
        </>}
      </dialog>
    </section>
  );
}
