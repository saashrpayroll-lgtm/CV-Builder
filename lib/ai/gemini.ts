import { GoogleGenerativeAI } from "@google/generative-ai";
import { groqGenerate, groqGenerateJSON } from "./groq";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateText(prompt: string): Promise<string> {
    try {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error: any) {
        console.warn("Gemini generation failed (quota/rate-limit), falling back to Groq:", error?.message || error);
        return await groqGenerate(prompt);
    }
}

export async function generateJSON(prompt: string): Promise<any> {
    try {
        const fullPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no extra text.`;
        const result = await geminiModel.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text().trim();
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
    } catch (error: any) {
        console.warn("Gemini JSON generation failed (quota/rate-limit), falling back to Groq:", error?.message || error);
        return await groqGenerateJSON(prompt);
    }
}
