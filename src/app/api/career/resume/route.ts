import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { createRequire } from "module";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

type PdfParse = (dataBuffer: Buffer) => Promise<{ text: string }>;

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse/lib/pdf-parse.js") as PdfParse;

function cleanExtractedText(value: string) {
  return value
    .replace(/\u0000/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 20_000);
}

function looksReadable(value: string) {
  const visibleCharacters = value.replace(/\s/g, "").length;
  if (visibleCharacters < 20) return false;
  const replacementCharacters = (value.match(/\uFFFD/g) ?? []).length;
  return replacementCharacters / Math.max(visibleCharacters, 1) < 0.08;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("resume");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Please upload a resume file." }, { status: 400 });
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Please upload a resume smaller than 8MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name || "resume";
  const fileType = file.type || "unknown";
  const lowerName = fileName.toLowerCase();

  try {
    let extractedText = "";

    if (fileType.includes("pdf") || lowerName.endsWith(".pdf")) {
      const result = await pdfParse(buffer);
      extractedText = result.text;
    } else if (
      fileType.includes("wordprocessingml") ||
      fileType.includes("msword") ||
      lowerName.endsWith(".docx") ||
      lowerName.endsWith(".doc")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      const decoded = buffer.toString("utf8");
      extractedText = looksReadable(decoded) ? decoded : "";
    }

    const text = cleanExtractedText(extractedText);
    if (!text) {
      return NextResponse.json(
        {
          error:
            "I could not extract readable text from this file. Try PDF, DOCX, TXT, or paste the resume text directly.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      fileName,
      fileType,
      size: file.size,
      text,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Resume parsing failed for this file. Try exporting it as PDF/DOCX, or paste the resume text directly.",
      },
      { status: 422 }
    );
  }
}
