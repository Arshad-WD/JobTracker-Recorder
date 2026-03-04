/**
 * Unified AI provider abstraction layer.
 * Routes AI generation requests to the user's chosen provider.
 */

export type AIProviderType =
    | "GEMINI"
    | "OPENAI"
    | "CLAUDE"
    | "OPENROUTER"
    | "HUGGINGFACE";

interface AIConfig {
    provider: AIProviderType;
    apiKey: string;
    model?: string | null;
}

const DEFAULT_MODELS: Record<AIProviderType, string> = {
    GEMINI: "gemini-2.0-flash",
    OPENAI: "gpt-4o-mini",
    CLAUDE: "claude-3-5-sonnet-20241022",
    OPENROUTER: "openai/gpt-4o-mini",
    HUGGINGFACE: "mistralai/Mistral-7B-Instruct-v0.3",
};

export const PROVIDER_LABELS: Record<AIProviderType, string> = {
    GEMINI: "Google Gemini",
    OPENAI: "OpenAI (GPT)",
    CLAUDE: "Anthropic Claude",
    OPENROUTER: "OpenRouter",
    HUGGINGFACE: "HuggingFace",
};

export const PROVIDER_MODELS: Record<AIProviderType, string[]> = {
    GEMINI: ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"],
    OPENAI: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
    CLAUDE: [
        "claude-3-5-sonnet-20241022",
        "claude-3-haiku-20240307",
        "claude-3-opus-20240229",
    ],
    OPENROUTER: [
        "openai/gpt-4o-mini",
        "anthropic/claude-3.5-sonnet",
        "google/gemini-flash-1.5",
        "meta-llama/llama-3.1-70b-instruct",
        "mistralai/mistral-large-latest",
    ],
    HUGGINGFACE: [
        "mistralai/Mistral-7B-Instruct-v0.3",
        "meta-llama/Meta-Llama-3-8B-Instruct",
        "google/gemma-2-9b-it",
    ],
};

export async function generateWithAI(
    config: AIConfig,
    prompt: string
): Promise<string> {
    const model = config.model || DEFAULT_MODELS[config.provider];

    switch (config.provider) {
        case "GEMINI":
            return generateWithGemini(config.apiKey, model, prompt);
        case "OPENAI":
            return generateWithOpenAI(config.apiKey, model, prompt);
        case "CLAUDE":
            return generateWithClaude(config.apiKey, model, prompt);
        case "OPENROUTER":
            return generateWithOpenRouter(config.apiKey, model, prompt);
        case "HUGGINGFACE":
            return generateWithHuggingFace(config.apiKey, model, prompt);
        default:
            throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
}

async function generateWithGemini(
    apiKey: string,
    model: string,
    prompt: string
): Promise<string> {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const genModel = genAI.getGenerativeModel({ model });
    const result = await genModel.generateContent(prompt);
    return result.response.text();
}

async function generateWithOpenAI(
    apiKey: string,
    model: string,
    prompt: string
): Promise<string> {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
    });
    return completion.choices[0]?.message?.content || "";
}

async function generateWithClaude(
    apiKey: string,
    model: string,
    prompt: string
): Promise<string> {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
        model,
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
    });
    const textBlock = message.content.find((b) => b.type === "text");
    return textBlock && "text" in textBlock ? textBlock.text : "";
}

async function generateWithOpenRouter(
    apiKey: string,
    model: string,
    prompt: string
): Promise<string> {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey,
    });
    const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
    });
    return completion.choices[0]?.message?.content || "";
}

async function generateWithHuggingFace(
    apiKey: string,
    model: string,
    prompt: string
): Promise<string> {
    const { HfInference } = await import("@huggingface/inference");
    const hf = new HfInference(apiKey);
    const result = await hf.textGeneration({
        model,
        inputs: prompt,
        parameters: { max_new_tokens: 2000 },
    });
    return result.generated_text;
}

/** Format AI provider errors into user-friendly messages */
function formatAIError(error: unknown): string {
    const msg = error instanceof Error ? error.message : String(error);

    if (msg.includes("invalid x-api-key") || msg.includes("authentication_error") || msg.includes("Incorrect API key") || msg.includes("401")) {
        return "Invalid API key provided. Please check your key and try again.";
    }
    if (msg.includes("404") && msg.includes("model")) {
        return "The selected model is not available with this API key.";
    }
    if (msg.includes("429") || msg.includes("rate_limit_exceeded") || msg.includes("insufficient_quota")) {
        return "Rate limit or quota exceeded. Please check your billing details.";
    }

    try {
        if (msg.includes("{")) {
            const jsonStr = msg.substring(msg.indexOf("{"));
            const parsed = JSON.parse(jsonStr);
            if (parsed.error && parsed.error.message) {
                return parsed.error.message;
            }
        }
    } catch {
        // Ignore parsing errors
    }

    return "Failed to connect to AI: " + msg;
}

/** Test if an API key works for a given provider */
export async function testAIConnection(
    config: AIConfig
): Promise<{ success: boolean; error?: string }> {
    try {
        const result = await generateWithAI(config, "Say hello in one sentence.");
        if (result && result.length > 0) {
            return { success: true };
        }
        return { success: false, error: "Empty response from AI" };
    } catch (error) {
        return {
            success: false,
            error: formatAIError(error),
        };
    }
}
