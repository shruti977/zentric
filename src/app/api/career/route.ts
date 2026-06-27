import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeCareerProfile } from "@/lib/career-engine";

const defaultDreamRole = "Your Dream Role";
const defaultTargetCompany = "Your Target Company";

type StoredCareerProfile = {
  id: string;
  userId: string;
  dreamRole: string;
  targetCompany: string;
  resumeText: string | null;
  skillsText: string | null;
  projectsText: string | null;
  experienceText: string | null;
  educationText: string | null;
  preferredKeywords: string | null;
  jobDescriptionText: string | null;
  createdAt: Date;
  updatedAt: Date;
};

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
  careerProfile: {
    findUnique(args: unknown): Promise<StoredCareerProfile | null>;
    upsert(args: unknown): Promise<StoredCareerProfile>;
  };
  jobApplication: {
    findMany(args: unknown): Promise<StoredJobApplication[]>;
  };
};

function normalizeCareerDefaults<T extends Partial<StoredCareerProfile> | null>(profile: T) {
  if (!profile) return profile;
  if (profile.dreamRole === "Google SDE" && profile.targetCompany === "Google") {
    return {
      ...profile,
      dreamRole: defaultDreamRole,
      targetCompany: defaultTargetCompany,
    };
  }
  return profile;
}

function cleanCareerBody(body: Record<string, unknown>) {
  const dreamRole = String(body.dreamRole || defaultDreamRole).slice(0, 120);
  const targetCompany = String(body.targetCompany || defaultTargetCompany).slice(0, 80);

  return {
    dreamRole: dreamRole === "Google SDE" && targetCompany === "Google" ? defaultDreamRole : dreamRole,
    targetCompany: dreamRole === "Google SDE" && targetCompany === "Google" ? defaultTargetCompany : targetCompany,
    resumeText: String(body.resumeText || "").slice(0, 20_000),
    skillsText: String(body.skillsText || "").slice(0, 6_000),
    projectsText: String(body.projectsText || "").slice(0, 10_000),
    experienceText: String(body.experienceText || "").slice(0, 10_000),
    educationText: String(body.educationText || "").slice(0, 5_000),
    preferredKeywords: String(body.preferredKeywords || "").slice(0, 2_000),
    jobDescriptionText: String(body.jobDescriptionText || "").slice(0, 20_000),
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [profile, jobs] = await Promise.all([
    careerDb.careerProfile.findUnique({ where: { userId: session.user.id } }),
    careerDb.jobApplication.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const normalizedProfile = normalizeCareerDefaults(profile);

  return NextResponse.json({
    profile: normalizedProfile,
    analysis: analyzeCareerProfile(normalizedProfile),
    jobs,
  });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = cleanCareerBody(await req.json());
  const profile = await careerDb.careerProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      ...body,
    },
    update: {
      ...body,
    },
  });

  const normalizedProfile = normalizeCareerDefaults(profile);

  return NextResponse.json({
    profile: normalizedProfile,
    analysis: analyzeCareerProfile(normalizedProfile),
  });
}
