import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const LEETCODE_GQL = "https://leetcode.com/graphql/";

async function lcFetch(query: string, variables: Record<string, unknown>) {
  const res = await fetch(LEETCODE_GQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referer": "https://leetcode.com",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`);
  return res.json();
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const username = req.nextUrl.searchParams.get("username")?.trim();
  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  try {
    // Step 1: Fetch profile, recent submissions, and daily challenge in parallel
    const [profileRes, recentRes, dailyRes] = await Promise.all([
      lcFetch(
        `query userProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
            profile {
              ranking
              reputation
              solutionCount
            }
          }
          allQuestionsCount {
            difficulty
            count
          }
        }`,
        { username }
      ),
      lcFetch(
        `query recentAC($username: String!) {
          recentAcSubmissionList(username: $username, limit: 15) {
            id
            title
            titleSlug
            timestamp
          }
        }`,
        { username }
      ),
      lcFetch(
        `query questionOfToday {
          activeDailyCodingChallengeQuestion {
            date
            link
            question {
              frontendQuestionId: questionFrontendId
              title
              titleSlug
              difficulty
              acRate
              topicTags {
                name
                slug
              }
            }
          }
        }`,
        {}
      ),
    ]);

    if (!profileRes.data?.matchedUser) {
      return NextResponse.json(
        { error: `LeetCode user "${username}" not found or profile is private` },
        { status: 404 }
      );
    }

    // Step 2: Determine recommended difficulty based on solved counts
    const acCounts: { difficulty: string; count: number }[] =
      profileRes.data.matchedUser.submitStats.acSubmissionNum;
    const easySolved = acCounts.find((c) => c.difficulty === "Easy")?.count ?? 0;
    const mediumSolved = acCounts.find((c) => c.difficulty === "Medium")?.count ?? 0;
    const recommendedDifficulty =
      easySolved < 50 ? "EASY" : mediumSolved < 100 ? "MEDIUM" : "HARD";

    // Step 3: Fetch suggested problems at recommended difficulty
    const recentSlugs = new Set(
      (recentRes.data?.recentAcSubmissionList ?? []).map(
        (s: { titleSlug: string }) => s.titleSlug
      )
    );

    const suggestRes = await lcFetch(
      `query problemsetQuestionList($limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
          categorySlug: ""
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          questions: data {
            frontendQuestionId: questionFrontendId
            title
            titleSlug
            difficulty
            acRate
            paidOnly: isPaidOnly
            topicTags {
              name
              slug
            }
          }
        }
      }`,
      { limit: 50, skip: 0, filters: { difficulty: recommendedDifficulty } }
    );

    const allSuggestions: {
      frontendQuestionId: string;
      title: string;
      titleSlug: string;
      difficulty: string;
      acRate: number;
      paidOnly: boolean;
      topicTags: { name: string; slug: string }[];
    }[] = suggestRes.data?.problemsetQuestionList?.questions ?? [];

    // Filter out paid and recently solved
    const suggestions = allSuggestions
      .filter((q) => !q.paidOnly && !recentSlugs.has(q.titleSlug))
      .slice(0, 10);

    return NextResponse.json({
      user: profileRes.data.matchedUser,
      allCounts: profileRes.data.allQuestionsCount,
      recentSubmissions: recentRes.data?.recentAcSubmissionList ?? [],
      dailyChallenge: dailyRes.data?.activeDailyCodingChallengeQuestion ?? null,
      suggestions,
      recommendedDifficulty: recommendedDifficulty.charAt(0) + recommendedDifficulty.slice(1).toLowerCase(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch LeetCode data. Please try again." },
      { status: 500 }
    );
  }
}

