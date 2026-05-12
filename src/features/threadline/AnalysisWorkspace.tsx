/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  X, 
  ChevronDown, 
  MessageSquare, 
  ClipboardCheck, 
  Clock, 
  ArrowRight, 
  AlertCircle,
  Brain,
  CheckCircle2,
  Info,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// UI Components
import { 
  Button, 
  Card, 
  Typography, 
  Badge, 
  Input,
  Textarea,
  Select,
  CardContent
} from "../../components/ui";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";
import { cn } from "../../lib/utils";

// Context & Domain
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { useWorkspaceAlerts } from "../../contexts/WorkspaceAlertsContext";
import { AssessmentGate } from "./AssessmentGate";
import { DataPoint } from "../../components/ui";

export function AnalysisWorkspace({ onViewProfile, onNavigateToAssessments, onNavigateToTab }: { onViewProfile?: () => void, onNavigateToAssessments?: () => void, onNavigateToTab?: (tab: string) => void }) {
  const { flags, activeAssessmentId } = useFeatureFlags();
  const { 
    missingDocuments, 
    lowConfidenceMappings,
    setHypothesisSubmitted: setSharedHypothesisSubmitted, 
    setIsDeferred: setSharedIsDeferred, 
    setImpressionFormulated 
  } = useWorkspaceAlerts();

  const [hypothesisText, setHypothesisText] = useState("");
  const [hypothesisSubmitted, setHypothesisSubmitted] = useState(false);
  const [isDeferred, setIsDeferred] = useState(false);
  const [missingInfo, setMissingInfo] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [deferDate, setDeferDate] = useState<string | null>(null);

  useEffect(() => {
    setHypothesisSubmitted(false);
    setHypothesisText("");
    setIsDeferred(false);
    setDeferDate(null);
  }, [activeAssessmentId]);

  const handleSubmitHypothesis = () => {
    if (hypothesisText.length >= 20) {
      setHypothesisSubmitted(true);
      setSharedHypothesisSubmitted(true);
    }
  };

  const handleDefer = () => {
    setDeferDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
    setIsDeferred(true);
    setSharedIsDeferred(true);
  };

  const handleFormulate = () => {
    setImpressionFormulated(true);
  };

  const showPrompt = flags.FEATURE_HYPOTHESIS_FRAMING_PROMPT && !hypothesisSubmitted;

  const headerActions = !flags.FEATURE_SINGLE_HYPOTHESIS ? (
    <Button variant="outline" size="sm">
      <Plus size={16} /> Request Another Assessment
    </Button>
  ) : undefined;

  const mainContent = (
    <div className="space-y-6 pb-20">
      <UncertaintyBanner 
        missing={missingDocuments.length} 
        lowConf={lowConfidenceMappings.length} 
        onNavigate={() => onNavigateToTab?.("Evidence")}
        enabled={!!flags.FEATURE_UNCERTAINTY_INDICATOR}
      />

      <AnimatePresence mode="wait">
        {showPrompt ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto py-12"
          >
            <Card className="p-10 text-center space-y-8 shadow-xl border-divider/50">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                  <Brain size={32} />
              </div>
              <div className="space-y-2">
                  <Typography variant="h2" className="font-serif text-2xl">Clinical Hypothesis</Typography>
                  <Typography variant="body" className="text-text-secondary max-w-md mx-auto">
                      Before reviewing the system's mapping, what is your initial working hypothesis for this client?
                  </Typography>
              </div>
              
              <div className="space-y-6">
                  <Textarea
                      value={hypothesisText}
                      onChange={(e) => setHypothesisText(e.target.value)}
                      placeholder="Type your hypothesis here (minimum 20 characters)..."
                      className="min-h-[160px] text-lg p-6 bg-gray-50/50"
                  />
                  <div className={cn(
                      "text-sm font-bold flex items-center justify-center gap-2",
                      hypothesisText.length < 20 ? "text-error" : "text-success"
                  )}>
                      {hypothesisText.length < 20 ? (
                          <><X size={14} /> {hypothesisText.length} / 20 characters</>
                      ) : (
                          <><CheckCircle2 size={14} /> Ready to submit</>
                      )}
                  </div>
              </div>

              <div className="space-y-3 pt-4">
                  <Button 
                      variant="brand" 
                      size="lg" 
                      className="w-full h-14 text-lg" 
                      disabled={hypothesisText.length < 20}
                      onClick={handleSubmitHypothesis}
                  >
                      Submit Hypothesis & View Analysis
                  </Button>
                  <Button 
                      variant="ghost" 
                      className="w-full text-text-disabled" 
                      onClick={() => {
                          setHypothesisSubmitted(true);
                          setSharedHypothesisSubmitted(true);
                      }}
                  >
                      Skip and proceed anyway
                  </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
              {hypothesisSubmitted && hypothesisText && (
                  <Card className="bg-primary/5 border-primary/20 p-6 flex gap-6">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-divider flex items-center justify-center text-primary shrink-0">
                          <ClipboardCheck size={24} />
                      </div>
                      <DataPoint 
                          label="Your Recorded Hypothesis" 
                          value={
                            <div className="italic text-text-primary leading-relaxed whitespace-normal pr-4">
                              "{hypothesisText}"
                            </div>
                          } 
                      />
                  </Card>
              )}

              <Card className="divide-y divide-divider p-0 overflow-hidden">
                  {/* Steps integration */}
                  {[
                      { id: 1, title: "Initial Evidence Summary", sub: "Core observations from sessions and collateral", items: ["Assessment Data", "Session Insights", "Document Collateral"] },
                      { id: 2, title: "Symptom Patterns", sub: "Whole Mind Snapshot & Observed Themes", items: ["Symptom Clusters", "Functional Impact"] },
                      { id: 3, title: "Working Impression", sub: "Provisional status based on combined signals", items: ["Working Impression (Likely Social Anxiety)", "Differential Considerations"] },
                      { id: 4, title: "Clarity Roadmap", sub: "Next steps to resolve uncertainty", items: ["Suggested Diagnostic Actions", "Information Gaps"] },
                  ].map(step => (
                      <div key={step.id} className="p-8 flex gap-8 hover:bg-gray-50/50 transition-colors">
                          <div className="w-10 h-10 rounded-full border-2 border-divider flex items-center justify-center font-black text-text-disabled shrink-0 bg-white">
                              {step.id}
                          </div>
                          <div className="flex-1 space-y-6">
                              <div className="space-y-1">
                                  <Typography variant="h3">{step.title}</Typography>
                                  <Typography variant="body-sm" className="text-text-secondary">{step.sub}</Typography>
                              </div>
                              <div className="flex flex-col gap-3">
                                  {step.items.map(item => (
                                      <div key={item} className="flex items-center justify-between p-4 bg-white border border-divider rounded-xl shadow-sm group cursor-pointer hover:border-primary/30 transition-all">
                                          <Typography variant="body" className="font-semibold text-[15px] text-text-primary leading-tight">{item}</Typography>
                                          <ChevronDown size={14} className="text-text-disabled group-hover:text-primary transition-colors" />
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  ))}
              </Card>

              {/* Final Decision Block */}
              <div className="pt-8 border-t border-divider">
                  {isDeferred ? (
                      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                          <Card className="border-2 border-warning/30 bg-warning/5 p-8 space-y-8">
                              <div className="flex items-center gap-3 text-warning-dark">
                                  <Clock size={24} />
                                  <Typography variant="h3">Assessment Deferred — {deferDate}</Typography>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="space-y-2">
                                      <Typography variant="label-micro" className="text-warning-dark">Missing Information</Typography>
                                      <Textarea 
                                          value={missingInfo}
                                          onChange={(e) => setMissingInfo(e.target.value)}
                                          placeholder="What observations are still required?"
                                          className="min-h-[120px] bg-white border-warning/20 focus:ring-warning/10"
                                      />
                                  </div>
                                  <div className="space-y-4">
                                      <div className="space-y-2">
                                          <Select 
                                              label="Next Action Step"
                                              className="bg-white border-warning/20"
                                              value={nextStep}
                                              onChange={(e) => setNextStep(e.target.value)}
                                          >
                                              <option value="">Select action...</option>
                                              <option value="follow-up">Schedule follow-up session</option>
                                              <option value="docs">Request school observations</option>
                                              <option value="other">Review collateral data</option>
                                          </Select>
                                      </div>
                                      <div className="flex justify-end gap-3 pt-4">
                                          <Button variant="ghost" onClick={() => setIsDeferred(false)}>Cancel Deferral</Button>
                                          <Button variant="brand" className="bg-warning hover:bg-warning-dark border-none">Save Deferral Details</Button>
                                      </div>
                                  </div>
                              </div>
                          </Card>
                      </motion.div>
                  ) : (
                      <div className="flex gap-4 max-w-2xl ml-auto">
                          <Button variant="outline" size="lg" className="flex-1 h-16 text-lg font-bold border-divider text-text-secondary" onClick={handleDefer}>
                              <Clock size={20} /> Defer Decision
                          </Button>
                          <Button variant="brand" size="lg" className="flex-1 h-16 text-lg font-bold" onClick={handleFormulate}>
                              Formulate Impression <ArrowRight size={20} />
                          </Button>
                      </div>
                  )}
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <AssessmentGate onNavigateToAssessments={onNavigateToAssessments || (() => {})}>
      <WorkspaceLayout 
        singleColumn
        contentClassName="px-0 py-2 sm:px-0"
        title="Analysis"
        subtitle="Clinical Reasoning & Whole Mind Integration"
        headerActions={headerActions}
        mainContent={mainContent}
      />
    </AssessmentGate>
  );
}

function UncertaintyBanner({ missing, lowConf, onNavigate, enabled }: any) {
    if (!enabled || (missing === 0 && lowConf === 0)) return null;

    const issues = [];
    if (lowConf > 0) issues.push(`${lowConf} low-confidence mapping${lowConf > 1 ? 's' : ''}`);

    return (
        <div className="bg-warning-light/30 border border-warning/20 p-4 rounded-xl flex items-center gap-4 text-warning-dark">
            <AlertCircle size={20} className="shrink-0" />
            <Typography variant="body-sm" className="flex-1 font-medium">
                Active indicators: <span className="font-bold">{issues.join(", ")}</span>. These factors increase diagnostic uncertainty.
            </Typography>
            <Button variant="ghost" size="sm" onClick={onNavigate} className="text-warning-dark hover:bg-warning/10 font-bold whitespace-nowrap">
                Review Artifacts
            </Button>
        </div>
    );
}
