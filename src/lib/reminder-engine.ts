import { prisma } from "@/lib/prisma";
import { getSmartReminderDays, getDaysInactive } from "@/lib/utils";
import type { Application } from "@prisma/client";

export interface ReminderResult {
    applicationId: string;
    userId: string;
    companyName: string;
    positionTitle: string;
    daysInactive: number;
    reminderLevel: 1 | 2 | 3;
}

export async function scanForReminders(): Promise<ReminderResult[]> {
    const results: ReminderResult[] = [];

    // Find all active applications that might need reminders
    const applications = await prisma.application.findMany({
        where: {
            archived: false,
            autoReminderEnabled: true,
            status: { in: ["APPLIED", "SCREENING"] },
        },
        include: {
            user: {
                select: { reminderEnabled: true, reminderDays: true },
            },
        },
    });

    for (const app of applications) {
        if (!app.user.reminderEnabled) continue;

        const daysInactive = getDaysInactive(app.lastActivityAt);
        const smartDays = getSmartReminderDays(app.tags, app.priority);
        const effectiveDays = Math.min(smartDays, app.user.reminderDays);

        if (daysInactive < effectiveDays) continue;

        // Determine reminder level
        let reminderLevel: 1 | 2 | 3 = 1;
        if (app.reminderSentAt) {
            const daysSinceReminder = getDaysInactive(app.reminderSentAt);
            if (daysSinceReminder >= 14) {
                reminderLevel = 3; // Suggest marking as ghosted
            } else if (daysSinceReminder >= 7) {
                reminderLevel = 2; // Second reminder
            } else {
                continue; // Too soon for another reminder
            }
        }

        results.push({
            applicationId: app.id,
            userId: app.userId,
            companyName: app.companyName,
            positionTitle: app.positionTitle,
            daysInactive,
            reminderLevel,
        });
    }

    return results;
}

export async function processReminders(reminders: ReminderResult[]): Promise<number> {
    let processed = 0;

    for (const reminder of reminders) {
        let title: string;
        let message: string;
        let type: "REMINDER" | "FOLLOW_UP" = "REMINDER";

        switch (reminder.reminderLevel) {
            case 1:
                title = "Follow-up Reminder";
                message = `No updates on your application at ${reminder.companyName} (${reminder.positionTitle}) for ${reminder.daysInactive} days. Consider following up!`;
                type = "FOLLOW_UP";
                break;
            case 2:
                title = "Second Reminder";
                message = `Still no response from ${reminder.companyName} for ${reminder.positionTitle}. Consider sending another follow-up.`;
                type = "FOLLOW_UP";
                break;
            case 3:
                title = "Likely Ghosted";
                message = `${reminder.companyName} hasn't responded for ${reminder.daysInactive} days regarding ${reminder.positionTitle}. Consider marking as ghosted.`;
                type = "REMINDER";
                break;
        }

        // Create in-app notification
        await prisma.notification.create({
            data: {
                userId: reminder.userId,
                title,
                message,
                type,
                link: `/applications?id=${reminder.applicationId}`,
            },
        });

        // Update reminder sent timestamp
        await prisma.application.update({
            where: { id: reminder.applicationId },
            data: { reminderSentAt: new Date() },
        });

        // Auto-suggest status change for level 3
        if (reminder.reminderLevel === 3) {
            await prisma.notification.create({
                data: {
                    userId: reminder.userId,
                    title: "Status Update Suggested",
                    message: `Consider changing ${reminder.companyName} - ${reminder.positionTitle} status to "Ghosted"`,
                    type: "STATUS_CHANGE",
                    link: `/applications?id=${reminder.applicationId}`,
                },
            });
        }

        processed++;
    }

    return processed;
}
