"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { generateRecommendations, inferCommunity, inferTopic } from "@/lib/analytics";
import { seedData, storageKey } from "@/lib/seed";
import type { ContentEntry, ExecutionTask, FounderSignalData, PlatformId, SocialPost, TaskCategory } from "@/lib/types";
import { dayKey, uid } from "@/lib/utils";

interface StoreValue {
  data: FounderSignalData;
  hydrated: boolean;
  addContent: (entry: Omit<ContentEntry, "id" | "publishedAt">) => void;
  addTask: (title: string, category: TaskCategory, platform?: ExecutionTask["platform"]) => void;
  startTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  importPosts: (platform: PlatformId, posts: SocialPost[]) => void;
  updateSettings: (patch: Partial<FounderSignalData["settings"]>) => void;
  recomputeRecommendations: () => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const loadData = () => {
  if (typeof window === "undefined") return seedData;
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? ({ ...seedData, ...JSON.parse(raw) } as FounderSignalData) : seedData;
  } catch {
    return seedData;
  }
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<FounderSignalData>(seedData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadData());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, hydrated]);

  const addContent = useCallback((entry: Omit<ContentEntry, "id" | "publishedAt">) => {
    setData((current) => ({
      ...current,
      contentLog: [{ id: uid(), publishedAt: new Date().toISOString(), ...entry }, ...current.contentLog]
    }));
  }, []);

  const addTask = useCallback((title: string, category: TaskCategory, platform?: ExecutionTask["platform"]) => {
    setData((current) => ({
      ...current,
      executionTasks: [
        { id: uid(), title, category, platform, status: "idle", createdAt: new Date().toISOString() },
        ...current.executionTasks
      ]
    }));
  }, []);

  const startTask = useCallback((taskId: string) => {
    setData((current) => {
      if (current.executionTasks.some((task) => task.status === "active")) return current;
      return {
        ...current,
        executionTasks: current.executionTasks.map((task) =>
          task.id === taskId ? { ...task, status: "active", startTime: new Date().toISOString() } : task
        )
      };
    });
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setData((current) => {
      const task = current.executionTasks.find((item) => item.id === taskId && item.status === "active");
      if (!task?.startTime) return current;
      const end = new Date();
      const durationMs = Math.max(1000, end.getTime() - new Date(task.startTime).getTime());
      return {
        ...current,
        executionTasks: current.executionTasks.map((item) =>
          item.id === taskId ? { ...item, status: "completed", endTime: end.toISOString(), durationMs } : item
        ),
        executionHistory: [
          {
            id: uid(),
            taskId,
            title: task.title,
            category: task.category,
            platform: task.platform,
            startTime: task.startTime,
            endTime: end.toISOString(),
            durationMs,
            dayKey: dayKey(end)
          },
          ...current.executionHistory
        ]
      };
    });
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setData((current) => ({ ...current, executionTasks: current.executionTasks.filter((task) => task.id !== taskId) }));
  }, []);

  const importPosts = useCallback((platform: PlatformId, posts: SocialPost[]) => {
    setData((current) => {
      const existing = new Set(current.socialPosts.map((post) => `${post.platform}:${post.externalId}`));
      const tagged = posts
        .filter((post) => !existing.has(`${post.platform}:${post.externalId}`))
        .map((post) => ({
          ...post,
          topic: post.topic || inferTopic(post.text),
          community: post.community || inferCommunity(post.text, platform)
        }));
      const merged = [...tagged, ...current.socialPosts];
      return {
        ...current,
        socialPosts: merged,
        socialAccounts: current.socialAccounts.map((account) =>
          account.platform === platform ? { ...account, status: "connected", lastSyncedAt: new Date().toISOString() } : account
        ),
        recommendations: generateRecommendations({ ...current, socialPosts: merged })
      };
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<FounderSignalData["settings"]>) => {
    setData((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
  }, []);

  const recomputeRecommendations = useCallback(() => {
    setData((current) => ({ ...current, recommendations: generateRecommendations(current) }));
  }, []);

  const resetDemo = useCallback(() => {
    localStorage.removeItem(storageKey);
    setData(seedData);
  }, []);

  const value = useMemo(
    () => ({
      data,
      hydrated,
      addContent,
      addTask,
      startTask,
      completeTask,
      removeTask,
      importPosts,
      updateSettings,
      recomputeRecommendations,
      resetDemo
    }),
    [data, hydrated, addContent, addTask, startTask, completeTask, removeTask, importPosts, updateSettings, recomputeRecommendations, resetDemo]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useFounderSignal = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useFounderSignal must be used inside StoreProvider");
  return context;
};
