import { inferCommunity, inferTopic } from "@/lib/analytics";
import type { PlatformId, SocialPost } from "@/lib/types";
import { uid } from "@/lib/utils";

interface BlueskyFeedItem {
  post: {
    uri: string;
    cid: string;
    author: { handle: string };
    record?: { text?: string; createdAt?: string };
    likeCount?: number;
    replyCount?: number;
    repostCount?: number;
    quoteCount?: number;
  };
}

export const normalizeBlueskyPosts = (items: BlueskyFeedItem[]): SocialPost[] =>
  items.map((item) => {
    const text = item.post.record?.text ?? "";
    return {
      id: uid(),
      platform: "bluesky",
      externalId: item.post.uri,
      accountHandle: item.post.author.handle,
      text,
      url: `https://bsky.app/profile/${item.post.author.handle}/post/${item.post.uri.split("/").pop() ?? item.post.cid}`,
      postedAt: item.post.record?.createdAt ?? new Date().toISOString(),
      topic: inferTopic(text),
      community: inferCommunity(text, "bluesky"),
      metrics: {
        views: 0,
        likes: item.post.likeCount ?? 0,
        replies: item.post.replyCount ?? 0,
        reposts: item.post.repostCount ?? 0,
        quotes: item.post.quoteCount ?? 0,
        shares: 0
      },
      raw: item
    };
  });

interface ThreadsItem {
  id: string;
  text?: string;
  permalink?: string;
  timestamp?: string;
  username?: string;
  metrics?: Record<string, number>;
}

export const normalizeThreadsPosts = (items: ThreadsItem[], handle: string): SocialPost[] =>
  items.map((item) => {
    const text = item.text ?? "";
    return {
      id: uid(),
      platform: "threads",
      externalId: item.id,
      accountHandle: item.username ? `@${item.username}` : handle,
      text,
      url: item.permalink,
      postedAt: item.timestamp ?? new Date().toISOString(),
      topic: inferTopic(text),
      community: inferCommunity(text, "threads"),
      metrics: {
        views: item.metrics?.views ?? 0,
        likes: item.metrics?.likes ?? 0,
        replies: item.metrics?.replies ?? 0,
        reposts: item.metrics?.reposts ?? 0,
        quotes: item.metrics?.quotes ?? 0,
        shares: item.metrics?.shares ?? 0
      },
      raw: item
    };
  });

export const platformDisplayName = (platform: PlatformId) => {
  const names: Record<PlatformId, string> = {
    instagram: "Instagram",
    threads: "Threads",
    x: "X",
    bluesky: "Bluesky"
  };
  return names[platform];
};
