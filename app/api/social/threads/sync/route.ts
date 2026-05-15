import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeThreadsPosts } from "@/lib/social";

const schema = z.object({
  userId: z.string().min(1),
  accessToken: z.string().min(12)
});

interface ThreadsMediaResponse {
  data?: Array<{
    id: string;
    text?: string;
    permalink?: string;
    timestamp?: string;
    username?: string;
  }>;
}

interface ThreadsInsightResponse {
  data?: Array<{ name: string; values?: Array<{ value: number }> }>;
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "A Threads user id and access token are required." }, { status: 400 });
  }

  const mediaUrl = new URL(`https://graph.threads.net/v1.0/${parsed.data.userId}/threads`);
  mediaUrl.searchParams.set("fields", "id,text,permalink,timestamp,username");
  mediaUrl.searchParams.set("limit", "25");
  mediaUrl.searchParams.set("access_token", parsed.data.accessToken);

  const mediaResponse = await fetch(mediaUrl);
  if (!mediaResponse.ok) {
    return NextResponse.json({ error: "Threads sync failed. Check token, user id, scopes, and Meta app access." }, { status: 401 });
  }

  const media = (await mediaResponse.json()) as ThreadsMediaResponse;
  const items = await Promise.all(
    (media.data ?? []).map(async (item) => {
      const insightsUrl = new URL(`https://graph.threads.net/v1.0/${item.id}/insights`);
      insightsUrl.searchParams.set("metric", "views,likes,replies,reposts,quotes,shares");
      insightsUrl.searchParams.set("access_token", parsed.data.accessToken);
      const insightResponse = await fetch(insightsUrl);
      if (!insightResponse.ok) return { ...item, metrics: {} };
      const insight = (await insightResponse.json()) as ThreadsInsightResponse;
      const metrics = Object.fromEntries((insight.data ?? []).map((metric) => [metric.name, metric.values?.[0]?.value ?? 0]));
      return { ...item, metrics };
    })
  );

  return NextResponse.json({ posts: normalizeThreadsPosts(items, parsed.data.userId) });
}
