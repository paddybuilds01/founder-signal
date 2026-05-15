export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const dayKey = (date: Date) => date.toISOString().slice(0, 10);

export const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);

export const formatDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

export const pct = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

export const hourLabel = (hour: number) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 || 12;
  return `${normalized} ${suffix}`;
};
