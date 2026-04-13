import Stripe from 'stripe';

// Stripe is optional — only initialize if the secret key is provided
export const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        typescript: true,
    })
    : null;
