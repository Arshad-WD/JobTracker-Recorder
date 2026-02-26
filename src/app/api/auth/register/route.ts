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
        const validated = registerSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validated.password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name: validated.name,
                email: validated.email,
                hashedPassword,
            },
        });

        // Create welcome notification
        await prisma.notification.create({
            data: {
                userId: user.id,
                title: "Welcome to JobTracker! 🎉",
                message:
                    "Start adding your job applications and never lose track of your job search again.",
                type: "SYSTEM",
            },
        });

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

        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
