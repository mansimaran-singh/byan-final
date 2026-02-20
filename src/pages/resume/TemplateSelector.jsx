import React from "react";

export default function TemplateSelector({ selectedTemplate, setTemplate }) {

  const templates = [
    "modern",
    "minimal",
    "elegant",
    "compact",
    "classic",
    "academic",
    "creative",
    "corporate",
    "gradient",
    "two-column"
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {templates.map(t => (
        <div
          key={t}
          onClick={() => setTemplate(t)}
          className={`border rounded-xl cursor-pointer p-3 text-center
            ${selectedTemplate === t ? "border-red-500 shadow-red-500 shadow-lg" : "border-gray-700"}
          `}
        >
          <div className="h-32 bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            {t.toUpperCase()} PREVIEW
          </div>

          <p className="mt-2 text-sm">{t}</p>
        </div>
      ))}
    </div>
  );
}
