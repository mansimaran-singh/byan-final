export async function generateSuggestions(resume, jd, matched, missing, score) {
  try {
    const topMatched = matched.slice(0, 8);
    const topMissing = missing.slice(0, 8);

    let text = "";

    if (score >= 80) {
      text += `Great alignment with the job description (approx. ${score}/100).\n`;
    } else if (score >= 60) {
      text += `Good baseline match (approx. ${score}/100) with room to strengthen specific skills.\n`;
    } else {
      text += `Current match is on the lower side (approx. ${score}/100). Consider tightening the resume against the JD.\n`;
    }

    if (topMatched.length) {
      text += `\nAlready covered well:\n- ${topMatched.join("\n- ")}\n`;
    }

    if (topMissing.length) {
      text += `\nConsider weaving these keywords into your bullets where they are genuinely true:\n- ${topMissing.join("\n- ")}\n`;
    }

    text += `\nMake sure your strongest projects and experiences directly mirror the language of the job description, especially in the first half of the resume.`;

    return text;
  } catch (err) {
    console.error("Suggestion generator error:", err);
    return "Error generating suggestions.";
  }
}
