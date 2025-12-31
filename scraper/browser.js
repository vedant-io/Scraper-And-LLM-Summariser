import { saveArticleToDB } from "../config/article_saver.js";
import { scrapeArticleContent } from "./content_scraper.js";

(async () => {
  // Production-like behavior

  // console.log(JSON.stringify(articles, null, 2));
  // const articleUrls = articles.map((article) => article.url).filter(Boolean);
  // console.log(JSON.stringify(articleUrls, null, 2));
  const enrichedArticles = [];

  for (const article of articles) {
    if (!article.url) continue;

    console.log(`Scraping article: ${article.url}`);

    try {
      const content = await scrapeArticleContent(page, article.url);

      // const saved = await saveArticleToDB({
      //   ...article,
      //   ...content,
      // });

      // if (saved) {
      //   console.log(`Saved: ${saved.title}`);
      // }

      enrichedArticles.push({
        ...article,
        ...content,
      });
    } catch (err) {
      console.error(`Failed to scrape ${article.url}`, err.message);
    }
  }
  console.log(JSON.stringify(enrichedArticles.splice(-5), null, 2));

  await browser.close();
})();
