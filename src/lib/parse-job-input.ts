/**
 * One-line job input parser
 * Parses inputs like: "Google SWE Remote 25L" or "Stripe - Backend Dev - $150k - Hybrid"
 */

interface ParsedJob {
    companyName: string;
    positionTitle: string;
    jobType?: "REMOTE" | "HYBRID" | "ONSITE";
    salaryMin?: number;
    salaryMax?: number;
    location?: string;
    platform?: string;
}

const JOB_TYPE_PATTERNS: Record<string, "REMOTE" | "HYBRID" | "ONSITE"> = {
    remote: "REMOTE",
    hybrid: "HYBRID",
    onsite: "ONSITE",
    "on-site": "ONSITE",
    "in-office": "ONSITE",
    wfh: "REMOTE",
    "work from home": "REMOTE",
};

const PLATFORM_PATTERNS: Record<string, string> = {
    linkedin: "LINKEDIN",
    indeed: "INDEED",
    glassdoor: "GLASSDOOR",
    referral: "REFERRAL",
    referred: "REFERRAL",
    naukri: "OTHER",
    angellist: "ANGELLIST",
};

const SALARY_REGEX = /(?:\$|₹|€|£)?(\d+\.?\d*)\s*(?:k|K|l|L|lpa|LPA|lac|cr)?(?:\s*[-–to]+\s*(?:\$|₹|€|£)?(\d+\.?\d*)\s*(?:k|K|l|L|lpa|LPA|lac|cr)?)?/;

function parseSalary(token: string): { min?: number; max?: number } | null {
    const match = token.match(SALARY_REGEX);
    if (!match) return null;

    let min = parseFloat(match[1]);
    let max = match[2] ? parseFloat(match[2]) : undefined;

    // Detect multiplier
    const lowerToken = token.toLowerCase();
    if (lowerToken.includes("l") || lowerToken.includes("lac") || lowerToken.includes("lpa")) {
        min *= 100000;
        if (max) max *= 100000;
    } else if (lowerToken.includes("k")) {
        min *= 1000;
        if (max) max *= 1000;
    } else if (lowerToken.includes("cr")) {
        min *= 10000000;
        if (max) max *= 10000000;
    }

    // If no max, estimate a range
    if (!max && min > 0) {
        max = Math.round(min * 1.3);
    }

    return { min, max };
}

export function parseQuickInput(input: string): ParsedJob {
    // Split by common delimiters
    const parts = input
        .split(/\s*[-–|,]\s*|\s{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);

    // If no delimiters, split by spaces and try to be smart
    const tokens = parts.length === 1 ? input.split(/\s+/) : parts;

    const result: ParsedJob = {
        companyName: "",
        positionTitle: "",
    };

    const unclassified: string[] = [];

    for (const token of tokens) {
        const lower = token.toLowerCase();

        // Check job type
        if (JOB_TYPE_PATTERNS[lower]) {
            result.jobType = JOB_TYPE_PATTERNS[lower];
            continue;
        }

        // Check platform
        if (PLATFORM_PATTERNS[lower]) {
            result.platform = PLATFORM_PATTERNS[lower];
            continue;
        }

        // Check salary
        const salary = parseSalary(token);
        if (salary && salary.min && salary.min > 100) {
            result.salaryMin = salary.min;
            result.salaryMax = salary.max;
            continue;
        }

        unclassified.push(token);
    }

    // First unclassified = company, second = position, rest = location
    if (unclassified.length >= 1) {
        result.companyName = unclassified[0];
    }
    if (unclassified.length >= 2) {
        result.positionTitle = unclassified[1];
    }
    if (unclassified.length >= 3) {
        result.location = unclassified.slice(2).join(" ");
    }

    return result;
}
