"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { applicationCreateSchema, applicationUpdateSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import type { ApplicationStatus } from "@prisma/client";

async function getSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }
    return session;
}

export async function getApplications(archived = false) {
    const session = await getSession();
    return prisma.application.findMany({
        where: {
            userId: session.user.id,
            archived,
        },
        include: {
            interviews: {
                orderBy: { roundNumber: "asc" },
            },
        },
        orderBy: { updatedAt: "desc" },
    });
}

export async function getApplication(id: string) {
    const session = await getSession();
    return prisma.application.findFirst({
        where: {
            id,
            userId: session.user.id,
        },
        include: {
            interviews: {
                orderBy: { roundNumber: "asc" },
            },
            attachments: true,
        },
    });
}

export async function createApplication(data: unknown) {
    const session = await getSession();
    const validated = applicationCreateSchema.parse(data);

    // Duplicate detection
    const existing = await prisma.application.findFirst({
        where: {
            userId: session.user.id,
            companyName: { equals: validated.companyName, mode: "insensitive" },
            positionTitle: { equals: validated.positionTitle, mode: "insensitive" },
            archived: false,
        },
    });

    if (existing) {
        return { error: "duplicate", existingId: existing.id };
    }

    const app = await prisma.application.create({
        data: {
            ...validated,
            userId: session.user.id,
            recruiterEmail: validated.recruiterEmail || null,
            jobLink: validated.jobLink || null,
        },
        include: { interviews: true },
    });

    revalidatePath("/dashboard");
    revalidatePath("/applications");
    return { success: true, data: app };
}

