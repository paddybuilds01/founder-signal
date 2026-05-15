"use client";

import Link from "next/link";
import { ArrowUpRight, Clock, Sparkles } from "lucide-react";
import { Panel, PageTitle, Pill, Stat } from "@/components/ui";
import { bestPostingTimes, founderSignalScore, generateRecommendations, growthVelocity, topicPerformance, totalAudience } from "@/lib/analytics";
import { useFounderSignal } from "@/lib/store";
import { formatCompact, pct } from "@/lib/utils";

export default function OverviewPage() {
  const { data, hydrated, recomputeRecommendations } = useFounderSignal();
  if (!hydrated) return <div className="text-white/60">Loading Founder Signal...</div>;

  const posts = data.socialPosts;
  const recommendations = data.recommendations.length ? data.recommendations : generateRecommendations(data);
  const topics = topicPerformance(posts).slice(0, 4);
  const times = bestPostingTimes(posts);

  return (
    <div>
      <PageTitle title="Founder command center" kicker="Signal, speed, and social intelligence" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total Audience" value={formatCompact(totalAudience(data))} detail="Across tracked platforms" />
        <Stat label="Growth Velocity" value={pct(growthVelocity(data))} detail="Average weekly growth" />
        <Stat label="Imported Posts" value={posts.length.toString()} detail="Threads + Bluesky ready" />
        <Stat label="Signal Score" value={founderSignalScore(data).toString()} detail="Growth, content, execution" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Actionable recommendations</h2>
              <p className="text-sm text-white/55">Generated from posts, timing, topics, communities, and execution logs.</p>
            </div>
            <button onClick={recomputeRecommendations} className="rounded-lg border border-line p-2 text-white/70 hover:text-white" title="Refresh recommendations">
              <Sparkles size={18} />
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {recommendations.map((rec) => (
              <div key={rec.id} className="rounded-lg border border-line bg-black/20 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Pill>{rec.type}</Pill>
                  <span className="text-xs text-white/45">{Math.round(rec.confidence * 100)}% confidence</span>
                </div>
                <div className="font-medium">{rec.title}</div>
                <p className="mt-2 text-sm leading-6 text-white/60">{rec.detail}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <h2 className="text-lg font-semibold">Best posting windows</h2>
          <div className="mt-4 space-y-3">
            {times.map((time) => (
              <div key={time.label} className="flex items-center justify-between rounded-lg border border-line bg-white/5 px-3 py-2">
                <span>{time.label}</span>
                <span className="text-sm text-mint">{formatCompact(time.score)} signal</span>
              </div>
            ))}
          </div>
          <Link href="/analytics" className="mt-5 inline-flex items-center gap-2 text-sm text-sky">
            Open analytics <ArrowUpRight size={15} />
          </Link>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel>
          <h2 className="text-lg font-semibold">Top topics</h2>
          <div className="mt-4 space-y-3">
            {topics.map((topic) => (
              <div key={topic.topic}>
                <div className="flex justify-between text-sm">
                  <span>{topic.topic}</span>
                  <span className="text-white/55">{formatCompact(topic.score)}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/8">
                  <div className="h-2 rounded-full bg-mint" style={{ width: `${Math.min(100, topic.score / 30)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-lg font-semibold">Execution link</h2>
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-line bg-white/5 p-4">
            <Clock className="mt-1 text-amber" size={18} />
            <p className="text-sm leading-6 text-white/65">
              Tag creation tasks with Threads or Bluesky. Founder Signal will compare completion time against post engagement to show which work creates the strongest audience response.
            </p>
          </div>
          <Link href="/execution" className="mt-5 inline-flex items-center gap-2 text-sm text-sky">
            Open execution tracker <ArrowUpRight size={15} />
          </Link>
        </Panel>
      </div>
    </div>
  );
}
