"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { content, localeLabels, type Locale } from "./content";
import { TravelMap } from "./TravelMap";

const languages: Locale[] = ["zh", "en", "ja"];
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
  const current = content[locale];

  useEffect(() => {
    const saved = window.localStorage.getItem("jiajun-site-language") as Locale | null;
    if (saved && languages.includes(saved)) {
      setLocale(saved);
      return;
    }

    const browserLanguage = window.navigator.language.toLowerCase();
    if (browserLanguage.startsWith("ja")) setLocale("ja");
    else if (!browserLanguage.startsWith("zh")) setLocale("en");
  }, []);

  useEffect(() => {
    document.documentElement.lang = current.htmlLang;
    document.title = current.pageTitle;
    window.localStorage.setItem("jiajun-site-language", locale);
  }, [current.htmlLang, current.pageTitle, locale]);

  return (
    <div className="site-root" id="top">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={`${current.hero.name} — home`}>
          <span className="wordmark-mark">HJ</span>
          <span className="wordmark-name">
            {current.hero.name} / {current.hero.romanName}
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {current.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

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

        <section className="metrics section-shell" aria-label="Research metrics">
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
    </div>
  );
}
