import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface UpdateRequest {
  orderId: string;
  newStatus: string;
  sendEmail?: boolean;
}

const statusMessages: Record<string, { subject: string; heading: string; body: string; color: string }> = {
  confirmed: {
    subject: "Order Confirmed",
    heading: "Your Order is Confirmed! ✅",
    body: "Great news! Your order has been confirmed and is being prepared for shipment.",
    color: "#3b82f6",
  },
  shipped: {
    subject: "Order Shipped",
    heading: "Your Order is On Its Way! 🚚",
    body: "Your order has been shipped and is on its way to you.",
    color: "#8b5cf6",
  },
  delivered: {
    subject: "Order Delivered",
    heading: "Order Delivered! 🎉",
    body: "Your order has been delivered. We hope you enjoy your products!",
    color: "#22c55e",
  },
  cancelled: {
    subject: "Order Cancelled",
    heading: "Order Cancelled ❌",
    body: "Your order has been cancelled. If you have any questions, please contact support.",
    color: "#ef4444",
  },
  processing: {
    subject: "Order Processing",
    heading: "Order Being Processed ⏳",
    body: "Your order is currently being processed. We'll notify you when it ships.",
    color: "#f59e0b",
  },
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userId = claimsData.claims.sub;

    // Check admin role using service role client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Forbidden: admin role required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { orderId, newStatus, sendEmail = true }: UpdateRequest = await req.json();

    if (!orderId || !newStatus) {
      return new Response(
        JSON.stringify({ error: "orderId and newStatus are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch the order
    const { data: order, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const oldStatus = order.status;

    // Update the order status
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Failed to update order", details: updateError.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send email via Resend if configured
    let emailSent = false;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (sendEmail && statusMessages[newStatus]) {
      const shippingAddress = order.shipping_address as any;
      const customerEmail = shippingAddress?.email;

      if (customerEmail && resendApiKey) {
        const msg = statusMessages[newStatus];
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background-color:#ffffff;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;">
              <tr>
                <td style="padding:40px 30px;text-align:center;background-color:${msg.color};">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;">${msg.heading}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:30px;">
                  <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.6;">
                    Hi ${shippingAddress?.firstName || "Customer"},
                  </p>
                  <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.6;">
                    ${msg.body}
                  </p>
                  <div style="background-color:#f9fafb;border-radius:8px;padding:20px;margin-bottom:24px;">
                    <p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Order Number</p>
                    <p style="margin:0;color:#111827;font-size:18px;font-weight:600;">${order.order_number}</p>
                    <p style="margin:12px 0 0;color:#6b7280;font-size:14px;">Status: <strong style="color:${msg.color};">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</strong></p>
                  </div>
                  <div style="background-color:#f9fafb;border-radius:8px;padding:20px;margin-bottom:24px;">
                    <p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Order Total</p>
                    <p style="margin:0;color:#111827;font-size:24px;font-weight:600;">₹${Number(order.total).toFixed(2)}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 30px;background-color:#f9fafb;text-align:center;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;">© 2026 OFH - The Organic Foods House. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        try {
          const resendRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: "OFH Orders <orders@updates.organicfoodshub.com>",
              to: [customerEmail],
              subject: `${msg.subject} - Order #${order.order_number}`,
              html: emailHtml,
            }),
          });
          emailSent = resendRes.ok;
          if (!resendRes.ok) {
            console.error("Resend error:", await resendRes.text());
          }
        } catch (emailErr) {
          console.error("Email send failed:", emailErr);
        }
      } else if (customerEmail) {
        console.log(`Email would be sent to ${customerEmail} (Resend not configured)`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        oldStatus,
        newStatus,
        orderNumber: order.order_number,
        emailSent,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
