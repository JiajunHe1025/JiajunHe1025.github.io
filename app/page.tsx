"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AmbientDock } from "./AmbientDock";
import { content, localeLabels, type Locale } from "./content";
import { TravelMap } from "./TravelMap";
import { SceneHero } from "./SceneHero";
import { sceneThemes, isSceneTheme, type SceneTheme } from "./sceneThemes";
import { reports } from "./notes/reports";

const languages: Locale[] = ["zh", "en", "ja", "ko"];
const themes = [...sceneThemes, "classic", "night", "film", "glass", "pixel", "cartoon", "noritake", "neko", "shiba"] as const;
type Theme = (typeof themes)[number];

const themeNames: Record<Locale, Record<Theme, string>> = {
  zh: {
    garden: "声音研究花园",
    cloud: "云端语音小岛",
    courtyard: "微缩研究庭院",
    classic: "经典学术",
    night: "暗夜实验室",
    film: "胶片旅行",
    glass: "流体玻璃",
    pixel: "日系像素",
    cartoon: "缤纷卡通",
    noritake: "Noritake 线稿",
    neko: "日系猫咪",
    shiba: "日系柴犬",
  },
  en: {
    garden: "Sound Garden",
    cloud: "Cloud Islands",
    courtyard: "Research Courtyard",
    classic: "Academic",
    night: "Night Lab",
    film: "Film Journey",
    glass: "Liquid Glass",
    pixel: "Japanese Pixel",
    cartoon: "Playful Cartoon",
    noritake: "Noritake Line",
    neko: "Japanese Cat",
    shiba: "Japanese Shiba",
  },
  ja: {
    garden: "音声研究ガーデン",
    cloud: "雲の上の音声島",
    courtyard: "研究コートヤード",
    classic: "アカデミック",
    night: "ナイトラボ",
    film: "フィルム旅",
    glass: "リキッドグラス",
    pixel: "和風ピクセル",
    cartoon: "カラフル漫画",
    noritake: "Noritake 線画",
    neko: "和風ねこ",
    shiba: "和風柴犬",
  },
  ko: {
    garden: "소리 연구 정원",
    cloud: "구름 위 음성 섬",
    courtyard: "연구 안뜰",
    classic: "클래식 아카데믹",
    night: "나이트 랩",
    film: "필름 여행",
    glass: "리퀴드 글래스",
    pixel: "일본풍 픽셀",
    cartoon: "컬러풀 카툰",
    noritake: "Noritake 라인 드로잉",
    neko: "일본풍 고양이",
    shiba: "일본풍 시바견",
  },
};

const themeLabels: Record<Locale, string> = {
  zh: "切换网站主题",
  en: "Switch website theme",
  ja: "サイトテーマを切り替える",
  ko: "웹사이트 테마 전환",
};

const notesShortcutLabels: Record<Locale, string> = {
  zh: "技术笔记",
  en: "Notes",
  ja: "技術ノート",
  ko: "기술 노트",
};

const publicationControls: Record<Locale, {
  search: string; placeholder: string; year: string; allYears: string;
  clear: string; empty: string; results: (shown: number, total: number) => string;
}> = {
  zh: { search: "搜索论文", placeholder: "标题、作者、会议或关键词", year: "发表年份", allYears: "全部年份", clear: "清空筛选", empty: "没有匹配的记录。试试其他关键词或年份。", results: (shown, total) => `显示 ${shown} / ${total} 条发表记录` },
  en: { search: "Search publications", placeholder: "Title, author, venue, or keyword", year: "Publication year", allYears: "All years", clear: "Clear filters", empty: "No matching records. Try another keyword or year.", results: (shown, total) => `Showing ${shown} of ${total} publication records` },
  ja: { search: "論文を検索", placeholder: "タイトル・著者・会議・キーワード", year: "発表年", allYears: "すべての年", clear: "絞り込みを解除", empty: "一致する記録はありません。別のキーワードや年をお試しください。", results: (shown, total) => `${total} 件の発表記録のうち ${shown} 件を表示` },
  ko: { search: "논문 검색", placeholder: "제목, 저자, 학회 또는 키워드", year: "발표 연도", allYears: "모든 연도", clear: "필터 초기화", empty: "일치하는 기록이 없습니다. 다른 키워드나 연도를 입력해 보세요.", results: (shown, total) => `전체 발표 기록 ${total}개 중 ${shown}개 표시` },
};

