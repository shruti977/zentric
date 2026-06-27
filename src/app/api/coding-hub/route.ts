import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPracticeQuestions } from "@/lib/practice-questions";

type AIMessage = {
  role: "system" | "user";
  content: string;
};

const languageRuntimes = {
  javascript: { compiler: "nodejs-20.17.0", label: "JavaScript" },
  python: { compiler: "cpython-3.13.8", label: "Python" },
  java: { compiler: "openjdk-jdk-21+35", label: "Java" },
  cpp: { compiler: "gcc-13.2.0", label: "C++" },
  c: { compiler: "gcc-13.2.0-c", label: "C" },
} as const;

const executionWindows = new Map<string, { count: number; resetAt: number }>();

function canExecute(userId: string) {
  const now = Date.now();
  const current = executionWindows.get(userId);
  if (!current || current.resetAt <= now) {
    executionWindows.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (current.count >= 12) return false;
  current.count += 1;
  return true;
}

function normalizedOutput(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

async function executeCode(
  language: keyof typeof languageRuntimes,
  code: string,
  stdin: string,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Zentric-Coding-Hub/1.0",
      },
      body: JSON.stringify({
        compiler: languageRuntimes[language].compiler,
        code,
        stdin,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Compiler service returned ${response.status}.`);
    }

    return (await response.json()) as {
      status?: string;
      compiler_error?: string;
      compiler_message?: string;
      program_output?: string;
      program_error?: string;
      program_message?: string;
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function complete(messages: AIMessage[]) {
  if (process.env.GROQ_API_KEY) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.55,
      max_tokens: 1500,
    });
    return response.choices[0]?.message?.content ?? "";
  }

  if (process.env.OPENAI_API_KEY) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      temperature: 0.55,
      max_tokens: 1500,
    });
    return response.choices[0]?.message?.content ?? "";
  }

  throw new Error("No AI provider is configured.");
}

function extractJson(content: string) {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced ?? content.match(/\{[\s\S]*\}/)?.[0];
  if (!candidate) throw new Error("The AI did not return a valid challenge.");
  return JSON.parse(candidate);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  try {
    if (body.action === "run") {
      const language = String(body.language || "") as keyof typeof languageRuntimes;
      const code = String(body.code || "");
      const tests = Array.isArray(body.tests) ? body.tests.slice(0, 6) : [];
      const studyTopicId = typeof body.studyTopicId === "string" ? body.studyTopicId : "";
      const questionId = typeof body.questionId === "string" ? body.questionId : "";
      const submitForStudy = body.submitForStudy === true;

      if (!(language in languageRuntimes)) {
        return NextResponse.json({ error: "Unsupported programming language." }, { status: 400 });
      }
      if (!code.trim() || code.length > 20_000) {
        return NextResponse.json(
          { error: "Code must contain between 1 and 20,000 characters." },
          { status: 400 },
        );
      }
      if (!tests.length) {
        return NextResponse.json({ error: "No tests were provided." }, { status: 400 });
      }
      if (!canExecute(session.user.id)) {
        return NextResponse.json(
          { error: "Execution limit reached. Wait one minute and try again." },
          { status: 429 },
        );
      }

      const results = await Promise.all(
        tests.map(async (test: { stdin?: unknown; expectedOutput?: unknown }) => {
          const stdin = String(test.stdin ?? "").slice(0, 4000);
          const expectedOutput = String(test.expectedOutput ?? "").slice(0, 4000);
          try {
            const execution = await executeCode(language, code, stdin);
            const error =
              execution.compiler_error ||
              execution.compiler_message ||
              execution.program_error ||
              (execution.status && execution.status !== "0" ? execution.program_message : "");
            const actualOutput = execution.program_output || "";
            return {
              passed: !error && normalizedOutput(actualOutput) === normalizedOutput(expectedOutput),
              actual: normalizedOutput(actualOutput),
              expected: normalizedOutput(expectedOutput),
              error: error ? normalizedOutput(error) : undefined,
            };
          } catch (error) {
            return {
              passed: false,
              expected: normalizedOutput(expectedOutput),
              error:
                error instanceof Error
                  ? error.name === "AbortError"
                    ? "Execution timed out."
                    : error.message
                  : "Execution failed.",
            };
          }
        }),
      );

      let studyProgress:
        | {
            completedCount: number;
            totalQuestions: number;
            progressPercent: number;
            status: string;
          }
        | undefined;

      if (submitForStudy && studyTopicId && questionId && results.every((result) => result.passed)) {
        const topic = await prisma.studyTopic.findFirst({
          where: { id: studyTopicId, userId: session.user.id },
        });

        if (topic) {
          const questions = getPracticeQuestions(topic.name);
          const isValidQuestion = questions.some((question) => question.id === questionId);

          if (isValidQuestion) {
            await prisma.studyPracticeProgress.upsert({
              where: {
                userId_studyTopicId_questionId: {
                  userId: session.user.id,
                  studyTopicId,
                  questionId,
                },
              },
              create: {
                userId: session.user.id,
                studyTopicId,
                questionId,
              },
              update: {
                completedAt: new Date(),
              },
            });

            const completedCount = await prisma.studyPracticeProgress.count({
              where: { userId: session.user.id, studyTopicId },
            });
            const status = completedCount >= questions.length ? "completed" : "in_progress";

            await prisma.studyTopic.update({
              where: { id: studyTopicId },
              data: { status },
            });

            studyProgress = {
              completedCount,
              totalQuestions: questions.length,
              progressPercent: Math.round((completedCount / questions.length) * 100),
              status,
            };
          }
        }
      }

      return NextResponse.json({
        language: languageRuntimes[language].label,
        results,
        studyProgress,
      });
    }

    if (body.action === "generate") {
      const topic = String(body.topic || "Arrays").slice(0, 40);
      const difficulty = String(body.difficulty || "Medium").slice(0, 20);
      const content = await complete([
        {
          role: "system",
          content: `You create concise, language-neutral coding interview challenges for Zentric Coding Hub.
Return only valid JSON with this exact shape:
{
  "id": "ai-kebab-case-id",
  "title": "Short challenge title",
  "topic": "Topic",
  "difficulty": "Easy|Medium|Hard",
  "description": "Clear problem statement",
  "examples": [{"input": "human readable input", "output": "human readable output"}],
  "constraints": ["constraint one", "constraint two"],
  "functionName": "camelCaseFunctionName",
  "inputFormat": "Precise standard-input format",
  "outputFormat": "Precise standard-output format",
  "tests": [{"stdin": "complete plain-text stdin", "expectedOutput": "complete plain-text stdout"}],
  "hint": "One useful hint"
}
Provide 4 deterministic tests. Keep input parsing practical in C, C++, Java, Python, and JavaScript. Do not use nested objects, JSON parsing, or language-specific values.`,
        },
        {
          role: "user",
          content: `Create one ${difficulty} challenge about ${topic}. Avoid obscure tricks and make it suitable for direct browser practice.`,
        },
      ]);
      const challenge = extractJson(content);

      if (
        !challenge.title ||
        !challenge.functionName ||
        !Array.isArray(challenge.tests) ||
        challenge.tests.length < 2
      ) {
        throw new Error("The generated challenge was incomplete.");
      }

      return NextResponse.json({ challenge });
    }

    if (body.action === "review") {
      const code = String(body.code || "").slice(0, 12000);
      const title = String(body.title || "Coding challenge").slice(0, 120);
      const description = String(body.description || "").slice(0, 2500);
      const languageKey = String(body.language || "javascript") as keyof typeof languageRuntimes;
      const language =
        languageKey in languageRuntimes ? languageRuntimes[languageKey].label : "JavaScript";

      if (!code.trim()) {
        return NextResponse.json({ error: "Add code before requesting a review." }, { status: 400 });
      }

      const review = await complete([
        {
          role: "system",
          content: `You are Zentric's senior ${language} code reviewer.
Review solutions for correctness, edge cases, time and space complexity, readability, and maintainability.
Use this compact format:
## Verdict
One sentence.
## What works
- bullets
## Improve next
- prioritized bullets
## Complexity
- Time: ...
- Space: ...
## Suggested version
A ${language} code block only when an improved version is genuinely useful.
Do not claim you executed the code.`,
        },
        {
          role: "user",
          content: `Challenge: ${title}
Problem: ${description}

Solution (${language}):
\`\`\`
${code}
\`\`\``,
        },
      ]);

      return NextResponse.json({ review });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    console.error("Coding Hub AI error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The Coding Hub AI request could not be completed.",
      },
      { status: 500 },
    );
  }
}
