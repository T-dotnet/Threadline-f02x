import React from "react";
import { AlertTriangle, Activity, CheckCircle2, FlaskConical, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useWorkspaceAlerts, COGNITIVE_LOOP_LABELS } from "../../contexts/WorkspaceAlertsContext";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { Typography } from "../../components/ui";
import { cn } from "../../lib/utils";

interface WorkspaceStatusBarProps {
  onNavigate: (tab: string) => void;
}

export function WorkspaceStatusBar({ onNavigate }: WorkspaceStatusBarProps) {
  const navigate = useNavigate();
  const { flags } = useFeatureFlags();
  const { conflicts, missingDocuments, lowConfidenceMappings, currentStep } = useWorkspaceAlerts();
  const [searchParams, setSearchParams] = useSearchParams();

  if (!flags.FEATURE_WORKSPACE_STATUS_BAR && !flags.FEATURE_COGNITIVE_LOOP_TRACKER) return null;

  const totalAlerts = conflicts.length + missingDocuments.length + lowConfidenceMappings.length;
  const showAlerts = flags.FEATURE_WORKSPACE_STATUS_BAR && totalAlerts > 0;
  const showTracker = flags.FEATURE_COGNITIVE_LOOP_TRACKER;

  if (!showAlerts && !showTracker) return null;

  const openCognitiveLoopModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("modal", "cognitive_loop");
    setSearchParams(newParams);
  };

  const alertStrings = [];
  if (conflicts.length > 0) alertStrings.push({ text: `${conflicts.length} Conflict${conflicts.length > 1 ? 's' : ''}`, type: 'conflict', count: conflicts.length });
  if (missingDocuments.length > 0) alertStrings.push({ text: `${missingDocuments.length} Missing Doc${missingDocuments.length > 1 ? 's' : ''}`, type: 'document', count: missingDocuments.length });
  if (lowConfidenceMappings.length > 0) alertStrings.push({ text: `${lowConfidenceMappings.length} Low Confidence`, type: 'mapping', count: lowConfidenceMappings.length });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden bg-white border border-divider rounded-lg shadow-sm mb-6 mt-2"
      >
        <div className="px-6 py-4 flex items-center justify-between gap-8">
          {/* Tracker Section */}
          {showTracker && (
            <div className="flex items-center gap-5 flex-1">
              <div className="flex items-center gap-2.5">
                <div className="bg-brand text-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                  <Activity size={12} strokeWidth={3} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Typography variant="label-micro" className="leading-tight text-text-secondary">
                      Cognitive Loop
                    </Typography>
                    <button 
                      onClick={openCognitiveLoopModal}
                      className="bg-transparent border-none p-0 cursor-pointer text-slate-400 flex items-center hover:text-slate-600 transition-colors"
                      title="What is the Cognitive Loop?"
                    >
                      <HelpCircle size={12} />
                    </button>
                  </div>
                  <div className="text-[13px] font-semibold text-brand whitespace-nowrap leading-tight">
                    {currentStep}. {COGNITIVE_LOOP_LABELS[currentStep as any]}
                  </div>
                </div>
              </div>

              {/* Progress Pips */}
              <div className="flex gap-1 items-center flex-1 max-w-[300px]">
                {[1, 2, 3, 4, 5, 6].map((s) => {
                  const isActive = s === currentStep;
                  const isCompleted = s < currentStep;
                  return (
                    <div key={s} className="flex-1 relative">
                      <motion.div 
                        animate={{ 
                          backgroundColor: isActive ? "#06302c" : isCompleted ? "#06302c" : "#e2e8f0",
                          height: isActive ? 6 : 4
                        }}
                        className="rounded"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Alert Section */}
          <div className="flex items-center gap-6">
            {showAlerts && (
              <div className="flex items-center gap-2">
                {alertStrings.map((item, i) => (
                  <div 
                    key={item.type}
                    onClick={() => {
                      if (item.type === 'conflict' || item.type === 'mapping') onNavigate('Evidence');
                      if (item.type === 'document') onNavigate('Documents');
                    }}
                    className={cn(
                      "px-2 py-0.5 rounded border text-[10px] font-bold uppercase whitespace-nowrap cursor-pointer transition-all hover:bg-gray-50 flex items-center gap-1.5",
                      item.type === 'conflict' ? "border-red-500 text-red-500" : 
                      item.type === 'document' ? "border-blue-500 text-blue-500" :
                      "border-gray-400 text-gray-500"
                    )}
                  >
                    {item.type === 'conflict' && <AlertTriangle size={12} />}
                    {item.type === 'document' && <Activity size={12} />}
                    {item.text}
                  </div>
                ))}
              </div>
            )}
            
            {/* Status Indicator & Playground */}
            <div className="flex items-center gap-6">
              {currentStep === 6 && !showAlerts ? (
                <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-semibold">
                  <CheckCircle2 size={14} />
                  <span>Verification Ready</span>
                </div>
              ) : (
                <div className="text-[10px] text-text-secondary font-bold tracking-widest uppercase opacity-80">
                  {showAlerts ? "" : "Live Processing"}
                </div>
              )}

              <div className="h-4 w-px bg-divider mx-0" />

              <button 
                onClick={() => navigate('/playground')}
                className="flex items-center gap-1.5 text-text-secondary hover:text-brand transition-colors cursor-pointer group"
                title="Open Style Guide / Playground"
              >
                <FlaskConical size={12} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Playground</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
