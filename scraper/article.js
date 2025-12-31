import puppeteer from "puppeteer";

const ARTICLE_URL = "https://beyondchats.com/blogs/sales-chatbots/";

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  );

  console.log(`Visiting article: ${ARTICLE_URL}`);
  await page.goto(ARTICLE_URL, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  // Wait for article content to exist
  await page.waitForSelector("div.elementor-widget-theme-post-content");

  const articleContent = await page.$eval(
    "div.elementor-widget-theme-post-content",
    (el) => {
      // Remove junk inside content
      el.querySelectorAll(".has-social-placeholder, script, style").forEach(
        (n) => n.remove()
      );

      return {
        // contentHtml: el.innerHTML.trim(),
        contentText: el.innerText.replace(/\n{2,}/g, "\n").trim(),
      };
    }
  );

  console.log("===== ARTICLE CONTENT =====");
  console.log(articleContent);
  await browser.close();

  return articleContent;
})();
