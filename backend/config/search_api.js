import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function searchGoogle(query) {
  const API = process.env.GOOGLE_SEARCH_API;
  const apiKey = API; // Use environment variables if possible
  const cxId = "049f0ed4c8a8244ab";
  const url = `www.googleapis.com/${apiKey}&cx=${cxId}&q=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data.items); // Array of search results
    // You can then process 'data.items' to display results in your UI
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Call the function with your search term
searchGoogle("example query");
