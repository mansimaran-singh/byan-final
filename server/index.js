import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./auth/authRoutes.js";
import oauthRoutes from "./oauth/oauthRoutes.js";
import OpenAI from "openai";
import { analyzeATS } from "./ats/atsEngine.js";
import { upload } from "./upload/uploadHandler.js";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

const OPENAI_KEY = process.env.OPENAI_KEY;
const openai = OPENAI_KEY
  ? new OpenAI({ apiKey: OPENAI_KEY })
  : null;

// -------------------- APP BANAYA --------------------
const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());

// -------------------- ROUTES ------------------------
app.use("/auth", authRoutes);
app.use("/oauth", oauthRoutes);

// -------------------- AI ROUTES ---------------------

// AI rewrite bullet / summary
app.post("/ai/rewrite", async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ error: "AI service not configured (missing OPENAI_KEY)" });
    }
    const { prompt } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Rewrite resume text in ATS-optimized bullet style." },
        { role: "user", content: prompt }
      ]
    });

    res.json({ text: completion.choices[0].message.content });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "AI rewriting failed" });
  }
});

// AI tailor resume to JD
app.post("/ai/tailor", async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ error: "AI service not configured (missing OPENAI_KEY)" });
    }
    const { resume, jd } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Tailor resume summary and bullets to match job description. Keep it ATS friendly." },
        { role: "user", content: `JOB DESCRIPTION:\n${jd}\n\nRESUME DATA:\n${resume}` }
      ]
    });

    res.json({ text: completion.choices[0].message.content });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "AI tailoring failed" });
  }
});

// -------------------- ATS ROUTES --------------------

app.post("/analyze-ats", async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    if (!resume || !jobDescription) {
      return res.status(400).json({ error: "Resume and job description are required." });
    }

    const result = await analyzeATS(resume, jobDescription);
    return res.json(result);

  } catch (err) {
    console.error("ATS text analysis error:", err);
    return res.status(500).json({ error: "ATS analysis failed." });
  }
});

app.post("/upload-resume-ats", upload.single("file"), async (req, res) => {
  try {
    const { file } = req;
    const { jobDescription } = req.body;

    if (!file || !jobDescription) {
      return res.status(400).json({ error: "File and job description are required." });
    }

    let extractedText = "";

    if (file.mimetype === "application/pdf") {
      const parser = new PDFParse({ data: file.buffer });
      const data = await parser.getText();
      extractedText = data.text || "";
      await parser.destroy();
    } else if (
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.originalname?.toLowerCase().endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value || "";
    } else {
      return res.status(400).json({ error: "Only PDF and DOCX files are supported." });
    }

    const atsResult = await analyzeATS(extractedText, jobDescription);

    return res.json({
      ...atsResult,
      extractedText,
    });

  } catch (err) {
    console.error("ATS file analysis error:", err);
    return res.status(500).json({ error: "File ATS failed." });
  }
});

app.post("/upload-resume-extract", upload.single("file"), async (req, res) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ error: "Resume file is required." });
    }

    let extractedText = "";

    if (file.mimetype === "application/pdf") {
      const parser = new PDFParse({ data: file.buffer });
      const data = await parser.getText();
      extractedText = data.text || "";
      await parser.destroy();
    } else if (
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.originalname?.toLowerCase().endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value || "";
    } else if (
      file.mimetype === "text/plain" ||
      file.originalname?.toLowerCase().endsWith(".txt")
    ) {
      extractedText = file.buffer.toString("utf-8");
    } else {
      return res.status(400).json({ error: "Only PDF, DOCX, and TXT files are supported." });
    }

    return res.json({ text: extractedText });

  } catch (err) {
    console.error("Resume extract error:", err);
    return res.status(500).json({ error: "Could not read resume file." });
  }
});

// -------------------- DB CONNECT --------------------
const SKIP_DB = process.env.SKIP_DB === "true";
const MONGO_URI = process.env.MONGO_URI || "";
function buildStandardUriFromSrv(srv) {
  try {
    const m = srv.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/?/i);
    if (!m) return null;
    const [, user, pass, host] = m;
    const parts = host.split(".");
    const clusterName = parts[0];
    const clusterId = parts[1];
    const hosts = [
      `${clusterName}-shard-00-00.${clusterId}.mongodb.net:27017`,
      `${clusterName}-shard-00-01.${clusterId}.mongodb.net:27017`,
      `${clusterName}-shard-00-02.${clusterId}.mongodb.net:27017`,
    ];
    const db = "byan_users";
    const replicaSet = clusterName.charAt(0).toUpperCase() + clusterName.slice(1); // e.g., Cluster0
    return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hosts.join(",")}/${db}?ssl=true&replicaSet=${replicaSet}&authSource=admin&retryWrites=true&w=majority`;
  } catch {
    return null;
  }
}
async function connectDbWithFallback() {
  if (SKIP_DB || !MONGO_URI) {
    console.log("⚠️ DB connection skipped");
    return;
  }
  try {
    await mongoose.connect(MONGO_URI, { dbName: "byan_users", serverSelectionTimeoutMS: 8000 });
    console.log("🚀 MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    if (MONGO_URI.startsWith("mongodb+srv://")) {
      const fallback = buildStandardUriFromSrv(MONGO_URI);
      if (fallback) {
        console.log("🔁 Trying non-SRV connection...");
        try {
          await mongoose.connect(fallback, { dbName: "byan_users", serverSelectionTimeoutMS: 8000 });
          console.log("🚀 MongoDB Connected via non-SRV connection");
          return;
        } catch (e2) {
          console.error("❌ Fallback connection failed:", e2);
        }
      }
    }
    console.log("ℹ️ Ensure Atlas IP whitelist allows this machine and DNS/SRV lookups are permitted.");
  }
}
connectDbWithFallback();

// -------------------- TEST ROUTE --------------------
app.get("/", (req, res) => {
  res.send("BYAN server running...");
});

// -------------------- SERVER START ------------------
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
