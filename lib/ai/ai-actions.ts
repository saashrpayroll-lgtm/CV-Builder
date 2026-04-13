import { generateText, generateJSON } from "./gemini";
import { groqGenerate, groqGenerateJSON, groqGrammarFix, groqDetectErrors } from "./groq";

// ─── Gemini-based AI Actions (Content Generation) ─── //

export async function generateFullResume(jobTitle: string, yearsExperience: number, keySkills: string[]): Promise<any> {
    const prompt = `Generate a COMPLETE professional resume for a ${jobTitle} with ${yearsExperience} years of experience.
Key skills: ${keySkills.join(", ")}

Return JSON matching this EXACT structure:
{
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "location": "San Francisco, CA",
    "jobTitle": "${jobTitle}",
    "website": "",
    "linkedin": "linkedin.com/in/johndoe",
    "github": ""
  },
  "summary": "A compelling 3-4 sentence professional summary...",
  "workExperience": [
    {
      "id": "exp-1",
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "Jan 2022",
      "endDate": "Present",
      "current": true,
      "description": "• Achievement-oriented bullet points with metrics\\n• Another impactful bullet point",
      "location": "City, State"
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "school": "University Name",
      "degree": "Bachelor of Science",
      "fieldOfStudy": "Computer Science",
      "startDate": "2014",
      "endDate": "2018",
      "grade": "3.8 GPA"
    }
  ],
  "skills": [
    { "id": "skill-1", "name": "Skill Name", "category": "Technical", "percentage": 90 }
  ],
  "projects": [
    {
      "id": "proj-1",
      "name": "Project Name",
      "description": "Brief description with impact",
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "certifications": [
    { "id": "cert-1", "name": "Cert Name", "issuer": "Issuing Body", "date": "2023" }
  ]
}

Generate realistic, impressive content with:
- 3 work experiences with quantifiable achievements
- 8-12 relevant skills with realistic percentages
- 2 education entries
- 2-3 projects
- 2 certifications
Make it ATS-friendly with strong action verbs.`;

    return await generateJSON(prompt);
}

export async function generateBulletPoints(role: string, company: string, industry?: string): Promise<string[]> {
    const prompt = `Generate 5 impactful bullet points for a ${role} at ${company}${industry ? ` in the ${industry} industry` : ""}.
Each bullet MUST:
- Start with a strong action verb
- Include a quantifiable metric/number
- Be 1-2 lines max
- Be ATS-optimized

Return as JSON array of strings. Example: ["Led team...", "Increased revenue..."]`;

    return await generateJSON(prompt);
}

export async function suggestSkills(jobRole: string, currentSkills: string[] = []): Promise<any[]> {
    const prompt = `Suggest 15 highly relevant skills for a ${jobRole} position.
${currentSkills.length > 0 ? `Already has: ${currentSkills.join(", ")}. Suggest DIFFERENT skills.` : ""}

Return JSON array with objects: { "name": "Skill Name", "category": "Technical|Soft|Tool|Framework|Language", "percentage": 75-95, "relevance": "high|medium" }

Focus on:
- Industry-standard technical skills
- Popular tools and frameworks
- Key soft skills for this role
- Emerging technologies in this field`;

    return await generateJSON(prompt);
}

export async function generateSummary(personalInfo: any, workExperience: any[], skills: any[]): Promise<string> {
    const prompt = `Write a compelling professional summary (3-4 sentences, ~60 words) for:
Name: ${personalInfo?.fullName || "Professional"}
Title: ${personalInfo?.jobTitle || "Professional"}
Experience: ${workExperience?.length || 0} roles, most recent: ${workExperience?.[0]?.position || "N/A"} at ${workExperience?.[0]?.company || "N/A"}
Top Skills: ${skills?.slice(0, 5).map((s: any) => s.name).join(", ") || "Various"}

Make it:
- Start with years of experience or a strong qualifier
- Mention 2-3 key specializations
- Include a results-oriented achievement
- End with a value proposition
- ATS-friendly with relevant keywords

Return ONLY the summary text, nothing else.`;

    return await generateText(prompt);
}

