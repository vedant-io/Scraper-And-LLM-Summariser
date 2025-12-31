import { getBaseTitle } from "../../../utils/helper.js";
import Badge from "../common/Badge";

export default function ArticleHeader({ title, createdAt, enhanced }) {
  return (
    <header className="mb-10">
      <h1 className="text-4xl font-bold mb-4">{getBaseTitle(title)}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{new Date(createdAt).toLocaleDateString()}</span>
        <Badge type={enhanced ? "enhanced" : "original"} />
      </div>
    </header>
  );
}
