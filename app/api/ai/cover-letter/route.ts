import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCoverLetter } from "@/lib/ai/ai-actions";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { resumeData, jobDescription, companyName } = await req.json();
        if (!resumeData || !jobDescription || !companyName) {
            return NextResponse.json({ error: "Resume data, job description, and company name required" }, { status: 400 });
        }

        const coverLetter = await generateCoverLetter(resumeData, jobDescription, companyName);

        // Optionally save to DB
        if (resumeData.id) {
            await supabase.from("cover_letters").insert({
                user_id: user.id,
                resume_id: resumeData.id,
                title: `Cover Letter - ${companyName}`,
                content: coverLetter,
                job_description: jobDescription,
                company_name: companyName,
            });
        }

        return NextResponse.json({ success: true, coverLetter });
    } catch (error) {
        console.error("[AI_COVER_LETTER]", error);
        return NextResponse.json({ error: "Failed to generate cover letter" }, { status: 500 });
    }
}
