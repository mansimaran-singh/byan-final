import React from "react";

export default function ModernTemplate({ data }) {
  const bulletLines = (text) =>
    text
      ? text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean)
      : [];

  const SectionTitle = ({ children }) => (
    <div className="mt-6">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold tracking-wide text-gray-900">
          {children}
        </h2>
      </div>
      <div className="mt-1 h-px bg-red-500" />
    </div>
  );

  const hasAnyPersonal =
    data.personal.name ||
    data.personal.email ||
    data.personal.phone ||
    data.personal.location ||
    data.personal.linkedin ||
    data.personal.github ||
    data.personal.portfolio;

  const isCompletelyEmpty = !data.hasData && !hasAnyPersonal;

  const sampleData = {
    personal: {
      name: "Alex Chen",
      location: "San Francisco, CA",
      phone: "+1 555 123 4567",
      email: "alex.chen@example.com",
      linkedin: "linkedin.com/in/alexchen",
      github: "github.com/alexchen",
      portfolio: "alexchen.dev",
    },
    summary:
      "Software Engineer with 3+ years of experience building scalable web applications, specializing in React, Node.js, and cloud-native architectures.",
    experience: [
      {
        title: "Software Engineer · TechCorp",
        desc: `Built and maintained React-based dashboards used by 5,000+ monthly users.
Improved API performance by 30% by optimizing queries and caching responses.
Collaborated with designers and PMs to ship features in 2-week sprints.`,
      },
      {
        title: "Frontend Developer · StartupX",
        desc: `Implemented responsive UI components in React and Tailwind CSS.
Integrated REST APIs and improved error handling and loading states.
Worked closely with founders to rapidly prototype new ideas.`,
      },
    ],
    education: [
      {
        title: "B.Tech in Computer Science · ABC University",
        desc: "2018 – 2022 · GPA: 8.5/10",
      },
    ],
    projects: [
      {
        title: "Personal Portfolio Website",
        desc: `Built a responsive portfolio using React and Tailwind CSS.
Integrated contact form and project gallery with smooth animations.`,
      },
    ],
    skills: [
      { title: "Languages", desc: "JavaScript, TypeScript, Python" },
      { title: "Frontend", desc: "React, Next.js, Tailwind CSS" },
      { title: "Backend", desc: "Node.js, Express, MongoDB" },
      { title: "Tools", desc: "Git, Docker, AWS (basic)" },
    ],
  };

  const displayData = isCompletelyEmpty
    ? {
        ...data,
        ...sampleData,
        personal: { ...sampleData.personal, ...data.personal },
      }
    : data;

  const contactsLine = [
    displayData.personal.location,
    displayData.personal.phone,
    displayData.personal.email,
  ]
    .filter(Boolean)
    .join("  •  ");

  const linksLine = [
    displayData.personal.linkedin &&
      `LinkedIn: ${displayData.personal.linkedin}`,
    displayData.personal.github && `GitHub: ${displayData.personal.github}`,
    displayData.personal.portfolio && displayData.personal.portfolio,
  ]
    .filter(Boolean)
    .join("    ");

  return (
    <div className="max-w-[800px] mx-auto border border-gray-200 shadow-sm rounded-lg overflow-hidden bg-white text-gray-900 text-sm leading-relaxed">
      <div className="h-1 bg-red-500" />

      <div className="px-8 pt-6 pb-8">
        {displayData.personal.name && (
          <h1 className="text-2xl font-bold text-gray-900">
            {displayData.personal.name}
          </h1>
        )}

        {displayData.summary && (
          <p className="mt-1 text-sm text-gray-800">
            {displayData.summary}
          </p>
        )}

        {contactsLine && (
          <p className="mt-3 text-xs text-gray-700">
            {contactsLine}
          </p>
        )}

        {linksLine && (
          <p className="mt-1 text-xs text-red-500">
            {linksLine}
          </p>
        )}

        {displayData.experience.length > 0 && (
          <>
            <SectionTitle>EXPERIENCE</SectionTitle>
            <div className="mt-3 space-y-4">
              {displayData.experience.map((exp, i) => {
                const lines = bulletLines(exp.desc);
                return (
                  <div key={i}>
                    <div className="font-semibold text-gray-900">
                      {exp.title}
                    </div>
                    {lines.length > 0 && (
                      <ul className="mt-1 ml-5 list-disc space-y-1 text-gray-800">
                        {lines.map((line, j) => (
                          <li key={j}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {displayData.education.length > 0 && (
          <>
            <SectionTitle>EDUCATION</SectionTitle>
            <div className="mt-3 space-y-1">
              {displayData.education.map((edu, i) => (
                <div key={i}>
                  <div className="font-semibold text-gray-900">
                    {edu.title}
                  </div>
                  {edu.desc && (
                    <p className="text-gray-800">{edu.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {displayData.skills.length > 0 && (
          <>
            <SectionTitle>SKILLS</SectionTitle>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              {displayData.skills.map((s, i) => (
                <div key={i} className="text-gray-800">
                  <span className="font-semibold">{s.title}: </span>
                  <span>{s.desc}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {displayData.projects.length > 0 && (
          <>
            <SectionTitle>PROJECTS</SectionTitle>
            <div className="mt-3 space-y-3">
              {displayData.projects.map((proj, i) => {
                const lines = bulletLines(proj.desc);
                return (
                  <div key={i}>
                    <div className="font-semibold text-gray-900">
                      {proj.title}
                    </div>
                    {lines.length > 0 && (
                      <ul className="mt-1 ml-5 list-disc space-y-1 text-gray-800">
                        {lines.map((line, j) => (
                          <li key={j}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
