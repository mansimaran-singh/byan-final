import OpenAI from "openai";
import { extractKeywords } from "./atsKeywords.js";
import { calculateScore } from "./atsScore.js";
import { generateSuggestions } from "./atsSuggestions.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const client = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

// Clean text helper
function clean(text) {
  return text?.toLowerCase().replace(/\s+/g, " ").trim();
}

export async function analyzeATS(resumeText, jdText) {
  try {
    const resume = clean(resumeText);
    const jd = clean(jdText);

    if (!resume || !jd) {
      return {
        score: 0,
        matched: [],
        missing: [],
        suggestions: ["Invalid resume or job description."],
      };
    }

    // Keyword extraction
    const resumeKeywords = [...new Set(extractKeywords(resume))];
    const jdKeywords = [...new Set(extractKeywords(jd))];

    // Matching
    const matched = jdKeywords.filter((kw) => resume.includes(kw));
    const missing = jdKeywords.filter((kw) => !resume.includes(kw));

    // Score
    const score = calculateScore(matched, missing);

    let suggestions = "No suggestions available.";

    if (client) {
      try {
        const gptResponse = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `
Resume:
${resumeText}

Job Description:
${jdText}

Give 6 short bullet-point suggestions on how to improve the resume for this job.
`,
            },
          ],
        });

        suggestions =
          gptResponse.choices?.[0]?.message?.content ||
          "No suggestions available.";
      } catch (err) {
        console.log("GPT error, using fallback.");
        suggestions = await generateSuggestions(resumeText, jdText, matched, missing, score);
      }
    } else {
      suggestions = await generateSuggestions(resumeText, jdText, matched, missing, score);
    }

    return {
      score,
      matched,
      missing,
      suggestions,
    };
  } catch (err) {
    console.error("ATS ENGINE ERROR:", err);
    return {
      score: 0,
      matched: [],
      missing: [],
      suggestions: "Something went wrong.",
    };
  }
}
