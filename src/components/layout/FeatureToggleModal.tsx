import React, { useState } from "react";
import { X, Search, Filter, Info, ShieldAlert, Sparkles, Layout, Brain } from "lucide-react";
import { useFeatureFlags, FeatureFlags } from "../../contexts/FeatureToggleContext";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, BRAND, primaryBtn } from "../../features/threadline/constants";
import { motion, AnimatePresence } from "motion/react";

interface FeatureToggleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ToggleCategory = "Workflow Compliance" | "UI Enhancements" | "Analysis & Intelligence" | "System Logic";

interface ToggleItem {
  key: keyof FeatureFlags;
  label: string;
  description: string;
  category: ToggleCategory;
}

const CATEGORY_ICONS: Record<ToggleCategory, React.ReactNode> = {
  "Workflow Compliance": <ShieldAlert size={14} />,
  "UI Enhancements": <Layout size={14} />,
  "Analysis & Intelligence": <Sparkles size={14} />,
  "System Logic": <Brain size={14} />
};

export function FeatureToggleModal({ isOpen, onClose }: FeatureToggleModalProps) {
  const { flags, setFlag, setAllFlags, resetToDefaults, activeCount } = useFeatureFlags();
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const toggleItems: ToggleItem[] = [
    {
      key: "FEATURE_CLIENT_STATUS_BADGES",
      label: "Client Status Badges",
      description: "Shows visual status indicators (Conflicts, In Progress, etc.) on the client list cards.",
      category: "UI Enhancements"
    },
    {
      key: "FEATURE_CLINICAL_NOTES_STRIP",
      label: "Clinical Notes Summary",
      description: "Displays a collapsible summary of recent clinical notes in Evidence and Analysis workspaces.",
      category: "UI Enhancements"
    },
    {
      key: "FEATURE_ASSESSMENT_GATE",
      label: "Assessment Activation Guard",
      description: "Requires an active assessment to be selected before accessing Analysis, Evidence, or Report workspaces.",
      category: "Workflow Compliance"
    },
    {
      key: "FEATURE_PRIOR_ASSESSMENT_COMPARE",
      label: "Prior Assessment Comparison",
      description: "Shows a collapsible sidebar with prior assessment summaries when a new assessment is active.",
      category: "UI Enhancements"
    },
    {
      key: "FEATURE_DOCUMENT_COMPLETENESS_GATE",
      label: "Document Completeness Gate",
      description: "Validates required documents are present before triggering AI processing calls.",
      category: "Workflow Compliance"
    },
    {
      key: "FEATURE_EVIDENCE_SOURCE_LINKS",
      label: "Evidence Source Links",
      description: "Adds traceable links from evidence mappings back to their source documents.",
      category: "UI Enhancements"
    },
    {
      key: "FEATURE_WORKSPACE_STATUS_BAR",
      label: "Workspace Status Bar",
      description: "Renders a persistent alert bar above the tab rail for conflicts and missing information.",
      category: "Unified Workspace Status" as any // Just keeping consistency
    },
    {
      key: "FEATURE_EQUALISED_MAPPING_ACTIONS",
      label: "Equalised Mapping Actions",
      description: "Balances cognitive effort between Accept/Reject/Modify actions with inline rationale capture.",
      category: "Analysis & Intelligence"
    },
    {
      key: "FEATURE_CONFIDENCE_BADGE",
      label: "Confidence Badges",
      description: "Displays a standardised confidence badge on evidence mapping cards.",
      category: "Analysis & Intelligence"
    },
    {
      key: "FEATURE_CONFLICT_RESOLUTION_GATE",
      label: "Conflict Resolution Gate",
      description: "Prevents navigation to Analysis tab if unresolved conflicts exist in Evidence.",
      category: "Workflow Compliance"
    },
    {
      key: "FEATURE_HYPOTHESIS_FRAMING_PROMPT",
      label: "Hypothesis Framing Prompt",
      description: "Requires clinician to record an independent hypothesis before viewing AI analysis.",
      category: "Analysis & Intelligence"
    },
    {
      key: "FEATURE_DEFER_AS_PRIMARY_ACTION",
      label: "Defer as Primary Action",
      description: "Renders Defer and Formulate as equal-weight primary actions in Analysis.",
      category: "Analysis & Intelligence"
    },
    {
      key: "FEATURE_UNCERTAINTY_INDICATOR",
      label: "Uncertainty Indicator",
      description: "Summarises uncertainty signals (low confidence, conflicts, missing docs) in Analysis header.",
      category: "Analysis & Intelligence"
    },
    {
      key: "FEATURE_SEQUENTIAL_REPORT_REVIEW",
      label: "Sequential Report Review",
      description: "Requires active confirmation of each report section before approval is enabled.",
      category: "Workflow Compliance"
    },
    {
      key: "FEATURE_REPORT_COMPLETENESS_CHECK",
      label: "Report Completeness Check",
      description: "Validates that all accepted evidence items are reflected in the final report before download.",
      category: "Workflow Compliance"
    },
    {
      key: "FEATURE_WORKSPACE_ALERTS_CONTEXT",
      label: "Workspace Alerts Context",
      description: "Enables shared alert state (conflicts, missing docs) across workspace tabs.",
      category: "System Logic"
    },
    {
      key: "FEATURE_COGNITIVE_LOOP_TRACKER",
      label: "Cognitive Loop Tracker",
      description: "Tracks and surfaces progress through the six-step Threadline Cognitive Loop.",
      category: "UI Enhancements"
    },
    {
      key: "FEATURE_ASSESSMENT_DETAILS",
      label: "Assessment Details List",
      description: "Shows expanded details (date, description, client notes) on assessment cards in list view.",
      category: "UI Enhancements"
    },
    {
      key: "FEATURE_SESSION_DETAILS",
      label: "Session Details List",
      description: "Shows expanded details (date, description, client notes) on session cards in list view.",
      category: "UI Enhancements"
    },
    {
      key: "FEATURE_SINGLE_HYPOTHESIS",
      label: "Single Hypothesis Mode",
      description: "Forces a single diagnostic pathway: hides framing prompts, uncertainty indicators and document gates.",
      category: "System Logic"
    }
  ];

  // Fix category for status bar if it was missing
  toggleItems.forEach(item => {
    if (!item.category) (item as any).category = "System Logic";
    if (item.key === "FEATURE_WORKSPACE_STATUS_BAR") item.category = "UI Enhancements";
  });

  const filteredItems = toggleItems.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase()) || 
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const categoriesOrder: ToggleCategory[] = ["Workflow Compliance", "Analysis & Intelligence", "UI Enhancements", "System Logic"];

  return (
    <AnimatePresence>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
        background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000
      }} onClick={onClose}>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          style={{
            background: "white", borderRadius: 16, width: "100%", maxWidth: 540, 
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "85vh"
          }} 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ padding: "24px 28px", borderBottom: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: BRAND, color: "white", padding: 8, borderRadius: 10 }}>
                <Brain size={22} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: TEXT_PRIMARY }}>Development Feature Toggles</h2>
                <div style={{ fontSize: 13, color: TEXT_SECONDARY, display: "flex", alignItems: "center", gap: 6 }}>
                  {activeCount} features active 
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#cbd5e1" }} />
                  Audit Sandbox Mode
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_SECONDARY, padding: 8, borderRadius: "50%", hover: { background: "#f1f5f9" } } as any}>
              <X size={20} />
            </button>
          </div>

          {/* Search & Actions Bar */}
          <div style={{ padding: "16px 28px", borderBottom: `1px solid ${DIVIDER}`, background: "#fafafa", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: TEXT_SECONDARY }}>
                <Search size={14} />
              </div>
              <input 
                type="text" 
                placeholder="Search features..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ 
                  width: "100%", padding: "8px 10px 8px 32px", fontSize: 13, 
                  border: `1px solid ${DIVIDER}`, borderRadius: 8,
                  outline: "none"
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={() => setAllFlags(true)}
                style={{ background: "none", border: "none", cursor: "pointer", color: BRAND, fontSize: 12, fontWeight: 600 }}
              >
                All On
              </button>
              <button 
                onClick={() => setAllFlags(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_SECONDARY, fontSize: 12, fontWeight: 600 }}
              >
                All Off
              </button>
              <button 
                onClick={resetToDefaults}
                style={{ background: "#f1f5f9", border: "none", cursor: "pointer", color: TEXT_PRIMARY, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6 }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div style={{ padding: "0 28px 28px 28px", overflowY: "auto", flex: 1 }}>
            {categoriesOrder.map(category => {
              const itemsInCategory = filteredItems.filter(i => i.category === category);
              if (itemsInCategory.length === 0) return null;

              return (
                <div key={category} style={{ marginTop: 24 }}>
                  <div style={{ 
                    display: "flex", alignItems: "center", gap: 8, 
                    fontSize: 11, fontWeight: 700, color: TEXT_SECONDARY, 
                    textTransform: "uppercase", letterSpacing: "0.05em", 
                    marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid #f1f5f9`
                  }}>
                    <span style={{ color: BRAND }}>{CATEGORY_ICONS[category]}</span>
                    {category}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {itemsInCategory.map((item) => {
                      const isDisabledByHypothesis = flags.FEATURE_SINGLE_HYPOTHESIS && (
                        item.key === "FEATURE_HYPOTHESIS_FRAMING_PROMPT" || 
                        item.key === "FEATURE_UNCERTAINTY_INDICATOR" || 
                        item.key === "FEATURE_DOCUMENT_COMPLETENESS_GATE"
                      );
                      
                      return (
                        <div key={item.key} style={{ 
                          display: "flex", 
                          alignItems: "flex-start", 
                          justifyContent: "space-between", 
                          gap: 20,
                          opacity: isDisabledByHypothesis ? 0.5 : 1,
                          pointerEvents: isDisabledByHypothesis ? "none" : "auto"
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: flags[item.key] ? BRAND : TEXT_PRIMARY }}>{item.label}</div>
                              {flags[item.key] && (
                                <div style={{ 
                                  background: "#ecfdf5", color: "#10b981", 
                                  fontSize: 9, fontWeight: 700, padding: "1px 6px", 
                                  borderRadius: 10, border: "1px solid #d1fae5" 
                                }}>ACTIVE</div>
                              )}
                              {isDisabledByHypothesis && (
                                <div style={{ 
                                  background: "#f8fafc", color: "#64748b", 
                                  fontSize: 9, fontWeight: 700, padding: "1px 6px", 
                                  borderRadius: 10, border: "1px solid #e2e8f0" 
                                }}>LOCKED</div>
                              )}
                            </div>
                            <div style={{ fontSize: 12, color: TEXT_SECONDARY, lineHeight: 1.5 }}>{item.description}</div>
                          </div>
                          <label style={{ cursor: "pointer", position: "relative", display: "inline-block", width: 44, height: 24, flexShrink: 0, marginTop: 4 }}>
                            <input 
                              type="checkbox" 
                              checked={!!flags[item.key]} 
                              onChange={() => setFlag(item.key, !flags[item.key])}
                              style={{ opacity: 0, width: 0, height: 0 }}
                              disabled={isDisabledByHypothesis}
                            />
                            <span style={{
                              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                              background: flags[item.key] ? BRAND : "#e2e8f0",
                              borderRadius: 24, transition: "0.3s", cursor: "pointer"
                            }}>
                              <span style={{
                                position: "absolute", height: 18, width: 18, left: 3, bottom: 3,
                                background: "white", transition: "0.3s", borderRadius: "50%",
                                transform: flags[item.key] ? "translateX(20px)" : "translateX(0)",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                              }} />
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: "16px 28px", background: "#f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${DIVIDER}` }}>
            <div style={{ fontSize: 12, color: TEXT_SECONDARY, display: "flex", alignItems: "center", gap: 6 }}>
              <Info size={14} /> 
              Changes are applied instantly.
            </div>
            <button onClick={onClose} style={{ ...primaryBtn, padding: "10px 28px", borderRadius: 8 }}>
              Close Auditor View
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
