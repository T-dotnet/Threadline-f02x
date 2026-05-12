/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Card, Typography, DataPoint } from "../../../components/ui";
import { cn } from "../../../lib/utils";

interface MetaItem {
  label: string;
  value: React.ReactNode;
}

interface DetailViewLayoutProps {
  onBack: () => void;
  backLabel: string;
  title: string;
  subtitle?: React.ReactNode;
  headerBadges?: React.ReactNode;
  headerActions?: React.ReactNode;
  metaBanner?: MetaItem[];
  children: React.ReactNode;
  className?: string;
}

export function DetailViewLayout({
  onBack,
  backLabel,
  title,
  subtitle,
  headerBadges,
  headerActions,
  metaBanner,
  children,
  className
}: DetailViewLayoutProps) {
  return (
    <div className={cn("animate-in fade-in slide-in-from-bottom-2 duration-300", className)}>
      <Card className="overflow-hidden border-divider shadow-sm">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <button 
              onClick={onBack} 
              className="flex items-center gap-2 text-[13px] font-semibold text-primary hover:opacity-80 transition-opacity font-sans"
            >
              <ArrowLeft size={16} /> {backLabel}
            </button>
            <div className="space-y-1">
              <Typography variant="h1" className="text-2xl font-serif">
                {title}
              </Typography>
              {subtitle && (
                <div className="text-[13px] text-text-secondary">
                  {subtitle}
                </div>
              )}
            </div>
            {headerBadges && (
              <div className="flex items-center gap-3">
                {headerBadges}
              </div>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>

        <div className="p-8">
          {/* Metadata banner */}
          {metaBanner && metaBanner.length > 0 && (
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl flex flex-wrap mb-8 overflow-hidden">
              {metaBanner.map(({ label, value }, idx) => (
                <DataPoint 
                  key={label} 
                  label={label} 
                  value={value} 
                  className={cn(
                    "px-6 py-4 min-w-[160px] flex-1 border-slate-100",
                    idx !== metaBanner!.length - 1 && "border-r"
                  )}
                />
              ))}
            </div>
          )}

          {children}
        </div>
      </Card>
    </div>
  );
}
