import React from "react";

export default function ProfessionalTemplate({ data }) {
  return (
    <div className="flex h-full w-full bg-white text-gray-800 font-sans" style={{ minHeight: "297mm" }}>
      
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gray-900 text-white p-8">
        <div className="mb-8">
            {data.personal.name && (
              <h1 className="text-3xl font-bold leading-tight mb-4">{data.personal.name}</h1>
            )}
            <div className="text-sm text-gray-300 space-y-3">
                {data.personal.email && <div className="break-words flex items-center gap-2"><span>📧</span> {data.personal.email}</div>}
                {data.personal.phone && <div className="flex items-center gap-2"><span>📱</span> {data.personal.phone}</div>}
                {data.personal.location && <div className="flex items-center gap-2"><span>📍</span> {data.personal.location}</div>}
                {data.personal.linkedin && <div className="break-words flex items-center gap-2"><span>🔗</span> LinkedIn</div>}
                {data.personal.portfolio && <div className="break-words flex items-center gap-2"><span>🌐</span> Portfolio</div>}
            </div>
        </div>

        {/* Skills */}
        {data.skills?.length > 0 && (
            <div className="mb-8">
                <h3 className="text-lg font-bold border-b border-gray-600 pb-2 mb-4 uppercase tracking-wider text-gray-100">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                        <span key={i} className="bg-gray-700 px-2 py-1 rounded text-xs text-white">{skill.title}</span>
                    ))}
                </div>
            </div>
        )}

        {/* Education (Sidebar) */}
        {data.education?.length > 0 && (
            <div className="mb-8">
                <h3 className="text-lg font-bold border-b border-gray-600 pb-2 mb-4 uppercase tracking-wider text-gray-100">Education</h3>
                <div className="space-y-4">
                    {data.education.map((edu, i) => (
                        <div key={i}>
                            <div className="font-bold text-white">{edu.title}</div>
                            <div className="text-xs text-gray-400 mt-1 italic">{edu.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-10">
        
        {(data.summary) && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide">Profile</h3>
            <p className="text-gray-700 leading-relaxed text-left text-sm break-words">
              {data.summary}
            </p>
          </div>
        )}

        {(data.experience?.length > 0) && (
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide">Experience</h3>
                <div className="space-y-6">
                    {data.experience.map((exp, i) => (
                        <div key={i}>
                            <h4 className="font-bold text-lg text-gray-900">{exp.title}</h4>
                            <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap leading-relaxed text-left break-words">{exp.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {(data.projects?.length > 0) && (
            <div>
                <h3 className="text-xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4 uppercase tracking-wide">Projects</h3>
                <div className="space-y-4">
                    {data.projects.map((proj, i) => (
                        <div key={i}>
                            <h4 className="font-bold text-md text-gray-900">{proj.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 text-left break-words">{proj.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>

    </div>
  );
}
