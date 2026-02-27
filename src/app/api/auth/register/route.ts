import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log(`[REGISTER] Attempting registration for: ${body.email}`);

        const validated = registerSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email },
        });

        if (existingUser) {
            console.log(`[REGISTER] User already exists: ${validated.email}`);
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validated.password, 12);

        // Create user and welcome notification in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name: validated.name,
                    email: validated.email,
                    hashedPassword,
                },
            });

            await tx.notification.create({
                data: {
                    userId: user.id,
                    title: "Welcome to JobTracker! 🎉",
                    message: "Start adding your job applications and never lose track of your job search again.",
                    type: "SYSTEM",
                },
            });

            return user;
        });

        console.log(`[REGISTER] Successfully created account for: ${validated.email}`);

        return NextResponse.json(
            { success: true, message: "Account created successfully" },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }

        console.error("[REGISTER] Registration error:", error);

        // Return a more descriptive error if it's a Prisma error
        if (error instanceof Error && error.message.includes("Can't reach database")) {
            return NextResponse.json(
                { error: "Database connection failed. Please check your environment variables." },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: "Something went wrong during registration. Please try again later." },
            { status: 500 }
        );
    }
}
