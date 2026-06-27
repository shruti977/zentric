"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bot,
  BookOpen,
  Briefcase,
  Code2,
  Cpu,
  Loader2,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const agents = [
  {
    type: "orchestrator",
    name: "Orchestrator Agent",
    icon: Sparkles,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-500/20",
    description: "Turns complex goals into a coordinated plan across Zentric's specialists.",
    capabilities: ["Task routing", "Multi-step planning", "Cross-domain guidance"],
    systemPrompt: `You are Zentric's Orchestrator Agent. Analyze the user's goal, identify which specialist perspectives are needed, and coordinate a clear multi-step response.
Use the Planner, Study, Coding, Research, Career, and Automation specialties when relevant.
State the specialists you are using, synthesize their recommendations, resolve conflicts, and finish with a prioritized action plan.`,
  },
  {
    type: "planner",
    name: "Planner Agent",
    icon: Bot,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-500/20",
    description: "Breaks goals into actionable tasks and builds realistic daily or weekly schedules.",
    capabilities: ["Goal decomposition", "Task prioritization", "Schedule design"],
    systemPrompt: `You are Zentric's Planner Agent, an expert productivity coach and task planner.
Break big goals into clear, achievable steps. Prioritize work using urgency and importance, create realistic schedules, account for energy and deadlines, and always finish with specific next actions.
Use organized lists, timelines, and checklists. Be direct, calm, and practical.`,
  },
  {
    type: "study",
    name: "Study Agent",
    icon: BookOpen,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-500/20",
    description: "Creates learning paths, explains DSA topics, and recommends focused practice.",
    capabilities: ["Learning paths", "DSA coaching", "Progress reviews"],
    systemPrompt: `You are Zentric's Study Agent, an expert learning coach and DSA mentor.
Create structured study plans, explain concepts clearly with examples, recommend LeetCode problems by topic and difficulty, and help users review progress.
Use markdown and code blocks when useful. Be encouraging, methodical, and specific.`,
  },
  {
    type: "coding",
    name: "Coding Agent",
    icon: Code2,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-500/20",
    description: "Reviews code, diagnoses bugs, explains algorithms, and improves solutions.",
    capabilities: ["Code review", "Debugging", "Algorithm analysis"],
    systemPrompt: `You are Zentric's Coding Agent, an expert software engineer and code reviewer.
Help with debugging, code review, algorithms, architecture, and clean implementation. Explain root causes, tradeoffs, and time and space complexity where relevant.
Use correctly labeled markdown code blocks. Be precise and technical without being needlessly verbose.`,
  },
  {
    type: "research",
    name: "Research Agent",
    icon: Search,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-500/20",
    description: "Organizes research questions, compares options, and synthesizes useful findings.",
    capabilities: ["Topic synthesis", "Tech comparison", "Decision briefs"],
    systemPrompt: `You are Zentric's Research Agent, an expert analyst and information synthesizer.
Clarify the research question, organize the important facts, compare alternatives, identify uncertainty, and provide a concise decision-ready summary.
Never invent citations or claim live browsing. Clearly distinguish known facts, assumptions, and items the user should verify.`,
  },
  {
    type: "career",
    name: "Career Agent",
    icon: Briefcase,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-500/20",
    description: "Improves resumes, prepares interviews, and builds practical career strategies.",
    capabilities: ["Resume feedback", "Interview practice", "Career roadmaps"],
    systemPrompt: `You are Zentric's Career Agent, an expert career coach, recruiter, and interviewer.
Help with resumes, job-search strategy, technical and behavioral interviews, salary negotiation, and career planning.
Give honest, specific feedback and use concrete examples. Use the STAR framework for behavioral interview coaching.`,
  },
  {
    type: "automation",
    name: "Automation Agent",
    icon: Cpu,
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-500/20",
    description: "Designs repeatable workflows, summaries, templates, and productivity routines.",
    capabilities: ["Workflow design", "Report templates", "Smart routines"],
    systemPrompt: `You are Zentric's Automation Agent, an expert in productivity automation and workflow design.
Turn repetitive work into clear, repeatable workflows. Create useful summaries, reports, checklists, templates, reminder routines, and implementation plans.
Be specific and practical. Explain what can be automated now and what still requires an external integration.`,
  },
] as const;

