import puppeteer from "puppeteer";
import axios from "axios";

import { Article } from "../models/article_model.js";
import { scrapeReferenceArticle } from "../../scraper/referenceArticleScraper.js";
import { normalizeReferenceContent } from "../../config/normalize_reference.js";
import { rewriteArticleWithLLM } from "../../llm/rewriteArticles.js";

async function enhanceArticle(articleId) {
  // 1️⃣ Fetch original article from DB
  const original = await Article.findById(articleId);
  if (!original) {
    throw new Error("Article not found");
  }

  // 2️⃣ Google search using title
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

  // 3️⃣ Scrape reference articles
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
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

  // 4️⃣ Normalize content
  const normalizedRefA = normalizeReferenceContent(refAData.contentText);
  const normalizedRefB = normalizeReferenceContent(refBData.contentText);

  if (
    normalizedRefA.metadata.confidence === "low" ||
    normalizedRefB.metadata.confidence === "low"
  ) {
    throw new Error("Reference content quality too low for rewriting");
  }

  // 5️⃣ Rewrite using LLM
  const rewrittenContent = await rewriteArticleWithLLM({
    originalArticle: original.content,
    referenceA: normalizedRefA.cleanedText,
    referenceB: normalizedRefB.cleanedText,
  });

  // 6️⃣ Append references
  const finalContent = `${rewrittenContent}

References:
1. ${refA.title} – ${refA.url}
2. ${refB.title} – ${refB.url}
`;

  // 7️⃣ Save enhanced article
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
