import { NextResponse } from "next/server";
import { scanForReminders, processReminders } from "@/lib/reminder-engine";

export const dynamic = "force-dynamic";

// This endpoint should be called by a cron job daily at 9 AM
// Example: Vercel Cron, Railway Cron, or node-cron
export async function GET(request: Request) {
    try {
        // Optional: Verify cron secret
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Scan for applications needing reminders
        const reminders = await scanForReminders();

        // Process and send reminders
        const processed = await processReminders(reminders);

        return NextResponse.json({
            success: true,
            scanned: reminders.length,
            processed,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Cron reminder error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
