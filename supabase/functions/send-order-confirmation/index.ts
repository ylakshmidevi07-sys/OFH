import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface OrderConfirmationRequest {
  email: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  estimatedDelivery: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderConfirmationRequest = await req.json();

    const {
      email,
      orderNumber,
      items,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      paymentMethod,
      shippingAddress,
      estimatedDelivery,
    } = orderData;

    if (!email || !orderNumber) {
      throw new Error("Missing required fields: email and orderNumber");
    }

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            ${item.name}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            ₹${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="padding: 40px 30px; text-align: center; background-color: #22c55e;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Order Confirmed! 🎉</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                  Thank you for your order! We're excited to get your fresh, organic products on their way to you.
                </p>
                
                <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                  <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Order Number</p>
                  <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${orderNumber}</p>
                </div>

                <h2 style="margin: 0 0 16px; color: #111827; font-size: 18px;">Order Summary</h2>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Item</th>
                    <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Price</th>
                  </tr>
                  ${itemsHtml}
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Subtotal</td>
                    <td style="padding: 8px 0; text-align: right; color: #374151;">₹${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Shipping</td>
                    <td style="padding: 8px 0; text-align: right; color: #374151;">${shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Tax</td>
                    <td style="padding: 8px 0; text-align: right; color: #374151;">₹${tax.toFixed(2)}</td>
                  </tr>
                  ${discount > 0 ? `
                  <tr>
                    <td style="padding: 8px 0; color: #22c55e;">Discount</td>
                    <td style="padding: 8px 0; text-align: right; color: #22c55e;">-₹${discount.toFixed(2)}</td>
                  </tr>
                  ` : ""}
                  <tr style="border-top: 2px solid #e5e7eb;">
                    <td style="padding: 16px 0 8px; color: #111827; font-weight: 600; font-size: 18px;">Total</td>
                    <td style="padding: 16px 0 8px; text-align: right; color: #111827; font-weight: 600; font-size: 18px;">₹${total.toFixed(2)}</td>
                  </tr>
                </table>

                <div style="display: flex; gap: 24px; margin-bottom: 24px;">
                  <div style="flex: 1;">
                    <h3 style="margin: 0 0 8px; color: #111827; font-size: 14px; font-weight: 600;">Shipping Address</h3>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
                      ${shippingAddress.address}<br>
                      ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
                    </p>
                  </div>
                  <div style="flex: 1;">
                    <h3 style="margin: 0 0 8px; color: #111827; font-size: 14px; font-weight: 600;">Payment Method</h3>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">
                      ${paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "upi" ? "UPI" : "Credit/Debit Card"}
                    </p>
                  </div>
                </div>

                <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                  <p style="margin: 0; color: #92400e; font-size: 14px;">
                    <strong>Estimated Delivery:</strong> ${estimatedDelivery}
                  </p>
                </div>

                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                  If you have any questions about your order, please don't hesitate to contact our support team.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 30px; background-color: #f9fafb; text-align: center;">
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                  © 2026 OFH - The Organic Foods House. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "OFH Orders <orders@ofh.com>",
      to: [email],
      subject: `Order Confirmed - ${orderNumber}`,
      html: emailHtml,
    });

    console.log("Order confirmation email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
