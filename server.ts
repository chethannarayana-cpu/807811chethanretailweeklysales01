import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI Client lazy or guarded
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Business Insights & Natural Language Assistant Endpoint
  app.post("/api/ai-insights", async (req, res) => {
    try {
      const { summaryData, question } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          response: "Gemini API key is not configured. Running in default rule-based analytics mode. All calculations are executed with human-in-the-loop verification.",
          fallback: true,
        });
      }

      const prompt = `You are a Senior Retail Business Intelligence Analyst.
Analyze the following retail weekly sales & store performance metrics:

DATA SUMMARY:
${JSON.stringify(summaryData, null, 2)}

USER QUESTION / PROMPT:
${question || "Provide 3 concise strategic recommendations to boost net sales and reduce stockout/returns."}

Provide a crisp, actionable, structured response with clear bullet points focusing on revenue drivers, regional performance, store targets, and stockout mitigation.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({
        response: response.text || "No response generated.",
        fallback: false,
      });
    } catch (err: any) {
      console.error("AI Insights Error:", err);
      res.status(500).json({
        error: "Failed to generate AI insights.",
        details: err?.message || "Internal server error",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Retail Sales Intelligence server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
