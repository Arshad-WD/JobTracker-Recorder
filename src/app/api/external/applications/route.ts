import { prisma } from "@/lib/prisma";
import { applicationCreateSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const apiKey = request.headers.get("X-API-Key");

        if (!apiKey) {
            return NextResponse.json({ error: "API Key is required" }, { status: 401 });
        }

        // Find user by API Key
        const user = await prisma.user.findUnique({
            where: { apiKey } as any,
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
        }

        const body = await request.json();
        const validated = applicationCreateSchema.parse(body);

        // Duplicate detection
        const existing = await prisma.application.findFirst({
            where: {
                userId: user.id,
                companyName: { equals: validated.companyName, mode: "insensitive" },
                positionTitle: { equals: validated.positionTitle, mode: "insensitive" },
                archived: false,
            },
        });

        if (existing) {
            return NextResponse.json({
                error: "Duplicate application",
                id: existing.id
            }, { status: 409 });
        }

        // Create application
        const app = await prisma.application.create({
            data: {
                ...validated,
                userId: user.id,
                recruiterEmail: validated.recruiterEmail || null,
                jobLink: validated.jobLink || null,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Application recorded",
            data: app
        }, { status: 201 });

    } catch (error: any) {
        console.error("[EXTERNAL_API_ERROR]", error);

        if (error.name === "ZodError") {
            return NextResponse.json({
                error: "Validation failed",
                details: error.errors
            }, { status: 400 });
        }

        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}

// OPTIONS for CORS (Chrome Extension will send preflight requests)
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
        },
    });
}
