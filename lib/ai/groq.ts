import Groq from "groq-sdk";
import { getSystemAISettings } from "./config";

async function getGroqClient() {
    const settings = await getSystemAISettings();

    if (settings && settings.ai_enabled === false) {
        throw new Error("AI_DISABLED");
    }

    const apiKey = (settings?.ai_provider === 'GROQ' && settings?.ai_api_key) 
        ? settings.ai_api_key 
        : process.env.GROQ_API_KEY!;
        
    if (!apiKey) throw new Error("No Groq API key available.");

    return new Groq({ apiKey });
}

export async function groqGenerate(prompt: string, systemPrompt?: string): Promise<string> {
    try {
        const groq = await getGroqClient();
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
                { role: "user" as const, content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 4096,
        });

        return completion.choices[0]?.message?.content?.trim() || "";
    } catch (e: any) {
        if (e.message === 'AI_DISABLED') return fallbackManualResponse();
        console.error("Groq generation failed:", e);
        return "";
    }
}

export async function groqGenerateJSON(prompt: string, systemPrompt?: string): Promise<any> {
    try {
        const settings = await getSystemAISettings();
        if (settings?.ai_enabled === false) return { error: "AI features are currently disabled by the administrator. Please update manually." };
        
        const fullPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no extra text.`;
        const text = await groqGenerate(fullPrompt, systemPrompt);
        
        if (text === fallbackManualResponse() || !text) {
            return { error: "AI disabled or failed." };
        }
        
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
    } catch (e: any) {
        console.error("Groq JSON generation failed:", e);
        return { error: "Failed to generate valid JSON." };
    }
}

export async function groqGrammarFix(text: string): Promise<string> {
    const res = await groqGenerate(
        `Fix all grammar, spelling, and punctuation errors in this text. Return ONLY the corrected text, nothing else:\n\n${text}`,
        "You are a professional editor. Fix grammar and spelling issues while preserving the original meaning and professional tone."
    );
    return res === fallbackManualResponse() ? text : res; // If AI is disabled, just return the text unchanged
}

export async function groqDetectErrors(resumeJson: string): Promise<any> {
    return await groqGenerateJSON(
        `Analyze this resume data and detect ALL issues. Return a JSON array of objects with fields: "type" (error|warning|suggestion), "section" (which section), "message" (what's wrong), "fix" (how to fix it).

Resume Data:
${resumeJson}

Check for:
- Missing critical sections (summary, skills, experience)
- Weak or vague descriptions
- Missing contact info
- Too short or too long content
- Inconsistent date formats
- Spelling/grammar hints
- Missing quantifiable achievements
- ATS compatibility issues`,
        "You are an expert resume reviewer. Be thorough and actionable."
    );
}

function fallbackManualResponse() {
    return "AI generation is currently disabled by the system administrator. Please edit this section manually.";
}
