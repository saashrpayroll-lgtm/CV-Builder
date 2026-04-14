import { NextResponse } from "next/server";
import { deductExportCredit } from "@/app/actions/credits";

export async function POST() {
    const result = await deductExportCredit();
    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
}
