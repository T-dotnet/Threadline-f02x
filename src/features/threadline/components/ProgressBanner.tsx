import React from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import { TYPE_SCALE, BRAND, TEXT_PRIMARY, TEXT_SECONDARY } from "../constants";

interface ProgressBannerProps {
  title: string;
  subtitle: string;
  current: number;
  total: number;
  progressLabel: string;
  actionLabel: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  isActionActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  breakdown?: { label: string; current: number; total: number }[];
}

export function ProgressBanner({
  title,
  subtitle,
  current,
  total,
  progressLabel,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  isActionActive = false,
  className,
  style,
  breakdown
}: ProgressBannerProps) {
  const isComplete = current >= total;
  const active = isActionActive || isComplete;
  
  return (
    <div className={cn("bg-white flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-6 rounded-none sm:rounded-xl shadow-sm sm:border border-t border-b border-divider", className)} style={style}>
      <div className="w-full md:w-auto text-center md:text-left flex-1">
        <div style={{ ...TYPE_SCALE.HeadingSmall, marginBottom: 4 }}>{title}</div>
        <div style={{ ...TYPE_SCALE.LabelMicro, color: TEXT_SECONDARY }}>{subtitle}</div>
        {breakdown && breakdown.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 justify-center md:justify-start">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className={cn("inline-block w-1.5 h-1.5 rounded-full", item.current >= item.total ? "bg-green-500" : "bg-gray-300")} />
                <span className="text-[10px] text-text-secondary whitespace-nowrap">
                  {item.label}: <span className="font-medium text-text-primary">{item.current}/{item.total}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 w-full md:w-auto self-center">
        <div className="flex items-center gap-4 w-full justify-center sm:justify-start sm:w-auto">
          <span style={{ fontSize: 13, color: TEXT_SECONDARY, whiteSpace: "nowrap" }}>
            <span style={{ fontWeight: 500, color: TEXT_PRIMARY }}>{current}</span> of {total} {progressLabel}
          </span>
          <div style={{ width: 100, height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
            <motion.div 
              animate={{ width: `${Math.min((current / total) * 100, 100)}%` }}
              style={{ height: "100%", background: BRAND }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <button 
          onClick={active ? onAction : undefined}
          disabled={!active}
          className={cn(
            "flex items-center justify-center gap-2 whitespace-nowrap transition-all w-full sm:w-auto",
            "px-6 py-2.5 rounded-full font-bold text-sm"
          )}
          style={{
            background: !active ? "#9ca3af" : BRAND,
            color: "white", 
            opacity: !active ? 0.7 : 1,
            cursor: !active ? "not-allowed" : "pointer",
          }}
        >
          {ActionIcon && <ActionIcon size={18} />}
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
