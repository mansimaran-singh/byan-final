import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export const generateDOCX = async (formData, templateName = "resume") => {
  const sections = [];
  const personal = formData.personalInformation || {};

  const addTitle = (title) => {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: title, bold: true, size: 28 }),
        ],
        spacing: { after: 200 },
      })
    );
  };

  const addEntry = (label, value) => {
    if (!value) return;
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: label + ": ", bold: true }),
          new TextRun({ text: value }),
        ],
        spacing: { after: 150 },
      })
    );
  };

  addTitle("Personal Information");
  addEntry("Name", personal.fullName);
  addEntry("Email", personal.email);
  addEntry("Phone", personal.phone);
  addEntry("LinkedIn", personal.linkedin);
  addEntry("GitHub", personal.github);
  addEntry("Portfolio", personal.portfolio);

  const addGroup = (title, items) => {
    if (!items?.length) return;
    addTitle(title);
    items.forEach((i) => {
      addEntry(i.title || i.company || i.university, i.desc || (i.description ? i.description.join(", ") : ""));
    });
  };

  addGroup("Education", formData.education);
  addGroup("Experience", formData.experience);
  addGroup("Projects", formData.projects);
  addGroup("Certifications", formData.certifications);

  if (formData.skills?.length) {
    addTitle("Skills");
    formData.skills.forEach(s => {
      addEntry(s.category, s.items?.join(", "));
    });
  }

  const doc = new Document({ sections: [{ children: sections }] });

  const buffer = await Packer.toBlob(doc);
  saveAs(buffer, `${templateName}.docx`);
};