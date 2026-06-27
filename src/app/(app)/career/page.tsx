"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  AlertCircle,
  Bot,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileText,
  FileUp,
  Loader2,
  Mic,
  PlayCircle,
  Plus,
  Save,
  SearchCheck,
  Target,
  Trash2,
  WandSparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type CareerProfile = {
  dreamRole: string;
  targetCompany: string;
  resumeText: string;
  skillsText: string;
  projectsText: string;
  experienceText: string;
  educationText: string;
  preferredKeywords: string;
  jobDescriptionText: string;
};

type Analysis = {
  isAnalyzed: boolean;
  dreamRole: string;
  targetCompany: string;
  resumeScore: number | null;
  atsScore: number | null;
  resumeMatch: number | null;
  jobDescriptionMatch: number | null;
  strongSections: string[];
  needsImprovement: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  missingFromJobDescription: string[];
  suggestions: string[];
  suggestedBullet: string;
  recommendedLearningPath: Array<{ topic: string; action: string }>;
  interviewPrep: string[];
  generatedInterviewQuestions: string[];
  companies: Array<{
    company: string;
    readiness: number | null;
    weakestSkills: string[];
    estimatedPrepTime: string;
    missingTopics: string[];
  }>;
};

type JobApplication = {
  id: string;
  company: string;
  role: string;
  status: string;
  location?: string | null;
  url?: string | null;
  notes?: string | null;
  appliedAt?: string | null;
};

const emptyProfile: CareerProfile = {
  dreamRole: "Your Dream Role",
  targetCompany: "Your Target Company",
  resumeText: "",
  skillsText: "",
  projectsText: "",
  experienceText: "",
  educationText: "",
  preferredKeywords: "System Design, Docker, REST API, Graph Algorithms",
  jobDescriptionText: "",
};

const tabs = [
  { id: "resume", label: "Resume", icon: FileText },
  { id: "ats", label: "ATS Analysis", icon: SearchCheck },
  { id: "interview", label: "Interview Prep", icon: Mic },
  { id: "jobs", label: "Job Tracker", icon: ClipboardList },
  { id: "companies", label: "Company Readiness", icon: Building2 },
] as const;

const statusOptions = ["wishlist", "applied", "interview", "offer", "rejected"];
const companyOptions = ["Google", "Amazon", "Microsoft", "Atlassian", "Adobe", "Uber"];

