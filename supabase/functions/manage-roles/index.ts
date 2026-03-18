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

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: callerRole } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!callerRole) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const path = url.searchParams.get("path");

    // GET /audit-log
    if (req.method === "GET" && path === "audit-log") {
      const page = parseInt(url.searchParams.get("page") || "1");
      const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
      const from = url.searchParams.get("from");
      const to = url.searchParams.get("to");
      const actionFilter = url.searchParams.get("action");
      const emailFilter = url.searchParams.get("email");

      let query = supabaseAdmin
        .from("role_audit_log")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (from) query = query.gte("created_at", from);
      if (to) query = query.lte("created_at", to + "T23:59:59.999Z");
      if (actionFilter && actionFilter !== "all") query = query.eq("action", actionFilter);
      if (emailFilter) query = query.or(`actor_email.ilike.%${emailFilter}%,target_email.ilike.%${emailFilter}%`);

      const offset = (page - 1) * pageSize;
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      return new Response(JSON.stringify({ logs: data, total: count ?? 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /activity-log
    if (req.method === "GET" && path === "activity-log") {
      const page = parseInt(url.searchParams.get("page") || "1");
      const pageSize = parseInt(url.searchParams.get("pageSize") || "20");
      const emailFilter = url.searchParams.get("email");
      const eventType = url.searchParams.get("event_type");

      // Get all users for email mapping
      const { data: { users: allUsers } } = await supabaseAdmin.auth.admin.listUsers();
      const userMap = new Map(allUsers.map((u) => [u.id, u.email]));

      let query = supabaseAdmin
        .from("user_activity_log")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      // If email filter, find matching user IDs
      if (emailFilter) {
        const matchingIds = allUsers
          .filter((u) => u.email?.toLowerCase().includes(emailFilter.toLowerCase()))
          .map((u) => u.id);
        if (matchingIds.length === 0) {
          return new Response(JSON.stringify({ logs: [], total: 0, users: {} }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        query = query.in("user_id", matchingIds);
      }
      if (eventType) {
        query = query.eq("event_type", eventType);
      }

      const offset = (page - 1) * pageSize;
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      // Also get last_sign_in_at from auth for each unique user
      const uniqueUserIds = [...new Set((data || []).map((d) => d.user_id))];
      const userDetails: Record<string, { email: string; last_sign_in_at: string | null }> = {};
      for (const uid of uniqueUserIds) {
        const u = allUsers.find((au) => au.id === uid);
        if (u) {
          userDetails[uid] = { email: u.email || "unknown", last_sign_in_at: u.last_sign_in_at || null };
        }
      }

      return new Response(JSON.stringify({ logs: data, total: count ?? 0, users: userDetails }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (req.method === "GET") {
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;

      const { data: roles } = await supabaseAdmin.from("user_roles").select("*");

      const usersWithRoles = users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        roles: (roles || []).filter((r) => r.user_id === u.id).map((r) => r.role),
      }));

      return new Response(JSON.stringify({ users: usersWithRoles }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { action } = body;

      // Invite action
      if (action === "invite") {
        const { emails, role } = body;
        if (!emails || !Array.isArray(emails) || emails.length === 0) {
          return new Response(JSON.stringify({ error: "Emails array required" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (!role || !["admin", "moderator", "user"].includes(role)) {
          return new Response(JSON.stringify({ error: "Valid role required" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const results = [];
        for (const email of emails) {
          const trimmed = email.trim();
          if (!trimmed) continue;

          try {
            // Generate a random password - user will reset it
            const tempPassword = crypto.randomUUID().slice(0, 16) + "Aa1!";
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
              email: trimmed,
              password: tempPassword,
              email_confirm: true,
            });

            if (authError) {
              results.push({ email: trimmed, success: false, error: authError.message });
              continue;
            }

            // Assign role
            await supabaseAdmin
              .from("user_roles")
              .upsert({ user_id: authData.user.id, role }, { onConflict: "user_id,role" });

            // Log audit
            await supabaseAdmin.from("role_audit_log").insert({
              actor_id: user.id,
              actor_email: user.email!,
              target_user_id: authData.user.id,
              target_email: trimmed,
              action: "invite",
              role,
            });

            results.push({ email: trimmed, success: true });
          } catch (err: any) {
            results.push({ email: trimmed, success: false, error: err.message });
          }
        }

        return new Response(JSON.stringify({ results }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Bulk assign/remove
      if (action === "bulk-assign" || action === "bulk-remove") {
        const { userIds, role } = body;
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0 || !role || !["admin", "moderator", "user"].includes(role)) {
          return new Response(JSON.stringify({ error: "Invalid parameters: userIds array and valid role required" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (action === "bulk-remove" && userIds.includes(user.id) && role === "admin") {
          return new Response(JSON.stringify({ error: "You cannot remove your own admin role" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const results = [];
        for (const uid of userIds) {
          try {
            const { data: { user: targetUser } } = await supabaseAdmin.auth.admin.getUserById(uid);
            const targetEmail = targetUser?.email || "unknown";

            if (action === "bulk-assign") {
              await supabaseAdmin.from("user_roles").upsert({ user_id: uid, role }, { onConflict: "user_id,role" });
            } else {
              await supabaseAdmin.from("user_roles").delete().eq("user_id", uid).eq("role", role);
            }

            await supabaseAdmin.from("role_audit_log").insert({
              actor_id: user.id,
              actor_email: user.email!,
              target_user_id: uid,
              target_email: targetEmail,
              action: action === "bulk-assign" ? "assign" : "remove",
              role,
            });

            results.push({ userId: uid, success: true });
          } catch (err: any) {
            results.push({ userId: uid, success: false, error: err.message });
          }
        }

        return new Response(JSON.stringify({ results }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Assign/remove role
      const { userId, role } = body;
      if (!userId || !role || !["admin", "moderator", "user"].includes(role)) {
        return new Response(JSON.stringify({ error: "Invalid parameters" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "remove" && userId === user.id && role === "admin") {
        return new Response(JSON.stringify({ error: "You cannot remove your own admin role" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get target email for audit
      const { data: { user: targetUser } } = await supabaseAdmin.auth.admin.getUserById(userId);
      const targetEmail = targetUser?.email || "unknown";

      if (action === "assign") {
        const { error } = await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: userId, role }, { onConflict: "user_id,role" });
        if (error) throw error;

        await supabaseAdmin.from("role_audit_log").insert({
          actor_id: user.id,
          actor_email: user.email!,
          target_user_id: userId,
          target_email: targetEmail,
          action: "assign",
          role,
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "remove") {
        const { error } = await supabaseAdmin
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", role);
        if (error) throw error;

        await supabaseAdmin.from("role_audit_log").insert({
          actor_id: user.id,
          actor_email: user.email!,
          target_user_id: userId,
          target_email: targetEmail,
          action: "remove",
          role,
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
