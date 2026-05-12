/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Info, FileText, ChevronRight } from "lucide-react";
import { Typography, Card, Badge } from "../../../components/ui";
import { Condition } from "../../../types";
import { getGuidelineContent } from "../../../services/dataService";
import { GUIDELINE_SECTIONS } from "../../../constants";
import { cn } from "../../../lib/utils";

// Simple Accordion for now since we used a custom one in UIElements
function LocalAccordion({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Card className="overflow-hidden border-divider">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
      >
        <Typography variant="h3" className="text-sm uppercase tracking-wider">{title}</Typography>
        <ChevronRight className={cn("transition-transform text-text-disabled", isOpen && "rotate-90")} size={20} />
      </button>
      {isOpen && <div className="p-6 border-t border-divider">{children}</div>}
    </Card>
  );
}

export function GuidelinesTab({ row }: { row: Condition }) {
  const [activeSection, setActiveSection] = useState("description");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const content = getGuidelineContent(row);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex gap-8 min-h-[600px]">
      {/* Sidebar Navigation */}
      <div className="w-64 shrink-0 space-y-1">
        <Typography variant="label-micro" className="px-4 mb-4 text-text-disabled">Guideline Sections</Typography>
        {GUIDELINE_SECTIONS.map(sec => {
          const active = activeSection === sec.id;
          return (
            <button 
              key={sec.id} 
              onClick={() => scrollTo(sec.id)} 
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border-l-2",
                active 
                  ? "bg-primary-light/50 text-primary border-primary" 
                  : "text-text-secondary hover:bg-gray-50 border-transparent"
              )}
            >
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-8">
        {/* Info Banner */}
        <div className="bg-info-light/40 border border-info/10 rounded-xl p-4 flex gap-4">
          <Info className="text-info shrink-0 mt-1" size={20} />
          <div className="space-y-1">
            <Typography variant="body-sm" className="font-bold text-info-dark">
              {row.guideline} (2025-01) • {row.code}
            </Typography>
            <Typography variant="body-sm" className="text-info-dark/80 leading-relaxed">
              This content is automatically sourced from official guidelines and is read-only. Changes will be reflected in future system updates.
            </Typography>
          </div>
        </div>

        <div className="space-y-6">
          {GUIDELINE_SECTIONS.map(sec => (
            <div key={sec.id} ref={el => sectionRefs.current[sec.id] = el} className="scroll-mt-8">
              <LocalAccordion title={sec.label}>
                <div className="space-y-6">
                  {sec.id === "description" && (
                    <Typography variant="body" className="leading-relaxed text-text-secondary whitespace-pre-wrap">
                      {content.description}
                    </Typography>
                  )}
                  
                  {sec.id === "diagnostic" && (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <Typography variant="h3" className="text-sm text-text-primary">Inclusions</Typography>
                        <div className="space-y-2">
                          {content.inclusions.map((v, i) => (
                            <div key={i} className="flex gap-3">
                              <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <Typography variant="body" className="text-text-secondary">{v}</Typography>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Typography variant="h3" className="text-sm text-text-primary">Exclusions</Typography>
                        <div className="space-y-2">
                          {content.exclusions.map((v, i) => (
                            <div key={i} className="flex gap-3">
                              <span className="text-error mt-1.5 w-1.5 h-1.5 rounded-full bg-error shrink-0" />
                              <Typography variant="body" className="text-text-secondary">{v}</Typography>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {sec.id === "requirements" && (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <Typography variant="h3" className="text-sm text-text-primary">Essential (Required) Features</Typography>
                        <Typography variant="body" className="text-text-secondary leading-relaxed">{content.requirements}</Typography>
                      </div>
                      <div className="space-y-3">
                        <Typography variant="h3" className="text-sm text-text-primary">Insight Specifiers</Typography>
                        <Typography variant="body" className="text-text-secondary leading-relaxed">{content.insightSpecifiers}</Typography>
                      </div>
                    </div>
                  )}

                  {(["clinical", "scoring", "boundary", "developmental", "gender", "course"] as const).includes(sec.id as any) && (
                    <Typography variant="body" className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                      {(content as any)[sec.id === 'clinical' ? 'clinicalFeatures' : sec.id]}
                    </Typography>
                  )}

                  {sec.id === "differential" && (
                    <div className="space-y-8">
                      {content.differential.map(({ title, text }) => (
                        <div key={title} className="space-y-3">
                          <Typography variant="h3" className="text-sm text-text-primary">{title}</Typography>
                          <Typography variant="body" className="text-text-secondary leading-relaxed">{text}</Typography>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </LocalAccordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
