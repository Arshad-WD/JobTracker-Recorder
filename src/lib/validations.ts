import { z } from "zod";

export const applicationCreateSchema = z.object({
    companyName: z.string().min(1, "Company name is required").max(200),
    positionTitle: z.string().min(1, "Position title is required").max(200),
    platform: z.enum(["LINKEDIN", "INDEED", "REFERRAL", "DIRECT", "GLASSDOOR", "ANGELLIST", "COMPANY_WEBSITE", "OTHER"]).default("OTHER"),
    jobType: z.enum(["REMOTE", "HYBRID", "ONSITE"]).default("REMOTE"),
    salaryMin: z.coerce.number().int().min(0).nullable().optional(),
    salaryMax: z.coerce.number().int().min(0).nullable().optional(),
    location: z.string().max(200).optional().nullable(),
    status: z.enum(["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED", "GHOSTED", "NO_CONFIRMATION"]).default("APPLIED"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    appliedDate: z.coerce.date().optional(),
    followUpDate: z.coerce.date().optional().nullable(),
    recruiterName: z.string().max(200).optional().nullable(),
    recruiterEmail: z.string().email().optional().nullable().or(z.literal("")),
    recruiterPhone: z.string().max(50).optional().nullable(),
    jobLink: z.string().url().optional().nullable().or(z.literal("")),
    resumeVersion: z.string().max(100).optional().nullable(),
    notes: z.string().optional().nullable(),
    tags: z.array(z.string()).default([]),
});

export const applicationUpdateSchema = applicationCreateSchema.partial().extend({
    id: z.string(),
    archived: z.boolean().optional(),
});

export const interviewCreateSchema = z.object({
    applicationId: z.string(),
    roundNumber: z.coerce.number().int().min(1).max(20),
    type: z.enum(["HR", "TECHNICAL", "MANAGERIAL", "ASSIGNMENT", "CULTURE_FIT", "SYSTEM_DESIGN"]).default("HR"),
    scheduledAt: z.coerce.date().optional().nullable(),
    result: z.enum(["PENDING", "PASSED", "FAILED"]).default("PENDING"),
    notes: z.string().optional().nullable(),
});

export const interviewUpdateSchema = interviewCreateSchema.partial().extend({
    id: z.string(),
});

export const searchSchema = z.object({
    query: z.string().max(200),
    status: z.string().optional(),
    platform: z.string().optional(),
    jobType: z.string().optional(),
    priority: z.string().optional(),
    tags: z.array(z.string()).optional(),
    archived: z.boolean().optional(),
});

export type ApplicationCreateInput = z.infer<typeof applicationCreateSchema>;
export type ApplicationUpdateInput = z.infer<typeof applicationUpdateSchema>;
export type InterviewCreateInput = z.infer<typeof interviewCreateSchema>;
export type InterviewUpdateInput = z.infer<typeof interviewUpdateSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
