import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config();

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create demo user
    const user = await prisma.user.upsert({
        where: { email: "demo@jobtracker.com" },
        update: {},
        create: {
            email: "demo@jobtracker.com",
            name: "Demo User",
            reminderEnabled: true,
            emailReminders: true,
            reminderDays: 30,
        },
    });

    console.log(`Created user: ${user.email}`);

    // Create sample applications
    const applications = [
        {
            companyName: "Google",
            positionTitle: "Senior Software Engineer",
            platform: "LINKEDIN" as const,
            jobType: "HYBRID" as const,
            salaryMin: 180000,
            salaryMax: 250000,
            location: "Mountain View, CA",
            status: "INTERVIEW" as const,
            priority: "HIGH" as const,
            recruiterName: "Sarah Johnson",
            recruiterEmail: "sarah@google.com",
            recruiterPhone: "+1-650-555-0101",
            resumeVersion: "v3.2 - Full Stack",
            tags: ["Dream Company", "MNC", "High Salary"],
            notes: "Had initial phone screen. They liked my system design experience.",
            appliedDate: new Date("2026-01-15"),
        },
        {
            companyName: "Stripe",
            positionTitle: "Full Stack Developer",
            platform: "REFERRAL" as const,
            jobType: "REMOTE" as const,
            salaryMin: 150000,
            salaryMax: 200000,
            location: "Remote (US)",
            status: "SCREENING" as const,
            priority: "HIGH" as const,
            recruiterName: "Mike Chen",
            recruiterEmail: "mike@stripe.com",
            resumeVersion: "v3.1 - Backend Focus",
            tags: ["Dream Company", "Referral", "High Salary"],
            notes: "Referred by John from my previous company.",
            appliedDate: new Date("2026-02-01"),
        },
        {
            companyName: "Vercel",
            positionTitle: "Frontend Engineer",
            platform: "DIRECT" as const,
            jobType: "REMOTE" as const,
            salaryMin: 140000,
            salaryMax: 180000,
            status: "APPLIED" as const,
            priority: "MEDIUM" as const,
            resumeVersion: "v3.0 - Frontend",
            tags: ["Startup"],
            notes: "Applied through their careers page. Love their developer experience focus.",
            appliedDate: new Date("2026-02-10"),
        },
        {
            companyName: "Meta",
            positionTitle: "Software Engineer - React",
            platform: "LINKEDIN" as const,
            jobType: "ONSITE" as const,
            salaryMin: 200000,
            salaryMax: 300000,
            location: "Menlo Park, CA",
            status: "REJECTED" as const,
            priority: "HIGH" as const,
            recruiterName: "Lisa Park",
            recruiterEmail: "lisa@meta.com",
            resumeVersion: "v3.2 - Full Stack",
            tags: ["MNC", "High Salary"],
            notes: "Rejected after onsite. Feedback: needed more experience with large-scale systems.",
            appliedDate: new Date("2026-01-05"),
        },
        {
            companyName: "Acme Corp",
            positionTitle: "Tech Lead",
            platform: "INDEED" as const,
            jobType: "HYBRID" as const,
            salaryMin: 130000,
            salaryMax: 160000,
            location: "New York, NY",
            status: "OFFER" as const,
            priority: "MEDIUM" as const,
            recruiterName: "Tom Wilson",
            recruiterPhone: "+1-212-555-0202",
            resumeVersion: "v3.2 - Full Stack",
            tags: ["Startup"],
            notes: "Received offer! $155k base + equity. Considering.",
            appliedDate: new Date("2026-01-20"),
        },
        {
            companyName: "TechStartup Inc",
            positionTitle: "Backend Developer",
            platform: "ANGELLIST" as const,
            jobType: "REMOTE" as const,
            salaryMin: 100000,
            salaryMax: 130000,
            status: "GHOSTED" as const,
            priority: "LOW" as const,
            resumeVersion: "v3.1 - Backend Focus",
            tags: ["Startup"],
            notes: "No response after 2 follow-ups.",
            appliedDate: new Date("2025-12-15"),
        },
        {
            companyName: "Amazon",
            positionTitle: "SDE II",
            platform: "COMPANY_WEBSITE" as const,
            jobType: "ONSITE" as const,
            salaryMin: 160000,
            salaryMax: 220000,
            location: "Seattle, WA",
            status: "APPLIED" as const,
            priority: "HIGH" as const,
            resumeVersion: "v3.2 - Full Stack",
            tags: ["MNC", "High Salary"],
            appliedDate: new Date("2026-02-20"),
        },
        {
            companyName: "Netflix",
            positionTitle: "Senior UI Engineer",
            platform: "LINKEDIN" as const,
            jobType: "HYBRID" as const,
            salaryMin: 250000,
            salaryMax: 350000,
            location: "Los Gatos, CA",
            status: "SCREENING" as const,
            priority: "HIGH" as const,
            recruiterName: "Jenny Adams",
            recruiterEmail: "jadams@netflix.com",
            resumeVersion: "v3.0 - Frontend",
            tags: ["Dream Company", "MNC", "High Salary"],
            appliedDate: new Date("2026-02-18"),
        },
    ];

    for (const appData of applications) {
        const app = await prisma.application.create({
            data: {
                ...appData,
                userId: user.id,
            },
        });
        console.log(`  Created: ${app.companyName} - ${app.positionTitle}`);

        // Add interviews for applicable statuses
        if (appData.status === "INTERVIEW") {
            await prisma.interview.createMany({
                data: [
                    {
                        applicationId: app.id,
                        roundNumber: 1,
                        type: "HR",
                        result: "PASSED",
                        notes: "Went well. Discussed background and motivation.",
                    },
                    {
                        applicationId: app.id,
                        roundNumber: 2,
                        type: "TECHNICAL",
                        result: "PENDING",
                        notes: "Scheduled for next week.",
                    },
                ],
            });
        }
        if (appData.status === "OFFER") {
            await prisma.interview.createMany({
                data: [
                    {
                        applicationId: app.id,
                        roundNumber: 1,
                        type: "HR",
                        result: "PASSED",
                    },
                    {
                        applicationId: app.id,
                        roundNumber: 2,
                        type: "TECHNICAL",
                        result: "PASSED",
                    },
                    {
                        applicationId: app.id,
                        roundNumber: 3,
                        type: "MANAGERIAL",
                        result: "PASSED",
                    },
                ],
            });
        }
        if (appData.status === "REJECTED") {
            await prisma.interview.createMany({
                data: [
                    {
                        applicationId: app.id,
                        roundNumber: 1,
                        type: "HR",
                        result: "PASSED",
                    },
                    {
                        applicationId: app.id,
                        roundNumber: 2,
                        type: "TECHNICAL",
                        result: "PASSED",
                    },
                    {
                        applicationId: app.id,
                        roundNumber: 3,
                        type: "SYSTEM_DESIGN",
                        result: "FAILED",
                    },
                ],
            });
        }
    }

    // Create sample notifications
    await prisma.notification.createMany({
        data: [
            {
                userId: user.id,
                title: "Welcome to JobTracker!",
                message: "Start tracking your job applications to stay organized.",
                type: "SYSTEM",
            },
            {
                userId: user.id,
                title: "Follow-up Reminder",
                message: "Consider following up on your Vercel application.",
                type: "FOLLOW_UP",
                link: "/applications",
            },
            {
                userId: user.id,
                title: "Interview Scheduled",
                message: "Google - Technical interview round 2 coming up.",
                type: "INTERVIEW",
            },
        ],
    });

    console.log("✅ Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
