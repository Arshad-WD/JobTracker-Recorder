import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({ status: "ok", message: "PDF parser is ready" });
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
            return NextResponse.json({ error: "Invalid file type. Please upload a PDF." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Move require inside for better compatibility
        const pdf = require("pdf-parse");
        const data = await pdf(buffer);

        return NextResponse.json({
            text: data.text,
            metadata: data.metadata,
            info: data.info,
            numpages: data.numpages
        });

    } catch (error) {
        console.error("PDF Parsing error:", error);
        return NextResponse.json(
            {
                error: "Failed to parse PDF",
                message: error instanceof Error ? error.message : "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}
