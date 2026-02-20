import React from "react";
import { ResumeFormData } from "../types";

interface ModernProfessionalProps {
  formData: ResumeFormData;
}

const ModernProfessional: React.FC<ModernProfessionalProps> = ({ formData }) => {
  const { personalInformation, experience, education, skills, projects, certifications, leadership, research } =
    formData;

  return (
    <div className="font-sans text-gray-900 p-8 bg-card shadow-lg min-h-full">
      {/* Personal Information */}
      <div className="text-center mb-6 pb-4 border-b border-primary">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {personalInformation.fullName}
        </h1>
        <div className="flex flex-wrap justify-center items-center text-sm text-gray-900 gap-x-4 gap-y-1 mt-2">
          {personalInformation.location && (
            <span className="flex items-center">
              {personalInformation.location}
            </span>
          )}
          {personalInformation.phone && (
            <span className="flex items-center">
              P: {personalInformation.phone}
            </span>
          )}
          {personalInformation.email && (
            <span className="flex items-center">
              {personalInformation.email}
            </span>
          )}
          {personalInformation.linkedin && (
            <span className="flex items-center">
              LinkedIn:{" "}
              <a
                href={`https://${personalInformation.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                {personalInformation.linkedin}
              </a>
            </span>
          )}
          {personalInformation.github && (
            <span className="flex items-center">
              GitHub:{" "}
              <a
                href={`https://${personalInformation.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                {personalInformation.github}
              </a>
            </span>
          )}
        </div>
      </div>

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-primary pb-1">
            EDUCATION
          </h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-lg text-gray-900">
                  {edu.university}
                  {edu.location && <span className="font-normal text-gray-900">, {edu.location}</span>}
                </h3>
                <span className="text-sm text-gray-900">
                  {edu.startDate}–{edu.endDate}
                </span>
              </div>
              <p className="text-md text-gray-900 mb-1">
                {edu.degree}
                {edu.gpa && <span className="ml-2">| GPA: {edu.gpa}</span>}
                {edu.percentage && <span className="ml-2">| Percentage: {edu.percentage}</span>}
              </p>
              {edu.description && edu.description.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-900 space-y-0.5">
                  {edu.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-primary pb-1">
            EXPERIENCE
          </h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-lg text-gray-900">
                  {exp.company} – {exp.title}
                </h3>
                <span className="text-sm text-gray-900">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-900 mb-1">{exp.location}</p>
              <ul className="list-disc list-inside text-sm text-gray-900 space-y-0.5">
                {exp.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Roles & Leadership */}
      {leadership.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-primary pb-1">
            ROLES & LEADERSHIP
          </h2>
          {leadership.map((lead, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-lg text-gray-900">
                  {lead.organization} – {lead.title}
                </h3>
                <span className="text-sm text-gray-900">
                  {lead.startDate} – {lead.endDate}
                </span>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-900 space-y-0.5">
                {lead.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-primary pb-1">
            PROJECTS
          </h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-lg text-gray-900">
                {project.title}
                {project.link && (
                  <span className="ml-2 text-gray-900 text-sm font-normal">
                    (<a href={`https://${project.link}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{project.link}</a>)
                  </span>
                )}
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-900 space-y-0.5">
                {project.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Research */}
      {research.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-primary pb-1">
            RESEARCH
          </h2>
          {research.map((res, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-lg text-gray-900">
                {res.title}
                {(res.journal || res.date) && (
                  <span className="ml-2 text-gray-900 text-sm font-normal">
                    ({res.journal}{res.journal && res.date && ", "}{res.date})
                  </span>
                )}
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-900 space-y-0.5">
                {res.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-primary pb-1">
            CERTIFICATIONS
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-900 space-y-1">
            {certifications.map((cert, index) => (
              <li key={index}>
                <span className="font-semibold text-gray-900">{cert.name}</span> by {cert.issuer} ({cert.date})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-primary pb-1">
            SKILLS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-900">
            {skills.map((skillCategory, index) => (
              <div key={index}>
                <span className="font-semibold text-gray-900">
                  {skillCategory.category}:{" "}
                </span>
                {skillCategory.items.join(", ")}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernProfessional;