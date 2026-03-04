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
        const { companyName, positionTitle, category, jobType, notes } = body;

        const categoryPrompts: Record<string, string> = {
            technical: `Generate 8 technical interview questions for a ${positionTitle} position at ${companyName}.
${jobType ? `Job type: ${jobType}` : ""}
${notes ? `Context: ${notes}` : ""}

Include:
- 3 coding/algorithm questions
- 2 system design questions
- 2 technology-specific questions
- 1 debugging/troubleshooting scenario

For each question:
- State the question clearly
- Provide a brief hint about what the interviewer is looking for
- Rate difficulty: Easy, Medium, or Hard`,

            behavioral: `Generate 8 behavioral interview questions for a ${positionTitle} position at ${companyName}.

Include STAR method guidance for each:
- Questions about leadership, teamwork, conflict resolution, failure, success
- What the interviewer wants to hear
- Brief example answer structure`,

            system_design: `Generate 5 system design interview questions appropriate for a ${positionTitle} at ${companyName}.
${notes ? `Context: ${notes}` : ""}

For each:
- Clear problem statement
- Key areas to discuss (scalability, reliability, etc.)
- Time estimation (15, 30, or 45 minutes)
- Key concepts the interviewer expects`,

            culture_fit: `Generate 6 culture fit interview questions for ${companyName}.

Include:
- Questions about work style and values
- Questions about team dynamics
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
