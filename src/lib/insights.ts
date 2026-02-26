/**
 * Dashboard coaching insights engine
 * Generates natural-language, actionable suggestions from analytics data
 */

interface InsightData {
    totalApps: number;
    needsFollowUp: number;
    interviewConversionRate: number;
    offerRate: number;
    ghostedRate: number;
    rejectedCount: number;
    offerCount: number;
    interviewCount: number;
    recentApps: Array<{
        id: string;
        companyName: string;
        positionTitle: string;
        status: string;
        createdAt: Date;
    }>;
    statusCounts: Array<{ status: string; count: number }>;
}

export interface Insight {
    id: string;
    type: "action" | "success" | "warning" | "tip";
    emoji: string;
    title: string;
    description: string;
    priority: number; // 1 = highest
}

export function generateInsights(data: InsightData): Insight[] {
    const insights: Insight[] = [];

    // Follow-up nudges
    if (data.needsFollowUp > 0) {
        insights.push({
            id: "follow-up",
            type: "action",
            emoji: "📬",
            title: `Follow up with ${data.needsFollowUp} ${data.needsFollowUp === 1 ? "company" : "companies"}`,
            description: `${data.needsFollowUp} application${data.needsFollowUp === 1 ? " has" : "s have"} been waiting 14+ days. A polite follow-up can boost your chances.`,
            priority: 1,
        });
    }

    // Interview rate coaching
    if (data.totalApps >= 5) {
        if (data.interviewConversionRate >= 30) {
            insights.push({
                id: "interview-rate-good",
                type: "success",
                emoji: "🔥",
                title: `Interview rate is ${data.interviewConversionRate}% — excellent!`,
                description: "You're getting interviews at a great rate. Your resume and targeting are working well.",
                priority: 3,
            });
        } else if (data.interviewConversionRate < 10) {
            insights.push({
                id: "interview-rate-low",
                type: "tip",
                emoji: "💡",
                title: "Your interview rate is below 10%",
                description: "Consider tailoring your resume for each role, or focus on roles that match your strongest skills.",
                priority: 2,
            });
        }
    }

    // Offer celebration
    if (data.offerCount > 0) {
        insights.push({
            id: "offer-celebration",
            type: "success",
            emoji: "🎉",
            title: `You have ${data.offerCount} offer${data.offerCount > 1 ? "s" : ""}!`,
            description: "Congratulations! Take time to evaluate and negotiate. You've earned this.",
            priority: 1,
        });
    }

    // High ghosted rate
    if (data.ghostedRate > 30 && data.totalApps >= 5) {
        insights.push({
            id: "ghosted-warning",
            type: "warning",
            emoji: "👻",
            title: `${data.ghostedRate}% of applications went silent`,
            description: "Try applying directly through company websites and following up after 1 week.",
            priority: 2,
        });
    }

    // Applications with no activity
    const screeningCount = data.statusCounts.find((s) => s.status === "SCREENING")?.count || 0;
    if (screeningCount > 3) {
        insights.push({
            id: "screening-pile-up",
            type: "tip",
            emoji: "📋",
            title: `${screeningCount} applications stuck in screening`,
            description: "Consider reaching out to recruiters directly to move things forward.",
            priority: 2,
        });
    }

    // Momentum check
    if (data.totalApps === 0) {
        insights.push({
            id: "get-started",
            type: "action",
            emoji: "🚀",
            title: "Start your job search journey",
            description: "Add your first application and let us help you stay organized and focused.",
            priority: 1,
        });
    } else if (data.totalApps < 5) {
        insights.push({
            id: "build-momentum",
            type: "tip",
            emoji: "⚡",
            title: "Build momentum — aim for 5+ applications",
            description: "Studies show that applying to at least 5 positions per week gives the best results.",
            priority: 3,
        });
    }

    // Sort by priority
    return insights.sort((a, b) => a.priority - b.priority).slice(0, 4);
}
