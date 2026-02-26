import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function formatRelativeDate(date: Date | string): string {
    const now = new Date();
    const target = new Date(date);
    const diffMs = now.getTime() - target.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        APPLIED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        SCREENING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        INTERVIEW: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        OFFER: "bg-green-500/20 text-green-400 border-green-500/30",
        REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
        GHOSTED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        NO_CONFIRMATION: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export function getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
        LOW: "bg-slate-500/20 text-slate-400 border-slate-500/30",
        MEDIUM: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        HIGH: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    };
    return colors[priority] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export function getPlatformLabel(platform: string): string {
    const labels: Record<string, string> = {
        LINKEDIN: "LinkedIn",
        INDEED: "Indeed",
        REFERRAL: "Referral",
        DIRECT: "Direct",
        GLASSDOOR: "Glassdoor",
        ANGELLIST: "AngelList",
        COMPANY_WEBSITE: "Company Website",
        OTHER: "Other",
    };
    return labels[platform] || platform;
}

export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        APPLIED: "Applied",
        SCREENING: "Screening",
        INTERVIEW: "Interview",
        OFFER: "Offer",
        REJECTED: "Rejected",
        GHOSTED: "Ghosted",
        NO_CONFIRMATION: "No Confirmation",
    };
    return labels[status] || status;
}

export function getJobTypeLabel(jobType: string): string {
    const labels: Record<string, string> = {
        REMOTE: "Remote",
        HYBRID: "Hybrid",
        ONSITE: "Onsite",
    };
    return labels[jobType] || jobType;
}

export function calculateApplicationScore(app: {
    salaryMin?: number | null;
    salaryMax?: number | null;
    jobType: string;
    priority: string;
    tags: string[];
}): number {
    let score = 50;

    // Salary factor (0-25 pts)
    if (app.salaryMax) {
        if (app.salaryMax >= 150000) score += 25;
        else if (app.salaryMax >= 100000) score += 20;
        else if (app.salaryMax >= 75000) score += 15;
        else if (app.salaryMax >= 50000) score += 10;
        else score += 5;
    }

    // Priority factor (0-15 pts)
    if (app.priority === "HIGH") score += 15;
    else if (app.priority === "MEDIUM") score += 10;
    else score += 5;

    // Tags factor (0-10 pts)
    const valuableTags = ["Dream Company", "High Salary", "Referral"];
    const matchingTags = app.tags.filter((t) => valuableTags.includes(t));
    score += Math.min(matchingTags.length * 5, 10);

    return Math.min(score, 100);
}

export function getDaysInactive(lastActivity: Date): number {
    const now = new Date();
    const diffMs = now.getTime() - new Date(lastActivity).getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function getSmartReminderDays(tags: string[], priority: string): number {
    if (priority === "HIGH") return 7;
    if (tags.includes("Referral")) return 10;
    if (tags.includes("Startup")) return 14;
    if (tags.includes("MNC")) return 30;
    return 30;
}
