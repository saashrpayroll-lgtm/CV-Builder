import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Admin check placeholder (replace with actual role check)
        if (!user || user.email !== process.env.ADMIN_EMAIL) {
            // return new NextResponse("Unauthorized", { status: 401 });
        }

        const templatesDir = path.join(process.cwd(), "templates");
        const categories = fs.readdirSync(templatesDir);

        const templates: any[] = [];

        categories.forEach(category => {
            const categoryDir = path.join(templatesDir, category);
            if (fs.statSync(categoryDir).isDirectory()) {
                const templateFolders = fs.readdirSync(categoryDir);
                templateFolders.forEach(folder => {
                    const templatePath = path.join(categoryDir, folder);
                    const configPath = path.join(templatePath, "config.json");
                    if (fs.existsSync(configPath)) {
                        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
                        templates.push({
                            ...config,
                            category,
                            path: `/templates/${category}/${folder}`
                        });
                    }
                });
            }
        });

        return NextResponse.json(templates);

    } catch (error) {
        console.error("[ADMIN_TEMPLATES_GET_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    // Placeholder for Template Upload logic (unzip, validate, save)
    return NextResponse.json({ message: "Admin Template Upload coming soon" });
}
