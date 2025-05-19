import { client } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripeSecret = process.env.STRIPE_SECRET;
if (!stripeSecret) throw new Error('STRIPE_SECRET is not defined in environment variables.');

const stripe = new Stripe(stripeSecret, {
  typescript: true,
  apiVersion: '2024-04-10',
});

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Create a Stripe Connect account
    const account = await stripe.accounts.create({
      country: 'US',
      type: 'custom',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'company',
    });

    // Store Stripe account ID in DB
    await client.user.update({
      where: { clerkId: user.id },
      data: { stripeId: account.id },
    });

    // Create an onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: process.env.STRIPE_REFRESH_URL || 'http://localhost:3000/callback/stripe/refresh',
      return_url: process.env.STRIPE_RETURN_URL || 'http://localhost:3000/callback/stripe/success',
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: any) {
    console.error('Stripe account creation error:', error.message || error);
    return new NextResponse('Something went wrong while creating Stripe account', { status: 500 });
  }
}
