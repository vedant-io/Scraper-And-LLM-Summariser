import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { connectDB } from "../config/db.js";
import cors from "cors";
import axios from "axios";
import articleRoutes from "./routes/article.route.js";
import searchRoutes from "./routes/search.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", searchRoutes);

app.use("/api/v1", articleRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`The Server is running on port: ${port}`);
});
