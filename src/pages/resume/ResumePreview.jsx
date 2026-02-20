import React from "react";
import Modern from "./templates/Modern.tsx";
import Minimal from "./templates/Minimal.tsx";
import Elegant from "./templates/Elegant.tsx";
import Professional from "./templates/Professional.tsx";
import Creative from "./templates/Creative.tsx";
import CompactATS from "./templates/CompactATS.tsx";
import ClassicProfessional from "./templates/ClassicProfessional.tsx";
import ModernProfessional from "./templates/ModernProfessional.tsx";

export default function ResumePreview({ template, formData, resumeRef }) {
  // Ensure the data structure matches what the TSX templates expect
  // Crucially passing 'hasData' so templates know when to stop showing placeholders
  const safeData = {
    hasData: formData.hasData || false,
    personalInformation: formData.personalInformation || {},
    education: formData.education || [],
    experience: formData.experience || [],
    skills: formData.skills || [],
    projects: formData.projects || [],
    certifications: formData.certifications || [],
    leadership: formData.leadership || [],
    research: formData.research || [],
    summary: formData.personalInformation?.professionalSummary || ""
  };

  const renderTemplate = () => {
    const props = { data: safeData, formData: safeData }; // Support both naming conventions used in templates
    
    switch (template) {
      case "modern":
        return <Modern {...props} />;
      case "minimal":
        return <Minimal {...props} />;
      case "elegant":
        return <Elegant {...props} />;
      case "professional":
        return <Professional {...props} />;
      case "creative":
        return <Creative {...props} />;
      case "compact-ats":
        return <CompactATS {...props} />;
      case "classic-professional":
        return <ClassicProfessional {...props} />;
      case "modern-professional":
        return <ModernProfessional {...props} />;
      default:
        return <Modern {...props} />;
    }
  };

  return (
    <div
      ref={resumeRef}
      className="bg-white text-black w-full min-h-[1122px] shadow-inner"
    >
      {renderTemplate()}
    </div>
  );
}