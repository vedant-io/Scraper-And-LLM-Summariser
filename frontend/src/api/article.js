import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

export async function fetchArticles() {
  const res = await API.get("/articles");
  return res.data;
}
