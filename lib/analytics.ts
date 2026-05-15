import type { FounderSignalData, Recommendation, SocialPost } from "@/lib/types";
import { hourLabel } from "@/lib/utils";

export const engagementTotal = (post: SocialPost) =>
  post.metrics.likes + post.metrics.replies * 2 + post.metrics.reposts * 3 + post.metrics.quotes * 3 + post.metrics.shares * 2;

export const engagementRate = (post: SocialPost) => {
  const denominator = post.metrics.views > 0 ? post.metrics.views : Math.max(1, post.metrics.likes + post.metrics.replies + post.metrics.reposts);
  return (engagementTotal(post) / denominator) * 100;
};

export const totalAudience = (data: FounderSignalData) =>
  Object.values(data.platformMetrics).reduce((sum, metrics) => sum + metrics.audience, 0);

export const growthVelocity = (data: FounderSignalData) => {
  const values = Object.values(data.platformMetrics).map((metrics) => metrics.weeklyGrowthPct);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export const founderSignalScore = (data: FounderSignalData) => {
  const growth = Math.min(100, growthVelocity(data) * 13);
  const output = Math.min(100, data.contentLog.length * 10 + data.socialPosts.length * 5);
  const execution = Math.min(100, data.executionHistory.length * 8 + data.executionTasks.filter((task) => task.status === "completed").length * 6);
  return Math.round(growth * 0.35 + output * 0.35 + execution * 0.3);
};

export const topicPerformance = (posts: SocialPost[]) => {
  const map = new Map<string, { topic: string; posts: number; score: number; replies: number; reposts: number }>();
  posts.forEach((post) => {
    const current = map.get(post.topic) ?? { topic: post.topic, posts: 0, score: 0, replies: 0, reposts: 0 };
    current.posts += 1;
    current.score += engagementTotal(post);
    current.replies += post.metrics.replies;
    current.reposts += post.metrics.reposts;
    map.set(post.topic, current);
  });
  return [...map.values()].sort((a, b) => b.score - a.score);
};

export const communityPerformance = (posts: SocialPost[]) => {
  const map = new Map<string, { community: string; posts: number; score: number }>();
  posts.forEach((post) => {
    const current = map.get(post.community) ?? { community: post.community, posts: 0, score: 0 };
    current.posts += 1;
    current.score += engagementTotal(post);
    map.set(post.community, current);
  });
  return [...map.values()].sort((a, b) => b.score - a.score);
};

export const bestPostingTimes = (posts: SocialPost[]) => {
  const map = new Map<string, { label: string; hour: number; weekday: string; score: number; posts: number }>();
  posts.forEach((post) => {
    const date = new Date(post.postedAt);
    const hour = date.getHours();
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const key = `${weekday}-${hour}`;
    const current = map.get(key) ?? { label: `${weekday} ${hourLabel(hour)}`, hour, weekday, score: 0, posts: 0 };
    current.posts += 1;
    current.score += engagementTotal(post);
    map.set(key, current);
  });
  return [...map.values()].sort((a, b) => b.score / b.posts - a.score / a.posts).slice(0, 5);
};

export const inferTopic = (text: string) => {
  const normalized = text.toLowerCase();
  if (/(ship|execution|speed|build|task|workflow)/.test(normalized)) return "Execution";
  if (/(distribution|growth|reach|audience|channel)/.test(normalized)) return "Distribution";
  if (/(content|post|newsletter|thread|creator)/.test(normalized)) return "Content Strategy";
  if (/(market|customer|signal|feedback|insight)/.test(normalized)) return "Market Signal";
  return "Founder Notes";
};

export const inferCommunity = (text: string, platform: string) => {
  const normalized = text.toLowerCase();
  if (/(ai|automation|agent)/.test(normalized)) return "AI Builders";
  if (/(indie|bootstrap|solo)/.test(normalized)) return "Indie Builders";
  if (/(creator|content|audience)/.test(normalized)) return "Creator Founders";
  if (platform === "bluesky") return "Open Social Builders";
  return "Founder Operators";
};

export const generateRecommendations = (data: FounderSignalData): Recommendation[] => {
  const topics = topicPerformance(data.socialPosts);
  const communities = communityPerformance(data.socialPosts);
  const times = bestPostingTimes(data.socialPosts);
  const topTopic = topics[0];
  const topCommunity = communities[0];
  const topTime = times[0];

  return [
    {
      id: "rec_time",
      type: "time",
      title: topTime ? `Post around ${topTime.label}` : "Build a timing baseline",
      detail: topTime
        ? `Your highest average engagement currently clusters around ${topTime.label}.`
        : "Sync or log more posts to calculate reliable posting windows.",
      confidence: topTime && topTime.posts > 1 ? 0.76 : 0.48
    },
    {
      id: "rec_topic",
      type: "topic",
      title: topTopic ? `Double down on ${topTopic.topic}` : "No topic signal yet",
      detail: topTopic
        ? `${topTopic.topic} is generating the strongest weighted engagement across recent posts.`
        : "Topic recommendations appear once posts are imported or logged.",
      confidence: topTopic && topTopic.posts > 1 ? 0.8 : 0.55
    },
    {
      id: "rec_community",
      type: "community",
      title: topCommunity ? `Test more in ${topCommunity.community}` : "Find your first community pocket",
      detail: topCommunity
        ? `${topCommunity.community} is the strongest current community fit by replies and repost spread.`
        : "Community fit is calculated from post text, feed context, and engagement response.",
      confidence: topCommunity && topCommunity.posts > 1 ? 0.74 : 0.5
    },
    {
      id: "rec_execution",
      type: "execution",
      title: "Link creation time to post outcomes",
      detail: "Tag execution tasks with Threads or Bluesky so the app can learn which work drives audience signal.",
      confidence: 0.68
    }
  ];
};
