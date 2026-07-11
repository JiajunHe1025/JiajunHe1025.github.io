"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AmbientDock } from "./AmbientDock";
import { content, localeLabels, type Locale } from "./content";
import { TravelMap } from "./TravelMap";

const languages: Locale[] = ["zh", "en", "ja", "ko"];
const themes = ["classic", "night", "film", "glass", "pixel", "cartoon", "noritake", "neko", "shiba"] as const;
type Theme = (typeof themes)[number];

const themeNames: Record<Locale, Record<Theme, string>> = {
  zh: {
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
  const [theme, setTheme] = useState<Theme>("glass");
  const themeMenuRef = useRef<HTMLDetailsElement>(null);
  const current = content[locale];
  const labels = accessibilityLabels[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("jiajun-site-language") as Locale | null;
      if (saved && languages.includes(saved)) {
        setLocale(saved);
        return;
      }

      const browserLanguage = window.navigator.language.toLowerCase();
      if (browserLanguage.startsWith("ja")) setLocale("ja");
      else if (browserLanguage.startsWith("ko")) setLocale("ko");
      else if (!browserLanguage.startsWith("zh")) setLocale("en");
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
    window.localStorage.setItem("jiajun-site-language", locale);
  }, [current.htmlLang, current.pageTitle, locale]);

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
    <div className="site-root" id="top">
      <a className="skip-link" href="#main-content">
        {labels.skip}
      </a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={`${current.hero.name} — ${labels.home}`}>
          <span className="wordmark-mark">HJ</span>
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
            {current.research.items.map((item) => (
              <article className="research-card" key={item.number}>
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
              </article>
            ))}
          </div>
        </section>

        <section className="content-section publications-section" id="publications">
          <div className="section-shell">
            <SectionHeading
              index={current.publications.index}
              eyebrow={current.publications.eyebrow}
              title={current.publications.title}
              introduction={current.publications.introduction}
            />
            <div className="publication-list">
              {current.publications.items.map((publication) => (
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

        <section className="content-section section-shell" id="journey">
          <SectionHeading
            index={current.journey.index}
            eyebrow={current.journey.eyebrow}
            title={current.journey.title}
          />
          <div className="journey-grid">
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
