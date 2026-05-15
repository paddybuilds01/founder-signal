"use client";

import { Panel, PageTitle } from "@/components/ui";
import { useFounderSignal } from "@/lib/store";

export default function SettingsPage() {
  const { data, updateSettings, resetDemo } = useFounderSignal();
  return (
    <div>
      <PageTitle title="Settings" kicker="Connections and persistence" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <h2 className="text-lg font-semibold">Supabase</h2>
          <div className="mt-4 space-y-3">
            <input
              value={data.settings.supabaseUrl}
              onChange={(event) => updateSettings({ supabaseUrl: event.target.value })}
              placeholder="Supabase project URL"
              className="w-full rounded-lg border border-line bg-black/25 px-3 py-2 outline-none focus:border-mint"
            />
            <input
              value={data.settings.supabaseAnonKey}
              onChange={(event) => updateSettings({ supabaseAnonKey: event.target.value })}
              placeholder="Supabase anon key"
              type="password"
              className="w-full rounded-lg border border-line bg-black/25 px-3 py-2 outline-none focus:border-mint"
            />
          </div>
          <p className="mt-4 text-sm leading-6 text-white/55">
            The app is local-first right now. Supabase schema and integration points are included so persistence can be enabled when project credentials are ready.
          </p>
        </Panel>
        <Panel>
          <h2 className="text-lg font-semibold">Demo data</h2>
          <p className="mt-3 text-sm leading-6 text-white/55">Reset local demo data, imported posts, task history, and recommendations in this browser.</p>
          <button onClick={resetDemo} className="mt-5 rounded-lg border border-rose/40 bg-rose/10 px-4 py-2 text-rose">Reset local data</button>
        </Panel>
      </div>
    </div>
  );
}