const homeNotesLabels: Record<Locale, { title: string; introduction: string; all: string; method: string }> = {
  zh: { title: "把研究中的问题，继续写下去。", introduction: "技术报告、方法拆解与实验观察。三篇现有笔记，记录对语音与音频模型的思考。", all: "浏览全部技术笔记", method: "查看原始研究方法图" },
  en: { title: "Keep the research conversation going.", introduction: "Technical reports, method breakdowns, and experimental observations. Three existing notes on speech and audio models.", all: "Browse all technical notes", method: "View the original method diagram" },
  ja: { title: "研究の問いを、書き続ける。", introduction: "技術レポート、手法の解説、実験の観察。音声・オーディオモデルを考える三つの既存ノート。", all: "すべての技術ノートを見る", method: "元の研究手法図を見る" },
  ko: { title: "연구의 질문을 계속 기록합니다.", introduction: "기술 보고서, 방법 분석, 실험 관찰. 음성·오디오 모델을 살펴보는 세 편의 기존 노트입니다.", all: "모든 기술 노트 보기", method: "원본 연구 방법 도식 보기" },
};

const homeReportNames: Record<string, string> = {
  "moss-transcribe-diarize-0-9b-sats": "MOSS-Transcribe-Diarize",
  "dllm-asr-prior-guided-adaptive-denoising": "dLLM-ASR",
  "nemotron-labs-audex-unified-audio-llm": "AUDEX",
};

const accessibilityLabels: Record<Locale, { skip: string; home: string; navigation: string; metrics: string }> = {
  zh: { skip: "跳到主要内容", home: "主页", navigation: "主要导航", metrics: "研究数据" },
  en: { skip: "Skip to content", home: "Home", navigation: "Primary navigation", metrics: "Research metrics" },
  ja: { skip: "メインコンテンツへ移動", home: "ホーム", navigation: "メインナビゲーション", metrics: "研究指標" },
  ko: { skip: "주요 콘텐츠로 이동", home: "홈", navigation: "주요 탐색", metrics: "연구 지표" },
};

const isTheme = (value: string | undefined | null): value is Theme =>
  themes.includes(value as Theme);
const signalHeights = [18, 32, 48, 26, 64, 42, 78, 38, 58, 86, 54, 34, 72, 46, 92, 62, 40, 68, 30, 50, 24, 44, 20];

function SectionHeading({
  index,
  eyebrow,
  title,
  introduction,
}: {
  index: string;
  eyebrow: string;
  title: string;
  introduction?: string;
}) {
  return (
    <div className="section-heading">
      <div className="section-kicker">
        <span>{index}</span>
        <span>{eyebrow}</span>
      </div>
      <div className="section-heading-copy">
        <h2>{title}</h2>
        {introduction ? <p>{introduction}</p> : null}
      </div>
    </div>
  );
}

function ResearchFigure({ item }: { item: (typeof content)["zh"]["research"]["items"][number] }) {
  return (
    <figure className="research-figure">
      <Image
        className="research-figure-image"
        src={item.figure}
        alt={item.figureAlt}
        width={1600}
        height={960}
        sizes="(max-width: 820px) 90vw, 36vw"
        unoptimized
      />
      <figcaption>{item.paper}</figcaption>
    </figure>
  );
}

