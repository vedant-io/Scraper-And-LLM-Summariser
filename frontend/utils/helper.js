export function isEnhanced(article) {
  return (
    article.author === "AI-enhanced" || article.title.includes("(Enhanced)")
  );
}

export function getBaseTitle(title) {
  return title.replace("(Enhanced)", "").trim();
}
