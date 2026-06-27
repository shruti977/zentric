import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type StoredJobApplication = {
  id: string;
  company: string;
  role: string;
  status: string;
  location: string | null;
  url: string | null;
  notes: string | null;
  appliedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

const careerDb = prisma as typeof prisma & {
  jobApplication: {
    create(args: unknown): Promise<StoredJobApplication>;
  };
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!String(body.company || "").trim() || !String(body.role || "").trim()) {
    return NextResponse.json({ error: "Company and role are required" }, { status: 400 });
  }

  const job = await careerDb.jobApplication.create({
    data: {
      userId: session.user.id,
      company: String(body.company).trim().slice(0, 120),
      role: String(body.role).trim().slice(0, 120),
      status: String(body.status || "wishlist").slice(0, 40),
      location: body.location ? String(body.location).slice(0, 120) : null,
      url: body.url ? String(body.url).slice(0, 500) : null,
      notes: body.notes ? String(body.notes).slice(0, 3_000) : null,
      appliedAt: body.appliedAt ? new Date(body.appliedAt) : null,
    },
  });

  return NextResponse.json(job, { status: 201 });
}
