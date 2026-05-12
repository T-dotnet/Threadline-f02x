/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, Fragment, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Grid, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Code,
  FileText,
  Clock,
  ExternalLink
} from "lucide-react";

// UI Components
import { 
  Button, 
  Badge, 
  Card, 
  Typography, 
  TableFooter 
} from "../../../components/ui";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { cn } from "../../../lib/utils";

// Sub-components
import { CoverageSidebar } from "./CoverageSidebar";
import { AddUnitModal } from "./AddUnitModal";

// Domain
import { Condition, DecisionUnit } from "../../../types";
import { getDUs } from "../../../services/dataService";

export function DecisionUnitsTab({ row }: { row: Condition }) {
  const [units, setUnits] = useState<DecisionUnit[]>(() => getDUs(row));
  const [sf, setSf] = useState<keyof DecisionUnit>("lastUpdated");
  const [sd, setSd] = useState("desc");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);
  const [exp, setExp] = useState<Record<string, boolean>>({});
  const [jsonMode, setJsonMode] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<string | undefined>(undefined);

  const onAddUnit = (unit: Partial<DecisionUnit>) => {
    const newUnit: DecisionUnit = {
      id: Math.max(...units.map(u => u.id), 0) + 1,
      type: unit.type || "Diagnostic Rule",
      status: "Draft",
      group: unit.group || "New Group",
      logic: unit.logic || "New logic defined",
      pop: unit.pop || "Both",
      source: unit.source || row.guideline,
      ok: false,
      createdBy: "Current User",
      lastUpdated: new Date().toLocaleDateString() + " – " + new Date().toLocaleTimeString(),
      version: "V.10",
      ...unit
    };
    setUnits([newUnit, ...units]);
    setModalOpen(false);
  };

  const sort = (f: keyof DecisionUnit) => {
    if (sf === f) setSd(d => d === "asc" ? "desc" : "asc");
    else { setSf(f); setSd("asc"); }
  };

  const sorted = useMemo(() => 
    [...units].sort((a, b) => {
      if (sf === "lastUpdated") {
        const d1 = new Date(a.lastUpdated.replace('–', '')).getTime();
        const d2 = new Date(b.lastUpdated.replace('–', '')).getTime();
        return sd === "asc" ? d1 - d2 : d2 - d1;
      }
      return sd === "asc" 
        ? String(a[sf]).localeCompare(String(b[sf])) 
        : String(b[sf]).localeCompare(String(a[sf]));
    }), [units, sf, sd]);

  const paged = sorted.slice(page * rpp, (page + 1) * rpp);
  const total = Math.ceil(sorted.length / rpp);
  const s = page * rpp + 1;
  const e = Math.min((page + 1) * rpp, sorted.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Typography variant="h3">Decision Units</Typography>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setSidebarOpen(true)}>
            <Grid size={18} /> Coverage and Validation
          </Button>
          <Button variant="brand" onClick={() => setModalOpen(true)}>
            <Plus size={18} /> Add Decision Unit
          </Button>
        </div>
      </div>

      <div className="border border-divider rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-divider">
                <th 
                  className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => sort("type")}
                >
                  <div className="flex items-center gap-2">Unit Type <ChevronRight size={14} className={cn("transition-transform", sd === 'asc' ? 'rotate-90' : '-rotate-90')} /></div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Rule Group</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Logic Summary</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Population</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider font-sans">
              {paged.map(u => (
                <Fragment key={u.id}>
                  <tr 
                    className={cn(
                      "transition-colors hover:bg-gray-50/50 cursor-pointer",
                      exp[u.id] && "bg-primary-light/10"
                    )}
                    onClick={() => setExp(p => ({ ...p, [u.id]: !p[u.id] }))}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <ChevronRight size={16} className={cn("transition-transform text-text-disabled", exp[u.id] && "rotate-90")} />
                        <Typography variant="body" className="font-semibold">{u.type}</Typography>
                      </div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={u.status} /></td>
                    <td className="px-6 py-4"><Typography variant="body-sm">{u.group}</Typography></td>
                    <td className="px-6 py-4 max-w-md"><Typography variant="body-sm" className="line-clamp-2">{u.logic}</Typography></td>
                    <td className="px-6 py-4"><Badge variant="outline" className="font-bold">{u.pop}</Badge></td>
                    <td className="px-6 py-4">
                      {u.ok ? (
                        <CheckCircle2 size={20} className="text-success" />
                      ) : (
                        <AlertCircle size={20} className="text-error" />
                      )}
                    </td>
                  </tr>
                  
                  {exp[u.id] && (
                    <tr className="bg-gray-50/30">
                      <td colSpan={6} className="px-0 py-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-divider p-8">
                          {/* Details */}
                          <div className="space-y-8 pr-8">
                            <div className="space-y-3">
                              <Typography variant="label-micro">Clinical Explanation</Typography>
                              <Typography variant="body" className="leading-relaxed text-text-secondary">
                                {u.explanation || u.logic}
                              </Typography>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-2">
                                <Typography variant="label-micro">Guideline Source</Typography>
                                <div className="flex items-center gap-2 text-primary font-semibold hover:underline cursor-pointer">
                                  <Typography variant="body-sm">{u.source}</Typography>
                                  <ExternalLink size={14} />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Typography variant="label-micro">Population</Typography>
                                <Typography variant="body-sm">{u.pop}</Typography>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <Typography variant="label-micro">Notes</Typography>
                              <Typography variant="body-sm" className="text-text-secondary italic">
                                {u.notes || "No additional notes available."}
                              </Typography>
                            </div>
                          </div>

                          {/* Technical / Logic */}
                          <div className="space-y-8 pl-8">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Code size={18} className="text-text-disabled" />
                                <Typography variant="h3" className="text-sm">Structured Logic</Typography>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setJsonMode(p => ({ ...p, [u.id]: !p[u.id] }));
                                }}
                              >
                                {jsonMode[u.id] ? "Static Preview" : "View JSON"}
                              </Button>
                            </div>

                            {jsonMode[u.id] ? (
                              <Card className="bg-gray-950 border-white/10 p-4 overflow-hidden">
                                <pre className="text-[11px] font-mono text-success-light/80 leading-relaxed overflow-x-auto">
                                  {JSON.stringify({
                                    group: u.group.toLowerCase().replace(/\s/g, '_'),
                                    status: u.status,
                                    conditions: [
                                      { field: "symptom_match", operator: "IN", values: ["Criteria A", "Criteria B"] }
                                    ]
                                  }, null, 2)}
                                </pre>
                              </Card>
                            ) : (
                              <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                  <div className="space-y-2">
                                    <Typography variant="label-micro">Created By</Typography>
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center text-[10px] font-black text-primary">JD</div>
                                      <Typography variant="body-sm">{u.createdBy || "John Doe"}</Typography>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Typography variant="label-micro">Version</Typography>
                                    <Badge variant="soft">{u.version || "V.10"}</Badge>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Typography variant="label-micro">Last Updated</Typography>
                                  <div className="flex items-center gap-2 text-text-secondary">
                                    <Clock size={14} />
                                    <Typography variant="body-sm">{u.lastUpdated}</Typography>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <Typography variant="label-micro">Change Notes</Typography>
                                  <Typography variant="body-sm" className="text-text-secondary leading-relaxed">
                                    {u.changeNotes || "No change notes available."}
                                  </Typography>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <TableFooter 
          page={page} 
          setPage={setPage} 
          rpp={rpp} 
          setRpp={setRpp} 
          total={total} 
          s={s} 
          e={e} 
          count={sorted.length} 
        />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <CoverageSidebar 
            onClose={() => setSidebarOpen(false)} 
            onDimensionClick={(dim) => {
              setSelectedDimension(dim);
              setModalOpen(true);
            }} 
            units={units}
          />
        )}
      </AnimatePresence>

      <AddUnitModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onAddUnit={onAddUnit} 
        initialRuleType={selectedDimension} 
      />
    </div>
  );
}
