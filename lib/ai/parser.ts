import { groqGenerate } from "./groq";
import crypto from "crypto";

// Try Gemini first, fall back to Groq if Gemini quota is exceeded
async function generateWithFallback(prompt: string): Promise<string> {
  // Try Gemini first
  try {
    const { generateText } = await import("./gemini");
    return await generateText(prompt);
  } catch (geminiError: any) {
    console.warn("[PARSER] Gemini failed, falling back to Groq:", geminiError?.message?.slice(0, 100));
  }

  // Fallback to Groq
  return await groqGenerate(prompt, "You are an expert resume parser. Extract structured data precisely and return only valid JSON.");
}

export async function parseResumeWithAI(rawText: string) {
  const prompt = `
    You are an expert Resume Parser. Your task is to extract structured data from the provided resume text and return it in a specific JSON format that matches the ResumeBuilder schema.
    
    RESUME TEXT:
    ${rawText.slice(0, 15000)}
    
    REQUIRED JSON STRUCTURE:
    {
      "personalInfo": {
        "fullName": "",
        "email": "",
        "phone": "",
        "location": "",
        "jobTitle": "",
        "website": "",
        "linkedin": "",
        "github": "",
        "photoShape": "circle"
      },
      "summary": "professional summary paragraph",
      "workExperience": [
        {
          "company": "",
          "position": "",
          "startDate": "YYYY-MM or Month YYYY",
          "endDate": "YYYY-MM or Present",
          "current": false,
          "description": "detailed description with bullet points",
          "location": ""
        }
      ],
      "education": [
        {
          "school": "",
          "degree": "",
          "fieldOfStudy": "",
          "startDate": "YYYY-MM",
          "endDate": "YYYY-MM",
          "grade": "",
          "description": ""
        }
      ],
      "skills": [
         { "name": "Skill Name", "percentage": 85 }
      ],
      "projects": [
        {
          "name": "",
          "description": "",
          "link": "",
          "technologies": ["Tech1", "Tech2"]
        }
      ]
    }

    RULES:
    1. Extract as much as possible with high precision.
    2. Infer "jobTitle" from the headline or recent experience.
    3. The "summary" is a top-level string, not inside personalInfo.
    4. Format dates as "Month YYYY" or "YYYY-MM".
    5. Assign a realistic "percentage" (60-100) for skills based on the context.
    6. Return ONLY VALID JSON. No extra text, no markdown code blocks.
  `;

  try {
    const text = await generateWithFallback(prompt);
    // Clean up potential markdown code blocks if the model ignores the instruction
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(jsonStr);

    // Add IDs to collections if missing
    const addIds = (list: any[]) => list?.map(item => ({ id: crypto.randomUUID(), ...item })) || [];

    return {
      ...data,
      personalInfo: data.personalInfo || { fullName: "", email: "", phone: "", location: "", jobTitle: "" },
      summary: data.summary || "",
      workExperience: addIds(data.workExperience),
      education: addIds(data.education),
      skills: addIds(data.skills),
      projects: addIds(data.projects)
    };
  } catch (error: any) {
    console.error("AI Parse Error:", error?.message || error);
    throw new Error("Failed to parse resume with AI: " + (error?.message || "Unknown error"));
  }
}
