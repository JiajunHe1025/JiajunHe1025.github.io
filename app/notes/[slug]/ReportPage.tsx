"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AmbientDock } from "../../AmbientDock";
import type { Locale, Report } from "../reports";
import styles from "./report.module.css";

const locales: Locale[] = ["zh", "en", "ja", "ko"];
const themes = ["garden", "cloud", "courtyard", "classic", "night", "film", "glass", "pixel", "cartoon", "noritake", "neko", "shiba"] as const;
type Theme = (typeof themes)[number];

const isLocale = (value: string | null): value is Locale =>
  value !== null && locales.includes(value as Locale);

const isTheme = (value: string | null): value is Theme =>
  value !== null && themes.includes(value as Theme);

const ui = {
  zh: {
    htmlLang: "zh-Hans",
    skip: "跳到报告正文",
    back: "返回技术笔记",
    home: "返回主页",
    theme: "切换主题",
    language: "切换语言",
    themes: { garden: "研究花园", cloud: "云端小岛", courtyard: "微缩庭院", classic: "经典", night: "暗夜", film: "胶片", glass: "流体玻璃", pixel: "日系像素", cartoon: "明亮卡通", noritake: "Noritake 线稿", neko: "日系猫咪", shiba: "日系柴犬" },
    published: "发布于",
    readingTime: "阅读时长",
    keyFacts: "关键数据",
    contents: "本文目录",
    overview: "核心概览",
    glossary: "术语表",
    sources: "资料来源",
    sourceKinds: { article: "原始报道", paper: "技术论文", repository: "代码仓库", model: "模型页面" },
    sourceNote: "链接在新标签页打开。实验数字请优先核对论文、模型卡或官方仓库的最新版本。",
    interpretation: "独立理解、非原文复刻",
    interpretationText: "本文基于公开技术报告、论文与项目资料重新组织问题、方法和证据，并加入作者自己的判断与使用建议。它不是逐段翻译，也不替代原作者的正式版本。",
    bodyLanguageNote: null,
    tableNote: "表格说明",
    footer: "以清晰、可核查的方式分享技术。",
  },
  en: {
    htmlLang: "en",
    skip: "Skip to the report",
    back: "Back to technical notes",
    home: "Back home",
    theme: "Switch theme",
    language: "Switch language",
    themes: { garden: "Research Garden", cloud: "Cloud Island", courtyard: "Research Courtyard", classic: "Classic", night: "Night", film: "Film", glass: "Fluid Glass", pixel: "Japanese Pixel", cartoon: "Bright Cartoon", noritake: "Noritake Line", neko: "Japanese Cat", shiba: "Japanese Shiba" },
    published: "Published",
    readingTime: "Reading time",
    keyFacts: "Key facts",
    contents: "Contents",
    overview: "Overview",
    glossary: "Glossary",
    sources: "Sources",
    sourceKinds: { article: "Original article", paper: "Technical paper", repository: "Repository", model: "Model page" },
    sourceNote: "Links open in a new tab. For experimental figures, prefer the latest paper, model card, or official repository.",
    interpretation: "Independent interpretation, not a reproduction",
    interpretationText: "This note reorganizes the problem, method, and evidence from public reports, papers, and project materials, adding the author's own assessment and practical guidance. It is not a line-by-line translation and does not replace the authors' official version.",
    bodyLanguageNote: null,
    tableNote: "Table note",
    footer: "Sharing technology clearly and verifiably.",
  },
  ja: {
    htmlLang: "ja",
    skip: "レポート本文へ移動",
    back: "技術ノートへ戻る",
    home: "ホームへ戻る",
    theme: "テーマを切り替える",
    language: "言語を切り替える",
    themes: { garden: "研究の庭", cloud: "雲の島", courtyard: "小さな中庭", classic: "クラシック", night: "ナイト", film: "フィルム", glass: "フルイドガラス", pixel: "和風ピクセル", cartoon: "ポップカートゥーン", noritake: "Noritake 線画", neko: "和風ねこ", shiba: "和風柴犬" },
    published: "公開日",
    readingTime: "読了時間",
    keyFacts: "主要データ",
    contents: "目次",
    overview: "概要",
    glossary: "用語集",
    sources: "参照資料",
    sourceKinds: { article: "元記事", paper: "技術論文", repository: "リポジトリ", model: "モデルページ" },
    sourceNote: "リンクは新しいタブで開きます。実験値は最新版の論文、モデルカード、公式リポジトリを優先して確認してください。",
    interpretation: "独自解釈であり、原文の複製ではありません",
    interpretationText: "本稿は公開された技術報告、論文、プロジェクト資料をもとに、問題・手法・根拠を再構成し、筆者独自の評価と実践上の提案を加えたものです。逐語訳ではなく、原著者の正式版に代わるものでもありません。",
    bodyLanguageNote: null,
    tableNote: "表の注記",
    footer: "技術を明確かつ検証可能な形で共有します。",
  },
  ko: {
    htmlLang: "ko",
    skip: "보고서 본문으로 이동",
    back: "기술 노트로 돌아가기",
    home: "홈으로 돌아가기",
    theme: "테마 전환",
    language: "언어 전환",
    themes: { garden: "연구 정원", cloud: "구름 섬", courtyard: "작은 연구 뜰", classic: "클래식", night: "나이트", film: "필름", glass: "플루이드 글라스", pixel: "일본풍 픽셀", cartoon: "밝은 카툰", noritake: "Noritake 라인 아트", neko: "일본풍 고양이", shiba: "일본풍 시바견" },
    published: "게시일",
    readingTime: "읽는 시간",
    keyFacts: "핵심 데이터",
    contents: "목차",
    overview: "핵심 개요",
    glossary: "용어집",
    sources: "참고 자료",
    sourceKinds: { article: "원문 기사", paper: "기술 논문", repository: "코드 저장소", model: "모델 페이지" },
    sourceNote: "링크는 새 탭에서 열립니다. 실험 수치는 최신 논문, 모델 카드 또는 공식 저장소에서 우선 확인해 주세요.",
    interpretation: "독립적인 해설이며 원문 복제가 아닙니다",
    interpretationText: "이 글은 공개된 기술 보고서, 논문, 프로젝트 자료를 바탕으로 문제·방법·근거를 다시 구성하고 필자의 판단과 활용 제안을 더했습니다. 문장별 번역이 아니며 원저자의 공식 자료를 대체하지 않습니다.",
    bodyLanguageNote: "보고서의 제목·요약·목차와 장 제목은 한국어로 제공되며, 세부 기술 본문은 정확한 의미 보존을 위해 현재 영어로 표시됩니다.",
    tableNote: "표 주석",
    footer: "기술을 명확하고 검증 가능한 방식으로 공유합니다.",
  },
} satisfies Record<Locale, {
  htmlLang: string;
  skip: string;
  back: string;
  home: string;
  theme: string;
  language: string;
  themes: Record<Theme, string>;
  published: string;
  readingTime: string;
  keyFacts: string;
  contents: string;
  overview: string;
  glossary: string;
  sources: string;
  sourceKinds: Record<Report["sources"][number]["kind"], string>;
  sourceNote: string;
  interpretation: string;
  interpretationText: string;
  bodyLanguageNote: string | null;
  tableNote: string;
  footer: string;
}>;

