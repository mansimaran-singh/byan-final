import { ResumeFormData } from "../pages/resume/types";

export function mapToResumeFormData(partialData: any): ResumeFormData {
  const defaultTemplate: ResumeFormData = {
    personalInformation: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
      professionalSummary: ""
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    leadership: [],
    research: []
  };

  return {
    ...defaultTemplate,
    ...partialData,
    personalInformation: {
      ...defaultTemplate.personalInformation,
      ...(partialData.personalInformation || {}),
      portfolio: (partialData.personalInformation?.portfolio || partialData.personalInformation?.website || "")
    },
    // Ensure arrays are actually arrays and have the correct structure
    education: Array.isArray(partialData.education) ? partialData.education : [],
    experience: Array.isArray(partialData.experience) ? partialData.experience : [],
    skills: Array.isArray(partialData.skills) ? partialData.skills : [],
    projects: Array.isArray(partialData.projects) ? partialData.projects : [],
    certifications: Array.isArray(partialData.certifications) ? partialData.certifications : [],
    leadership: Array.isArray(partialData.leadership) ? partialData.leadership : [],
    research: Array.isArray(partialData.research) ? partialData.research : []
  };
}
