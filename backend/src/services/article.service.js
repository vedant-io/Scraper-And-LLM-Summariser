import puppeteer from "puppeteer";
import axios from "axios";

import { Article } from "../models/article_model.js";
import { scrapeReferenceArticle } from "../../scraper/referenceArticleScraper.js";
import { normalizeReferenceContent } from "../../config/normalize_reference.js";
import { rewriteArticleWithLLM } from "../../llm/rewriteArticles.js";

async function enhanceArticle(articleId) {
  const original = await Article.findById(articleId);
  if (!original) {
    throw new Error("Article not found");
  }

  const searchResponse = await axios.get(
    "http://localhost:5000/api/v1/google-article-search",
    {
      params: { title: original.title },
    }
  );

  const results = searchResponse.data.results;
  if (!results || results.length < 2) {
    throw new Error("Insufficient reference articles from Google");
  }

  const [refA, refB] = results;

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  let refAData, refBData;

  try {
    refAData = await scrapeReferenceArticle(browser, refA.url);
    refBData = await scrapeReferenceArticle(browser, refB.url);
  } finally {
    await browser.close();
  }

  if (!refAData?.contentText || !refBData?.contentText) {
    throw new Error("Failed to scrape reference article content");
  }

  const normalizedRefA = normalizeReferenceContent(refAData.contentText);
  const normalizedRefB = normalizeReferenceContent(refBData.contentText);

  const rewrittenContent = await rewriteArticleWithLLM({
    originalArticle: original.content,
    referenceA: normalizedRefA.cleanedText,
    referenceB: normalizedRefB.cleanedText,
  });

  const finalContent = `${rewrittenContent}

References:
1. ${refA.title} – ${refA.url}
2. ${refB.title} – ${refB.url}
`;

  const enhancedArticle = await Article.create({
    title: `${original.title} (Enhanced)`,
    content: finalContent,
    tags: original.tags,
    author: "AI-enhanced",
  });

  return enhancedArticle;
}

export default {
  enhanceArticle,
};
