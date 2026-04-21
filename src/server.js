import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import { configDotenv } from "dotenv";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/chat", async (req, res) => {
  console.log(process.env.PORT)
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "message field is required" });
  }

  try {
    const response = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: message }],
    });

    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    res.json({ response: text });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      res.status(error.status ?? 500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}/health`);
});
