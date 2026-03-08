import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWithAI, type AIProviderType } from "@/lib/ai-provider";

export const dynamic = "force-dynamic";

const PROMPTS: Record<string, (_data: Record<string, string>) => string> = {
    cover_letter: (d) => `Write a professional, compelling cover letter for a ${d.positionTitle} position at ${d.companyName}.
${d.jobType ? `Job type: ${d.jobType}` : ""}
${d.notes ? `Additional context: ${d.notes}` : ""}

Guidelines:
- Keep it concise (250-350 words)
- Show enthusiasm for the company
- Highlight relevant skills
- Use a professional but personable tone
- Include a strong opening and closing
- Do NOT include placeholder brackets like [Your Name]
- Write it ready to use as-is`,

    resume_tips: (d) => `Give me 5-7 specific, actionable resume tips for someone applying to a ${d.positionTitle} position at ${d.companyName}.
${d.jobType ? `Job type: ${d.jobType}` : ""}
${d.notes ? `Context: ${d.notes}` : ""}

For each tip:
- Be specific to this role/company
- Include example bullet points they could use
- Focus on quantifiable achievements
- Use strong action verbs`,

    interview_tips: (d) => `Provide interview preparation tips for a ${d.positionTitle} position at ${d.companyName}.
${d.jobType ? `Job type: ${d.jobType}` : ""}
${d.notes ? `Context: ${d.notes}` : ""}

Include:
1. Key areas to research about the company
2. 5 likely interview questions with suggested answers
3. Questions to ask the interviewer
4. Common pitfalls to avoid
5. How to make a strong first impression`,

    follow_up_email: (d) => `Write a professional follow-up email for a ${d.positionTitle} position at ${d.companyName}.
${d.notes ? `Context: ${d.notes}` : ""}

Guidelines:
- Brief and respectful (100-150 words)
- Show continued interest
- Reference something specific from the application/interview
- Include a clear call to action
- Professional but warm tone`,
};

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
                        "Please configure your AI provider and API key in Settings to use AI features.",
                },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { type, companyName, positionTitle, jobType, notes } = body;

        if (!type || !PROMPTS[type]) {
            return NextResponse.json(
                { error: "Invalid generation type" },
                { status: 400 }
            );
        }

        const promptFn = PROMPTS[type];
        const prompt = promptFn({
            companyName: companyName || "the company",
            positionTitle: positionTitle || "the position",
            jobType: jobType || "",
            notes: notes || "",
        });

        const result = await generateWithAI(
            {
                provider: u.aiProvider as AIProviderType,
                apiKey: u.aiApiKey,
                model: u.aiModel,
            },
            prompt
        );

        return NextResponse.json({ content: result });
    } catch (error) {
        console.error("AI generation error:", error);
        return NextResponse.json(
            {
                error: "Generation failed",
                message:
                    error instanceof Error ? error.message : "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}
