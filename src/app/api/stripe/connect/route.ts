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

    const account = await stripe.accounts.create({
      country: 'US',
      type: 'custom',
      business_type: 'company',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: '127.0.0.1', // safer fallback IP
      },
    });

    await stripe.accounts.update(account.id, {
      business_profile: {
        mcc: '5045',
        url: 'https://bestcookieco.com',
      },
      company: {
        address: {
          city: 'Fairfax',
          line1: '123 State St',
          postal_code: '22031',
          state: 'VA',
        },
        tax_id: '000000000',
        name: 'The Best Cookie Co',
        phone: '8888675309',
      },
    });

    const person = await stripe.accounts.createPerson(account.id, {
      first_name: 'Jenny',
      last_name: 'Rosen',
      relationship: {
        representative: true,
        title: 'CEO',
      },
    });

    await stripe.accounts.updatePerson(account.id, person.id, {
      address: {
        city: 'Victoria',
        line1: '123 State St',
        postal_code: 'V8P 1A1',
        state: 'BC',
      },
      dob: { day: 10, month: 11, year: 1980 },
      ssn_last_4: '0000',
      phone: '8888675309',
      email: 'jenny@bestcookieco.com',
      relationship: { executive: true },
    });

    await stripe.accounts.createPerson(account.id, {
      first_name: 'Kathleen',
      last_name: 'Banks',
      email: 'kathleen@bestcookieco.com',
      address: {
        city: 'Victoria',
        line1: '123 State St',
        postal_code: 'V8P 1A1',
        state: 'BC',
      },
      dob: { day: 10, month: 11, year: 1980 },
      phone: '8888675309',
      relationship: {
        owner: true,
        percent_ownership: 80,
      },
    });

    await stripe.accounts.update(account.id, {
      company: {
        owners_provided: true,
      },
    });

    await client.user.update({
      where: { clerkId: user.id },
      data: { stripeId: account.id },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: process.env.STRIPE_REFRESH_URL || 'http://localhost:3000/callback/stripe/refresh',
      return_url: process.env.STRIPE_RETURN_URL || 'http://localhost:3000/callback/stripe/success',
      type: 'account_onboarding',
      collection_options: {
        fields: 'currently_due',
      },
    });

    return NextResponse.json({ url: accountLink.url });

  } catch (error: any) {
    console.error('Stripe account creation error:', error.message || error);
    return new NextResponse('Something went wrong while creating Stripe account', { status: 500 });
  }
}
