const CTA_KEYWORDS = [
  "learn more",
  "request a demo",
  "get started",
  "sign up",
  "book a demo",
  "take a tour",
  "try for free",
  "contact sales",
  "explore",
];

const NAV_KEYWORDS = [
  "home",
  "product",
  "platform",
  "pricing",
  "features",
  "solutions",
  "resources",
  "customers",
  "company",
  "about",
  "faq",
];

const SHORT_LINE_MAX_WORDS = 4;
const MIN_PARAGRAPH_LENGTH = 40;

function isMostlyNoise(line) {
  const lower = line.toLowerCase();

  // empty or symbols only
  if (!line.trim() || /^[\W_]+$/.test(line)) return true;

  // CTA junk
  if (CTA_KEYWORDS.some((k) => lower.includes(k))) return true;

  // navigation labels
  if (NAV_KEYWORDS.includes(lower.trim()) && lower.split(" ").length <= 2)
    return true;

  return false;
}

function looksLikeMenuItem(line) {
  return (
    line.split(" ").length <= SHORT_LINE_MAX_WORDS &&
    /^[A-Z][a-zA-Z\s]+$/.test(line)
  );
}

function scoreParagraph(text) {
  let score = 0;

  if (text.length >= MIN_PARAGRAPH_LENGTH) score += 2;
  if (text.includes(".")) score += 1;
  if (/[a-zA-Z]{4,}/.test(text)) score += 1;
  if (!CTA_KEYWORDS.some((k) => text.toLowerCase().includes(k))) score += 1;

  return score;
}

export function normalizeReferenceContent(rawText) {
  if (!rawText || rawText.length < 200) {
    return {
      cleanedText: "",
      metadata: {
        removedLines: 0,
        keptLines: 0,
        confidence: "low",
      },
    };
  }

  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let removed = 0;

  // 1️⃣ Hard filtering (safe deletions)
  const filteredLines = lines.filter((line) => {
    if (isMostlyNoise(line)) {
      removed++;
      return false;
    }

    if (looksLikeMenuItem(line)) {
      removed++;
      return false;
    }

    return true;
  });

  // 2️⃣ Block formation
  const paragraphs = [];
  let buffer = [];

  for (const line of filteredLines) {
    buffer.push(line);

    if (line.endsWith(".") || line.length > 120) {
      paragraphs.push(buffer.join(" "));
      buffer = [];
    }
  }

  if (buffer.length) {
    paragraphs.push(buffer.join(" "));
  }

  // 3️⃣ Soft scoring (keep concept-rich content)
  const finalParagraphs = paragraphs.filter((p) => scoreParagraph(p) >= 3);

  const cleanedText = finalParagraphs.join("\n\n");

  const confidence =
    cleanedText.length > 800
      ? "high"
      : cleanedText.length > 400
      ? "medium"
      : "low";

  return {
    cleanedText,
    metadata: {
      removedLines: removed,
      keptLines: finalParagraphs.length,
      confidence,
    },
  };
}
