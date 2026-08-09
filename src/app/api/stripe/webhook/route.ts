import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: any;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`[STRIPE_WEBHOOK_ERROR] Signature verification failed:`, err?.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log(`[STRIPE_PAYMENT_SUCCESS] Payment completed for session: ${session.id}`);
      // Record payment in DB if available
      try {
        if (session.customer_email) {
          await prisma.user.updateMany({
            where: { email: session.customer_email },
            data: { role: 'pro' } as any,
          });
        }
      } catch (dbErr) {
        console.warn('[STRIPE_WEBHOOK_DB_WARN] Could not record user upgrade in DB:', dbErr);
      }
      break;
    }
    default:
      console.log(`[STRIPE_WEBHOOK] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
