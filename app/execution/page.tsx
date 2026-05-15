"use client";

import { useEffect, useState } from "react";
import { Check, Play, Trash2 } from "lucide-react";
import { Panel, PageTitle, Pill } from "@/components/ui";
import { useFounderSignal } from "@/lib/store";
import type { AnyPlatformId, TaskCategory } from "@/lib/types";
import { formatDuration } from "@/lib/utils";

const categories: TaskCategory[] = ["writing", "research", "strategy", "design", "video", "ops"];
const platforms: AnyPlatformId[] = ["threads", "bluesky", "instagram", "x", "linkedin", "substack", "youtube"];

export default function ExecutionPage() {
  const { data, addTask, startTask, completeTask, removeTask } = useFounderSignal();
  const [now, setNow] = useState(Date.now());
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("writing");
  const [platform, setPlatform] = useState<AnyPlatformId>("threads");
  const active = data.executionTasks.find((task) => task.status === "active");

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [active]);

  const elapsed = active?.startTime ? now - new Date(active.startTime).getTime() : 0;

  return (
    <div>
      <PageTitle title="Execution tracker" kicker="Measure real outcome time" />
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Panel>
          <div className="grid gap-3 md:grid-cols-[1.2fr_0.6fr_0.6fr_auto]">
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Meaningful task" className="rounded-lg border border-line bg-black/25 px-3 py-2 outline-none focus:border-mint" />
            <select value={category} onChange={(event) => setCategory(event.target.value as TaskCategory)} className="rounded-lg border border-line bg-black/25 px-3 py-2 outline-none">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={platform} onChange={(event) => setPlatform(event.target.value as AnyPlatformId)} className="rounded-lg border border-line bg-black/25 px-3 py-2 outline-none">
              {platforms.map((item) => <option key={item}>{item}</option>)}
            </select>
            <button onClick={() => { if (title.trim()) { addTask(title, category, platform); setTitle(""); } }} className="rounded-lg bg-mint px-4 py-2 font-medium text-black">Add</button>
          </div>
          <div className="mt-5 space-y-3">
            {data.executionTasks.map((task) => (
              <div key={task.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white/5 px-4 py-3">
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="mt-1 flex gap-2"><Pill>{task.category}</Pill>{task.platform ? <Pill>{task.platform}</Pill> : null}</div>
                </div>
                <div className="flex items-center gap-2">
                  {task.status === "active" ? <span className="text-sm text-mint">{formatDuration(elapsed)}</span> : null}
                  {task.durationMs ? <span className="text-sm text-white/55">{formatDuration(task.durationMs)}</span> : null}
                  {task.status === "idle" ? <IconButton onClick={() => startTask(task.id)} disabled={Boolean(active)} title="Start"><Play size={16} /></IconButton> : null}
                  {task.status === "active" ? <IconButton onClick={() => completeTask(task.id)} title="Complete"><Check size={16} /></IconButton> : null}
                  <IconButton onClick={() => removeTask(task.id)} title="Remove"><Trash2 size={16} /></IconButton>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-lg font-semibold">Live run</h2>
          <div className="mt-4 rounded-lg border border-line bg-black/25 p-4">
            <div className="text-sm text-white/45">Active task</div>
            <div className="mt-1 font-medium">{active?.title ?? "Idle"}</div>
            <div className="mt-5 text-4xl font-semibold text-mint">{formatDuration(elapsed)}</div>
          </div>
          <div className="mt-4 text-sm text-white/55">{data.executionHistory.length} completed sessions logged.</div>
        </Panel>
      </div>
    </div>
  );
}

const IconButton = ({ children, title, onClick, disabled }: { children: React.ReactNode; title: string; onClick: () => void; disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} title={title} className="rounded-lg border border-line p-2 text-white/70 hover:text-white disabled:opacity-30">
    {children}
  </button>
);
