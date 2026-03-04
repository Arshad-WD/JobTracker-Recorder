import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWithAI, type AIProviderType } from "@/lib/ai-provider";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        const u = user as any;

        if (!u?.aiProvider || !u?.aiApiKey) {
            return NextResponse.json(
                {
                    error: "AI not configured",
                    message:
                        "Please configure your AI provider and API key in Settings.",
                },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { companyName, positionTitle, category, jobType, notes, resumeText } = body;

        // Build resume context block
        const resumeContext = resumeText
            ? `\n\nCandidate's Resume:\n${resumeText}\n\nIMPORTANT: Tailor the questions specifically to the candidate's resume — reference their skills, projects, experience, and technologies listed. Ask about their specific work history and how it relates to the ${positionTitle} role at ${companyName}.`
            : "";

        const categoryPrompts: Record<string, string> = {
            technical: `Generate 8 technical interview questions for a ${positionTitle} position at ${companyName}.
${jobType ? `Job type: ${jobType}` : ""}
${notes ? `Context: ${notes}` : ""}${resumeContext}

Include:
- 3 coding/algorithm questions${resumeText ? " (based on technologies from the resume)" : ""}
- 2 system design questions${resumeText ? " (related to systems the candidate has built)" : ""}
- 2 technology-specific questions${resumeText ? " (targeting the candidate's listed skills)" : ""}
- 1 debugging/troubleshooting scenario

For each question:
- State the question clearly
- Provide a brief hint about what the interviewer is looking for
- Rate difficulty: Easy, Medium, or Hard`,

            behavioral: `Generate 8 behavioral interview questions for a ${positionTitle} position at ${companyName}.
${resumeContext}

Include STAR method guidance for each:
- Questions about leadership, teamwork, conflict resolution, failure, success${resumeText ? "\n- Reference specific experiences or projects from the candidate's resume" : ""}
- What the interviewer wants to hear
- Brief example answer structure`,

            system_design: `Generate 5 system design interview questions appropriate for a ${positionTitle} at ${companyName}.
${notes ? `Context: ${notes}` : ""}${resumeContext}

For each:
- Clear problem statement${resumeText ? " (relate to systems similar to what the candidate has worked on)" : ""}
- Key areas to discuss (scalability, reliability, etc.)
- Time estimation (15, 30, or 45 minutes)
- Key concepts the interviewer expects`,

            culture_fit: `Generate 6 culture fit interview questions for ${companyName}.
${resumeContext}

Include:
- Questions about work style and values
- Questions about team dynamics${resumeText ? "\n- Questions referencing the candidate's career trajectory and motivations" : ""}
- What makes a good answer
- Red flags to avoid`,
        };

        const selectedCategory = category || "technical";
        const prompt =
            categoryPrompts[selectedCategory] || categoryPrompts.technical;

        const result = await generateWithAI(
            {
                provider: u.aiProvider as AIProviderType,
                apiKey: u.aiApiKey,
                model: u.aiModel,
            },
            prompt
        );

        return NextResponse.json({ content: result, category: selectedCategory });
    } catch (error) {
        console.error("Interview prep error:", error);
        return NextResponse.json(
            {
                error: "Generation failed",
                message:
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}
