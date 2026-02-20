export default function cvTemplate(data) {
  return `
  <div style="font-family: 'Arial', sans-serif; padding: 20px;">

    <!-- HEADER -->
    <div style="border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
      <h1 style="font-size: 30px; margin: 0;">${data.personal.name || ""}</h1>
      <p style="margin: 2px 0; font-size: 14px;">
        ${data.personal.location || ""} • ${data.personal.phone || ""} • ${data.personal.email || ""}
      </p>
      <p style="margin: 2px 0; font-size: 14px;">
        ${data.personal.linkedin || ""} • ${data.personal.github || ""} • ${data.personal.portfolio || ""}
      </p>
    </div>

    <!-- SECTION GENERATOR -->
    ${section("EDUCATION", data.education)}
    ${section("EXPERIENCE", data.experience)}
    ${section("LEADERSHIP & ROLES", data.leadership)}
    ${section("PROJECTS", data.projects)}
    ${section("RESEARCH", data.research)}
    ${section("CERTIFICATIONS", data.certifications)}

    <!-- SKILLS -->
    <h2 style="margin-top: 25px; font-size: 20px;">SKILLS</h2>
    <ul style="margin: 0; padding-left: 18px;">
      ${data.skills
        .map(
          (s) => `<li><strong>${s.title}:</strong> ${s.desc}</li>`
        )
        .join("")}
    </ul>

  </div>
`;
}

function section(title, items) {
  if (!items || items.length === 0) return "";
  return `
    <h2 style="margin-top: 25px; font-size: 20px;">${title}</h2>
    <ul style="margin: 0; padding-left: 18px;">
      ${items
        .map(
          (i) => `
        <li style="margin-bottom: 8px;">
          <strong>${i.title || ""}</strong><br/>
          <span>${i.desc || ""}</span>
        </li>
      `
        )
        .join("")}
    </ul>
  `;
}
