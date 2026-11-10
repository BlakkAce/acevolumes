/**
 * Submit all sitemap URLs to IndexNow (Bing + Yandex + Seznam).
 * Bing's index feeds ChatGPT search and DuckDuckGo, so this is the fast
 * lane for AI-search visibility while Google crawls at its own pace.
 * Usage: node scripts/indexnow.mjs   (key lives in .indexnow-key)
 */
import { readFileSync } from "node:fs";

const SITE = "https://acevolumes.vercel.app";
const key = readFileSync(new URL("../.indexnow-key", import.meta.url), "utf8").trim();

const PATHS = [
  "/", "/about", "/contact", "/founder", "/mortgage", "/services", "/work",
  "/work/instafi-home-loans", "/work/excel-realty-mortgage", "/work/hcmg-command",
  "/work/harris-capital-mortgage", "/work/the-tab-team", "/work/trueterra-oils",
  "/work/jason-samuels-smith", "/work/top-trading-discounts",
];

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: "acevolumes.vercel.app",
    key,
    keyLocation: `${SITE}/${key}.txt`,
    urlList: PATHS.map((p) => `${SITE}${p}`),
  }),
});
console.log(`IndexNow submit: ${res.status} ${res.statusText}`);
if (res.status >= 400) console.log(await res.text());
