/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Calendar, Tag, FileText } from "lucide-react";

// UI Components
import { 
  Button, 
  Badge, 
  Card, 
  Typography, 
  Select 
} from "../../components/ui";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { cn } from "../../lib/utils";

// Domain & Types
import { Condition } from "../../types";
import { OverviewTab } from "./detail/OverviewTab";
import { GuidelinesTab } from "./detail/GuidelinesTab";
import { DecisionUnitsTab } from "./detail/DecisionUnitsTab";

const TABS = ["Overview", "Guidelines", "Decision Units", "Audit Log"];

export function ConditionDetail({ row, onBack }: { row: Condition; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [status, setStatus] = useState(row.status);

  const crumbs = [
    { label: "Conditions", onClick: onBack },
    { label: row.name.length > 32 ? row.name.slice(0, 32) + "..." : row.name },
    { label: TABS[activeTab] }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="py-8 space-y-8"
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2">
        {crumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <ChevronRight size={14} className="text-text-disabled" />}
            <button 
              onClick={crumb.onClick}
              disabled={!crumb.onClick}
              className={cn(
                "text-sm font-semibold transition-colors",
                crumb.onClick ? "text-primary hover:underline underline-offset-4" : "text-text-secondary"
              )}
            >
              {crumb.label}
            </button>
          </div>
        ))}
      </nav>

      {/* Header Info */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <Typography variant="h1">{row.name}</Typography>
          <div className="flex items-center gap-4 bg-white p-2 border border-divider rounded-xl shadow-sm">
            <Typography variant="label-micro" className="pl-2">Update Status</Typography>
            <div className="w-48">
              <Select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Approved">Approved</option>
                <option value="In Review">In Review</option>
                <option value="Draft">Draft</option>
                <option value="Deprecated">Deprecated</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-text-secondary">
            <Tag size={16} />
            <Typography variant="body-sm" className="font-semibold">{row.category}</Typography>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <FileText size={16} />
            <Typography variant="body-sm" className="font-semibold">{row.guideline}</Typography>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar size={16} />
            <Typography variant="body-sm">Last updated: {row.updated}</Typography>
          </div>
          <div className="flex items-center gap-3 pl-6 border-l border-divider">
            <StatusBadge status={status} />
            <Badge variant="soft" className="px-3">{row.code}</Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex items-center border-b border-divider overflow-x-auto no-scrollbar">
          {TABS.map((tab, i) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(i)}
              className={cn(
                "px-6 py-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap",
                activeTab === i 
                  ? "border-primary text-primary" 
                  : "border-transparent text-text-secondary hover:text-primary hover:bg-gray-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <Card className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              transition={{ duration: 0.15 }}
              className="p-8"
            >
              {activeTab === 0 && <OverviewTab row={row} />}
              {activeTab === 1 && <GuidelinesTab row={row} />}
              {activeTab === 2 && <DecisionUnitsTab row={row} />}
              {activeTab === 3 && (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-text-disabled">
                  <Clock size={48} strokeWidth={1} />
                  <Typography variant="body">Audit log implementation pending.</Typography>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </motion.div>
  );
}

const Clock = ({ size, strokeWidth, className }: any) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth={strokeWidth} 
    strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
