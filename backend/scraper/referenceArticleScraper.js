import puppeteer from "puppeteer";

export async function scrapeReferenceArticle(browser, url) {
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await page.evaluate(() => {
      const junkSelectors = [
        "nav",
        "footer",
        "aside",
        "script",
        "style",
        "noscript",
        "[role='navigation']",
        "[aria-modal='true']",
      ];

      junkSelectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => el.remove());
      });
    });

    const extracted = await page.evaluate(() => {
      function getTextLength(el) {
        return el.innerText ? el.innerText.length : 0;
      }

      let container =
        document.querySelector("article") || document.querySelector("main");

      if (!container) {
        const divs = Array.from(document.querySelectorAll("div"));
        container = divs.reduce((largest, current) => {
          return getTextLength(current) > getTextLength(largest)
            ? current
            : largest;
        }, divs[0]);
      }

      return {
        title: document.title,
        contentText:
          container?.innerText?.replace(/\n{2,}/g, "\n")?.trim() || "",
      };
    });

    return {
      url,
      title: extracted.title,
      contentText: extracted.contentText,
    };
  } catch (error) {
    return null;
  } finally {
    await page.close();
  }
}
