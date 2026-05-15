"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { Panel, PageTitle, Pill } from "@/components/ui";
import { bestPostingTimes, communityPerformance, engagementRate, topicPerformance } from "@/lib/analytics";
import { useFounderSignal } from "@/lib/store";
import type { PlatformId, SocialPost } from "@/lib/types";
import { formatCompact } from "@/lib/utils";

const platforms: PlatformId[] = ["threads", "bluesky", "instagram", "x"];

export default function AnalyticsPage() {
  const { data, importPosts } = useFounderSignal();
  const [platform, setPlatform] = useState<PlatformId>("threads");
  const [handle, setHandle] = useState("");
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState("");

  const filtered = data.socialPosts.filter((post) => post.platform === platform);
  const topics = topicPerformance(filtered);
  const communities = communityPerformance(filtered);
  const times = bestPostingTimes(filtered);

  const sync = async () => {
    setStatus("Syncing...");
    const endpoint = platform === "bluesky" ? "/api/social/bluesky/sync" : platform === "threads" ? "/api/social/threads/sync" : "";
    if (!endpoint) {
      setStatus("Instagram and X connectors are planned for the next integration wave.");
      return;
    }
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(platform === "bluesky" ? { handle, appPassword: secret } : { accessToken: secret, userId: handle })
    });
    const result = (await response.json()) as { posts?: SocialPost[]; error?: string };
    if (!response.ok || result.error) {
      setStatus(result.error ?? "Sync failed.");
      return;
    }
    importPosts(platform, result.posts ?? []);
    setStatus(`Imported ${result.posts?.length ?? 0} ${platform} posts.`);
  };

  return (
    <div>
      <PageTitle title="Social analytics" kicker="Threads + Bluesky intelligence" />
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.4fr]">
        <Panel>
          <h2 className="text-lg font-semibold">Connect and sync</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {platforms.map((item) => (
              <button
                key={item}
                onClick={() => setPlatform(item)}
                className={`rounded-lg border px-3 py-2 text-sm capitalize ${platform === item ? "border-mint bg-mint/10 text-white" : "border-line text-white/60"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            <input
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              placeholder={platform === "threads" ? "Threads user id" : "Handle"}
              className="w-full rounded-lg border border-line bg-black/25 px-3 py-2 outline-none focus:border-mint"
            />
            <input
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              placeholder={platform === "threads" ? "Threads access token" : "Bluesky app password"}
              type="password"
              className="w-full rounded-lg border border-line bg-black/25 px-3 py-2 outline-none focus:border-mint"
            />
            <button onClick={sync} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-mint px-4 py-2 font-medium text-black">
              <RefreshCw size={16} /> Sync posts
            </button>
            {status ? <p className="text-sm text-white/60">{status}</p> : null}
          </div>
        </Panel>

        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold capitalize">{platform} post analytics</h2>
              <p className="text-sm text-white/55">Normalized post-level performance and topic/community tagging.</p>
            </div>
            <button className="rounded-lg border border-line p-2 text-white/65" title="Export CSV">
              <Download size={17} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.12em] text-white/40">
                <tr>
                  <th className="py-3">Post</th>
                  <th>Topic</th>
                  <th>Community</th>
                  <th>Engagement</th>
                  <th>Replies</th>
                  <th>Reposts</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id} className="border-t border-line">
                    <td className="max-w-sm py-4 pr-5 text-white/75">{post.text}</td>
                    <td><Pill>{post.topic}</Pill></td>
                    <td><Pill>{post.community}</Pill></td>
                    <td>{engagementRate(post).toFixed(1)}%</td>
                    <td>{post.metrics.replies}</td>
                    <td>{post.metrics.reposts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Panel>
          <h2 className="text-lg font-semibold">Best times</h2>
          <div className="mt-4 space-y-3">
            {times.map((item) => <Row key={item.label} label={item.label} value={formatCompact(item.score)} />)}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-lg font-semibold">Topics</h2>
          <div className="mt-4 space-y-3">
            {topics.map((item) => <Row key={item.topic} label={item.topic} value={formatCompact(item.score)} />)}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-lg font-semibold">Communities</h2>
          <div className="mt-4 space-y-3">
            {communities.map((item) => <Row key={item.community} label={item.community} value={formatCompact(item.score)} />)}
          </div>
        </Panel>
      </div>
    </div>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between rounded-lg border border-line bg-white/5 px-3 py-2">
    <span>{label}</span>
    <span className="text-sm text-mint">{value}</span>
  </div>
);
