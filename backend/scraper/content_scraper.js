export async function scrapeArticleContent(page, url) {
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  await page.waitForSelector("div.elementor-widget-theme-post-content");

  return await page.$eval("div.elementor-widget-theme-post-content", (el) => {
    el.querySelectorAll(".has-social-placeholder, script, style").forEach((n) =>
      n.remove()
    );

    return {
      contentText: el.innerText.replace(/\n{2,}/g, "\n").trim(),
    };
  });
}
