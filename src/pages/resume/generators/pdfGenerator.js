import jsPDF from "jspdf";

export const generatePDF = (formData, templateName = "resume") => {
  const doc = new jsPDF();
  let y = 10;

  const addTitle = (title) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 10, y);
    y += 8;
  };

  const addEntry = (label, value) => {
    if (!value) return;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(label, 10, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value, 180);
    doc.text(lines, 10, y);
    y += lines.length * 6 + 4;
  };

  // PERSONAL
  addTitle(formData.personal.name);
  addEntry("Contact", `${formData.personal.location} | ${formData.personal.phone} | ${formData.personal.email}`);
  addEntry("Links", `${formData.personal.linkedin} | ${formData.personal.github} | ${formData.personal.portfolio}`);

  const sections = [
    ["EDUCATION", formData.education],
    ["EXPERIENCE", formData.experience],
    ["ROLES & LEADERSHIP", formData.leadership],
    ["PROJECTS", formData.projects],
    ["RESEARCH", formData.research],
    ["CERTIFICATIONS", formData.certifications],
  ];

  sections.forEach(([title, items]) => {
    if (!items.length) return;
    addTitle(title);
    items.forEach((x) => addEntry(x.title, x.desc));
  });

  if (formData.skills.length) {
    addTitle("SKILLS");
    formData.skills.forEach((s) => addEntry(s.title, s.desc));
  }

  doc.save(`${templateName}.pdf`);
};
