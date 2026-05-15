"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export const Panel = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.section
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className={`glass rounded-lg p-5 shadow-soft ${className}`}
  >
    {children}
  </motion.section>
);

export const PageTitle = ({ title, kicker }: { title: string; kicker: string }) => (
  <div className="mb-6">
    <div className="text-xs uppercase tracking-[0.16em] text-mint">{kicker}</div>
    <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{title}</h1>
  </div>
);

export const Stat = ({ label, value, detail }: { label: string; value: string; detail?: string }) => (
  <Panel>
    <div className="text-xs uppercase tracking-[0.12em] text-white/50">{label}</div>
    <div className="mt-3 text-3xl font-semibold">{value}</div>
    {detail ? <div className="mt-2 text-sm text-white/55">{detail}</div> : null}
  </Panel>
);

export const Pill = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-md border border-line bg-white/7 px-2 py-1 text-xs text-white/70">{children}</span>
);
