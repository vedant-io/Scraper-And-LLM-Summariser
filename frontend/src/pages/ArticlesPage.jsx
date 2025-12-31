import { useEffect, useState } from "react";
import { fetchArticles } from "../api/article.js";
import PageContainer from "../components/layout/PageContainer";
import ArticleList from "../components/articles/ArticleList";
import ArticleReader from "../components/articles/ArticleReader";
import { isEnhanced, getBaseTitle } from "../../utils/helper.js";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(null);

  useEffect(() => {
    fetchArticles().then(setArticles);
  }, []);

  const originalsMap = {};
  articles.forEach((a) => {
    if (!isEnhanced(a)) {
      originalsMap[a.title] = a;
    }
  });

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-8">Articles Dashboard</h1>

      <ArticleList articles={articles} onOpen={setActiveArticle} />

      {activeArticle && (
        <ArticleReader
          article={activeArticle}
          originalArticle={originalsMap[getBaseTitle(activeArticle.title)]}
          onClose={() => setActiveArticle(null)}
        />
      )}
    </PageContainer>
  );
}
