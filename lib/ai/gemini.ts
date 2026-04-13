import { GoogleGenerativeAI } from "@google/generative-ai";
import { groqGenerate, groqGenerateJSON } from "./groq";
import { getSystemAISettings } from "./config";

async function getGeminiModel() {
    const settings = await getSystemAISettings();
    
    if (settings && settings.ai_enabled === false) {
        throw new Error("AI_DISABLED");
    }
    
    const apiKey = (settings?.ai_provider === 'GEMINI' && settings?.ai_api_key) 
        ? settings.ai_api_key 
        : process.env.GEMINI_API_KEY!;
        
    if (!apiKey) throw new Error("No Gemini API key available.");

    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

export async function generateText(prompt: string): Promise<string> {
    try {
        const settings = await getSystemAISettings();
        if (settings?.ai_enabled === false) return fallbackManualResponse();
        
        // Route to Groq if specified in DB, else use Gemini (Default)
        if (settings?.ai_provider === 'GROQ') {
            return await groqGenerate(prompt);
        }

        const geminiModel = await getGeminiModel();
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error: any) {
        if (error.message === 'AI_DISABLED') return fallbackManualResponse();
        console.warn("Gemini generation failed, falling back to Groq:", error?.message || error);
        return await groqGenerate(prompt);
    }
}

export async function generateJSON(prompt: string): Promise<any> {
    try {
        const settings = await getSystemAISettings();
        if (settings?.ai_enabled === false) return { error: "AI features are currently disabled by the administrator. Please update manually." };
        
        if (settings?.ai_provider === 'GROQ') {
            return await groqGenerateJSON(prompt);
        }

        const geminiModel = await getGeminiModel();
        const fullPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no extra text.`;
        const result = await geminiModel.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text().trim();
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
    } catch (error: any) {
        if (error.message === 'AI_DISABLED') return { error: "AI disabled." };
        console.warn("Gemini JSON generation failed, falling back to Groq:", error?.message || error);
        return await groqGenerateJSON(prompt);
    }
}

function fallbackManualResponse() {
    return "AI generation is currently disabled by the system administrator. Please edit this section manually.";
}