const localeButtonLabel: Record<Locale, string> = { zh: "中", en: "EN", ja: "日", ko: "한" };
const localeNames: Record<Locale, string> = { zh: "中文", en: "English", ja: "日本語", ko: "한국어" };

export function ReportPage({ report }: { report: Report }) {
  const [locale, setLocale] = useState<Locale>("zh");
  const [theme, setTheme] = useState<Theme>("garden");
  const [preferencesReady, setPreferencesReady] = useState(false);
  const copy = ui[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      let savedLocale: string | null = null;
      let savedTheme: string | null = null;

      try {
        savedLocale = window.localStorage.getItem("jiajun-site-language");
        savedTheme = window.localStorage.getItem("jiajun-site-theme");
      } catch {
        // The report remains fully usable when browser storage is unavailable.
      }

      if (isLocale(savedLocale)) {
        setLocale(savedLocale);
      } else if (window.navigator.language.toLowerCase().startsWith("ja")) {
        setLocale("ja");
      } else if (window.navigator.language.toLowerCase().startsWith("ko")) {
        setLocale("ko");
      } else if (!window.navigator.language.toLowerCase().startsWith("zh")) {
        setLocale("en");
      }

      const initialTheme = isTheme(savedTheme) ? savedTheme : "garden";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
      setPreferencesReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;
    document.documentElement.lang = copy.htmlLang;
    document.title = `${report.title[locale]} · Jiajun He`;
    try {
      window.localStorage.setItem("jiajun-site-language", locale);
    } catch {
      // Language switching does not depend on persistent storage.
    }
  }, [copy.htmlLang, locale, preferencesReady, report.title]);

  const selectTheme = (nextTheme: Theme) => {
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      window.localStorage.setItem("jiajun-site-theme", nextTheme);
    } catch {
      // Theme switching does not depend on persistent storage.
    }
  };

  const tableOfContents = useMemo(
    () => [
      { id: "overview", label: copy.overview },
      ...report.sections.map((section) => ({ id: section.id, label: section.heading[locale] })),
      { id: "glossary", label: copy.glossary },
      { id: "sources", label: copy.sources },
    ],
    [copy.glossary, copy.overview, copy.sources, locale, report.sections],
  );

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#report-main">{copy.skip}</a>

      <header className={styles.header}>
        <Link className={styles.brandLink} href="/notes/" aria-label={copy.back}>
          <span className={styles.mark} aria-hidden="true">HJ</span>
          <span className={styles.backArrow} aria-hidden="true">←</span>
          <span>{copy.back}</span>
        </Link>

        <nav className={styles.headerNav} aria-label={copy.home}>
          <Link href="/">{copy.home}</Link>
        </nav>

        <div className={styles.controls}>
          <div className={styles.themeSwitch} role="group" aria-label={copy.theme}>
            {themes.map((option) => (
              <button
                key={option}
                type="button"
                aria-label={copy.themes[option]}
                aria-pressed={theme === option}
                onClick={() => selectTheme(option)}
              >
                <span className={`${styles.themeDot} ${styles[option]}`} aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className={styles.languageSwitch} role="group" aria-label={copy.language}>
            {locales.map((option) => (
              <button
                key={option}
                type="button"
                aria-label={localeNames[option]}
                aria-pressed={locale === option}
                onClick={() => setLocale(option)}
              >
                {localeButtonLabel[option]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main id="report-main" className={styles.main}>
        <article>
          <header className={styles.hero}>
            <span className={`${styles.themeSticker} ${styles.heroSticker}`} aria-hidden="true" />
            <div className={styles.heroMeta}>
              <span>{report.index}</span>
              <span>{report.category[locale]}</span>
            </div>
            <h1>{report.title[locale]}</h1>
            <p className={styles.summary}>{report.summary[locale]}</p>
            {copy.bodyLanguageNote ? <p className={styles.sourceNote}>{copy.bodyLanguageNote}</p> : null}
            <div className={styles.byline}>
              <span>{copy.published} <time dateTime={report.published}>{report.published}</time></span>
              <span>{copy.readingTime} · {report.readingTime[locale]}</span>
            </div>
            <div className={styles.tags} aria-label="Tags">
              {report.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <div className={styles.noritakeVignette} aria-hidden="true" />
          </header>

          <section id="overview" className={styles.overview} aria-labelledby="overview-title">
            <span className={`${styles.themeSticker} ${styles.overviewSticker}`} aria-hidden="true" />
            <div className={styles.overviewCopy}>
              <p className={styles.sectionKicker}>{copy.overview}</p>
              <h2 id="overview-title">{report.thesis[locale]}</h2>
            </div>

            <div className={styles.facts} aria-label={copy.keyFacts}>
              {report.facts.map((fact, index) => (
                <article key={`${fact.label[locale]}-${index}`} className={styles.fact}>
                  <span>{fact.label[locale]}</span>
                  <strong>{fact.value[locale]}</strong>
                  <p>{fact.detail[locale]}</p>
                </article>
              ))}
            </div>
          </section>

          <div className={styles.readingLayout}>
            <aside className={styles.toc} aria-labelledby="toc-title">
              <span className={`${styles.themeSticker} ${styles.tocSticker}`} aria-hidden="true" />
              <p id="toc-title">{copy.contents}</p>
              <ol>
                {tableOfContents.map((item, index) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            <div className={styles.reportBody}>
              {report.sections.map((section, index) => {
                const isCalibration = section.id === "claims" || section.id === "limits";

                return (
                  <section key={section.id} id={section.id} className={styles.section}>
                    <span className={`${styles.themeSticker} ${styles.sectionSticker} ${styles[`stickerSlot${index % 6}`]}`} aria-hidden="true" />
                    <p className={styles.sectionKicker}>{section.kicker[locale]}</p>
                    <h2>{section.heading[locale]}</h2>

                    <div className={styles.prose}>
                      {section.paragraphs.map((paragraph, index) => (
                        <p key={`${section.id}-paragraph-${index}`}>{paragraph[locale]}</p>
                      ))}
                    </div>

                    {section.bullets ? (
                      <ul className={styles.bullets}>
                        {section.bullets.map((bullet, index) => (
                          <li key={`${section.id}-bullet-${index}`}>
                            <strong>{bullet.title[locale]}</strong>
                            <span>{bullet.text[locale]}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {section.table ? (
                      <figure className={styles.tableFigure}>
                        <div className={styles.tableScroller} tabIndex={0} role="region" aria-label={section.table.caption[locale]}>
                          <table>
                            <caption>{section.table.caption[locale]}</caption>
                            <thead>
                              <tr>
                                {section.table.headers.map((header, index) => (
                                  <th key={`${section.id}-header-${index}`} scope="col">{header[locale]}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {section.table.rows.map((row, rowIndex) => (
                                <tr key={`${section.id}-row-${rowIndex}`}>
                                  {row.cells.map((cell, cellIndex) => (
                                    cellIndex === 0
                                      ? <th key={`${rowIndex}-${cellIndex}`} scope="row">{cell[locale]}</th>
                                      : <td key={`${rowIndex}-${cellIndex}`}>{cell[locale]}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {section.table.note ? (
                          <figcaption><strong>{copy.tableNote}</strong>{section.table.note[locale]}</figcaption>
                        ) : null}
                      </figure>
                    ) : null}

                    {section.callout ? (
                      <aside className={`${styles.callout} ${isCalibration ? styles.calibration : ""}`}>
                        <strong>{section.callout.label[locale]}</strong>
                        <p>{section.callout.text[locale]}</p>
                      </aside>
                    ) : null}
                  </section>
                );
              })}

              <section id="glossary" className={`${styles.section} ${styles.glossarySection}`}>
                <span className={`${styles.themeSticker} ${styles.sectionSticker} ${styles.stickerSlot4}`} aria-hidden="true" />
                <p className={styles.sectionKicker}>Glossary</p>
                <h2>{copy.glossary}</h2>
                <dl className={styles.glossary}>
                  {report.glossary.map((item) => (
                    <div key={item.term}>
                      <dt>{item.term}</dt>
                      <dd>{item.definition[locale]}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section id="sources" className={`${styles.section} ${styles.sourcesSection}`}>
                <span className={`${styles.themeSticker} ${styles.sectionSticker} ${styles.stickerSlot5}`} aria-hidden="true" />
                <p className={styles.sectionKicker}>References</p>
                <h2>{copy.sources}</h2>
                <p className={styles.sourceNote}>{copy.sourceNote}</p>
                <ul className={styles.sources}>
                  {report.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        <span>{copy.sourceKinds[source.kind]}</span>
                        <strong>{source.label[locale]}</strong>
                        <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>

                <aside className={styles.interpretation}>
                  <strong>{copy.interpretation}</strong>
                  <p>{copy.interpretationText}</p>
                </aside>
              </section>
            </div>
          </div>
        </article>
      </main>

      <footer className={styles.footer}>
        <Link href="/notes/">← {copy.back}</Link>
        <span>© {new Date().getFullYear()} Jiajun He · {copy.footer}</span>
        <Link href="/">{copy.home} ↑</Link>
      </footer>

      <AmbientDock locale={locale} />
    </div>
  );
}
