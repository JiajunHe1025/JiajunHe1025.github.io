import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished multilingual portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>何嘉俊 · Jiajun He \| Speech &amp; Multimodal AI<\/title>/i);
  assert.match(html, /허자쥔/);
  assert.match(html, /한국어/);
  assert.match(html, /Noritake/);
  assert.match(html, /日系猫咪/);
  assert.match(html, /日系柴犬/);
  assert.match(html, /"neko","shiba"|"neko", "shiba"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Codex is working/i);
});

test("keeps four locales and all pet themes wired across the site", async () => {
  const [content, page, layout, notes, report, globalCss, notesCss, reportCss] = await Promise.all([
    readFile(new URL("../app/content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/notes/NotesPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/notes/[slug]/ReportPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/notes/notes.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/notes/[slug]/report.module.css", import.meta.url), "utf8"),
  ]);

  assert.match(content, /export type Locale = "zh" \| "en" \| "ja" \| "ko"/);
  assert.match(content, /ko:\s*\{[\s\S]*htmlLang:\s*"ko"/);
  assert.match(page, /\["zh", "en", "ja", "ko"\]/);
  assert.match(notes, /\["zh", "en", "ja", "ko"\]/);
  assert.match(report, /\["zh", "en", "ja", "ko"\]/);

  for (const source of [page, layout, notes, report]) {
    assert.match(source, /"neko"/);
    assert.match(source, /"shiba"/);
  }

  for (const css of [globalCss, notesCss, reportCss]) {
    assert.match(css, /data-theme="neko"/);
    assert.match(css, /data-theme="shiba"/);
    assert.match(css, /japanese-neko-theme\.avif/);
    assert.match(css, /japanese-shiba-theme\.avif/);
    assert.match(css, /neko-stickers\.png/);
    assert.match(css, /shiba-stickers\.png/);
  }

  await Promise.all([
    access(new URL("../public/illustrations/japanese-neko-theme.avif", import.meta.url)),
    access(new URL("../public/illustrations/japanese-shiba-theme.avif", import.meta.url)),
    access(new URL("../public/illustrations/neko-stickers.png", import.meta.url)),
    access(new URL("../public/illustrations/shiba-stickers.png", import.meta.url)),
  ]);
});
