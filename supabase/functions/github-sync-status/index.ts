const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const REPO = "James-1971-source/sj-hope-homepage-lovable";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/github";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GITHUB_API_KEY = Deno.env.get("GITHUB_API_KEY");
    if (!LOVABLE_API_KEY || !GITHUB_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GitHub 커넥터가 연결되어 있지 않습니다." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const headers = {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GITHUB_API_KEY,
    };

    const [repoRes, commitsRes] = await Promise.all([
      fetch(`${GATEWAY_URL}/repos/${REPO}`, { headers }),
      fetch(`${GATEWAY_URL}/repos/${REPO}/commits?per_page=10`, { headers }),
    ]);

    if (!repoRes.ok || !commitsRes.ok) {
      const body = await (repoRes.ok ? commitsRes : repoRes).text();
      return new Response(
        JSON.stringify({ error: "GitHub API 호출 실패", details: body }),
        { status: repoRes.ok ? commitsRes.status : repoRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const repo = await repoRes.json();
    const commits = await commitsRes.json();

    return new Response(
      JSON.stringify({
        repo: {
          full_name: repo.full_name,
          html_url: repo.html_url,
          default_branch: repo.default_branch,
          pushed_at: repo.pushed_at,
          updated_at: repo.updated_at,
        },
        commits: (commits as any[]).map((c) => ({
          sha: c.sha,
          short_sha: c.sha?.slice(0, 7),
          message: c.commit?.message?.split("\n")[0] ?? "",
          author: c.commit?.author?.name ?? c.author?.login ?? "unknown",
          date: c.commit?.author?.date ?? null,
          url: c.html_url,
        })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