const interviewTracks = [
  {
    id: "google-sde",
    label: "Google SDE Interview",
    focus: "DSA, problem solving, system design basics, and behavioral depth",
    questions: [
      "Explain your strongest project architecture and the tradeoffs you made.",
      "Solve a medium graph problem and explain the time and space complexity.",
      "How would you design a URL shortener or rate limiter at a high level?",
      "Tell me about a time you handled failure or conflict.",
      "What is one missing skill in your resume for Google and how are you improving it?",
    ],
    videos: [
      { title: "Google software engineer mock interview", url: "https://www.youtube.com/results?search_query=google+software+engineer+mock+interview" },
      { title: "Google coding interview graph problems", url: "https://www.youtube.com/results?search_query=google+coding+interview+graph+problems" },
    ],
  },
  {
    id: "amazon-sde",
    label: "Amazon SDE Interview",
    focus: "DSA, scalable design, ownership, and leadership principles",
    questions: [
      "Tell me about a time you took ownership of a difficult problem.",
      "Design a notification system for millions of users.",
      "Solve a dynamic programming question and explain your recurrence.",
      "Which project proves you can build reliable backend systems?",
      "How would you improve your resume for Amazon leadership principles?",
    ],
    videos: [
      { title: "Amazon SDE mock interview", url: "https://www.youtube.com/results?search_query=amazon+sde+mock+interview" },
      { title: "Amazon leadership principles interview examples", url: "https://www.youtube.com/results?search_query=amazon+leadership+principles+mock+interview" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend / React Interview",
    focus: "React, TypeScript, UI architecture, performance, and product thinking",
    questions: [
      "Explain React rendering and how you would optimize a slow dashboard.",
      "How would you structure reusable components in Zentric?",
      "What accessibility improvements would you add to a login page?",
      "Explain state management choices for a large SaaS app.",
      "Walk me through a frontend bug you debugged deeply.",
    ],
    videos: [
      { title: "React frontend mock interview", url: "https://www.youtube.com/results?search_query=react+frontend+mock+interview" },
      { title: "TypeScript frontend interview questions", url: "https://www.youtube.com/results?search_query=typescript+frontend+interview+questions" },
    ],
  },
  {
    id: "backend",
    label: "Backend / System Design Interview",
    focus: "APIs, databases, scalability, caching, queues, and system design",
    questions: [
      "Design an ATS resume analysis service for thousands of users.",
      "How would you model users, resumes, jobs, and company readiness in a database?",
      "Explain REST API design and error handling for uploads.",
      "Where would you use caching in Zentric?",
      "How would you secure user resume data?",
    ],
    videos: [
      { title: "Backend system design mock interview", url: "https://www.youtube.com/results?search_query=backend+system+design+mock+interview" },
      { title: "System design interview beginner mock", url: "https://www.youtube.com/results?search_query=system+design+mock+interview+beginner" },
    ],
  },
  {
    id: "behavioral",
    label: "Behavioral / HR Interview",
    focus: "Communication, STAR stories, project ownership, conflict, and growth mindset",
    questions: [
      "Tell me about yourself in 90 seconds.",
      "Describe a time you failed and what changed after that.",
      "Tell me about a project you are proud of and why.",
      "How do you handle pressure before deadlines?",
      "Why this company and why this role?",
    ],
    videos: [
      { title: "Behavioral mock interview software engineer", url: "https://www.youtube.com/results?search_query=behavioral+mock+interview+software+engineer" },
      { title: "STAR method interview examples", url: "https://www.youtube.com/results?search_query=STAR+method+mock+interview+examples" },
    ],
  },
] as const;

function buildCustomInterviewTrack(company: string, role: string) {
  const safeCompany = company.trim() || "Your target company";
  const safeRole = role.trim() || "Software Engineer";

  return {
    id: "custom",
    label: `${safeCompany} ${safeRole} Interview`,
    focus: `Custom preparation for ${safeRole} at ${safeCompany}: technical depth, resume fit, projects, and behavioral readiness.`,
    questions: [
      `Why do you want to join ${safeCompany} for a ${safeRole} role?`,
      `Which project from your resume best proves you are ready for ${safeCompany}?`,
      "Tell me about a difficult technical decision you made and the tradeoff behind it.",
      "Explain one weak skill from your resume and your plan to improve it.",
      "Walk me through your resume in a way that matches this company and role.",
    ],
    videos: [
      {
        title: `${safeCompany} ${safeRole} mock interview`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${safeCompany} ${safeRole} mock interview`)}`,
      },
      {
        title: `${safeCompany} coding interview questions`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${safeCompany} coding interview questions`)}`,
      },
    ],
  };
}

function getTechnicalQuestions(interviewId: string, company: string, role: string) {
  if (interviewId === "frontend") {
    return [
      "Build a reusable autocomplete component. How would you handle debouncing, keyboard navigation, and loading states?",
      "Explain React reconciliation, memoization, and when useMemo/useCallback are actually useful.",
      "How would you debug a page that is slow only on low-end mobile devices?",
      "Design the frontend architecture for a dashboard with filters, charts, and real-time updates.",
      "Explain TypeScript generics using a reusable API response type.",
    ];
  }

  if (interviewId === "backend") {
    return [
      "Design a rate limiter for a public API. Compare token bucket and sliding window.",
      "How would you design authentication, sessions, and permissions for a SaaS app?",
      "Explain database indexing and how you would optimize a slow query.",
      "Design a queue-based resume analysis pipeline for large file uploads.",
      "What happens when a user sends a request from browser to database? Explain the full path.",
    ];
  }

  if (interviewId === "behavioral") {
    return [
      "Explain one technical project to a non-technical interviewer in under two minutes.",
      "Describe a time you disagreed on a technical decision and how you handled it.",
      "Tell a STAR story about debugging a difficult production-like issue.",
      "How do you prioritize learning when you have DSA, projects, and interviews at the same time?",
      "What technical weakness are you actively improving right now?",
    ];
  }

  if (interviewId === "amazon-sde") {
    return [
      "Solve a dynamic programming problem and explain the recurrence, base cases, and complexity.",
      "Design a scalable order tracking or notification service.",
      "Explain how you would handle retries, idempotency, and failure in a backend system.",
      "Given logs from a failing service, how would you debug the root cause?",
      "Solve a tree/graph traversal problem and explain edge cases.",
    ];
  }

  if (interviewId === "custom") {
    const safeCompany = company.trim() || "the target company";
    const safeRole = role.trim() || "the target role";
    return [
      `What technical skills are most important for ${safeRole} at ${safeCompany}, and which ones does your resume prove?`,
      `Design a system or feature that ${safeCompany} might build. Explain APIs, database, scaling, and tradeoffs.`,
      "Solve one DSA medium problem related to arrays, graphs, or dynamic programming and explain complexity.",
      "Pick one resume project and explain architecture, database design, security, and performance improvements.",
      `Which missing skill would hurt you most for ${safeCompany}, and what is your 7-day practice plan?`,
    ];
  }

  return [
    "Solve a medium graph problem and explain BFS vs DFS tradeoffs.",
    "Explain dynamic programming with recurrence, memoization, tabulation, and complexity.",
    "Design a URL shortener. Cover APIs, database schema, caching, rate limits, and scaling.",
    "Explain hashing, collisions, and when a hashmap is not the right choice.",
    "Pick your best project and explain architecture, bottlenecks, security, and measurable impact.",
  ];
}

export default function CareerHubPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("resume");
  const [profile, setProfile] = useState<CareerProfile>(emptyProfile);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [jobSaving, setJobSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedInterview, setSelectedInterview] = useState<string>("google-sde");
  const [customInterviewCompany, setCustomInterviewCompany] = useState("");
  const [customInterviewRole, setCustomInterviewRole] = useState("Software Engineer");
  const [customReadinessCompany, setCustomReadinessCompany] = useState("");
  const [jobForm, setJobForm] = useState({
    company: "",
    role: "",
    status: "wishlist",
    location: "",
    url: "",
    notes: "",
  });

  const fetchCareer = async () => {
    const response = await fetch("/api/career");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load Career Hub.");

    setProfile({
      ...emptyProfile,
      ...(data.profile ?? {}),
      resumeText: data.profile?.resumeText ?? "",
      skillsText: data.profile?.skillsText ?? "",
      projectsText: data.profile?.projectsText ?? "",
      experienceText: data.profile?.experienceText ?? "",
      educationText: data.profile?.educationText ?? "",
      preferredKeywords: data.profile?.preferredKeywords ?? emptyProfile.preferredKeywords,
      jobDescriptionText: data.profile?.jobDescriptionText ?? "",
    });
    setAnalysis(data.analysis);
    setJobs(Array.isArray(data.jobs) ? data.jobs : []);
    setLoading(false);
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      fetchCareer().catch(() => setLoading(false));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const jobStats = useMemo(() => {
    return statusOptions.map((status) => ({
      status,
      count: jobs.filter((job) => job.status === status).length,
    }));
  }, [jobs]);
  const isAnalyzed = Boolean(analysis?.isAnalyzed);
  const interviewTrack =
    selectedInterview === "custom"
      ? buildCustomInterviewTrack(customInterviewCompany, customInterviewRole)
      : interviewTracks.find((track) => track.id === selectedInterview) ?? interviewTracks[0];
  const technicalQuestions = getTechnicalQuestions(selectedInterview, customInterviewCompany || profile.targetCompany, customInterviewRole);
  const selectedCompany =
    analysis?.companies.find((company) => company.company === profile.targetCompany) ?? analysis?.companies[0] ?? null;

  const saveCareerProfile = async (nextProfile: CareerProfile) => {
    const response = await fetch("/api/career", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextProfile),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to save profile.");
    setProfile({
      ...emptyProfile,
      ...(data.profile ?? nextProfile),
      resumeText: data.profile?.resumeText ?? nextProfile.resumeText,
      skillsText: data.profile?.skillsText ?? nextProfile.skillsText,
      projectsText: data.profile?.projectsText ?? nextProfile.projectsText,
      experienceText: data.profile?.experienceText ?? nextProfile.experienceText,
      educationText: data.profile?.educationText ?? nextProfile.educationText,
      preferredKeywords: data.profile?.preferredKeywords ?? nextProfile.preferredKeywords,
      jobDescriptionText: data.profile?.jobDescriptionText ?? nextProfile.jobDescriptionText,
    });
    setAnalysis(data.analysis);
    return data;
  };

  const saveProfile = async (nextProfile = profile) => {
    setSaving(true);
    setMessage("");
    try {
      const data = await saveCareerProfile(nextProfile);
      setMessage(
        data.analysis?.isAnalyzed
          ? "Career Hub updated. Resume, ATS, and readiness scores recalculated."
          : "Career Hub saved. Add resume/profile details to generate scores."
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const uploadResume = async (file?: File | null) => {
    if (!file) return;
    setResumeUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const response = await fetch("/api/career/resume", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to parse resume.");

      const nextProfile = {
        ...profile,
        resumeText: data.text,
      };
      await saveCareerProfile(nextProfile);
      setMessage(`Resume uploaded from ${data.fileName}. ATS analysis has been recalculated.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload resume.");
    } finally {
      setResumeUploading(false);
    }
  };

  const addJob = async () => {
    if (!jobForm.company.trim() || !jobForm.role.trim()) return;
    setJobSaving(true);
    try {
      const response = await fetch("/api/career/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to add job.");
      setJobs((current) => [data, ...current]);
      setJobForm({ company: "", role: "", status: "wishlist", location: "", url: "", notes: "" });
    } finally {
      setJobSaving(false);
    }
  };

  const updateJobStatus = async (id: string, status: string) => {
    const response = await fetch(`/api/career/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await response.json();
    if (response.ok) {
      setJobs((current) => current.map((job) => (job.id === id ? updated : job)));
    }
  };

  const deleteJob = async (id: string) => {
    const response = await fetch(`/api/career/jobs/${id}`, { method: "DELETE" });
    if (response.ok) setJobs((current) => current.filter((job) => job.id !== id));
  };

  return (
    <main className="mx-auto max-w-7xl p-5 lg:p-8">
      <header className="mb-7 overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="mb-4 border-blue-400/30 bg-blue-500/10 text-blue-200">
              <BriefcaseBusiness className="mr-1 h-3 w-3" />
              AI Career Command Center
            </Badge>
            <h1 className="text-3xl font-bold text-white">Career Hub</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
              Resume, ATS analysis, interview prep, job tracking, and company readiness tied back to your Zentric growth mission.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:min-w-[420px]">
            <ScoreTile label="Resume" value={analysis?.resumeScore} />
            <ScoreTile label="ATS" value={analysis?.atsScore} />
            <ScoreTile label="Dream Match" value={analysis?.resumeMatch} />
          </div>
        </div>
      </header>

      <div className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-w-fit items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {message}
        </div>
      )}

      {!loading && !isAnalyzed && (
        <div className="mb-5 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-sm leading-6 text-yellow-100">
          Resume and ATS scores are not analyzed yet because no resume/profile data has been added. Paste your resume or fill Skills,
          Projects, and Experience, then click Save and Recalculate.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-purple-300" />
        </div>
      ) : (
        <>
          {activeTab === "resume" && (
            <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Dream Role">
                      <Input value={profile.dreamRole} onChange={(event) => setProfile({ ...profile, dreamRole: event.target.value })} />
                    </Field>
                    <Field label="Target Company">
                      <Select value={profile.targetCompany} onValueChange={(value) => setProfile({ ...profile, targetCompany: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {!companyOptions.includes(profile.targetCompany) && profile.targetCompany && (
                            <SelectItem value={profile.targetCompany}>{profile.targetCompany}</SelectItem>
                          )}
                          {companyOptions.map((company) => (
                            <SelectItem key={company} value={company}>{company}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <div className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.06] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="flex items-center gap-2 text-sm font-semibold text-blue-100">
                          <FileUp className="h-4 w-4" />
                          Upload Resume
                        </p>
                        <p className="mt-1 text-xs leading-5 text-gray-400">
                          Upload PDF, DOCX, DOC, TXT, MD, CSV, JSON, or paste text below. Zentric extracts resume text and recalculates ATS.
                        </p>
                      </div>
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-blue-400/30 px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-blue-400/10">
                        {resumeUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                        {resumeUploading ? "Reading..." : "Choose File"}
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt,.md,.csv,.json,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/*"
                          onChange={(event) => {
                            uploadResume(event.target.files?.[0]);
                            event.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <Field label="Skills">
                    <Textarea rows={3} value={profile.skillsText} onChange={(event) => setProfile({ ...profile, skillsText: event.target.value })} placeholder="React, Next.js, TypeScript, DSA, PostgreSQL..." />
                  </Field>
                  <Field label="Projects">
                    <Textarea rows={5} value={profile.projectsText} onChange={(event) => setProfile({ ...profile, projectsText: event.target.value })} placeholder="Paste your project bullets here..." />
                  </Field>
                  <Field label="Experience">
                    <Textarea rows={4} value={profile.experienceText} onChange={(event) => setProfile({ ...profile, experienceText: event.target.value })} placeholder="Internships, freelance work, leadership, responsibilities..." />
                  </Field>
                  <Field label="Full Resume Text">
                    <Textarea rows={6} value={profile.resumeText} onChange={(event) => setProfile({ ...profile, resumeText: event.target.value })} placeholder="Paste your full resume text for deeper analysis..." />
                  </Field>
                  <Button onClick={() => saveProfile()} disabled={saving} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save and Recalculate
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>AI Resume Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <BigScore value={analysis?.resumeScore} label="Resume Score" />
                  <SectionList title="Strong Sections" items={analysis?.strongSections ?? []} positive />
                  <SectionList title="Needs Improvement" items={analysis?.needsImprovement ?? []} />
                  <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4">
                    <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-100">
                      <WandSparkles className="h-4 w-4" />
                      Suggested Project Bullet
                    </p>
                    <p className="text-sm leading-6 text-gray-300">
                      {analysis?.suggestedBullet || "Add your resume/profile data first, then Zentric will rewrite your strongest project bullet."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "ats" && (
            <div className="grid gap-5 xl:grid-cols-[0.8fr_1fr]">
              <Card>
                <CardHeader><CardTitle>ATS & Job Description Match</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <BigScore value={analysis?.atsScore} label="ATS Score" />
                  <BigScore value={analysis?.jobDescriptionMatch} label="Job Description Match" />
                  <Field label="Paste Target Job Description">
                    <Textarea
                      rows={7}
                      value={profile.jobDescriptionText}
                      onChange={(event) => setProfile({ ...profile, jobDescriptionText: event.target.value })}
                      placeholder="Paste the job description here. Zentric will compare your resume against this exact role..."
                    />
                  </Field>
                  <Field label="Extra Target Keywords">
                    <Textarea rows={4} value={profile.preferredKeywords} onChange={(event) => setProfile({ ...profile, preferredKeywords: event.target.value })} />
                  </Field>
                  <Button onClick={() => saveProfile()} disabled={saving} variant="outline" className="border-blue-400/30 text-blue-200">
                    Update Match Analysis
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Keywords</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <KeywordBox title="Matched Keywords" keywords={analysis?.matchedKeywords ?? []} positive />
                  <KeywordBox title="Keywords Missing" keywords={analysis?.missingKeywords ?? []} />
                  <KeywordBox title="Missing From Job Description" keywords={analysis?.missingFromJobDescription ?? []} />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "interview" && (
            <div className="grid gap-5 lg:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>AI Interview Prep</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <Field label="Which interview do you want to prepare?">
                    <Select value={selectedInterview} onValueChange={setSelectedInterview}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {interviewTracks.map((track) => (
                          <SelectItem key={track.id} value={track.id}>{track.label}</SelectItem>
                        ))}
                        <SelectItem value="custom">Custom Company / Role</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  {selectedInterview === "custom" && (
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Custom Company">
                        <Input
                          value={customInterviewCompany}
                          onChange={(event) => setCustomInterviewCompany(event.target.value)}
                          placeholder="e.g. Netflix, Flipkart, TCS, Stripe"
                        />
                      </Field>
                      <Field label="Custom Role">
                        <Input
                          value={customInterviewRole}
                          onChange={(event) => setCustomInterviewRole(event.target.value)}
                          placeholder="e.g. Frontend Engineer, Backend Intern"
                        />
                      </Field>
                    </div>
                  )}
                  <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4">
                    <p className="text-sm font-semibold text-purple-100">{interviewTrack.label}</p>
                    <p className="mt-1 text-sm leading-6 text-gray-300">{interviewTrack.focus}</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-white">Questions to Practice</p>
                    {interviewTrack.questions.map((item) => (
                      <div key={item} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-white">Technical Questions</p>
                    {technicalQuestions.map((item) => (
                      <div key={item} className="flex gap-3 rounded-xl border border-blue-400/20 bg-blue-500/[0.06] p-3 text-sm text-gray-200">
                        <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-300" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-white">Resume & JD Generated Questions</p>
                    {(analysis?.generatedInterviewQuestions ?? []).map((item) => (
                      <div key={item} className="flex gap-3 rounded-xl border border-purple-400/20 bg-purple-500/[0.08] p-3 text-sm text-gray-200">
                        <WandSparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-300" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-white">Personalized Resume-Based Prep</p>
                    {(analysis?.interviewPrep ?? []).map((item) => (
                      <div key={item} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
                      {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Mock Interview Videos & Dream Match</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <BigScore value={analysis?.resumeMatch} label={`${analysis?.dreamRole ?? "Dream Job"} Match`} />
                  <div className="space-y-3">
                    <p className="flex items-center gap-2 text-sm font-medium text-white">
                      <PlayCircle className="h-4 w-4 text-red-300" />
                      Mock Interview Videos
                    </p>
                    {interviewTrack.videos.map((video) => (
                      <a
                        key={video.url}
                        href={video.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-gray-200 transition hover:border-red-300/30 hover:bg-red-400/10"
                      >
                        <span className="flex items-center gap-2">
                          <PlayCircle className="h-4 w-4 text-red-300" />
                          {video.title}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-500" />
                      </a>
                    ))}
                  </div>
                  <SectionList title="Missing Skills" items={analysis?.missingKeywords.slice(0, 5) ?? []} />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white">Recommended Learning Path</p>
                    {(analysis?.recommendedLearningPath ?? []).map((item) => (
                      <div key={item.topic} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-sm">
                        <span className="text-gray-200">{item.topic}</span>
                        <span className="text-xs text-blue-300">{item.action}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-5">
                {jobStats.map((item) => (
                  <div key={item.status} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                    <p className="text-2xl font-bold text-white">{item.count}</p>
                    <p className="text-xs capitalize text-gray-500">{item.status}</p>
                  </div>
                ))}
              </div>
              <Card>
                <CardHeader><CardTitle>Add Job</CardTitle></CardHeader>
                <CardContent className="grid gap-3 lg:grid-cols-[1fr_1fr_160px_1fr_auto]">
                  <Input placeholder="Company" value={jobForm.company} onChange={(event) => setJobForm({ ...jobForm, company: event.target.value })} />
                  <Input placeholder="Role" value={jobForm.role} onChange={(event) => setJobForm({ ...jobForm, role: event.target.value })} />
                  <Select value={jobForm.status} onValueChange={(value) => setJobForm({ ...jobForm, status: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{statusOptions.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input placeholder="Location / URL" value={jobForm.location} onChange={(event) => setJobForm({ ...jobForm, location: event.target.value })} />
                  <Button onClick={addJob} disabled={jobSaving || !jobForm.company.trim() || !jobForm.role.trim()}>
                    {jobSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </CardContent>
              </Card>
              <div className="space-y-3">
                {jobs.length === 0 ? (
                  <Card><CardContent className="py-10 text-center text-sm text-gray-500">No jobs tracked yet.</CardContent></Card>
                ) : jobs.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{job.role}</p>
                        <p className="text-sm text-gray-400">{job.company}{job.location ? ` • ${job.location}` : ""}</p>
                      </div>
                      <Select value={job.status} onValueChange={(value) => updateJobStatus(job.id, value)}>
                        <SelectTrigger className="md:w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>{statusOptions.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-300" onClick={() => deleteJob(job.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "companies" && (
            <div className="space-y-5">
              <Card>
                <CardHeader><CardTitle>Select Company for Resume Readiness</CardTitle></CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
                  <Field label="Target Company">
                    <Select value={profile.targetCompany} onValueChange={(value) => setProfile({ ...profile, targetCompany: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {!companyOptions.includes(profile.targetCompany) && profile.targetCompany && (
                          <SelectItem value={profile.targetCompany}>{profile.targetCompany}</SelectItem>
                        )}
                        {companyOptions.map((company) => (
                          <SelectItem key={company} value={company}>{company}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Or Enter Custom Company">
                    <Input
                      value={customReadinessCompany}
                      onChange={(event) => setCustomReadinessCompany(event.target.value)}
                      placeholder="e.g. Netflix, Flipkart, TCS, Stripe"
                    />
                  </Field>
                  <Button onClick={() => saveProfile()} disabled={saving} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SearchCheck className="mr-2 h-4 w-4" />}
                    Check Resume for {profile.targetCompany}
                  </Button>
                  <Button
                    onClick={() => {
                      const company = customReadinessCompany.trim();
                      if (!company) return;
                      saveProfile({ ...profile, targetCompany: company });
                    }}
                    disabled={saving || !customReadinessCompany.trim()}
                    variant="outline"
                    className="border-purple-400/30 text-purple-200 lg:col-start-2"
                  >
                    Use Custom Company
                  </Button>
                </CardContent>
              </Card>

              {selectedCompany && (
                <Card className="overflow-hidden border-blue-400/20 bg-blue-500/[0.04]">
                  <CardHeader>
                    <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span>{selectedCompany.company} Readiness</span>
                      <span className="text-blue-200">
                        {selectedCompany.readiness === null ? "Not analyzed yet" : `${selectedCompany.readiness}%`}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <Progress value={selectedCompany.readiness ?? 0} />
                    {!isAnalyzed && (
                      <div className="flex gap-3 rounded-xl border border-yellow-400/20 bg-yellow-400/10 p-3 text-sm text-yellow-100">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        Upload or paste your resume first. Then Zentric can compare it against {selectedCompany.company} expectations.
                      </div>
                    )}
                    <div className="grid gap-4 md:grid-cols-3">
                      <SectionList title="Skills Missing" items={selectedCompany.weakestSkills} />
                      <SectionList title="Areas To Master" items={selectedCompany.missingTopics} />
                      <div>
                        <p className="mb-2 text-sm font-medium text-white">Estimated Preparation</p>
                        <p className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-gray-300">
                          {selectedCompany.estimatedPrepTime}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4">
                      <p className="mb-2 text-sm font-semibold text-purple-100">Recommended Learning Path</p>
                      <div className="grid gap-2 md:grid-cols-2">
                        {(selectedCompany.missingTopics.length ? selectedCompany.missingTopics : analysis?.missingKeywords.slice(0, 4) ?? []).map((topic) => (
                          <div key={topic} className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-gray-200">
                            <span>{topic}</span>
                            <ArrowRight className="h-4 w-4 text-purple-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {(analysis?.companies ?? []).map((company) => (
                  <Card key={company.company} className="transition hover:-translate-y-1 hover:border-blue-400/30">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {company.company}
                        <span className="text-blue-200">{company.readiness === null ? "Not analyzed yet" : `${company.readiness}%`}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={company.readiness ?? 0} />
                      <SectionList title="Weakest Skills" items={company.weakestSkills} />
                      <p className="text-sm text-gray-400">Estimated prep: <span className="text-white">{company.estimatedPrepTime}</span></p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{label}</span>
      {children}
    </label>
  );
}

function ScoreTile({ label, value }: { label: string; value?: number | null }) {
  const hasScore = typeof value === "number";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 font-bold ${hasScore ? "text-2xl text-white" : "text-sm text-yellow-100"}`}>
        {hasScore ? `${value}/100` : "Not analyzed yet"}
      </p>
      <Progress value={value ?? 0} className="mt-3" />
    </div>
  );
}

function BigScore({ value, label }: { value?: number | null; label: string }) {
  const hasScore = typeof value === "number";

  return (
    <div className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.06] p-5">
      <div className="mb-3 flex items-center gap-3">
        <Target className="h-5 w-5 text-blue-300" />
        <p className="text-sm font-medium text-blue-100">{label}</p>
      </div>
      <p className={hasScore ? "text-5xl font-bold text-white" : "text-lg font-semibold text-yellow-100"}>
        {hasScore ? value : "Not analyzed yet"}
      </p>
      <p className="text-sm text-gray-500">{hasScore ? "out of 100" : "add resume/profile data to unlock this score"}</p>
      <Progress value={value ?? 0} className="mt-4" />
    </div>
  );
}

function SectionList({ title, items, positive = false }: { title: string; items: string[]; positive?: boolean }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-white">{title}</p>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No items yet.</p>
        ) : items.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
            {positive ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Bot className="h-4 w-4 text-purple-300" />}
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function KeywordBox({ title, keywords, positive = false }: { title: string; keywords: string[]; positive?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-3 text-sm font-medium text-white">{title}</p>
      <div className="flex flex-wrap gap-2">
        {keywords.length === 0 ? (
          <span className="text-sm text-gray-500">Nothing here yet.</span>
        ) : keywords.map((keyword) => (
          <Badge key={keyword} className={positive ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-yellow-400/30 bg-yellow-400/10 text-yellow-200"}>
            {keyword}
          </Badge>
        ))}
      </div>
    </div>
  );
}
