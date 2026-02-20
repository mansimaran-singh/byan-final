export interface PersonalInformation {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  professionalSummary?: string;
}

export interface Education {
  university: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  percentage?: string;
  description: string[];
}

export interface Experience {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Project {
  title: string;
  description: string[];
  link?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface Leadership {
  organization: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Research {
  title: string;
  journal?: string;
  date?: string;
  description: string[];
}

export interface ResumeFormData {
  personalInformation: PersonalInformation;
  education: Education[];
  experience: Experience[];
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  leadership: Leadership[];
  research: Research[];
}