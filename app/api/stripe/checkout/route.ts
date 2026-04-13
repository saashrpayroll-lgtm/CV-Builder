import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        if (!stripe) {
            return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Resume Builder Pro",
                            description: "Unlimited AI, Premium Templates, PDF Exports",
                        },
                        unit_amount: 1900,
                        recurring: { interval: "month" },
                    },
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=cancelled`,
            metadata: { userId: user.id },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("[STRIPE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
