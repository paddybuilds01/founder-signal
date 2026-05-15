export type PlatformId = "instagram" | "threads" | "x" | "bluesky";
export type LegacyPlatformId = "linkedin" | "substack" | "youtube";
export type AnyPlatformId = PlatformId | LegacyPlatformId;

export type TaskCategory = "writing" | "video" | "strategy" | "design" | "ops" | "research";

export interface PlatformMetrics {
  audience: number;
  posts: number;
  views: number;
  engagementRate: number;
  replies: number;
  reposts: number;
  shares: number;
  clicks: number;
  weeklyGrowthPct: number;
}

export interface SocialAccount {
  id: string;
  platform: PlatformId;
  handle: string;
  status: "connected" | "needs_auth" | "coming_soon";
  lastSyncedAt?: string;
  notes?: string;
}

export interface SocialPost {
  id: string;
  platform: PlatformId;
  externalId: string;
  accountHandle: string;
  text: string;
  url?: string;
  postedAt: string;
  topic: string;
  community: string;
  metrics: {
    views: number;
    likes: number;
    replies: number;
    reposts: number;
    quotes: number;
    shares: number;
  };
  raw?: unknown;
}

export interface ContentEntry {
  id: string;
  title: string;
  platform: AnyPlatformId;
  topic: string;
  community: string;
  publishedAt: string;
  linkedPostId?: string;
  impressions: number;
  engagementRate: number;
}

export interface ExecutionTask {
  id: string;
  title: string;
  category: TaskCategory;
  platform?: AnyPlatformId;
  status: "idle" | "active" | "completed";
  createdAt: string;
  startTime?: string;
  endTime?: string;
  durationMs?: number;
}

export interface ExecutionSession {
  id: string;
  taskId: string;
  title: string;
  category: TaskCategory;
  platform?: AnyPlatformId;
  startTime: string;
  endTime: string;
  durationMs: number;
  dayKey: string;
}

export interface Recommendation {
  id: string;
  type: "time" | "topic" | "community" | "execution";
  title: string;
  detail: string;
  confidence: number;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  progress: number;
  metric: string;
}

export interface AppSettings {
  shortcutsEnabled: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export interface FounderSignalData {
  platformMetrics: Record<AnyPlatformId, PlatformMetrics>;
  socialAccounts: SocialAccount[];
  socialPosts: SocialPost[];
  contentLog: ContentEntry[];
  executionTasks: ExecutionTask[];
  executionHistory: ExecutionSession[];
  goals: Goal[];
  recommendations: Recommendation[];
  settings: AppSettings;
}
