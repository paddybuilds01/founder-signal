"use client";

import { useState } from "react";
import { Panel, PageTitle, Pill } from "@/components/ui";
import { useFounderSignal } from "@/lib/store";
import type { AnyPlatformId } from "@/lib/types";

const platformOptions: AnyPlatformId[] = ["threads", "bluesky", "instagram", "x", "linkedin", "substack", "youtube"];

export default function ContentPage() {
  const { data, addContent } = useFounderSignal();
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<AnyPlatformId>("threads");
  const [topic, setTopic] = useState("Execution");
  const [community, setCommunity] = useState("Founder Operators");

  const submit = () => {
    if (!title.trim()) return;
    addContent({ title, platform, topic, community, impressions: 0, engagementRate: 0 });
    setTitle("");
  };

  return (
    <div>
      <PageTitle title="Content log" kicker="Output and post linkage" />
      <Panel>
        <div className="grid gap-3 md:grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr_auto]">
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post, thread, note, or content asset" className="rounded-lg border border-line bg-black/25 px-3 py-2 outline-none focus:border-mint" />
          <select value={platform} onChange={(event) => setPlatform(event.target.value as AnyPlatformId)} className="rounded-lg border border-line bg-black/25 px-3 py-2 outline-none">
            {platformOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <input value={topic} onChange={(event) => setTopic(event.target.value)} className="rounded-lg border border-line bg-black/25 px-3 py-2 outline-none" />
          <input value={community} onChange={(event) => setCommunity(event.target.value)} className="rounded-lg border border-line bg-black/25 px-3 py-2 outline-none" />
          <button onClick={submit} className="rounded-lg bg-mint px-4 py-2 font-medium text-black">Log</button>
        </div>
      </Panel>
      <Panel className="mt-5">
        <h2 className="text-lg font-semibold">Recent output</h2>
        <div className="mt-4 space-y-3">
          {data.contentLog.map((entry) => (
            <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white/5 px-4 py-3">
              <div>
                <div className="font-medium">{entry.title}</div>
                <div className="mt-1 text-sm text-white/50">{new Date(entry.publishedAt).toLocaleDateString()}</div>
              </div>
              <div className="flex gap-2">
                <Pill>{entry.platform}</Pill>
                <Pill>{entry.topic}</Pill>
                <Pill>{entry.community}</Pill>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
