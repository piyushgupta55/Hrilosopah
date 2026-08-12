import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import type Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

import { getBaseUrl } from '@/lib/baseUrl';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json().catch(() => ({}));
    const { attemptId, quizSlug = 'ai-awareness', locale = 'en' } = body;

    const origin = req.headers.get('origin') || getBaseUrl();

    // Single $1.00 Plan: Unlock Full Results & Certificate after completing all questions
    const planName = 'Full Quiz Results & Official Certificate Unlock';
    const amountInCents = 100; // $1.00 USD

    // Check if Stripe API key is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      const mockCheckoutUrl = `${origin}/${locale}/quiz/${quizSlug}/summary?payment=success&unlocked=true&session_id=demo_session_${Date.now()}`;
      return NextResponse.json({
        url: mockCheckoutUrl,
        sessionId: `demo_session_${Date.now()}`,
        demoMode: true,
        message: 'Stripe API key not set in .env. Returned $1 demo checkout URL.',
      });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: planName,
            description:
              'Unlock detailed question explanations, performance analytics & PDF certificate.',
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ];

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: session?.user?.email || undefined,
      success_url: `${origin}/${locale}/quiz/${quizSlug}/summary?payment=success&unlocked=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/quiz/${quizSlug}/summary?payment=cancelled`,
      metadata: {
        userId: session?.user?.email || 'guest',
        attemptId: attemptId || 'default',
        quizSlug,
      },
    });

    return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id });
  } catch (error: any) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create $1 Stripe Checkout session' },
      { status: 500 }
    );
  }
}
