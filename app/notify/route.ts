import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generateOrderConfirmationEmail, generatePaymentReminderEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, orderNumber, total, email } = body;

    if (!type || !orderNumber || !total || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: type, orderNumber, total, email' },
        { status: 400 }
      );
    }

    let emailHtml = '';
    let subject = '';

    switch (type) {
      case 'order-confirmation':
        subject = `Order Confirmed - #${orderNumber}`;
        emailHtml = generateOrderConfirmationEmail(orderNumber, total, email);
        break;

      case 'payment-reminder':
        subject = `Payment Reminder - Order #${orderNumber}`;
        emailHtml = generatePaymentReminderEmail(orderNumber, total, email);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        );
    }

    const result = await sendEmail({
      to: email,
      subject,
      html: emailHtml,
      replyTo: 'support@master3d.net',
    });

    return NextResponse.json(
      { success: true, messageId: result.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Notify route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
