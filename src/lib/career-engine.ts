export type CareerProfileInput = {
  dreamRole?: string | null;
  targetCompany?: string | null;
  resumeText?: string | null;
  skillsText?: string | null;
  projectsText?: string | null;
  experienceText?: string | null;
  educationText?: string | null;
  preferredKeywords?: string | null;
  jobDescriptionText?: string | null;
};

const defaultDreamRole = "Your Dream Role";
const defaultTargetCompany = "Your Target Company";

const companyKeywords: Record<string, string[]> = {
  Google: ["Graph Algorithms", "Dynamic Programming", "System Design", "Distributed Systems", "Testing", "Leadership"],
  Amazon: ["Leadership Principles", "System Design", "Scalability", "Java", "Ownership", "Behavioral Stories"],
  Microsoft: ["OOP", "System Design", "Cloud", "C#", "Distributed Systems", "Collaboration"],
  Atlassian: ["Frontend Architecture", "TypeScript", "Product Thinking", "Collaboration", "Testing", "APIs"],
  Adobe: ["Projects", "Creative Tools", "Performance", "Operating Systems", "Portfolio", "Design Thinking"],
  Uber: ["Graphs", "Distributed Systems", "Rate Limiting", "Backend", "System Design", "Scalability"],
};

function getCompanyKeywords(company: string, dreamRole: string) {
  const knownKeywords = companyKeywords[company];
  if (knownKeywords) return knownKeywords;

  const role = normalize(dreamRole);
  const roleKeywords = role.includes("frontend")
    ? ["React", "TypeScript", "Frontend Architecture", "Performance", "Accessibility", "Testing"]
    : role.includes("backend")
      ? ["REST API", "Databases", "System Design", "Scalability", "Caching", "Testing"]
      : role.includes("data")
        ? ["SQL", "Python", "Statistics", "Machine Learning", "Data Pipelines", "Communication"]
        : ["Data Structures", "Algorithms", "System Design", "Projects", "APIs", "Problem Solving"];

  return [
    ...roleKeywords,
    "Resume Metrics",
    "Project Impact",
    "Communication",
    "Ownership",
  ];
}

const baseKeywords = [
  "Next.js",
  "TypeScript",
  "React",
  "PostgreSQL",
  "Prisma",
  "REST API",
  "Docker",
  "System Design",
  "Graph Algorithms",
  "OpenAI",
  "Testing",
  "Metrics",
];

const keywordDictionary = [
  ...baseKeywords,
  "JavaScript",
  "Node.js",
  "Express",
  "NestJS",
  "MongoDB",
  "SQL",
  "Python",
  "Java",
  "C++",
  "AWS",
  "Cloud",
  "Kubernetes",
  "CI/CD",
  "Redis",
  "GraphQL",
  "Microservices",
  "Authentication",
  "Security",
  "Accessibility",
  "Performance",
  "Leadership",
  "Communication",
  "Problem Solving",
  "Data Structures",
  "Algorithms",
  "Dynamic Programming",
  "Graphs",
  "Operating Systems",
  "DBMS",
  "Computer Networks",
];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function normalize(value?: string | null) {
  return (value ?? "").toLowerCase();
}

function hasAny(text: string, values: string[]) {
  return values.some((value) => text.includes(value.toLowerCase()));
}

