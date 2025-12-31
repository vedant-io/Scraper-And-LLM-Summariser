import { useState } from "react";
import ArticleHeader from "./ArticleHeader";
import ArticleToggle from "./ArticleToggle";
import { isEnhanced } from "../../../utils/helper.js";

export default function ArticleReader({ article, originalArticle, onClose }) {
  const [view, setView] = useState("enhanced");
  const enhanced = isEnhanced(article);

  const content =
    enhanced && view === "original" && originalArticle
      ? originalArticle.content
      : article.content;

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <button onClick={onClose} className="text-sm text-gray-500 mb-6">
          ← Back
        </button>

        {enhanced && originalArticle && (
          <ArticleToggle view={view} setView={setView} />
        )}

        <ArticleHeader
          title={article.title}
          createdAt={article.createdAt}
          enhanced={enhanced}
        />

        <article className="prose prose-lg max-w-none whitespace-pre-line">
          {content}
        </article>
      </div>
    </div>
  );
}
