import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Calculate date range (last 7 days)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekAgoISO = weekAgo.toISOString();

    // Get metrics
    // 1. Total logins this week
    const { count: loginCount } = await supabaseAdmin
      .from("user_activity_log")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "login")
      .gte("created_at", weekAgoISO);

    // 2. New orders this week
    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("total, status")
      .gte("created_at", weekAgoISO);

    const newOrderCount = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

    // 3. New users this week
    const { data: { users: allUsers } } = await supabaseAdmin.auth.admin.listUsers();
    const newUsers = allUsers.filter(
      (u) => new Date(u.created_at) >= weekAgo
    ).length;

    // 4. Active users (logged in this week)
    const { data: activeLogins } = await supabaseAdmin
      .from("user_activity_log")
      .select("user_id")
      .eq("event_type", "login")
      .gte("created_at", weekAgoISO);
    const activeUsers = new Set(activeLogins?.map((l) => l.user_id)).size;

    // 5. Role changes this week
    const { count: roleChanges } = await supabaseAdmin
      .from("role_audit_log")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgoISO);

    // Get admin emails
    const { data: adminRoles } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    const adminEmails: string[] = [];
    for (const role of adminRoles || []) {
      const user = allUsers.find((u) => u.id === role.user_id);
      if (user?.email) adminEmails.push(user.email);
    }

    if (adminEmails.length === 0) {
      return new Response(JSON.stringify({ message: "No admin emails found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const weekLabel = `${weekAgo.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#1a1a1a;font-size:24px;margin:0;">📊 Weekly Admin Summary</h1>
      <p style="color:#666;font-size:14px;margin:8px 0 0;">${weekLabel}</p>
    </div>
    
    <div style="background:#f8faf8;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h2 style="color:#1a1a1a;font-size:18px;margin:0 0 16px;">Key Metrics</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb;">
            <span style="color:#666;font-size:13px;">Total Logins</span><br>
            <span style="color:#1a1a1a;font-size:24px;font-weight:700;">${loginCount || 0}</span>
          </td>
          <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb;">
            <span style="color:#666;font-size:13px;">Active Users</span><br>
            <span style="color:#1a1a1a;font-size:24px;font-weight:700;">${activeUsers}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb;">
            <span style="color:#666;font-size:13px;">New Orders</span><br>
            <span style="color:#1a1a1a;font-size:24px;font-weight:700;">${newOrderCount}</span>
          </td>
          <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb;">
            <span style="color:#666;font-size:13px;">Revenue</span><br>
            <span style="color:#2d8a4e;font-size:24px;font-weight:700;">$${totalRevenue.toFixed(2)}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 8px;">
            <span style="color:#666;font-size:13px;">New Users</span><br>
            <span style="color:#1a1a1a;font-size:24px;font-weight:700;">${newUsers}</span>
          </td>
          <td style="padding:12px 8px;">
            <span style="color:#666;font-size:13px;">Role Changes</span><br>
            <span style="color:#1a1a1a;font-size:24px;font-weight:700;">${roleChanges || 0}</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align:center;margin-top:32px;">
      <p style="color:#999;font-size:12px;">
        Organic Farm Hub • Weekly Admin Summary<br>
        This email was sent automatically. 
      </p>
    </div>
  </div>
</body>
</html>`;

    // Send to all admins
    const results = [];
    for (const email of adminEmails) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "OFH Admin <onboarding@resend.dev>",
          to: email,
          subject: `Weekly Summary: ${weekLabel}`,
          html: emailHtml,
        }),
      });
      const data = await res.json();
      results.push({ email, success: res.ok, data });
    }

    return new Response(JSON.stringify({ results, metrics: { loginCount, activeUsers, newOrderCount, totalRevenue, newUsers, roleChanges } }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
