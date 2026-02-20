import { ResumeFormData } from "./types";
import { defaultResumeData } from "./defaultResumeData";

const base: ResumeFormData = defaultResumeData;

const templateDefaults: Record<string, ResumeFormData> = {
  "modern": base,
  "minimal": base,
  "elegant": base,
  "professional": base,
  "creative": base,
  "compact-ats": base,
  "classic-professional": base,
  "modern-professional": base
};

export function getDefaultResumeDataForTemplate(templateId: string | null): ResumeFormData {
  if (!templateId) return base;
  return templateDefaults[templateId] || base;
}
