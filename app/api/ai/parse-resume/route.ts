import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

// We have to import pdf-parse this way to bypass Next.js server bundling issues sometimes
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Convert the File object into a Buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Extract plain text from the PDF
        const pdfData = await pdfParse(buffer);
        const text = pdfData.text;

        // Ensure user is authenticated
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Retrieve Admin Settings for API Key
        const { data: adminSettings } = await supabase.from('admin_settings').select('*').limit(1).single();
        if (!adminSettings?.ai_enabled || !adminSettings?.ai_api_key) {
            return NextResponse.json({ error: "AI processing is temporarily disabled by administrator." }, { status: 403 });
        }

        // Trigger Gemini to parse the unstructured text into structured JSON
        const genAI = new GoogleGenerativeAI(adminSettings.ai_api_key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an expert Resume Parser. I am giving you the raw text extracted from a LinkedIn Profile PDF or an old resume.
        Your job is to read this unstructured text and map it perfectly into the following JSON structure.
        If any field is missing from the text, just leave it as an empty string "" or an empty array [].
        Do NOT wrap the response in markdown blocks like \`\`\`json. Return strictly the raw JSON object.

        Target JSON Schema:
        {
          "personalDetails": {
            "fullName": "",
            "jobTitle": "",
            "email": "",
            "phone": "",
            "location": "",
            "website": "",
            "github": "",
            "linkedin": "",
            "summary": "" 
          },
          "experience": [
            {
              "id": "generate-unique-id",
              "jobTitle": "",
              "company": "",
              "location": "",
              "startDate": "", 
              "endDate": "", 
              "description": ""
            }
          ],
          "education": [
            {
              "id": "generate-unique-id",
              "degree": "", 
              "school": "",
              "location": "",
              "startDate": "",
              "endDate": "",
              "description": ""
            }
          ],
          "skills": ["Skill 1", "Skill 2"],
          "certifications": [],
          "languages": [],
          "projects": []
        }

        Here is the text to parse:
        ------
        ${text}
        ------
        `;

        const result = await model.generateContent(prompt);
        let rawResponse = result.response.text().trim();
        
        // Clean up markdown markers if Gemini ignores the prompt
        if (rawResponse.startsWith("```json")) {
            rawResponse = rawResponse.replace(/```json\n?/, "").replace(/```$/, "").trim();
        } else if (rawResponse.startsWith("```")) {
             rawResponse = rawResponse.replace(/```\n?/, "").replace(/```$/, "").trim();
        }

        const parsedJson = JSON.parse(rawResponse);
        return NextResponse.json(parsedJson);

    } catch (error: any) {
        console.error("PDF Parse Error:", error);
        return NextResponse.json({ error: error.message || "Failed to parse document" }, { status: 500 });
    }
}
