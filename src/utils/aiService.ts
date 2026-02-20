import { ResumeFormData, SkillCategory, Experience } from "../pages/resume/types";
import { extractResumeData } from "./resumeDataExtractor";

const STOP_WORDS = new Set([
  "the","and","for","with","from","that","this","have","has","are","was","were","to","of","in","on",
  "a","an","as","by","at","or","it","be","is","your","their","our","my","we"
]);

function processText(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
  );
}

export async function callAITailoringService(
  resumeText: string,
  jobDescription: string,
  mode: "critique" | "tailor"
): Promise<string | Partial<ResumeFormData>> {
  await new Promise((r) => setTimeout(r, 500));

  if (mode === "critique") {
    return [
      "AI Critique for your resume:",
      "",
      "Overall: Good structure; can be more targeted to the JD.",
      "Strengths:",
      "- Clear experience section.",
      "- Quantifiable achievements present.",
      "Areas for Improvement:",
      "- Professional Summary: tailor to JD keywords.",
      "- Experience Bullets: strengthen action verbs; align wording with JD.",
      "- Missing Keywords: consider adding skills directly from JD where applicable."
    ].join("\n");
  }

  const extracted = extractResumeData(resumeText);
  const jdKeywords = Array.from(processText(jobDescription)).slice(0, 3);

  const tailoredExperience: Experience[] = (extracted.experience || []).map((exp) => {
    const first = exp.description?.[0] || "delivered measurable outcomes";
    const k0 = jdKeywords[0] || "key technologies";
    const k1 = jdKeywords[1] || "advanced methodologies";
    return {
      ...exp,
      description: [
        `Spearheaded initiatives to ${first.toLowerCase().replace(/^[\\s•\\-]+/, "")}, leveraging ${k0}.`,
        ...(exp.description?.slice(1) || []),
        `Optimized processes using ${k1}, improving efficiency.`
      ].filter(Boolean)
    };
  });

  const tailoredSkills: SkillCategory[] = (extracted.skills || []).map((sc) => {
    const added = jdKeywords.filter((k) => !sc.items.includes(k));
    return { ...sc, items: [...sc.items, ...added] };
  });
  if (tailoredSkills.length === 0 && jdKeywords.length) {
    tailoredSkills.push({ category: "Job-Specific Keywords", items: jdKeywords });
  }

  const summaryBase = extracted.personalInformation?.professionalSummary || "professional";
  const tailored: Partial<ResumeFormData> = {
    personalInformation: {
      ...extracted.personalInformation,
      professionalSummary: `Highly motivated ${summaryBase} with expertise in ${jdKeywords.join(", ")}. Seeking to leverage skills at a high-impact team.`
    },
    experience: tailoredExperience,
    skills: tailoredSkills,
    education: extracted.education,
    projects: extracted.projects,
    certifications: extracted.certifications,
    leadership: extracted.leadership,
    research: extracted.research
  };

  return tailored;
}

export async function simulateAIResumeMapping(rawText: string): Promise<Partial<ResumeFormData>> {
  await new Promise((r) => setTimeout(r, 300));
  const extracted = extractResumeData(rawText);
  return extracted;
}