function splitKeywords(value?: string | null) {
  return (value ?? "")
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractKeywordsFromText(value?: string | null) {
  const text = normalize(value);
  return Array.from(new Set(keywordDictionary.filter((keyword) => text.includes(keyword.toLowerCase()))));
}

export function analyzeCareerProfile(profile: CareerProfileInput | null) {
  const dreamRole = profile?.dreamRole?.trim() || defaultDreamRole;
  const targetCompany = profile?.targetCompany?.trim() || defaultTargetCompany;
  const allText = [
    profile?.resumeText,
    profile?.skillsText,
    profile?.projectsText,
    profile?.experienceText,
    profile?.educationText,
  ]
    .filter(Boolean)
    .join("\n");
  const text = normalize(allText);
  const hasProfileEvidence = allText.replace(/\s+/g, "").length >= 20;
  const projectText = normalize(profile?.projectsText);
  const skillsText = normalize(profile?.skillsText);
  const experienceText = normalize(profile?.experienceText);
  const customKeywords = splitKeywords(profile?.preferredKeywords);
  const jobDescriptionText = profile?.jobDescriptionText ?? "";
  const jobDescriptionKeywords = extractKeywordsFromText(jobDescriptionText);
  const targetKeywords = [
    ...baseKeywords,
    ...getCompanyKeywords(targetCompany, dreamRole),
    ...customKeywords,
    ...jobDescriptionKeywords,
  ];
  const uniqueKeywords = Array.from(new Set(targetKeywords));
  const hasJobDescription = jobDescriptionText.replace(/\s+/g, "").length >= 40;

  if (!hasProfileEvidence) {
    return {
      isAnalyzed: false,
      dreamRole,
      targetCompany,
      resumeScore: null,
      atsScore: null,
      resumeMatch: null,
      jobDescriptionMatch: null,
      strongSections: [],
      needsImprovement: ["Paste your resume text or fill Skills, Projects, and Experience to start analysis."],
      matchedKeywords: [],
      missingKeywords: [],
      missingFromJobDescription: [],
      suggestions: [
        "Add your resume text or fill the profile sections, then click Save and Recalculate.",
        "Scores will appear only after Zentric has real resume/profile evidence to analyze.",
      ],
      suggestedBullet: "",
      recommendedLearningPath: [],
      interviewPrep: ["Add resume/profile data first to generate personalized interview prep."],
      generatedInterviewQuestions: ["Upload or paste your resume first to unlock role-specific technical questions."],
      companies: Array.from(new Set([targetCompany, ...Object.keys(companyKeywords)])).map((company) => ({
        company,
        readiness: null,
        weakestSkills: ["Add resume/profile data first"],
        estimatedPrepTime: "Not analyzed yet",
        missingTopics: [],
      })),
    };
  }

  const matchedKeywords = uniqueKeywords.filter((keyword) => text.includes(keyword.toLowerCase()));
  const missingKeywords = uniqueKeywords.filter((keyword) => !text.includes(keyword.toLowerCase())).slice(0, 8);
  const matchedJobDescriptionKeywords = jobDescriptionKeywords.filter((keyword) => text.includes(keyword.toLowerCase()));
  const missingFromJobDescription = jobDescriptionKeywords.filter((keyword) => !text.includes(keyword.toLowerCase())).slice(0, 8);

  const hasMetrics = /\b\d+[%x+]?\b|reduced|improved|increased|decreased|optimized|saved/.test(text);
  const hasActionVerbs = hasAny(text, ["built", "created", "designed", "implemented", "launched", "optimized", "led", "automated"]);
  const hasProjects = projectText.length > 80 || hasAny(text, ["project", "github", "deployed", "vercel"]);
  const hasSkills = skillsText.length > 30 || matchedKeywords.length >= 4;
  const hasExperience = experienceText.length > 80 || hasAny(text, ["intern", "experience", "freelance", "worked", "team"]);
  const hasEducation = normalize(profile?.educationText).length > 20 || hasAny(text, ["b.tech", "degree", "university", "college"]);

  const sectionScore =
    (hasProjects ? 18 : 6) +
    (hasSkills ? 16 : 6) +
    (hasExperience ? 16 : 5) +
    (hasEducation ? 10 : 3) +
    (hasMetrics ? 16 : 4) +
    (hasActionVerbs ? 12 : 4);
  const keywordScore = uniqueKeywords.length ? (matchedKeywords.length / uniqueKeywords.length) * 28 : 0;
  const resumeScore = clamp(sectionScore + keywordScore);
  const atsScore = clamp((matchedKeywords.length / Math.max(uniqueKeywords.length, 1)) * 100 + (hasMetrics ? 8 : 0));
  const resumeMatch = clamp(resumeScore * 0.55 + atsScore * 0.35 + (targetCompany ? 10 : 0));
  const jobDescriptionMatch = hasJobDescription
    ? clamp((matchedJobDescriptionKeywords.length / Math.max(jobDescriptionKeywords.length, 1)) * 80 + resumeScore * 0.2)
    : null;

  const strongSections = [
    hasProjects ? "Projects" : "",
    hasSkills ? "Skills" : "",
    hasMetrics ? "Impact Metrics" : "",
    hasActionVerbs ? "Action Verbs" : "",
  ].filter(Boolean);
  const needsImprovement = [
    !hasExperience ? "Experience" : "",
    !hasMetrics ? "Metrics" : "",
    missingKeywords.length ? "Target Keywords" : "",
    !hasProjects ? "Projects" : "",
  ].filter(Boolean);

  const suggestedBullet =
    "Built an AI Growth Operating System using Next.js, TypeScript, PostgreSQL, Prisma, and OpenAI with personalized roadmaps, coding analytics, and intelligent revision planning.";

  const suggestions = [
    hasMetrics
      ? "Your resume has measurable impact signals. Keep adding numbers to each project bullet."
      : "Add measurable outcomes such as users, speed, accuracy, completion rate, or time saved.",
    hasProjects
      ? "Your project section is a strength. Make the first bullet explain product impact, not only tech stack."
      : "Add 2-3 project bullets with problem, tech stack, and measurable outcome.",
    missingKeywords.length
      ? `Add missing ATS keywords naturally: ${missingKeywords.slice(0, 4).join(", ")}.`
      : "Your target keywords are well covered. Focus on sharper achievements.",
    hasJobDescription
      ? missingFromJobDescription.length
        ? `For this job description, strengthen evidence for: ${missingFromJobDescription.slice(0, 4).join(", ")}.`
        : "Your resume aligns well with the pasted job description keywords."
      : "Paste a job description to compare your resume against a real opening.",
  ];

  const companies = Array.from(new Set([targetCompany, ...Object.keys(companyKeywords)])).map((company) => {
    const keywords = getCompanyKeywords(company, dreamRole);
    const matched = keywords.filter((keyword) => text.includes(keyword.toLowerCase()));
    const readiness = clamp((matched.length / keywords.length) * 70 + resumeScore * 0.3);
    return {
      company,
      readiness,
      weakestSkills: keywords.filter((keyword) => !matched.includes(keyword)).slice(0, 3),
      estimatedPrepTime: `${Math.max(10, Math.ceil((100 - readiness) / 1.6))} days`,
      missingTopics: keywords.filter((keyword) => !matched.includes(keyword)).slice(0, 4),
    };
  });

  return {
    isAnalyzed: true,
    dreamRole,
    targetCompany,
    resumeScore,
    atsScore,
    resumeMatch,
    jobDescriptionMatch,
    strongSections: strongSections.length ? strongSections : ["Profile Basics"],
    needsImprovement: needsImprovement.length ? needsImprovement : ["Interview Storytelling"],
    matchedKeywords,
    missingKeywords,
    missingFromJobDescription,
    suggestions,
    suggestedBullet,
    recommendedLearningPath: missingKeywords.slice(0, 5).map((keyword) => ({
      topic: keyword,
      action:
        keyword.toLowerCase().includes("graph") || keyword.toLowerCase().includes("dynamic")
          ? "Practice in Study Tracker and Coding Hub"
          : "Add notes, projects, or interview prep evidence",
    })),
    interviewPrep: [
      "Prepare a 90-second introduction mapped to your dream role.",
      "Write 5 STAR stories: leadership, conflict, failure, ownership, and impact.",
      `Practice technical rounds focused on ${missingKeywords.slice(0, 3).join(", ") || "system design and DSA"}.`,
      "Create one project deep-dive story covering architecture, tradeoffs, and metrics.",
    ],
    generatedInterviewQuestions: [
      `Explain why your resume matches ${targetCompany} ${dreamRole}.`,
      `Deep-dive into your strongest project: architecture, APIs, database, scaling, and tradeoffs.`,
      `Solve a technical problem involving ${missingKeywords[0] || "graphs"} and explain complexity.`,
      `What evidence do you have for ${matchedKeywords[0] || "problem solving"} in your resume?`,
      hasJobDescription
        ? `The job description mentions ${jobDescriptionKeywords.slice(0, 3).join(", ") || "core skills"}. Explain your experience with them.`
        : "Paste a job description, then prepare answers for its required skills.",
    ],
    companies,
  };
}
