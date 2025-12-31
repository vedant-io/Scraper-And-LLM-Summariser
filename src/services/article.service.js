import puppeteer from "puppeteer";
import { listing_scraper } from "../../scraper/listing_scraper.js";
import { scrapeArticleContent } from "../../scraper/content_scraper.js";
import { rewriteArticleWithLLM } from "../../llm/rewriteArticles.js";
import { Article } from "../models/article_model.js";
import { scrapeReferenceArticle } from "../../scraper/referenceArticleScraper.js";

async function scrapeAndRewrite(page, url, referenceA, referenceB) {
  const articles = await listing_scraper(page, url);
  const processedArticles = [];

  for (const article of articles) {
    try {
      const content = await scrapeArticleContent(page, article.url);
      const originalArticle = content.contentText;

      const rewrittenContent = await rewriteArticleWithLLM({
        originalArticle,
        referenceA,
        referenceB,
      });

      const newArticle = new Article({
        ...article,
        content: rewrittenContent,
      });

      await newArticle.save();
      processedArticles.push(newArticle);
    } catch (error) {
      console.error(`Error processing article: ${article.url}`, error);
    }
  }

  return processedArticles;
}

async function referenceArticles(url, referenceAUrl, referenceBUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
  });

  try {
    const referenceA = await scrapeReferenceArticle(browser, referenceAUrl);
    const referenceB = await scrapeReferenceArticle(browser, referenceBUrl);

    if (!referenceA?.contentText || !referenceB?.contentText) {
      throw new Error("Could not scrape one or both reference articles.");
    }

    const page = await browser.newPage();
    const processedArticles = await scrapeAndRewrite(
      page,
      url,
      referenceA.contentText,
      referenceB.contentText
    );
    return processedArticles;
  } catch (error) {
    console.error(`Failed to process articles with references: ${error}`);
    return [];
  } finally {
    await browser.close();
  }
}

export default {
  referenceArticles,
};
