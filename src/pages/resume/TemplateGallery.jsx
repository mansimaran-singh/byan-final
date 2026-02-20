import React from "react";
import { motion } from "framer-motion";

export default function TemplateGallery({ openTemplate }) {
  const templates = [
    { id: "modern", name: "Modern Resume" },
    { id: "minimal", name: "Minimal Resume" },
    { id: "elegant", name: "Elegant Resume" },
    { id: "classic", name: "Classic Resume" },
    { id: "professional", name: "Professional Resume" },
    { id: "creative", name: "Creative Resume" },
    { id: "corporate", name: "Corporate Resume" },
    { id: "simple", name: "Simple Resume" },
    { id: "bold", name: "Bold Resume" },
    { id: "compact", name: "Compact Resume" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Choose Your Resume Template</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {templates.map(t => (
          <motion.div whileHover={{ scale: 1.03 }} key={t.id}
            className="border border-gray-700 rounded-lg p-4 cursor-pointer bg-black"
            onClick={() => openTemplate(t.id)}
          >
            <div className="h-44 bg-gray-900 rounded mb-3 flex items-center justify-center text-gray-400">
              [ Preview Image Placeholder ]
            </div>

            <p className="text-center">{t.name}</p>
          </motion.div>
        ))}

      </div>
    </div>
  );
}
