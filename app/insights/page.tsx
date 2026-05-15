"use client";

import { Panel, PageTitle } from "@/components/ui";
import { bestPostingTimes, communityPerformance, generateRecommendations, topicPerformance } from "@/lib/analytics";
import { useFounderSignal } from "@/lib/store";

export default function InsightsPage() {
  const { data } = useFounderSignal();
  const recommendations = data.recommendations.length ? data.recommendations : generateRecommendations(data);
  const topics = topicPerformance(data.socialPosts);
  const communities = communityPerformance(data.socialPosts);
  const times = bestPostingTimes(data.socialPosts);

  return (
    <div>
      <PageTitle title="Insight layer" kicker="Patterns, timing, topics, and communities" />
      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((rec) => (
          <Panel key={rec.id}>
            <div className="text-xs uppercase tracking-[0.14em] text-mint">{rec.type}</div>
            <h2 className="mt-2 text-xl font-semibold">{rec.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">{rec.detail}</p>
          </Panel>
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Ranked title="Topic trend" rows={topics.map((item) => [item.topic, item.score])} />
        <Ranked title="Community fit" rows={communities.map((item) => [item.community, item.score])} />
        <Ranked title="Posting windows" rows={times.map((item) => [item.label, item.score])} />
      </div>
    </div>
  );
}

const Ranked = ({ title, rows }: { title: string; rows: Array<[string, number]> }) => (
  <Panel>
    <h2 className="text-lg font-semibold">{title}</h2>
    <div className="mt-4 space-y-3">
      {rows.slice(0, 6).map(([label, score], index) => (
        <div key={label} className="flex items-center justify-between rounded-lg border border-line bg-white/5 px-3 py-2">
          <span>{index + 1}. {label}</span>
          <span className="text-sm text-mint">{Math.round(score)}</span>
        </div>
      ))}
    </div>
  </Panel>
);
