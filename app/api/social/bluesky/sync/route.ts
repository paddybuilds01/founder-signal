import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeBlueskyPosts } from "@/lib/social";

const schema = z.object({
  handle: z.string().min(3),
  appPassword: z.string().min(8)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "A Bluesky handle and app password are required." }, { status: 400 });
  }

  const sessionResponse = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: parsed.data.handle, password: parsed.data.appPassword })
  });

  if (!sessionResponse.ok) {
    return NextResponse.json({ error: "Bluesky authentication failed. Check the handle and app password." }, { status: 401 });
  }

  const session = (await sessionResponse.json()) as { accessJwt: string; did: string; handle: string };
  const feedUrl = new URL("https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed");
  feedUrl.searchParams.set("actor", session.did);
  feedUrl.searchParams.set("limit", "50");

  const feedResponse = await fetch(feedUrl, {
    headers: { Authorization: `Bearer ${session.accessJwt}` }
  });

  if (!feedResponse.ok) {
    return NextResponse.json({ error: "Could not fetch Bluesky author feed." }, { status: 502 });
  }

  const feed = (await feedResponse.json()) as { feed: Parameters<typeof normalizeBlueskyPosts>[0] };
  return NextResponse.json({ posts: normalizeBlueskyPosts(feed.feed ?? []) });
}
