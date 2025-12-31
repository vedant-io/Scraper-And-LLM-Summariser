import puppeteer from "puppeteer";
import { scrapeReferenceArticle } from "./referenceArticleScraper.js";
import { normalizeReferenceContent } from "../config/normalize_reference.js";

const urls = [
  "https://www.salesloft.com/platform/drift",
  "https://unbounce.com/conversion-rate-optimization/how-to-increase-conversion-rate/",
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  for (const url of urls) {
    const result = await scrapeReferenceArticle(browser, url);
    const normalized_output = normalizeReferenceContent(result?.contentText);
  }

  await browser.close();
})();
