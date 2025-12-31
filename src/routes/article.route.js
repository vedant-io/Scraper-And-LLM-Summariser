import express from "express";
import { Article } from "../models/article_model.js";

const router = express.Router();

router.get("/articles", async (req, res) => {
  try {
    const article = await Article.find({});
    res.send(article);
  } catch (error) {
    res.statusCode(400).send({ message: error.message });
  }
});

router.get("/articles/:id", async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).send({ message: `Provide an ID for the specific article` });
  }

  try {
    const article = await Article.findbyID(id);
    res.status(200).json(article);
  } catch (error) {
    res.status(400).send({
      message: `There was an issue while searching for that article: ${error.message}`,
    });
  }
});

router.post("/articles", async (req, res) => {
  try {
    const { title, url, author, tags, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const article = await Article.create({
      title,
      url,
      author,
      tags,
      content,
    });

    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/articles/:id", async (req, res) => {
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
});

router.delete("/articles/:id", async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/articles/search", async (req, res) => {
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
});

export default router;
