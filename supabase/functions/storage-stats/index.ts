import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

    // Check if user is admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: isAdminData, error: adminError } = await userClient.rpc("is_admin");
    if (adminError || !isAdminData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to list storage objects
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // List all files in media bucket recursively
    const allFiles: Array<{
      name: string;
      size: number;
      created_at: string;
      content_type: string;
    }> = [];

    const folders = ["images", "files", ""];

    for (const folder of folders) {
      const { data: files, error } = await adminClient.storage
        .from("media")
        .list(folder || undefined, { limit: 1000, sortBy: { column: "created_at", order: "desc" } });

      if (!error && files) {
        for (const file of files) {
          if (file.metadata) {
            allFiles.push({
              name: folder ? `${folder}/${file.name}` : file.name,
              size: file.metadata.size || 0,
              created_at: file.created_at || "",
              content_type: file.metadata.mimetype || "unknown",
            });
          }
        }
      }
    }

    const totalSize = allFiles.reduce((sum, f) => sum + f.size, 0);
    const imageFiles = allFiles.filter((f) =>
      f.content_type.startsWith("image/")
    );
    const docFiles = allFiles.filter(
      (f) => !f.content_type.startsWith("image/")
    );

    const stats = {
      totalFiles: allFiles.length,
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      imageCount: imageFiles.length,
      imageSize: imageFiles.reduce((sum, f) => sum + f.size, 0),
      docCount: docFiles.length,
      docSize: docFiles.reduce((sum, f) => sum + f.size, 0),
      storageLimitMB: 1024, // 1GB free tier
      files: allFiles.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    };

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
