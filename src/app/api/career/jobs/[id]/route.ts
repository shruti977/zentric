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
    findFirst(args: unknown): Promise<StoredJobApplication | null>;
    update(args: unknown): Promise<StoredJobApplication>;
    delete(args: unknown): Promise<StoredJobApplication>;
  };
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await careerDb.jobApplication.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  const body = await req.json();
  const updated = await careerDb.jobApplication.update({
    where: { id },
    data: {
      company: body.company !== undefined ? String(body.company).trim().slice(0, 120) : existing.company,
      role: body.role !== undefined ? String(body.role).trim().slice(0, 120) : existing.role,
      status: body.status !== undefined ? String(body.status).slice(0, 40) : existing.status,
      location: body.location !== undefined ? String(body.location || "").slice(0, 120) || null : existing.location,
      url: body.url !== undefined ? String(body.url || "").slice(0, 500) || null : existing.url,
      notes: body.notes !== undefined ? String(body.notes || "").slice(0, 3_000) || null : existing.notes,
      appliedAt: body.appliedAt !== undefined ? (body.appliedAt ? new Date(body.appliedAt) : null) : existing.appliedAt,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await careerDb.jobApplication.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  await careerDb.jobApplication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