function SignalBars() {
  return (
    <div className="signal-bars" aria-hidden="true">
      {signalHeights.map((height, index) => (
        <span
          key={`${height}-${index}`}
          style={{
            height: `${height}%`,
            animationDelay: `${index * -0.37}s`,
          }}
        />
      ))}
    </div>
  );
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [theme, setTheme] = useState<Theme>("garden");
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [publicationQuery, setPublicationQuery] = useState("");
  const [publicationYear, setPublicationYear] = useState("all");
  const themeMenuRef = useRef<HTMLDetailsElement>(null);
  const current = content[locale];
  const labels = accessibilityLabels[locale];
  const publicationLabels = publicationControls[locale];
  const notesLabels = homeNotesLabels[locale];
  const scene: SceneTheme | null = isSceneTheme(theme) ? theme : null;
  const publicationYears = [...new Set(current.publications.items.map((item) => item.year))]
    .sort((a, b) => Number(b) - Number(a));
  const normalizedQuery = publicationQuery.trim().normalize("NFKC").toLocaleLowerCase();
  const visiblePublications = current.publications.items.filter((publication) => {
    const searchableText = [publication.code, publication.title, publication.authors, publication.venue, publication.note, publication.year]
      .filter(Boolean).join(" ").normalize("NFKC").toLocaleLowerCase();
    return (publicationYear === "all" || publication.year === publicationYear)
      && searchableText.includes(normalizedQuery);
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      let saved: string | null = null;
      try {
        saved = window.localStorage.getItem("jiajun-site-language");
      } catch {
        // Browser language remains available when storage is restricted.
      }
      if (saved && languages.includes(saved as Locale)) {
        setLocale(saved as Locale);
      } else {
        const browserLanguage = window.navigator.language.toLowerCase();
        if (browserLanguage.startsWith("ja")) setLocale("ja");
        else if (browserLanguage.startsWith("ko")) setLocale("ko");
        else if (!browserLanguage.startsWith("zh")) setLocale("en");
      }
      setPreferencesReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const initialTheme = document.documentElement.dataset.theme;
      if (isTheme(initialTheme)) setTheme(initialTheme);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const closeThemeMenu = (event: PointerEvent) => {
      const menu = themeMenuRef.current;
      if (menu?.open && !menu.contains(event.target as Node)) menu.removeAttribute("open");
    };
    const closeThemeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") themeMenuRef.current?.removeAttribute("open");
    };

    document.addEventListener("pointerdown", closeThemeMenu);
    document.addEventListener("keydown", closeThemeMenuOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeThemeMenu);
      document.removeEventListener("keydown", closeThemeMenuOnEscape);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = current.htmlLang;
    document.title = current.pageTitle;
    if (preferencesReady) {
      try {
        window.localStorage.setItem("jiajun-site-language", locale);
      } catch {
        // Locale switching remains functional when browser storage is unavailable.
      }
    }
  }, [current.htmlLang, current.pageTitle, locale, preferencesReady]);

  const selectTheme = (nextTheme: Theme) => {
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      window.localStorage.setItem("jiajun-site-theme", nextTheme);
    } catch {
      // Keep theme switching functional when browser storage is unavailable.
    }
    themeMenuRef.current?.removeAttribute("open");
  };

  return (
    <div className={scene ? "site-root scene-site" : "site-root"} id="top">
      <a className="skip-link" href="#main-content">
        {labels.skip}
      </a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={`${current.hero.name} — ${labels.home}`}>
          {scene ? (
            <Image className="scene-wordmark-portrait" src="/jiajun-he.jpg" alt={current.hero.portraitAlt} width={42} height={42} unoptimized />
          ) : <span className="wordmark-mark">HJ</span>}
          <span className="wordmark-name">
            {current.hero.name} / {current.hero.romanName}
          </span>
        </a>

        <nav className="desktop-nav" aria-label={labels.navigation}>
          {current.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-controls">
          <Link className="notes-shortcut" href="/notes/">
            <span>{notesShortcutLabels[locale]}</span>
            <span aria-hidden="true">↗</span>
          </Link>

          <details className="theme-menu" ref={themeMenuRef}>
            <summary aria-label={`${themeLabels[locale]}：${themeNames[locale][theme]}`}>
              <span className={`theme-swatch theme-swatch-${theme}`} aria-hidden="true" />
              <span className="theme-current">{themeNames[locale][theme]}</span>
              <span className="theme-chevron" aria-hidden="true">⌄</span>
            </summary>
            <div className="theme-options" role="group" aria-label={themeLabels[locale]}>
              {themes.map((themeOption) => (
                <button
                  key={themeOption}
                  type="button"
                  aria-pressed={theme === themeOption}
                  onClick={() => selectTheme(themeOption)}
                >
                  <span className={`theme-swatch theme-swatch-${themeOption}`} aria-hidden="true" />
                  <span>{themeNames[locale][themeOption]}</span>
                  <span className="theme-check" aria-hidden="true">✓</span>
                </button>
              ))}
            </div>
          </details>

          <div className="language-switch" role="group" aria-label={current.languageLabel}>
            {languages.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => setLocale(language)}
                aria-pressed={locale === language}
              >
                {localeLabels[language]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main id="main-content">
        {scene ? <SceneHero locale={locale} scene={scene} onSceneChange={selectTheme} entranceReady={preferencesReady} /> : (
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{current.hero.eyebrow}</p>
            <div className="current-chip">
              <span className="pulse-dot" aria-hidden="true" />
              <span>{current.hero.current}</span>
            </div>
            <h1 id="hero-title">
              <span>{current.hero.name}</span>
              <small>{current.hero.romanName}</small>
            </h1>
            <p className="hero-headline">{current.hero.headline}</p>
            <p className="hero-introduction">{current.hero.introduction}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#research">
                {current.hero.primaryCta}
                <span aria-hidden="true">↓</span>
              </a>
              <a className="button button-ghost" href="#publications">
                {current.hero.secondaryCta}
                <Arrow />
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-label={current.hero.portraitAlt}>
            <span
              className="theme-sticker theme-sticker-hero theme-sticker-sprite-1"
              aria-hidden="true"
            />
            <div className="portrait-grid" aria-hidden="true" />
            <div className="portrait-frame">
              <Image
                className="portrait-image"
                src="/jiajun-he.jpg"
                alt={current.hero.portraitAlt}
                width={895}
                height={1280}
                sizes="(max-width: 720px) 82vw, (max-width: 1100px) 38vw, 390px"
                priority
                unoptimized
              />
              <div className="portrait-caption">
                <span>ALIBABA · TONGYI LAB</span>
                <span>{current.hero.availability}</span>
              </div>
            </div>
            <div className="signal-panel">
              <SignalBars />
              <div className="signal-labels" aria-hidden="true">
                <span>ASR</span>
                <span>MER</span>
                <span>LLM</span>
                <span>MULTIMODAL</span>
              </div>
            </div>
          </div>
        </section>

        )}

        <div className="noritake-vignettes" aria-hidden="true">
          <span className="noritake-vignette noritake-vignette-left" />
          <span className="noritake-vignette noritake-vignette-center" />
          <span className="noritake-vignette noritake-vignette-right" />
        </div>

        <section className="metrics section-shell" aria-label={labels.metrics}>
          {current.metrics.map((metric) => (
            <article className="metric" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
              <small>{metric.detail}</small>
            </article>
          ))}
        </section>

        <section className="now-section" aria-labelledby="now-title">
          <div className="section-shell now-grid">
            <div className="now-index">
              <span>{current.now.index}</span>
              <span>{current.now.eyebrow}</span>
            </div>
            <div className="now-copy">
              <h2 id="now-title">{current.now.title}</h2>
              <p>{current.now.description}</p>
            </div>
            <div className="now-organization">
              <span className="pulse-dot pulse-dot-light" aria-hidden="true" />
              <strong>{current.now.organization}</strong>
              <small>{current.now.period}</small>
            </div>
          </div>
        </section>

        <section className="content-section section-shell" id="research">
          <SectionHeading
            index={current.research.index}
            eyebrow={current.research.eyebrow}
            title={current.research.title}
            introduction={current.research.introduction}
          />
          <div className="research-grid">
            {current.research.items.map((item, index) => (
              <article className="research-card" id={`research-${index}`} key={item.number} tabIndex={-1}>
                <span
                  className={`theme-sticker theme-sticker-research theme-sticker-sprite-${index + 2}`}
                  aria-hidden="true"
                />
                <div className="research-card-top">
                  <span>{item.number}</span>
                  <div className="mini-signal" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                {!scene ? (
                  <ResearchFigure item={item} />
                ) : null}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="research-metric">
                  <strong>{item.metric}</strong>
                  <span>{item.metricLabel}</span>
                </div>
                <div className="tag-list">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                {scene ? (
                  <details className="scene-research-method">
                    <summary>{notesLabels.method}</summary>
                  <ResearchFigure item={item} />
                  </details>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="content-section publications-section" id="publications">
          <div className="section-shell">
            <span
              className="theme-sticker theme-sticker-publications theme-sticker-sprite-5"
              aria-hidden="true"
            />
            <SectionHeading
              index={current.publications.index}
              eyebrow={current.publications.eyebrow}
              title={current.publications.title}
              introduction={current.publications.introduction}
            />
            <div className="publication-controls">
              <label className="publication-search" htmlFor="publication-search">
                <span>{publicationLabels.search}</span>
                <input id="publication-search" type="search" value={publicationQuery}
                  placeholder={publicationLabels.placeholder}
                  onChange={(event) => setPublicationQuery(event.target.value)} />
              </label>
              <label className="publication-year-filter" htmlFor="publication-year">
                <span>{publicationLabels.year}</span>
                <select id="publication-year" value={publicationYear}
                  onChange={(event) => setPublicationYear(event.target.value)}>
                  <option value="all">{publicationLabels.allYears}</option>
                  {publicationYears.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </label>
              {normalizedQuery || publicationYear !== "all" ? (
                <button className="publication-clear" type="button" onClick={() => { setPublicationQuery(""); setPublicationYear("all"); }}>
                  {publicationLabels.clear}
                </button>
              ) : null}
            </div>
            <p className="publication-results" role="status">
              {publicationLabels.results(visiblePublications.length, current.publications.items.length)}
            </p>
            <div className="publication-list">
              {visiblePublications.map((publication) => (
                <a
                  className="publication-row"
                  key={`${publication.year}-${publication.title}`}
                  href={publication.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${publication.code}: ${publication.title}`}
                >
                  <span className="publication-year">{publication.year}</span>
                  <span className="publication-venue">{publication.venue}</span>
                  <span className="publication-title">
                    <strong>{publication.code}</strong>
                    <span>{publication.title}</span>
                    {publication.authors ? (
                      <small className="publication-authors">{publication.authors}</small>
                    ) : null}
                    <small>{publication.note}</small>
                  </span>
                  <span className="publication-link">
                    {current.publications.linkLabel} <Arrow />
                  </span>
                </a>
              ))}
            </div>
            {visiblePublications.length === 0 ? <p className="publication-empty">{publicationLabels.empty}</p> : null}
            <a
              className="scholar-profile-link"
              href={current.publications.scholarUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>{current.publications.scholarLabel}</span>
              <Arrow />
            </a>
          </div>
        </section>

        <section className="content-section home-notes-section section-shell" id="notes" aria-labelledby="home-notes-title">
          <div className="home-notes-heading">
            <span className="home-notes-eyebrow">FIELD NOTES / {notesShortcutLabels[locale]}</span>
            <h2 id="home-notes-title">{notesLabels.title}</h2>
            <p>{notesLabels.introduction}</p>
            <Link className="home-notes-all" href="/notes/">{notesLabels.all} <Arrow /></Link>
          </div>
          <div className="home-notes-list">
            {reports.filter((report) => homeReportNames[report.slug]).map((report) => (
              <Link className="home-note-row" key={report.slug} href={`/notes/${report.slug}/`}>
                <span className="home-note-meta"><span>{homeReportNames[report.slug]}</span><time dateTime={report.published}>{report.published}</time></span>
                <h3>{report.title[locale]}</h3>
                <p>{report.summary[locale]}</p>
                <span className="home-note-reading">{report.readingTime[locale]} <Arrow /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="content-section section-shell" id="journey">
          <SectionHeading
            index={current.journey.index}
            eyebrow={current.journey.eyebrow}
            title={current.journey.title}
          />
          <div className="journey-grid">
            <span
              className="theme-sticker theme-sticker-journey theme-sticker-sprite-4"
              aria-hidden="true"
            />
            <div className="journey-column">
              <h3>{current.journey.experienceTitle}</h3>
              <div className="timeline">
                {current.journey.experience.map((item) => (
                  <article className="timeline-item" key={`${item.period}-${item.organization}`}>
                    <span className={item.current ? "timeline-dot current" : "timeline-dot"} aria-hidden="true" />
                    <time>{item.period}</time>
                    <h4>{item.organization}</h4>
                    <p>{item.role}</p>
                    {item.note ? <small>{item.note}</small> : null}
                  </article>
                ))}
              </div>
            </div>
            <div className="journey-column">
              <h3>{current.journey.educationTitle}</h3>
              <div className="timeline">
                {current.journey.education.map((item) => (
                  <article className="timeline-item" key={`${item.period}-${item.organization}`}>
                    <span className="timeline-dot" aria-hidden="true" />
                    <time>{item.period}</time>
                    <h4>{item.organization}</h4>
                    <p>{item.role}</p>
                    {item.note ? <small>{item.note}</small> : null}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="content-section recognition-section" id="recognition">
          <div className="section-shell">
            <SectionHeading
              index={current.recognition.index}
              eyebrow={current.recognition.eyebrow}
              title={current.recognition.title}
            />
            <div className="recognition-grid">
              <div className="award-list">
                {current.recognition.awards.map((award) => (
                  <article className="award-item" key={`${award.year}-${award.title}`}>
                    <time>{award.year}</time>
                    <div>
                      <h3>{award.title}</h3>
                      <p>{award.note}</p>
                    </div>
                  </article>
                ))}
              </div>
              <aside className="skills-panel">
                <span
                  className="theme-sticker theme-sticker-skills theme-sticker-sprite-6"
                  aria-hidden="true"
                />
                <div className="skills-panel-header">
                  <span>TOOLKIT / 2026</span>
                  <h3>{current.recognition.skillsTitle}</h3>
                </div>
                {current.recognition.skillGroups.map((group) => (
                  <div className="skill-group" key={group.label}>
                    <h4>{group.label}</h4>
                    <div className="skill-list">
                      {group.items.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </aside>
            </div>
          </div>
        </section>

        <section className="content-section hobbies-section" id="hobbies">
          <div className="section-shell">
            <span
              className="theme-sticker theme-sticker-travel theme-sticker-sprite-3"
              aria-hidden="true"
            />
            <SectionHeading
              index={current.hobbies.index}
              eyebrow={current.hobbies.eyebrow}
              title={current.hobbies.title}
              introduction={current.hobbies.introduction}
            />
            <TravelMap
              locale={locale}
              mapLabel={current.hobbies.mapLabel}
              visitedLabel={current.hobbies.visitedLabel}
              placeholderTitle={current.hobbies.placeholderTitle}
              placeholderBody={current.hobbies.placeholderBody}
            />
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="section-shell contact-grid">
            <span
              className="theme-sticker theme-sticker-contact theme-sticker-sprite-2"
              aria-hidden="true"
            />
            <div className="contact-kicker">
              <span>{current.contact.index}</span>
              <span>{current.contact.eyebrow}</span>
            </div>
            <div className="contact-copy">
              <h2 id="contact-title">{current.contact.title}</h2>
              <p>{current.contact.description}</p>
            </div>
            <div className="contact-links">
              {current.contact.links.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <span>{index === 0 ? current.contact.emailLabel : link.label}</span>
                  <Arrow />
                  {index === 0 ? <small>{link.label}</small> : null}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <span>{current.footer}</span>
        <a href="#top">TOP ↑</a>
      </footer>

      <AmbientDock locale={locale} />
    </div>
  );
}
