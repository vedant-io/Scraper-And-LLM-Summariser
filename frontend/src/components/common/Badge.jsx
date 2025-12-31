export default function Badge({ type }) {
  const styles =
    type === "enhanced"
      ? "bg-green-200 text-green-800"
      : "bg-gray-200 text-gray-700";

  return (
    <span className={`text-xs px-3 py-1 rounded-full font-medium ${styles}`}>
      {type === "enhanced" ? "AI Enhanced" : "Original"}
    </span>
  );
}