export async function updateApplication(data: unknown) {
    const session = await getSession();
    const validated = applicationUpdateSchema.parse(data);
    const { id, ...updateData } = validated;

    const app = await prisma.application.findFirst({
        where: { id, userId: session.user.id },
    });

    if (!app) throw new Error("Application not found");

    const updated = await prisma.application.update({
        where: { id },
        data: {
            ...updateData,
            lastActivityAt: new Date(),
            recruiterEmail: updateData.recruiterEmail || null,
            jobLink: updateData.jobLink || null,
        },
        include: { interviews: true },
    });

    revalidatePath("/dashboard");
    revalidatePath("/applications");
    return { success: true, data: updated };
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
    const session = await getSession();
    const app = await prisma.application.findFirst({
        where: { id, userId: session.user.id },
    });

    if (!app) throw new Error("Application not found");

    const updated = await prisma.application.update({
        where: { id },
        data: { status, lastActivityAt: new Date() },
        include: { interviews: true },
    });

    // Create notification for status change
    await prisma.notification.create({
        data: {
            userId: session.user.id,
            title: "Status Updated",
            message: `${app.companyName} - ${app.positionTitle} moved to ${status}`,
            type: "STATUS_CHANGE",
            link: `/applications?id=${id}`,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath("/applications");
    return { success: true, data: updated };
}

export async function deleteApplication(id: string) {
    const session = await getSession();
    await prisma.application.deleteMany({
        where: { id, userId: session.user.id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/applications");
    return { success: true };
}

export async function archiveApplication(id: string, archive: boolean) {
    const session = await getSession();
    await prisma.application.updateMany({
        where: { id, userId: session.user.id },
        data: { archived: archive, lastActivityAt: new Date() },
    });

    revalidatePath("/dashboard");
    revalidatePath("/applications");
    revalidatePath("/archived");
    return { success: true };
}

export async function searchApplications(query: string) {
    const session = await getSession();
    if (!query.trim()) return [];

    const searchTerm = `%${query.toLowerCase()}%`;

    return prisma.application.findMany({
        where: {
            userId: session.user.id,
            OR: [
                { companyName: { contains: query, mode: "insensitive" } },
                { positionTitle: { contains: query, mode: "insensitive" } },
                { recruiterName: { contains: query, mode: "insensitive" } },
                { recruiterEmail: { contains: query, mode: "insensitive" } },
                { recruiterPhone: { contains: query, mode: "insensitive" } },
                { location: { contains: query, mode: "insensitive" } },
                { notes: { contains: query, mode: "insensitive" } },
            ],
        },
        include: {
            interviews: {
                orderBy: { roundNumber: "asc" },
            },
        },
        orderBy: { updatedAt: "desc" },
        take: 20,
    });
}

export async function getAnalytics() {
    const session = await getSession();
    const userId = session.user.id;

    const [
        totalApps,
        statusCounts,
        platformCounts,
        jobTypeCounts,
        monthlyApps,
        interviewCount,
        offerCount,
        recentApps,
    ] = await Promise.all([
        prisma.application.count({ where: { userId, archived: false } }),
        prisma.application.groupBy({
            by: ["status"],
            where: { userId, archived: false },
            _count: true,
        }),
        prisma.application.groupBy({
            by: ["platform"],
            where: { userId, archived: false },
            _count: true,
        }),
        prisma.application.groupBy({
            by: ["jobType"],
            where: { userId, archived: false },
            _count: true,
        }),
        prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "appliedDate") as month, COUNT(*)::int as count
      FROM "Application"
      WHERE "userId" = ${userId} AND "archived" = false
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    ` as Promise<Array<{ month: Date; count: number }>>,
        prisma.interview.count({
            where: { application: { userId } },
        }),
        prisma.application.count({
            where: { userId, status: "OFFER", archived: false },
        }),
        prisma.application.findMany({
            where: { userId, archived: false },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, companyName: true, positionTitle: true, status: true, createdAt: true },
        }),
    ]);

    const interviewConversionRate = totalApps > 0
        ? Math.round((interviewCount / totalApps) * 100)
        : 0;

    const offerRate = totalApps > 0
        ? Math.round((offerCount / totalApps) * 100)
        : 0;

    const rejectedCount = statusCounts.find(s => s.status === "REJECTED")?._count || 0;
    const rejectionRate = totalApps > 0
        ? Math.round((rejectedCount / totalApps) * 100)
        : 0;

    const ghostedCount = statusCounts.find(s => s.status === "GHOSTED")?._count || 0;
    const ghostedRate = totalApps > 0
        ? Math.round((ghostedCount / totalApps) * 100)
        : 0;

    // Applications needing follow-up
    const needsFollowUp = await prisma.application.count({
        where: {
            userId,
            archived: false,
            status: { in: ["APPLIED", "SCREENING"] },
            lastActivityAt: {
                lt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            },
        },
    });

    return {
        totalApps,
        statusCounts: statusCounts.map(s => ({ status: s.status, count: s._count })),
        platformCounts: platformCounts.map(p => ({ platform: p.platform, count: p._count })),
        jobTypeCounts: jobTypeCounts.map(j => ({ jobType: j.jobType, count: j._count })),
        monthlyApps,
        interviewConversionRate,
        offerRate,
        rejectionRate,
        ghostedRate,
        offerCount,
        interviewCount,
        rejectedCount,
        ghostedCount,
        needsFollowUp,
        recentApps,
    };
}

export async function getNotifications() {
    const session = await getSession();
    return prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
}

export async function markNotificationRead(id: string) {
    const session = await getSession();
    await prisma.notification.updateMany({
        where: { id, userId: session.user.id },
        data: { isRead: true },
    });
    revalidatePath("/");
}

export async function markAllNotificationsRead() {
    const session = await getSession();
    await prisma.notification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true },
    });
    revalidatePath("/");
}

export async function getUnreadNotificationCount() {
    const session = await getSession();
    return prisma.notification.count({
        where: { userId: session.user.id, isRead: false },
    });
}

export async function createInterview(data: unknown) {
    const session = await getSession();
    const validated = (await import("@/lib/validations")).interviewCreateSchema.parse(data);

    // Verify application belongs to user
    const app = await prisma.application.findFirst({
        where: { id: validated.applicationId, userId: session.user.id },
    });
    if (!app) throw new Error("Application not found");

    const interview = await prisma.interview.create({
        data: validated,
    });

    // Update application last activity
    await prisma.application.update({
        where: { id: validated.applicationId },
        data: { lastActivityAt: new Date(), status: "INTERVIEW" },
    });

    revalidatePath("/applications");
    revalidatePath("/dashboard");
    return { success: true, data: interview };
}

export async function updateInterview(data: unknown) {
    const session = await getSession();
    const validated = (await import("@/lib/validations")).interviewUpdateSchema.parse(data);
    const { id, ...updateData } = validated;

    const interview = await prisma.interview.findFirst({
        where: { id },
        include: { application: true },
    });

    if (!interview || interview.application.userId !== session.user.id) {
        throw new Error("Interview not found");
    }

    const updated = await prisma.interview.update({
        where: { id },
        data: updateData,
    });

    revalidatePath("/applications");
    return { success: true, data: updated };
}

export async function deleteInterview(id: string) {
    const session = await getSession();
    const interview = await prisma.interview.findFirst({
        where: { id },
        include: { application: true },
    });

    if (!interview || interview.application.userId !== session.user.id) {
        throw new Error("Interview not found");
    }

    await prisma.interview.delete({ where: { id } });
    revalidatePath("/applications");
    return { success: true };
}

export async function getUserSettings() {
    const session = await getSession();
    return prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            reminderEnabled: true,
            emailReminders: true,
            desktopNotifications: true,
            smsReminders: true,
            reminderDays: true,
            reminderTime: true,
        },
    });
}

export async function updateUserSettings(data: {
    reminderEnabled?: boolean;
    emailReminders?: boolean;
    desktopNotifications?: boolean;
    smsReminders?: boolean;
    reminderDays?: number;
    reminderTime?: string;
}) {
    const session = await getSession();
    await prisma.user.update({
        where: { id: session.user.id },
        data,
    });
    revalidatePath("/settings");
    return { success: true };
}

export async function importApplications(apps: unknown[]) {
    const session = await getSession();
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const app of apps) {
        try {
            const validated = applicationCreateSchema.parse(app);
            await prisma.application.create({
                data: {
                    ...validated,
                    userId: session.user.id,
                    recruiterEmail: validated.recruiterEmail || null,
                    jobLink: validated.jobLink || null,
                },
            });
            results.success++;
        } catch (error) {
            results.failed++;
            results.errors.push(
                `Failed to import: ${(app as Record<string, unknown>)?.companyName || "Unknown"}`
            );
        }
    }

    revalidatePath("/dashboard");
    revalidatePath("/applications");
    return results;
}

export async function exportApplications(format: "csv" | "json") {
    const session = await getSession();
    const apps = await prisma.application.findMany({
        where: { userId: session.user.id },
        include: { interviews: true },
        orderBy: { createdAt: "desc" },
    });
    return apps;
}
