export async function listing_scraper(page, url) {
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  );

  console.log(`Visiting ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

  // Wait for articles to exist
  await page.waitForSelector("article.entry-card");

  const articles = await page.$$eval("article.entry-card", (cards) =>
    cards.map((card) => {
      const titleAnchor = card.querySelector("h2.entry-title a");
      const authorEl = card.querySelector(".meta-author span");
      const tagEls = card.querySelectorAll(".meta-categories a");

      return {
        title: titleAnchor?.innerText.trim() || null,
        url: titleAnchor?.href || null,
        author: authorEl?.innerText.trim() || null,

        tags: Array.from(tagEls).map((t) => t.innerText.trim()),
      };
    })
  );
  return articles;
}
