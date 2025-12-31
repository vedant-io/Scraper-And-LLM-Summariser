import puppeteer from "puppeteer";
import { listing_scraper } from "../../scraper/listing_scraper.js";
import { scrapeArticleContent } from "../../scraper/content_scraper.js";
import { rewriteArticleWithLLM } from "../../llm/rewriteArticles.js";
import { Article } from "../models/article_model.js";

async function scrapeAndRewrite(url) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
  });
  const page = await browser.newPage();

  const articles = await listing_scraper(page, url);
  const processedArticles = [];

  for (const article of articles) {
    try {
      const content = await scrapeArticleContent(page, article.url);
      const originalArticle = content.contentText;

      // For the purpose of this example, we'll use the original article as references.
      // In a real-world scenario, you would fetch actual reference articles.
      const referenceA = originalArticle;
      const referenceB = originalArticle;

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

  await browser.close();
  return processedArticles;
}

export default {
  scrapeAndRewrite,
};
