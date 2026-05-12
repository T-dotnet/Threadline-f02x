import React, { useState } from "react";
import { History, ChevronRight, ChevronLeft, Calendar, User, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { MOCK_ASSESSMENTS } from "./mockData";
import { Typography, Badge, Card, CardContent } from "../../components/ui";
import { cn } from "../../lib/utils";

// SCOPE NOTE: If longitudinal comparison is out of scope, remove this component and document the limitation in the IFU

export function AssessmentCompareSidebar() {
  const { flags, activeAssessmentId } = useFeatureFlags();
  const [isOpen, setIsOpen] = useState(false);

  // Note: FEATURE_PRIOR_ASSESSMENT_COMPARE is currently forced to false for demo scope
  if (!flags.FEATURE_PRIOR_ASSESSMENT_COMPARE || !activeAssessmentId || true) return null;

  // For demo, we consider all assessments except the active one as "prior"
  const priorAssessments = MOCK_ASSESSMENTS.filter((_, idx) => String(idx) !== activeAssessmentId);

  if (priorAssessments.length === 0) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 z-[100] flex pointer-events-none">
      {/* Toggle Button */}
      <div className="flex flex-col justify-start pt-[120px] h-full transform-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "border-none rounded-l-xl py-5 px-2.5 cursor-pointer shadow-[-4px_0_12px_rgba(0,0,0,0.1)] pointer-events-auto flex flex-col items-center gap-4 transition-all duration-300",
            isOpen ? "bg-white text-info-dark border-y border-l border-divider" : "bg-info-dark text-white hover:bg-info-dark/90"
          )}
        >
          {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          <div className="writing-vertical text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
            Prior Assessments
          </div>
          <History size={18} className={isOpen ? "text-info-dark" : "text-white"} />
        </button>
      </div>

      {/* Sidebar Content */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-[380px] bg-white border-l border-divider shadow-[-4px_0_24px_rgba(0,0,0,0.08)] flex flex-col pointer-events-auto"
          >
            <div className="px-6 py-5 border-b border-divider flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-info-light flex items-center justify-center text-info-dark">
                  <History size={18} />
                </div>
                <Typography variant="h3" className="text-lg font-sans">Assessment History</Typography>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex flex-col gap-5">
                {priorAssessments.map((assessment, i) => (
                  <Card 
                    key={i} 
                    className="transition-all duration-300 hover:shadow-md bg-white border-divider"
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-text-disabled" />
                          <Typography variant="label-micro" className="text-text-secondary font-bold">
                            {assessment.subtitle.split(' • ')[0]}
                          </Typography>
                        </div>
                        <Badge variant={assessment.status.toLowerCase() === 'completed' ? 'success' : 'soft'} className="text-[9px] uppercase tracking-wider py-0 px-1.5 h-4">
                          {assessment.status.toLowerCase() === 'completed' ? 'Formulated' : 'Deferred'}
                        </Badge>
                      </div>
                      
                      <Typography variant="body" className="font-bold text-info-dark">
                        {assessment.title}
                      </Typography>

                      <div className="flex items-center gap-2">
                        <User size={13} className="text-text-disabled" />
                        <Typography variant="label-micro" className="text-text-secondary font-medium lowercase">
                          Assessed by: {assessment.subtitle.split(' • ')[1]}
                        </Typography>
                      </div>

                      <div className="mt-2 pt-3 border-t border-dashed border-divider flex items-start gap-2">
                        <Info size={14} className="text-text-disabled mt-0.5" />
                        <Typography variant="body-sm" className="italic text-text-secondary leading-relaxed">
                          Conclusion: Symptoms aligned with {assessment.title} guidelines. Recommended follow-up in 3 months.
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="p-5 border-t border-divider bg-gray-50">
              <div className="flex items-center gap-2 text-[10px]/[15px] font-bold tracking-[0.1em] text-text-disabled uppercase">
                <Info size={12} className="opacity-50" />
                <span>Reference database for longitudinal support</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
