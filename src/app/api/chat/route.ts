import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are Zentric AI, a helpful assistant integrated into the Zentric AI Growth Operating System.
You help students, developers, and professionals with:
- Task planning and productivity
- DSA problems and coding practice
- Study strategies and learning paths
- Career development and interview preparation
- Research and information gathering
- Code review and debugging

Be concise, practical, and encouraging. Format responses with markdown when helpful.`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json();
  const { conversationId, message } = body;

  if (!conversationId || !message?.trim()) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: session.user.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!conversation) {
    return new Response(JSON.stringify({ error: "Conversation not found" }), { status: 404 });
  }

  await prisma.message.create({
    data: { conversationId, role: "user", content: message.trim() },
  });

  if (conversation.messages.length === 0) {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { title: message.trim().slice(0, 60) },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const fallback = `I am Zentric AI! To enable real AI responses, add your **free** Gemini API key at https://aistudio.google.com/app/apikey and set it as GEMINI_API_KEY in your Vercel environment variables.\n\nYour message: "${message}"`;
    await prisma.message.create({
      data: { conversationId, role: "assistant", content: fallback },
    });
    return new Response(JSON.stringify({ content: fallback }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const history = conversation.messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood! I am Zentric AI, ready to help." }] },
        ...history,
      ],
    });

    const result = await chat.sendMessageStream(message.trim());

    const encoder = new TextEncoder();
    let fullContent = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              fullContent += text;
              controller.enqueue(encoder.encode(text));
            }
          }
        } finally {
          await prisma.message.create({
            data: { conversationId, role: "assistant", content: fullContent },
          });
          await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    const errorMsg = "Sorry, I encountered an error connecting to Gemini AI. Please try again.";
    await prisma.message.create({
      data: { conversationId, role: "assistant", content: errorMsg },
    });
    return new Response(JSON.stringify({ content: errorMsg }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
