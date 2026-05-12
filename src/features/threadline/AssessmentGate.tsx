import React from "react";
import { ClipboardList } from "lucide-react";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { EmptyState } from "../../components/shared/EmptyState";

interface AssessmentGateProps {
  children: React.ReactNode;
  onNavigateToAssessments: () => void;
}

export function AssessmentGate({ children, onNavigateToAssessments }: AssessmentGateProps) {
  const { flags, activeAssessmentId } = useFeatureFlags();

  if (!flags.FEATURE_ASSESSMENT_GATE || activeAssessmentId) {
    return <>{children}</>;
  }

  return (
    <div className="py-20 flex justify-center min-h-[400px] text-center">
        <EmptyState 
          icon={ClipboardList}
          title="No active assessment"
          description="Start a new assessment in the Assessments tab to begin."
          actionLabel="Go to Assessments"
          onAction={onNavigateToAssessments}
        />
    </div>
  );
}
