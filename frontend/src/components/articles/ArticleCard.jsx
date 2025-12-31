import { isEnhanced, getBaseTitle } from "../../../utils/helper.js";
import Badge from "../common/Badge";

export default function ArticleCard({ article, onOpen }) {
  const enhanced = isEnhanced(article);

  return (
    <div
      onClick={() => onOpen(article)}
      className={`rounded-xl border p-5 cursor-pointer transition
        hover:shadow-md
        ${enhanced ? "bg-green-50 border-green-200" : "bg-white"}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="font-semibold text-lg">{getBaseTitle(article.title)}</h2>
        <Badge type={enhanced ? "enhanced" : "original"} />
      </div>

      <p className="text-sm text-gray-600 line-clamp-3">{article.content}</p>
    </div>
  );
}
