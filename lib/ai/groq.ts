import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function groqGenerate(prompt: string, systemPrompt?: string): Promise<string> {
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
}

export async function groqGenerateJSON(prompt: string, systemPrompt?: string): Promise<any> {
    const fullPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no extra text.`;
    const text = await groqGenerate(fullPrompt, systemPrompt);
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
}

export async function groqGrammarFix(text: string): Promise<string> {
    return await groqGenerate(
        `Fix all grammar, spelling, and punctuation errors in this text. Return ONLY the corrected text, nothing else:\n\n${text}`,
        "You are a professional editor. Fix grammar and spelling issues while preserving the original meaning and professional tone."
    );
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
