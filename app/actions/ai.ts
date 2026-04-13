"use server";

import { generateText } from "@/lib/ai/gemini";
import { groqGenerate } from "@/lib/ai/groq";

export async function generateSummaryAction(jobRole: string, experience: string, currentSummary?: string) {
    try {
        const prompt = `
      Act as a professional resume writer. 
      Create a professional summary for a ${jobRole} with ${experience} years of experience.
      Highlight unique value propositions. 
      Tone: Professional, Impactful, and ATS-optimized.
      Max 50 words.
      ${currentSummary ? `Refine this existing summary: "${currentSummary}"` : ""}
      
      Output ONLY the summary text, no explanations.
    `;

        const text = await generateText(prompt);
        return { success: true, data: text };
    } catch (error) {
        console.error("Gemini Error:", error);
        return { success: false, error: "Failed to generate summary" };
    }
}

export async function improveTextAction(text: string) {
    try {
        const result = await groqGenerate(
            text,
            "You are an expert resume editor. Rewrite the following text to be more impactful, using action verbs and result-oriented language. Keep it concise. Return ONLY the improved text."
        );
        return { success: true, data: result || text };
    } catch (error) {
        console.error("Groq Error:", error);
        return { success: false, error: "Failed to improve text" };
    }
}

export async function checkGrammarAction(text: string) {
    try {
        const result = await groqGenerate(
            text,
            "Correct the grammar and spelling of the following text. Return ONLY the corrected text. If the text is correct, return it as is."
        );
        return { success: true, data: result || text };
    } catch (error) {
        console.error("Groq Error:", error);
        return { success: false, error: "Failed to check grammar" };
    }
}
