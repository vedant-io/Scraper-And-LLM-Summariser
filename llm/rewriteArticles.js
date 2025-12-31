import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_ORIGINAL_CHARS = 9000;
const MAX_REF_CHARS = 3500;
const MAX_OUTPUT_TOKENS = 1400;

function cap(text, maxChars) {
  if (!text) return "";
  return text.length > maxChars
    ? text.slice(0, maxChars) + "\n\n[Truncated for context limits]"
    : text;
}

export async function rewriteArticleWithLLM({
  originalArticle,
  referenceA,
  referenceB,
}) {
  const systemPrompt = `
You are an expert content editor and SEO-focused technical writer.

You rewrite articles to improve structure, clarity, depth, and competitiveness
while preserving originality and factual accuracy.

You strictly avoid plagiarism.
`.trim();

  const userPrompt = `
TASK
Rewrite the ORIGINAL ARTICLE to be more competitive with top-ranking articles
in terms of structure, clarity, and depth.

IMPORTANT RULES (STRICT)
- Do NOT copy sentences or phrases from the reference articles.
- Do NOT mention or imply any brand, product, or website from the references.
- Do NOT add claims or facts not supported by the original or references.
- Do NOT include calls-to-action, sales language, or marketing pitches.
- Preserve the core message and intent of the original article.
- Improve organization, flow, and explanation depth.
- Use clear headings and a professional blog tone.

ORIGINAL ARTICLE (PRIMARY SOURCE)
<<<
${cap(originalArticle, MAX_ORIGINAL_CHARS)}
>>>

REFERENCE ARTICLE A (STRUCTURE & DEPTH REFERENCE ONLY)
<<<
${cap(referenceA, MAX_REF_CHARS)}
>>>

REFERENCE ARTICLE B (STRUCTURE & DEPTH REFERENCE ONLY)
<<<
${cap(referenceB, MAX_REF_CHARS)}
>>>

OUTPUT REQUIREMENTS
- Output ONLY the rewritten article text.
- Use clear section headings.
- No citations inside the body.
- No preamble, no explanations, no meta commentary.
- Length should be comparable to the original article.
`.trim();

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.45,
    max_tokens: MAX_OUTPUT_TOKENS,
    top_p: 0.9,
    frequency_penalty: 0.2,
  });

  return response.choices[0].message.content.trim();
}
