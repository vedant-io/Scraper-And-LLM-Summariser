import { Article } from "../src/models/article_model.js";

export async function saveArticleToDB(article) {
  return await Article.create({
    title: article.title,
    url: article.url,
    author: article.author,
    tags: article.tags,
    content: article.contentText,
  });
}
