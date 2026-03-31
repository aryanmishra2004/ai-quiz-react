import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 7860;
const distDir = path.join(__dirname, "dist");
const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

app.use(express.json());
app.use(express.static(distDir));

const normalizeQuizPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.questions)) return payload.questions;
  if (typeof payload !== "string") return [];

  const cleanText = payload
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleanText);

  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed?.questions)) return parsed.questions;

  return [];
};

const createQuizPrompt = (topic, count) => `
Create exactly ${count} multiple-choice quiz questions about ${topic}.

Return valid JSON only.
Use this exact format:
[
  {
    "question": "Question text",
    "options": {
      "A": "Option A",
      "B": "Option B",
      "C": "Option C",
      "D": "Option D"
    },
    "answer": "A"
  }
]
`;

app.post("/api/generate", async (req, res) => {
  const topic = req.body?.topic?.trim();
  const count = Number.parseInt(req.body?.count, 10);

  if (!topic) {
    return res.status(400).json({ error: "Topic is required." });
  }

  if (!Number.isInteger(count) || count < 1 || count > 10) {
    return res
      .status(400)
      .json({ error: "Question count must be between 1 and 10." });
  }

  if (!GROQ_API_KEY) {
    return res.status(500).json({
      error: "Missing GROQ_API_KEY secret in the deployment environment.",
    });
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You create clean quiz JSON. Return JSON only with no markdown fences.",
          },
          {
            role: "user",
            content: createQuizPrompt(topic, count),
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const raw = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: raw?.error?.message || "Failed to generate quiz from Groq.",
      });
    }

    const content = raw.choices?.[0]?.message?.content;
    const questions = normalizeQuizPayload(content);

    if (!questions.length) {
      return res.status(502).json({ error: "Received an empty quiz payload." });
    }

    return res.json({ questions });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Unexpected server error during quiz generation.",
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
