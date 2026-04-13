import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
    if (!stripe || !supabaseAdmin) {
        return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
    }

    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === "checkout.session.completed") {
        const userId = session.metadata?.userId;
        if (!userId) {
            return new NextResponse("User ID missing in metadata", { status: 400 });
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription) as any;

        const { error } = await supabaseAdmin.from('users').update({
            stripe_customer_id: session.customer,
            subscription_status: 'pro',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        }).eq('id', userId);

        if (error) {
            console.error("[STRIPE WEBHOOK ERROR]:", error.message);
            return new NextResponse(`Database error: ${error.message}`, { status: 500 });
        }
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription) as any;

        const { error } = await supabaseAdmin.from('users').update({
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        }).eq('stripe_customer_id', session.customer);

        if (error) {
            console.error("[STRIPE WEBHOOK ERROR]:", error.message);
            return new NextResponse(`Database error: ${error.message}`, { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