const stepStyles = [
  "bg-purple-500/20 text-purple-300",
  "bg-blue-500/20 text-blue-300",
  "bg-emerald-500/20 text-emerald-300",
];

export default function AgentsPage() {
  const router = useRouter();
  const [launching, setLaunching] = useState<string | null>(null);
  const [error, setError] = useState("");

  const launchAgent = async (agent: (typeof agents)[number]) => {
    setLaunching(agent.type);
    setError("");

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${agent.name} Session`,
          systemPrompt: agent.systemPrompt,
        }),
      });
      const conversation = await response.json();

      if (!response.ok || !conversation.id) {
        throw new Error(conversation.error || "Unable to start this agent.");
      }

      router.push(`/chat?conversation=${conversation.id}`);
    } catch (launchError) {
      setError(
        launchError instanceof Error
          ? launchError.message
          : "Unable to start this agent. Please try again.",
      );
      setLaunching(null);
    }
  };

  return (
    <main className="mx-auto max-w-6xl p-6 lg:p-8">
      <header className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20">
            <Bot className="size-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">AI Agents</h1>
          <Badge className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            Ready
          </Badge>
        </div>
        <p className="text-sm text-gray-400">
          Choose a specialist and Zentric will open a dedicated AI conversation with the right
          expertise already loaded.
        </p>
      </header>

      <section className="mb-8 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600">
            <Zap className="size-5 text-white" />
          </div>
          <div>
            <h2 className="mb-1 font-semibold text-white">7 focused AI workspaces</h2>
            <p className="text-sm leading-6 text-gray-400">
              Each launch creates its own saved conversation and specialist instructions. Your
              messages and the agent&apos;s replies remain available in AI Chat.
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card
            key={agent.type}
            className={`flex flex-col border ${agent.border} bg-white/[0.025] transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.045]`}
          >
            <CardHeader className="pb-3">
              <div className="mb-3 flex items-center justify-between">
                <div className={`rounded-xl p-2.5 ${agent.bg}`}>
                  <agent.icon className={`size-5 ${agent.color}`} />
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Available
                </span>
              </div>
              <CardTitle className="text-base text-white">{agent.name}</CardTitle>
              <CardDescription className="min-h-10 text-xs leading-relaxed text-gray-400">
                {agent.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between">
              <div className="mb-5 flex flex-wrap gap-1.5">
                {agent.capabilities.map((capability) => (
                  <span
                    key={capability}
                    className={`rounded-md border px-2 py-1 text-xs ${agent.bg} ${agent.color} ${agent.border}`}
                  >
                    {capability}
                  </span>
                ))}
              </div>
              <Button
                size="sm"
                onClick={() => launchAgent(agent)}
                disabled={launching !== null}
                className="w-full border-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500"
              >
                {launching === agent.type ? (
                  <Loader2 className="mr-2 size-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 size-3.5" />
                )}
                {launching === agent.type ? "Opening agent..." : "Chat with agent"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-white">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Choose a specialist", "Pick the agent that best matches the work in front of you."],
            ["Get a focused workspace", "Zentric starts a saved chat with that agent's expertise."],
            ["Turn advice into action", "Continue the conversation, refine the result, and use it in your day."],
          ].map(([title, description], index) => (
            <div key={title} className="rounded-xl border border-white/8 bg-white/3 p-4">
              <div
                className={`mb-3 flex size-8 items-center justify-center rounded-lg text-sm font-bold ${stepStyles[index]}`}
              >
                {index + 1}
              </div>
              <h3 className="mb-1 text-sm font-medium text-white">{title}</h3>
              <p className="text-xs leading-5 text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
