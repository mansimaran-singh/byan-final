import { ResumeFormData } from "../pages/resume/types";

const SECTION_HEADERS = {
  experience: [/experience/i, /employment/i, /work history/i, /professional background/i],
  education: [/education/i, /academic/i, /university/i, /college/i],
  skills: [/skills/i, /technologies/i, /competencies/i, /expertise/i],
  projects: [/projects/i, /personal projects/i, /technical projects/i],
  certifications: [/certifications/i, /licenses/i, /awards/i],
  leadership: [/leadership/i, /volunteer/i, /extracurricular/i],
  research: [/research/i, /publications/i]
};

export function extractResumeData(rawText: string): Partial<ResumeFormData> {
  const promoted = rawText
    .replace(/\s{2,}/g, " ")
    .replace(/\b(EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|LEADERSHIP|RESEARCH|SUMMARY|ACHIEVEMENTS)\b/gi, "\n$1\n")
    .replace(/([•\-]\s+)/g, "\n$1") // bullets
    .replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g, "\n$1\n") // email
    .replace(/\b(20\d{2}|19\d{2})\b/g, "\n$1\n"); // years

  const lines = promoted
    .split(/[\n\r]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const result: any = {
    personalInformation: { fullName: "", email: "", phone: "", professionalSummary: "" },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    leadership: [],
    research: []
  };

  const emailMatch = promoted.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  const phoneMatch = promoted.match(/(\+?\d{1,4}[\s-]?)?\d{10,12}|\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/g);
  const linkedinMatch = promoted.match(/(linkedin\.com\/[^\s]+)/i);
  const githubMatch = promoted.match(/(github\.com\/[^\s]+)/i);
  const websiteCandidates = Array.from(promoted.matchAll(/\b((?:https?:\/\/)?(?:[a-z0-9-]+\.)+(?:com|org|net|io|dev|app|ai|co|in|us|uk|tech)(?:\/\S*)?)\b/gi)).map(m => m[1]);
  const websiteMatch = websiteCandidates.find(w => !/\b(B\.?Tech|M\.?Tech)\b/i.test(w));
  result.personalInformation.email = emailMatch ? emailMatch[0] : "";
  result.personalInformation.phone = phoneMatch ? phoneMatch[0] : "";
  if (linkedinMatch) result.personalInformation.linkedin = linkedinMatch[0];
  if (githubMatch) result.personalInformation.github = githubMatch[0];
  if (websiteMatch) result.personalInformation.portfolio = websiteMatch[0];

  const YEAR_ONLY = /^\d{4}$/;
  const MONTH_YEAR = /^(0?[1-9]|1[0-2])[\/\-\.\s](\d{2,4})$/;
  const DEGREE_WORD = /\b(B\.?Tech|M\.?Tech|B\.?Sc|M\.?Sc|Bachelor|Master|BS|MS)\b/i;

  let currentSection: string | null = null;
  let currentEntry: any = null;

  lines.forEach((line, index) => {
    let foundHeader = false;
    for (const [section, patterns] of Object.entries(SECTION_HEADERS)) {
      if (patterns.some(p => p.test(line)) && line.length < 30) {
        currentSection = section;
        foundHeader = true;
        if (currentEntry && result[currentSection]) {
          result[currentSection].push(currentEntry);
          currentEntry = null;
        }
        break;
      }
    }

    if (foundHeader) return;

    if (!currentSection) {
      if (index === 0 && line.length < 60) {
        result.personalInformation.fullName = line;
      } else if (result.personalInformation.professionalSummary.length < 600 && !/@|(\d{3}[\s-]?\d{3}[\s-]?\d{4})/.test(line)) {
        const sentence = line.replace(/^\s*[-•]+\s*/, "");
        result.personalInformation.professionalSummary += (sentence + " ").trim();
      }
      return;
    }

    switch (currentSection) {
      case "experience":
        if (YEAR_ONLY.test(line) || MONTH_YEAR.test(line) || /present/i.test(line)) {
          if (currentEntry) {
            if (!currentEntry.startDate) currentEntry.startDate = line;
            else currentEntry.endDate = line;
          }
        } else if (line.length < 80 && !/^[-•*]/.test(line)) {
          const atIdx = line.toLowerCase().indexOf(" at ");
          const isTitle = atIdx > -1 ? line.slice(0, atIdx).trim() : line.trim();
          const company = atIdx > -1 ? line.slice(atIdx + 4).trim() : "Company Name";
          if (currentEntry) result.experience.push(currentEntry);
          currentEntry = { title: isTitle, company, location: "", startDate: "", endDate: "", description: [] };
        } else if (currentEntry) {
          currentEntry.description.push(line.replace(/^[-•*]\s*/, ""));
        }
        break;

      case "education":
        if (YEAR_ONLY.test(line) || MONTH_YEAR.test(line)) {
          const lastEdu = result.education[result.education.length - 1];
          if (lastEdu) {
            if (!lastEdu.startDate) lastEdu.startDate = line;
            else lastEdu.endDate = line;
          }
        } else if (line.length < 160) {
          const degMatch = line.match(DEGREE_WORD);
          if (degMatch) {
            const degree = degMatch[0];
            const parts = line.split(/in\s+/i);
            const university = parts.length > 1 ? parts[1] : line;
            result.education.push({ university: university.replace(/[,;]\s*$/,""), degree, location: "", startDate: "", endDate: "", description: [] });
          } else {
            result.education.push({ university: line.replace(/[,;]\s*$/,""), degree: "Degree", location: "", startDate: "", endDate: "", description: [] });
          }
        }
        break;

      case "skills":
        const parts = line.split(/[:,|•]/).map(s => s.trim()).filter(s => s.length > 1);
        if (parts.length > 1) {
          result.skills.push({ category: parts[0], items: parts.slice(1) });
        } else if (line.length < 30) {
          result.skills.push({ category: "Technical", items: [line] });
        }
        break;

      case "projects":
        if (line.length < 80 && !/^[-•*]/.test(line)) {
          if (currentEntry) result.projects.push(currentEntry);
          currentEntry = { title: line, description: [] };
        } else if (currentEntry) {
          currentEntry.description.push(line.replace(/^[-•*]\s*/, ""));
        }
        break;
    }
  });

  if (currentEntry && currentSection && result[currentSection]) {
    result[currentSection].push(currentEntry);
  }

  if (result.skills.length > 1) {
    const merged = new Map<string, string[]>();
    result.skills.forEach((sc: any) => {
      const key = sc.category || "Technical";
      const items = (merged.get(key) || []).concat(sc.items || []);
      merged.set(key, Array.from(new Set(items)));
    });
    result.skills = Array.from(merged.entries()).map(([category, items]) => ({ category, items }));
  }

  return result;
}
