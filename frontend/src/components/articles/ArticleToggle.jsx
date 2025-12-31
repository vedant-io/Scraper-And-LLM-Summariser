export default function ArticleToggle({ view, setView }) {
  return (
    <div className="flex gap-2 mb-6">
      {["enhanced", "original"].map((type) => (
        <button
          key={type}
          onClick={() => setView(type)}
          className={`px-4 py-2 rounded font-medium
            ${
              view === type
                ? type === "enhanced"
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white"
                : "bg-gray-200"
            }
          `}
        >
          {type === "enhanced" ? "Enhanced" : "Original"}
        </button>
      ))}
    </div>
  );
}
