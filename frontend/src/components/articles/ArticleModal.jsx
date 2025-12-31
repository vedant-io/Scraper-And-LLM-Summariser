import { isEnhanced } from "../../../utils/helper.js";
import { useState } from "react";

export default function ArticleModal({ article, originalsMap, onClose }) {
  const [view, setView] = useState("enhanced");

  if (!article) return null;

  const enhanced = isEnhanced(article);
  const original =
    enhanced && originalsMap[article.title.replace("(Enhanced)", "").trim()];

  const content =
    enhanced && view === "original" && original
      ? original.content
      : article.content;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-6">
        <button onClick={onClose} className="text-sm text-gray-500 mb-4">
          ← Back
        </button>

        {enhanced && original && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setView("enhanced")}
              className={`px-3 py-1 rounded
                ${
                  view === "enhanced"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }
              `}
            >
              Enhanced
            </button>
            <button
              onClick={() => setView("original")}
              className={`px-3 py-1 rounded
                ${
                  view === "original" ? "bg-blue-600 text-white" : "bg-gray-200"
                }
              `}
            >
              Original
            </button>
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6">{article.title}</h1>

        <div className="prose max-w-none whitespace-pre-line">{content}</div>
      </div>
    </div>
  );
}
