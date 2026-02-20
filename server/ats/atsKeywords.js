export function extractKeywords(text) {
  if (!text) return [];

  text = text.toLowerCase();

  const skills = [
    // AI / ML Core
    "artificial intelligence", "ai",
    "machine learning", "ml",
    "deep learning", "dl",
    "neural networks",
    "supervised learning",
    "unsupervised learning",
    "reinforcement learning",

    // Data Science
    "data science",
    "data analysis",
    "data analytics",
    "exploratory data analysis", "eda",
    "data preprocessing",
    "feature engineering",
    "data visualization",
    "statistics",
    "probability",

    // Programming Languages
    "python",
    "java",
    "c++",
    "c",
    "javascript",
    "typescript",
    "r",
    "matlab",

    // Python Libraries
    "numpy",
    "pandas",
    "matplotlib",
    "seaborn",
    "scikit-learn",
    "sklearn",

    // Deep Learning Frameworks
    "tensorflow",
    "keras",
    "pytorch",
    "cnn",
    "rnn",
    "lstm",
    "transformer",

    // NLP / LLM
    "natural language processing", "nlp",
    "large language model", "llm",
    "gpt",
    "bert",
    "rag",
    "retrieval augmented generation",
    "prompt engineering",
    "tokenization",

    // Computer Vision
    "computer vision",
    "opencv",
    "image processing",
    "object detection",
    "image classification",

    // Databases
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "firebase",
    "nosql",

    // Web / Backend
    "node.js",
    "express",
    "react",
    "next.js",
    "rest api",
    "graphql",
    "backend development",
    "frontend development",

    // Cloud & DevOps
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "cloud computing",
    "devops",

    // Tools
    "git",
    "github",
    "linux",
    "bash",
    "jupyter",
    "vscode",

    // Internships / Experience
    "internship",
    "research",
    "project",
    "capstone project",
    "hands-on experience",

    // Soft / Professional Skills
    "problem solving",
    "critical thinking",
    "communication skills",
    "teamwork",
    "leadership",

    // ATS / Resume terms
    "resume",
    "cv",
    "ats",
    "job description",
    "keywords",
    "technical skills"
  ];

  return skills.filter(skill => text.includes(skill));
}
