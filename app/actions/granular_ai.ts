"use server";

import { generateText } from "@/lib/ai/gemini";

export async function improveText(text: string, type: "grammar" | "professional" | "ats" | "shorter") {
    let prompt = "";

    switch (type) {
        case "grammar":
            prompt = `Fix grammar and spelling errors in the following text. Do not change the tone or meaning. Return only the corrected text: "${text}"`;
            break;
        case "professional":
            prompt = `Rewrite the following text to sound more professional, executive, and impactful. Use strong action verbs. Return only the rewritten text: "${text}"`;
            break;
        case "ats":
            prompt = `Optimize the following text for ATS (Applicant Tracking Systems). Include relevant keywords if implied, but keep it natural. Return only the optimized text: "${text}"`;
            break;
        case "shorter":
            prompt = `Shorten the following text while retaining the key impact and metrics. Be concise. Return only the shortened text: "${text}"`;
            break;
    }

    const improvedText = await generateText(prompt);
    return improvedText;
}
