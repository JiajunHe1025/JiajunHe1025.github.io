"use client";

/* eslint-disable @next/next/no-img-element -- The approved scene art is a static full-width WebP; method diagrams retain their original source URLs. */

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { content, type Locale } from "./content";
import { sceneThemes, type SceneTheme } from "./sceneThemes";
import { SceneEntrance } from "./SceneEntrance";
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
      garden: "阳光下的微缩声音研究花园，有耳机拱门、录音室、声音亭与阅读亭",
      cloud: "蓝天白云中的微缩语音研究小岛，有声音、语言与情感研究装置",
      courtyard: "温暖奶油色的微缩研究庭院，有书本、录音装置与情感研究亭",
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
      garden: "A sunny miniature speech research garden with a headphone arch, recording studio, sound pavilion, and reading nook",
      cloud: "Miniature speech research islands among soft clouds, with sound, language, and emotion research objects",
      courtyard: "A warm miniature research courtyard with books, recording equipment, and an emotion pavilion",
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
      garden: "ヘッドホンのアーチ、録音室、音の東屋、読書スペースがある小さな研究の庭",
      cloud: "柔らかな雲に浮かぶ音声研究の島と、音・言語・感情の研究装置",
      courtyard: "本や録音装置、感情理解の東屋が並ぶ、温かな小さな研究の中庭",
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
      garden: "헤드폰 아치, 녹음실, 소리 정자와 독서 공간이 있는 햇살 가득한 작은 연구 정원",
      cloud: "부드러운 구름에 떠 있는 작은 음성 연구 섬과 소리·언어·감정 연구 장치",
      courtyard: "책, 녹음 장치와 감정 연구 정자가 있는 따뜻한 작은 연구 안뜰",
    },
  },
};

// Percentages are measured on the artwork itself, so hotspots move with it.
const hotspotPositions: Record<SceneTheme, readonly (readonly [number, number])[]> = {
  garden: [[89, 45], [67, 60], [49, 31]],
  cloud: [[89, 42], [68.5, 27.7], [48, 42.5]],
  courtyard: [[51, 49], [73, 22], [77, 72]],
};

export function SceneHero({ locale, scene, onSceneChange, entranceReady }: SceneHeroProps) {
  const current = content[locale];
  const ui = labels[locale];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const selectedItem = selectedIndex === null ? null : current.research.items[selectedIndex];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotionRef.current = preference.matches;
      if (preference.matches) {
        planeRef.current?.style.setProperty("--scene-x", "0px");
        planeRef.current?.style.setProperty("--scene-y", "0px");
      }
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

  function moveArtwork(event: PointerEvent<HTMLElement>) {
    if (reducedMotionRef.current || event.pointerType !== "mouse" || window.innerWidth <= 760) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    planeRef.current?.style.setProperty("--scene-x", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 10}px`);
    planeRef.current?.style.setProperty("--scene-y", `${((event.clientY - bounds.top) / bounds.height - 0.5) * 7}px`);
  }

  function resetArtwork() {
    planeRef.current?.style.setProperty("--scene-x", "0px");
    planeRef.current?.style.setProperty("--scene-y", "0px");
  }

  return (
    <section
      id="scene-hero"
      className={styles.sceneHero}
      data-scene={scene}
      data-locale={locale}
      aria-labelledby="hero-title"
      onPointerMove={moveArtwork}
      onPointerLeave={resetArtwork}
    >
      <div className={styles.art}>
        <div className={styles.artPlane} ref={planeRef}>
          <SceneEntrance key={scene} ready={entranceReady}>
          <img key={scene} className={styles.artImage} src={`/scenes/${scene}.webp`} alt={ui.artAlt[scene]} fetchPriority="high" decoding="async" />
          {current.research.items.map((item, index) => (
            <button
              key={index}
              type="button"
              className={styles.hotspot}
              style={{ left: `${hotspotPositions[scene][index][0]}%`, top: `${hotspotPositions[scene][index][1]}%` }}
              data-research-index={index}
              aria-label={`${ui.explore}: ${item.title}`}
              aria-haspopup="dialog"
              aria-controls="scene-research-dialog"
              onClick={(event) => openResearch(index, event)}
            >
              <span aria-hidden="true">＋</span><span className={styles.hotspotLabel}>{item.title}</span>
            </button>
          ))}
          </SceneEntrance>
        </div>
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.copyShell}>
        <div className={styles.themeSwitcher} role="group" aria-label={ui.sceneLabel}>
          {sceneThemes.map((theme) => (
            <button key={theme} type="button" data-scene-target={theme} aria-pressed={scene === theme} onClick={() => { resetArtwork(); onSceneChange(theme); }}>
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
      <div className={styles.mobileTopics} role="group" aria-label={ui.topicsLabel}>
        {ui.shortTopics.map((title, index) => (
          <button key={index} type="button" data-mobile-research-index={index} aria-label={`${ui.explore}: ${current.research.items[index].title}`} aria-haspopup="dialog" aria-controls="scene-research-dialog" onClick={(event) => openResearch(index, event)}>{title}<span aria-hidden="true">＋</span></button>
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
