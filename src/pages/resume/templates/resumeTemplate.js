export default function resumeTemplate(data) {
  return `
  <div style="font-family: 'Arial', sans-serif; padding: 20px;">

    <!-- HEADER -->
    <div style="padding-bottom: 12px; border-bottom: 2px solid #333; margin-bottom: 20px;">
      <h1 style="font-size: 28px; margin-bottom: 5px;">${data.personal.name || ""}</h1>
      <p style="margin: 0; font-size: 14px;">
        ${data.personal.location || ""} • ${data.personal.phone || ""} • ${data.personal.email || ""}
      </p>
      <p style="margin: 0; font-size: 14px;">
        ${data.personal.linkedin || ""} • ${data.personal.github || ""} • ${data.personal.portfolio || ""}
      </p>
    </div>

    ${block("EDUCATION", data.education)}
    ${block("EXPERIENCE", data.experience)}
    ${block("LEADERSHIP", data.leadership)}
    ${block("PROJECTS", data.projects)}
    ${block("RESEARCH", data.research)}
    ${block("CERTIFICATIONS", data.certifications)}

    <!-- SKILLS -->
    <h2 style="margin-top: 25px; font-size: 20px;">SKILLS</h2>
    ${data.skills
      .map(
        (s) =>
          `<p style="margin: 4px 0;"><strong>${s.title}:</strong> ${s.desc}</p>`
      )
      .join("")}

  </div>
`;
}

function block(title, items) {
  if (!items || items.length === 0) return "";
  return `
    <h2 style="margin-top: 25px; font-size: 20px;">${title}</h2>
    ${items
      .map(
        (i) => `
      <div style="margin-bottom: 12px;">
        <strong style="font-size: 16px;">${i.title || ""}</strong><br/>
        <span>${i.desc || ""}</span>
      </div>
    `
      )
      .join("")}
  `;
}
