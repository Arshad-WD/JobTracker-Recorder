import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
    testAIConnection,
    type AIProviderType,
} from "@/lib/ai-provider";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { provider, apiKey, model } = body;

        if (!provider || !apiKey) {
            return NextResponse.json(
                { error: "Provider and API key are required" },
                { status: 400 }
            );
        }

        const result = await testAIConnection({
            provider: provider as AIProviderType,
            apiKey,
            model,
        });

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Connection test failed" },
            { status: 500 }
        );
    }
}
