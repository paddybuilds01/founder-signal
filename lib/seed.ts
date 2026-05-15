import type { FounderSignalData } from "@/lib/types";

export const storageKey = "founder-signal-v2";

export const seedData: FounderSignalData = {
  platformMetrics: {
    instagram: {
      audience: 12400,
      posts: 18,
      views: 188000,
      engagementRate: 4.9,
      replies: 510,
      reposts: 0,
      shares: 1220,
      clicks: 380,
      weeklyGrowthPct: 2.9
    },
    threads: {
      audience: 8400,
      posts: 26,
      views: 142000,
      engagementRate: 6.8,
      replies: 920,
      reposts: 610,
      shares: 540,
      clicks: 0,
      weeklyGrowthPct: 5.2
    },
    x: {
      audience: 9700,
      posts: 22,
      views: 221000,
      engagementRate: 3.7,
      replies: 430,
      reposts: 380,
      shares: 0,
      clicks: 760,
      weeklyGrowthPct: 1.7
    },
    bluesky: {
      audience: 4100,
      posts: 31,
      views: 0,
      engagementRate: 7.4,
      replies: 690,
      reposts: 470,
      shares: 0,
      clicks: 0,
      weeklyGrowthPct: 6.1
    },
    linkedin: {
      audience: 18400,
      posts: 6,
      views: 93100,
      engagementRate: 5.7,
      replies: 874,
      reposts: 0,
      shares: 0,
      clicks: 1230,
      weeklyGrowthPct: 3.9
    },
    substack: {
      audience: 6200,
      posts: 2,
      views: 18700,
      engagementRate: 8.1,
      replies: 240,
      reposts: 0,
      shares: 0,
      clicks: 490,
      weeklyGrowthPct: 2.4
    },
    youtube: {
      audience: 9300,
      posts: 2,
      views: 72100,
      engagementRate: 4.5,
      replies: 420,
      reposts: 0,
      shares: 0,
      clicks: 660,
      weeklyGrowthPct: 1.8
    }
  },
  socialAccounts: [
    {
      id: "acct_threads",
      platform: "threads",
      handle: "@founder.signal",
      status: "needs_auth",
      notes: "Connect with a Threads access token after Meta app setup."
    },
    {
      id: "acct_bluesky",
      platform: "bluesky",
      handle: "founder-signal.bsky.social",
      status: "needs_auth",
      notes: "Connect with Bluesky handle and app password."
    },
    {
      id: "acct_instagram",
      platform: "instagram",
      handle: "@founder.signal",
      status: "coming_soon",
      notes: "Requires Instagram Business or Creator account and Meta app review."
    },
    {
      id: "acct_x",
      platform: "x",
      handle: "@foundersignal",
      status: "coming_soon",
      notes: "Detailed analytics may require paid X API access."
    }
  ],
  socialPosts: [
    {
      id: "post_threads_1",
      platform: "threads",
      externalId: "demo_threads_1",
      accountHandle: "@founder.signal",
      text: "The fastest founders are not doing more tasks. They are shortening the feedback loop between shipping, signal, and learning.",
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      topic: "Execution",
      community: "Founder Operators",
      metrics: { views: 18600, likes: 840, replies: 112, reposts: 96, quotes: 34, shares: 41 }
    },
    {
      id: "post_bluesky_1",
      platform: "bluesky",
      externalId: "demo_bluesky_1",
      accountHandle: "founder-signal.bsky.social",
      text: "Distribution is not a launch event. It is a daily measurement system.",
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(),
      topic: "Distribution",
      community: "Indie Builders",
      metrics: { views: 0, likes: 310, replies: 48, reposts: 72, quotes: 18, shares: 0 }
    },
    {
      id: "post_threads_2",
      platform: "threads",
      externalId: "demo_threads_2",
      accountHandle: "@founder.signal",
      text: "Your content calendar should answer one question: what did the market teach us last week?",
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      topic: "Content Strategy",
      community: "Creator Founders",
      metrics: { views: 12800, likes: 510, replies: 83, reposts: 61, quotes: 20, shares: 36 }
    }
  ],
  contentLog: [
    {
      id: "content_1",
      title: "Feedback loops beat content calendars",
      platform: "threads",
      topic: "Execution",
      community: "Founder Operators",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      linkedPostId: "post_threads_1",
      impressions: 18600,
      engagementRate: 6.0
    }
  ],
  executionTasks: [
    {
      id: "task_1",
      title: "Draft Threads post from execution notes",
      category: "writing",
      platform: "threads",
      status: "idle",
      createdAt: new Date().toISOString()
    },
    {
      id: "task_2",
      title: "Research Bluesky founder feeds",
      category: "research",
      platform: "bluesky",
      status: "idle",
      createdAt: new Date().toISOString()
    }
  ],
  executionHistory: [],
  goals: [
    { id: "goal_1", title: "Reach 40k cross-platform audience", target: 40000, progress: 34600, metric: "audience" },
    { id: "goal_2", title: "Publish 25 high-signal posts", target: 25, progress: 17, metric: "posts" },
    { id: "goal_3", title: "Log 20 execution hours", target: 20, progress: 7, metric: "hours" }
  ],
  recommendations: [],
  settings: {
    shortcutsEnabled: true,
    supabaseUrl: "",
    supabaseAnonKey: ""
  }
};
