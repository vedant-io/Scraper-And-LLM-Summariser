import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_SEARCH_API;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

router.get("/google-article-search", async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({
      error: "Article title is required for search",
    });
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/customsearch/v1",
      {
        params: {
          key: GOOGLE_API_KEY,
          cx: SEARCH_ENGINE_ID,
          q: `${title} blog article`,
          num: 5,
        },
      }
    );

    const rawResults = response.data.items || [];

    const filteredResults = rawResults
      .filter((item) => {
        const url = item.link.toLowerCase();
        return (
          !url.includes("youtube") &&
          !url.includes("pdf") &&
          !url.includes("login") &&
          !url.includes("signup")
        );
      })
      .map((item) => ({
        title: item.title,
        url: item.link,
        source: item.displayLink,
      }));

    res.status(200).json({
      query: title,
      results: filteredResults.slice(0, 2),
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch Google search results",
    });
  }
});

export default router;
