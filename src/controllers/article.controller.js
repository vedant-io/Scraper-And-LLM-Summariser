import { Article } from "../models/article_model.js";
import articleService from "../services/article.service.js";

async function scrapeAndRewrite(req, res) {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    const articles = await articleService.scrapeAndRewrite(url);
    res.status(201).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAllArticles(req, res) {
  try {
    const articles = await Article.find({});
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getArticleById(req, res) {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createArticle(req, res) {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateArticle(req, res) {
  try {
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteArticle(req, res) {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function searchArticles(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const articles = await Article.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default {
  scrapeAndRewrite,
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticles,
};
