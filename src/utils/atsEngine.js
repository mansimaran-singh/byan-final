// Comprehensive client-side ATS engine with expanded keyword library
export function extractKeywords(text) {
  if (!text) return [];
  text = text.toLowerCase();
  
  const skills = [
    // Programming & Web
    "python", "javascript", "typescript", "java", "c++", "c#", "ruby", "php", "go", "rust", "swift", "kotlin",
    "react", "angular", "vue", "next.js", "nuxt.js", "svelte", "node.js", "express", "django", "flask", "spring",
    "html", "css", "tailwind", "bootstrap", "sass", "less", "graphql", "rest api", "redux", "context api",
    
    // Data & AI
    "machine learning", "deep learning", "artificial intelligence", "ai", "data science", "data analysis",
    "statistics", "probability", "nlp", "computer vision", "tensorflow", "pytorch", "keras", "scikit-learn",
    "pandas", "numpy", "matplotlib", "seaborn", "sql", "mysql", "postgresql", "mongodb", "redis", "cassandra",
    "big data", "hadoop", "spark", "tableau", "power bi", "excel", "r programming",
    
    // DevOps & Cloud
    "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "jenkins", "ci/cd", "terraform", "ansible",
    "linux", "unix", "bash", "shell scripting", "git", "github", "gitlab", "bitbucket", "firebase", "netlify",
    
    // Design & Product
    "ui/ux", "figma", "adobe xd", "photoshop", "illustrator", "product management", "agile", "scrum", "kanban",
    "wireframing", "prototyping", "user research", "user testing",
    
    // Soft Skills & Professional
    "communication", "leadership", "teamwork", "problem solving", "critical thinking", "time management",
    "project management", "public speaking", "mentoring", "collaboration", "adaptability", "creativity",
    "customer service", "sales", "marketing", "seo", "content writing", "copywriting"
  ];
  
  // Use word boundary matching to avoid partial matches (e.g., "c" in "react")
  return skills.filter(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(text) || text.includes(skill); // Fallback for multi-word skills
  });
}

export function calculateScore(matched, missing) {
  const total = matched.length + missing.length;
  if (total === 0) return 0;
  // Weight matched skills slightly higher to reward relevance
  return Math.min(100, Math.round((matched.length / total) * 100));
}

export function analyzeATSLocal(resumeText, jdText) {
  const resume = resumeText?.toLowerCase() || "";
  const jd = jdText?.toLowerCase() || "";

  if (!resume || !jd) return null;

  // Extract unique keywords from JD
  const jdKeywords = [...new Set(extractKeywords(jd))];
  
  // Find matches and misses
  const matched = jdKeywords.filter(kw => resume.includes(kw));
  const missing = jdKeywords.filter(kw => !resume.includes(kw));
  
  const score = calculateScore(matched, missing);

  let suggestions = "";
  if (score < 40) {
    suggestions = "Your resume has a low match for this role. Focus on incorporating the missing technical skills listed below into your experience descriptions.";
  } else if (score < 75) {
    suggestions = "Good alignment! To improve your score, try to provide specific examples of how you used the missing keywords in your previous projects.";
  } else {
    suggestions = "Excellent match! Your resume is highly optimized for this job description. Ensure your formatting remains clean for human recruiters.";
  }

  return { score, matched, missing, suggestions };
}