export async function generateCoverLetter(
    resumeData: any,
    jobDescription: string,
    companyName: string
): Promise<string> {
    const prompt = `Write a professional cover letter for:

Applicant: ${resumeData?.personalInfo?.fullName || "Applicant"}
Current Role: ${resumeData?.personalInfo?.jobTitle || "Professional"}
Key Skills: ${resumeData?.skills?.slice(0, 8).map((s: any) => s.name).join(", ") || "Various"}
Experience: ${resumeData?.workExperience?.map((e: any) => `${e.position} at ${e.company}`).join("; ") || "Various roles"}

Company: ${companyName}
Job Description: ${jobDescription.slice(0, 2000)}

Write a 3-paragraph cover letter that:
1. Opening: Hook with relevant achievement, mention the specific role
2. Body: Connect 3-4 skills/experiences to job requirements with specific examples
3. Closing: Express enthusiasm, mention value you'll bring, call to action

Tone: Professional but personable. Length: ~250 words.
Return ONLY the cover letter text.`;

    return await generateText(prompt);
}

export async function tailorResumeForJob(resumeData: any, jobDescription: string): Promise<any> {
    const prompt = `You are an expert resume tailor. Analyze the job description and optimize the resume for it.

JOB DESCRIPTION:
${jobDescription.slice(0, 3000)}

CURRENT RESUME:
${JSON.stringify(resumeData, null, 2).slice(0, 5000)}

Return a JSON object with these fields:
{
  "optimizedSummary": "New summary tailored to this job",
  "suggestedSkills": ["skill1", "skill2", ...],
  "keywordsMissing": ["keyword1", "keyword2", ...],
  "bulletImprovements": [
    { "original": "old text", "improved": "new text", "experienceIndex": 0 }
  ],
  "overallFit": 85,
  "tips": ["tip1", "tip2", ...]
}`;

    return await generateJSON(prompt);
}

// ─── Groq-based AI Actions (Fast Inference) ─── //

export async function fixGrammar(text: string): Promise<string> {
    return await groqGrammarFix(text);
}

export async function detectResumeErrors(resumeData: any): Promise<any> {
    return await groqDetectErrors(JSON.stringify(resumeData, null, 2).slice(0, 8000));
}

export async function scoreResume(resumeData: any, jobDescription?: string): Promise<any> {
    const prompt = `Score this resume on a scale of 0-100 for ATS compatibility and overall quality.

Resume: ${JSON.stringify(resumeData, null, 2).slice(0, 5000)}
${jobDescription ? `Job Description: ${jobDescription.slice(0, 2000)}` : ""}

Return JSON:
{
  "totalScore": 78,
  "breakdown": {
    "contentQuality": { "score": 20, "max": 25, "feedback": "..." },
    "atsCompatibility": { "score": 18, "max": 25, "feedback": "..." },
    "impactMetrics": { "score": 15, "max": 20, "feedback": "..." },
    "formatting": { "score": 12, "max": 15, "feedback": "..." },
    "completeness": { "score": 13, "max": 15, "feedback": "..." }
  },
  "topImprovements": ["improvement1", "improvement2", "improvement3"],
  "strengths": ["strength1", "strength2"]
}`;

    return await groqGenerateJSON(prompt, "You are an expert ATS system and resume reviewer. Be accurate and helpful.");
}

export async function rewriteSection(section: string, content: string, action: string): Promise<string> {
    const prompt = `${action} this resume ${section} section content professionally:

${content}

Rules:
- Maintain factual accuracy
- Use strong action verbs
- Include metrics where possible
- Keep it concise and ATS-friendly
- Return ONLY the rewritten text`;

    return await groqGenerate(prompt, "You are a professional resume writer with 15+ years of experience.");
}

export async function globalPolish(resumeData: any): Promise<any> {
    const prompt = `Analyze this resume and provide comprehensive improvement suggestions.

Resume: ${JSON.stringify(resumeData, null, 2).slice(0, 6000)}

Return JSON array of suggestions:
[
  {
    "id": 1,
    "type": "improvement|ats|grammar|impact",
    "section": "summary|workExperience|skills|education|...",
    "title": "Short title",
    "description": "What's the issue",
    "before": "current text snippet",
    "after": "improved text snippet",
    "priority": "high|medium|low"
  }
]

Provide 5-8 actionable suggestions covering:
- Content impact improvements
- ATS keyword optimization
- Grammar/clarity fixes
- Missing achievements/metrics
- Section completeness`;

    return await groqGenerateJSON(prompt, "You are a senior career coach and resume expert. Be specific and actionable.");
}
