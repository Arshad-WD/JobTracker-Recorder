"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

async function getSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }
    return session;
}

export async function getGoals() {
    const session = await getSession();

    return (prisma as any).goal.findMany({
        where: { userId: session.user.id, isActive: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function createGoal(data: {
    title: string;
    goalType: string;
    targetCount: number;
    endDate?: string | null;
}) {
    const session = await getSession();


    const goal = await (prisma as any).goal.create({
        data: {
            userId: session.user.id,
            title: data.title,
            goalType: data.goalType,
            targetCount: data.targetCount,
            endDate: data.endDate ? new Date(data.endDate) : null,
        },
    });

    revalidatePath("/goals");
    revalidatePath("/dashboard");
    return { success: true, data: goal };
}

export async function updateGoalProgress(id: string, increment: number = 1) {
    const session = await getSession();


    const goal = await (prisma as any).goal.findFirst({
        where: { id, userId: session.user.id },
    });

    if (!goal) throw new Error("Goal not found");


    const updated = await (prisma as any).goal.update({
        where: { id },
        data: { currentCount: { increment } },
    });

    revalidatePath("/goals");
    revalidatePath("/dashboard");
    return { success: true, data: updated };
}

export async function deleteGoal(id: string) {
    const session = await getSession();

    await (prisma as any).goal.deleteMany({
        where: { id, userId: session.user.id },
    });

    revalidatePath("/goals");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function getStreakData() {
    const session = await getSession();
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });
    if (!user) return null;

    const u = user as any;
    return {
        currentStreak: u.currentStreak ?? 0,
        longestStreak: u.longestStreak ?? 0,
        lastActiveDate: u.lastActiveDate ?? null,
    };
}

export async function updateStreak() {
    const session = await getSession();
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) return;

    const u = user as any;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = u.lastActiveDate
        ? new Date(u.lastActiveDate)
        : null;

    if (lastActive) {
        lastActive.setHours(0, 0, 0, 0);
    }

    // Already active today
    if (lastActive && lastActive.getTime() === today.getTime()) {
        return;
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = 1;
    if (lastActive && lastActive.getTime() === yesterday.getTime()) {
        // Consecutive day
        newStreak = (u.currentStreak ?? 0) + 1;
    }

    const longestStreak = Math.max(u.longestStreak ?? 0, newStreak);

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            currentStreak: newStreak,
            longestStreak,
            lastActiveDate: today,
        } as any,
    });

    revalidatePath("/dashboard");
}
