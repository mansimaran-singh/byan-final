import { ResumeFormData } from "./types";

export const defaultResumeData: ResumeFormData = {
  personalInformation: {
    fullName: "Alex Chen",
    email: "alex.chen@example.com",
    phone: "+1 (555) 012-3456",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexc",
    github: "github.com/alexc",
    portfolio: "alexchen.dev",
    professionalSummary:
      "Full-stack developer with 5 years of experience building scalable web applications. Passionate about React, Node.js, and cloud architecture."
  },
  experience: [
    {
      title: "Senior Developer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "2021-01",
      endDate: "Present",
      description: [
        "Led development of core platform features. Improved performance by 40%.",
        "Mentored junior developers and conducted code reviews."
      ]
    },
    {
      title: "Software Engineer",
      company: "StartUp Inc",
      location: "San Francisco, CA",
      startDate: "2018-06",
      endDate: "2020-12",
      description: [
        "Built MVP from scratch using React and Python.",
        "Implemented RESTful APIs and integrated third-party services."
      ]
    }
  ],
  education: [
    {
      university: "University of Technology",
      degree: "BS Computer Science",
      location: "San Francisco, CA",
      startDate: "2014",
      endDate: "2018",
      description: ["Graduated with honors."]
    }
  ],
  skills: [
    { category: "Programming Languages", items: ["JavaScript", "TypeScript", "Python", "Java"] },
    { category: "Frameworks & Libraries", items: ["React", "Node.js", "Express", "Spring Boot"] },
    { category: "Cloud & DevOps", items: ["AWS", "Docker", "Kubernetes", "CI/CD"] },
    { category: "Databases", items: ["PostgreSQL", "MongoDB", "MySQL"] }
  ],
  projects: [
    {
      title: "Career Canvas",
      description: [
        "Dynamic resume builder with live preview and templating.",
        "DOCX/PDF export and ATS keyword analysis."
      ],
      link: "alexchen.dev/career-canvas"
    }
  ],
  certifications: [
    { name: "AWS Certified Developer", issuer: "Amazon", date: "2023" }
  ],
  leadership: [
    { organization: "Tech Corp", title: "Tech Lead", startDate: "2022", endDate: "2024", description: ["Led a team of 6 engineers."] }
  ],
  research: []
};
