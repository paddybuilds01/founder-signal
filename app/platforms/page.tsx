"use client";

import { Panel, PageTitle, Pill } from "@/components/ui";
import { useFounderSignal } from "@/lib/store";
import { formatCompact, pct } from "@/lib/utils";

export default function PlatformsPage() {
  const { data } = useFounderSignal();
  const entries = Object.entries(data.platformMetrics);
  const maxAudience = Math.max(...entries.map(([, metrics]) => metrics.audience));

  return (
    <div>
      <PageTitle title="Platform health" kicker="Audience growth and channel comparison" />
      <div className="grid gap-4 md:grid-cols-2">
        {entries.map(([platform, metrics]) => (
          <Panel key={platform}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold capitalize">{platform}</h2>
                <p className="text-sm text-white/55">{formatCompact(metrics.views)} views or reach proxy</p>
              </div>
              <Pill>{pct(metrics.weeklyGrowthPct)}</Pill>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <Metric label="Audience" value={formatCompact(metrics.audience)} />
              <Metric label="Posts" value={metrics.posts.toString()} />
              <Metric label="Engagement" value={`${metrics.engagementRate.toFixed(1)}%`} />
            </div>
            <div className="mt-5 h-2 rounded-full bg-white/8">
              <div className="h-2 rounded-full bg-sky" style={{ width: `${(metrics.audience / maxAudience) * 100}%` }} />
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-line bg-black/20 p-3">
    <div className="text-xs text-white/45">{label}</div>
    <div className="mt-1 font-semibold">{value}</div>
  </div>
);
