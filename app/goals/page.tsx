"use client";

import { Panel, PageTitle } from "@/components/ui";
import { useFounderSignal } from "@/lib/store";

export default function GoalsPage() {
  const { data } = useFounderSignal();
  return (
    <div>
      <PageTitle title="Goals" kicker="Audience and execution targets" />
      <div className="grid gap-5 md:grid-cols-3">
        {data.goals.map((goal) => {
          const progress = Math.min(100, (goal.progress / goal.target) * 100);
          return (
            <Panel key={goal.id}>
              <h2 className="text-lg font-semibold">{goal.title}</h2>
              <div className="mt-5 text-3xl font-semibold">{Math.round(progress)}%</div>
              <div className="mt-4 h-2 rounded-full bg-white/8">
                <div className="h-2 rounded-full bg-amber" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-3 text-sm text-white/55">
                {goal.progress.toLocaleString()} / {goal.target.toLocaleString()} {goal.metric}
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
