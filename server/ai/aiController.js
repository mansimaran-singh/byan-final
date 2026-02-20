import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const rewriteText = async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({ text: completion.choices[0].message.content });
  } catch (err) {
    console.error("AI Rewrite Error", err);
    res.status(500).json({ error: "AI rewrite failed" });
  }
};
