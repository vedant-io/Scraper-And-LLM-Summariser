import ArticleCard from "./ArticleCard.jsx";

export default function ArticleList({ articles, onOpen }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article._id} article={article} onOpen={onOpen} />
      ))}
    </div>
  );
}
