import { Resend } from 'resend';

// Initialize Resend only when the function is called, not at module load time
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(apiKey);
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const resend = getResendClient();
    
    // Send to customer and admins
    const recipients = [options.to, 'oscarege@icloud.com', 'dariodibonaoff@gmail.com'];
    
    const result = await resend.emails.send({
      from: 'Master 3D <contact.master3d@gmail.com>',
      to: recipients,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo || 'contact.master3d@gmail.com',
    });

    if (result.error) {
      console.error('[v0] Resend error:', result.error);
      throw new Error(result.error.message);
    }

    console.log('[v0] Email sent successfully:', result.data?.id);
    return result.data;
  } catch (error) {
    console.error('[v0] Failed to send email:', error);
    throw error;
  }
}

export function generateOrderConfirmationEmail(orderNumber: string, total: number, email: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF6B00; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .order-details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #FF6B00; }
          .label { font-weight: bold; color: #FF6B00; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .cta { display: inline-block; background: #FF6B00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
          </div>
          <div class="content">
            <p>Thank you for your order, ${email}!</p>
            
            <div class="order-details">
              <p><span class="label">Order Number:</span> #${orderNumber}</p>
              <p><span class="label">Total Amount:</span> CHF ${total.toFixed(2)}</p>
              <p><span class="label">Status:</span> Pending Payment</p>
            </div>

            <p>We've received your order and are ready to print your custom 3D products. Payment details have been sent separately.</p>

            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Complete your payment using the provided payment instructions</li>
              <li>We'll begin production once payment is confirmed</li>
              <li>You'll receive a shipping notification when your order is on the way</li>
            </ul>

            <a href="https://master3d.net/my-orders?order=${orderNumber}" class="cta">View Order Details</a>

            <p>For tracking updates, visit: <a href="https://track.master3d.net">track.master3d.net</a></p>

            <div class="footer">
              <p>Master 3D - Swiss 3D Printing Excellence</p>
              <p>This is an automated email, please do not reply directly.</p>
              <p>Contact: +41 78 251 47 68</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generatePaymentReminderEmail(orderNumber: string, total: number, email: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF6B00; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .payment-box { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border: 2px solid #FF6B00; }
          .label { font-weight: bold; color: #FF6B00; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .cta { display: inline-block; background: #FF6B00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Reminder</h1>
          </div>
          <div class="content">
            <p>Hi ${email},</p>
            
            <p>We're ready to start printing your order! To proceed, we need to receive your payment.</p>

            <div class="payment-box">
              <p><span class="label">Order Number:</span> #${orderNumber}</p>
              <p><span class="label">Amount Due:</span> CHF ${total.toFixed(2)}</p>
              <p><span class="label">Payment Methods:</span> TWINT or Bank Transfer</p>
            </div>

            <p>Complete payment instructions have been sent to you. Once we receive your payment, we'll begin production immediately.</p>

            <a href="https://master3d.net/my-orders?order=${orderNumber}" class="cta">View Payment Instructions</a>

            <div class="footer">
              <p>Master 3D - Swiss 3D Printing Excellence</p>
              <p>Contact: +41 78 251 47 68</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
