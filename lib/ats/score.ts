import { ResumeData } from "@/store/useResumeStore";

export interface ATSResult {
    score: number;
    breakdown: {
        keywords: number; // 40
        skills: number;   // 20
        structure: number; // 15
        formatting: number;// 10
        impact: number;    // 10
        grammar: number;   // 5
    };
    missingKeywords: string[];
    improvements: string[];
}

const ACTION_VERBS = [
    "achieved", "accelerated", "accomplished", "added", "advanced", "analyzed", "attained", "awarded",
    "boosted", "built", "calculated", "captured", "changed", "clarified", "coached", "collaborated",
    "created", "delivered", "developed", "deployed", "designed", "driven", "earned", "eliminated",
    "engineered", "enhanced", "established", "expanded", "expedited", "exceeded", "executed", "grew",
    "guided", "improved", "implemented", "increased", "initiated", "innovated", "inspired", "introduced",
    "launched", "led", "managed", "maximized", "mentored", "modernized", "negotiated", "optimized",
    "orchestrated", "organized", "overcame", "pioneered", "planned", "produced", "reduced", "resolved",
    "restored", "revamped", "saved", "scaled", "secured", "simplified", "solved", "spearheaded",
    "streamlined", "strengthened", "succeeded", "supercharged", "supported", "targeted", "transformed",
    "upgraded", "visualized", "won"
];

export function calculateATSScore(resume: ResumeData, jobDescription?: string): ATSResult {
    let score = 0;
    const breakdown = {
        keywords: 0,
        skills: 0,
        structure: 0,
        formatting: 0,
        impact: 0,
        grammar: 5 // Assume good until checked via AI
    };
    const improvements: string[] = [];
    const missingKeywords: string[] = [];

    // 1. Structure Check (15 points)
    let structureScore = 0;
    if (resume.personalInfo?.fullName && resume.personalInfo?.email) structureScore += 5;
    if ((resume.summary?.length || 0) > 50) structureScore += 5;
    if ((resume.workExperience?.length || 0) > 0) structureScore += 5;

    breakdown.structure = structureScore;

    // 2. Formatting & Length (10 points)
    let formatScore = 0;
    const totalWords = JSON.stringify(resume).split(/\s+/).length;
    if (totalWords >= 400 && totalWords <= 1200) formatScore += 5; // Ideal length
    if ((resume.education?.length || 0) > 0 && (resume.skills?.length || 0) > 0) formatScore += 5;

    breakdown.formatting = formatScore;

    // 3. Impact Analysis (Action Verbs) (10 points)
    let impactScore = 0;
    let verbCount = 0;
    const allText = JSON.stringify(resume.workExperience || []).toLowerCase();

    ACTION_VERBS.forEach(verb => {
        if (allText.includes(verb)) verbCount++;
    });

    if (verbCount > 5) impactScore = 10;
    else if (verbCount > 2) impactScore = 5;

    if (impactScore < 5) improvements.push("Use more strong action verbs like 'Achieved', 'Led', 'Developed'.");
    breakdown.impact = impactScore;

    // 4. Skills Relevance (20 points)
    let skillsScore = 0;
    const skillsLength = resume.skills?.length || 0;
    if (skillsLength >= 5) skillsScore = 20;
    else if (skillsLength >= 3) skillsScore = 10;
    else improvements.push("Add at least 5 key skills.");

    breakdown.skills = skillsScore;

    // 5. Keyword Match (40 points) - ONLY if JD is provided
    let keywordScore = 0;
    if (jobDescription) {
        // Simple logic for now: check exact matches of JD words in Resume
        // In a real app, we'd use TF-IDF or vector embeddings
        const jdWords = jobDescription.toLowerCase().match(/\b\w+\b/g) || [];
        const resumeWords = JSON.stringify(resume).toLowerCase();

        // Filter out common stop words (short list for demo)
        const stopWords = ["the", "and", "or", "but", "in", "on", "at", "to", "for", "with", "a", "an"];
        const importantKeywords = [...new Set(jdWords.filter(w => w.length > 4 && !stopWords.includes(w)))];

        let matchCount = 0;
        importantKeywords.forEach(kw => {
            if (resumeWords.includes(kw)) matchCount++;
            else missingKeywords.push(kw);
        });

        const matchRatio = matchCount / (importantKeywords.length || 1);
        keywordScore = Math.min(40, Math.round(matchRatio * 40));

        // Boost score if match is decent
        if (keywordScore < 20) improvements.push("Your resume matches less than 50% of the job keywords.");
    } else {
        // If no JD, give full points for this section or normalize?
        // Let's just give a base score or ask user to add JD
        keywordScore = 40; // Default max if no JD strictly to avoid penalizing
        // improvements.push("Add a Job Description to get a real keyword match score.");
    }

    breakdown.keywords = keywordScore;

    // Total Calculation
    score = breakdown.structure + breakdown.formatting + breakdown.impact + breakdown.skills + breakdown.keywords + breakdown.grammar;

    return {
        score,
        breakdown,
        missingKeywords: missingKeywords.slice(0, 10), // Limit to top 10
        improvements
    };
}
