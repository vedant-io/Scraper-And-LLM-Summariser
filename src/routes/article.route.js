import express from "express";
import articleController from "../controllers/article.controller.js";

const router = express.Router();

router.post("/articles/reference", articleController.referenceArticles);

router.get("/articles", articleController.getAllArticles);

router.get("/articles/search", articleController.searchArticles);

router.get("/articles/:id", articleController.getArticleById);

router.post("/articles", articleController.createArticle);

router.put("/articles/:id", articleController.updateArticle);

router.delete("/articles/:id", articleController.deleteArticle);

export default router;
