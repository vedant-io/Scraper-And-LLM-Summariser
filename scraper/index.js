import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import puppeteer from "puppeteer";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { listing_scraper } from "./listing_scraper.js";
import { scrapeArticleContent } from "./content_scraper.js";
import { saveArticleToDB } from "../config/article_saver.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function main() {
  await connectDB();

  const PAGE_NUMBER = 13;
  const URL = `https://beyondchats.com/blogs/page/${PAGE_NUMBER}`;

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
  });

  const page = await browser.newPage();

  const articles = await listing_scraper(page, URL);

  for (const article of articles) {
    try {
      const content = await scrapeArticleContent(page, article.url);
      await saveArticleToDB({
        ...article,
        ...content,
      });
    } catch (error) {
      console.log(`There was an error scraping website: ${error.message}`);
    }
  }

  await browser.close();
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
