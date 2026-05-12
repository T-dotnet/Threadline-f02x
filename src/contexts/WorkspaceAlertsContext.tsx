import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useFeatureFlags } from "./FeatureToggleContext";
import { MOCK_CONFLICTS, MOCK_MISSING_DOCUMENTS, MOCK_EVIDENCE_ITEMS, MOCK_CLIENT_DATA } from "../features/threadline/mockData";
import { FEATURE_CONFIDENCE_THRESHOLD } from "../features/threadline/constants";

export interface ConflictItem {
  id: string;
  description: string;
}

export interface MissingDocItem {
  id: string;
  name: string;
  description?: string;
}

export interface MappingItem {
  id: string;
  label: string;
  confidence: number;
}

export type CognitiveLoopStep = 1 | 2 | 3 | 4 | 5 | 6;

export const COGNITIVE_LOOP_LABELS: Record<CognitiveLoopStep, string> = {
  1: "Evidence Review",
  2: "Reliability Evaluation",
  3: "Conflict Resolution",
  4: "Hypothesis Formation",
  5: "Uncertainty Assessment",
  6: "Decision and Output"
};

interface WorkspaceAlertsContextType {
  conflicts: ConflictItem[];
  missingDocuments: MissingDocItem[];
  lowConfidenceMappings: MappingItem[];
  acceptedMappings: MappingItem[];
  currentStep: CognitiveLoopStep;
  stepReachedAt: Record<CognitiveLoopStep, string | null>;
  hypothesisSubmitted: boolean;
  isDeferred: boolean;
  impressionFormulated: boolean;
  reportApproved: boolean;
  setConflicts: (conflicts: ConflictItem[]) => void;
  setMissingDocuments: (docs: MissingDocItem[]) => void;
  setLowConfidenceMappings: (mappings: MappingItem[]) => void;
  setAcceptedMappings: (mappings: MappingItem[]) => void;
  setHypothesisSubmitted: (val: boolean) => void;
  setIsDeferred: (val: boolean) => void;
  setImpressionFormulated: (val: boolean) => void;
  setReportApproved: (val: boolean) => void;
  clearAlerts: () => void;
}

const WorkspaceAlertsContext = createContext<WorkspaceAlertsContextType | undefined>(undefined);

export function WorkspaceAlertsProvider({ children }: { children: ReactNode }) {
  const { flags, activeAssessmentId, activeClientId } = useFeatureFlags();
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [missingDocuments, setMissingDocuments] = useState<MissingDocItem[]>([]);
  const [lowConfidenceMappings, setLowConfidenceMappings] = useState<MappingItem[]>([]);
  const [acceptedMappings, setAcceptedMappings] = useState<MappingItem[]>([]);
  
  const [hypothesisSubmitted, setHypothesisSubmitted] = useState(false);
  const [isDeferred, setIsDeferred] = useState(false);
  const [impressionFormulated, setImpressionFormulated] = useState(false);
  const [reportApproved, setReportApproved] = useState(false);
  
  const [currentStep, setCurrentStep] = useState<CognitiveLoopStep>(1);
  const [stepReachedAt, setStepReachedAt] = useState<Record<CognitiveLoopStep, string | null>>({
    1: null, 2: null, 3: null, 4: null, 5: null, 6: null
  });

  const isEnabled = flags.FEATURE_WORKSPACE_ALERTS_CONTEXT;

  // REGULATORY NOTE: This tracker provides machine-readable process data for Phase 3 observer data capture sheets (per DOC-HF-CL-001 §4.2). Step-level deviation data supports process measures alongside outcome measures.

  const clearAlerts = React.useCallback(() => {
    setConflicts([]);
    setMissingDocuments([]);
    setLowConfidenceMappings([]);
    setAcceptedMappings([]);
    setHypothesisSubmitted(false);
    setIsDeferred(false);
    setImpressionFormulated(false);
    setReportApproved(false);
    setCurrentStep(1);
    setStepReachedAt({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });
  }, []);

  // Logic to derive current step and log transitions
  useEffect(() => {
    if (!flags.FEATURE_COGNITIVE_LOOP_TRACKER) return;

    let targetStep: CognitiveLoopStep = 1;
    
    if (reportApproved) {
      targetStep = 6;
    } else if (isDeferred || impressionFormulated) {
      targetStep = 5;
    } else if (hypothesisSubmitted) {
      targetStep = 4;
    } else if (conflicts.length === 0 && acceptedMappings.length > 0) {
      targetStep = 3;
    } else if (acceptedMappings.length > 0) {
      targetStep = 2;
    } else {
      targetStep = 1;
    }

    // Step 2 is effectively "Reliability Evaluation" - we are in it if we have at least one accepted item 
    // but haven't resolved all conflicts yet.
    // Step 3 is "Conflict Resolution" - we are in it once all conflicts are resolved.

    if (targetStep > currentStep) {
      const now = new Date().toISOString();
      setStepReachedAt(prev => ({ ...prev, [targetStep]: now }));
      setCurrentStep(targetStep);
      
      console.info("AUDIT LOG: Cognitive Loop Transition", {
        step: targetStep,
        stepLabel: COGNITIVE_LOOP_LABELS[targetStep],
        timestamp: now,
        assessmentId: activeAssessmentId
      });
    }
  }, [
    reportApproved, isDeferred, impressionFormulated, hypothesisSubmitted, 
    conflicts.length, lowConfidenceMappings.length, acceptedMappings.length,
    flags.FEATURE_COGNITIVE_LOOP_TRACKER, currentStep, activeAssessmentId
  ]);

  // Reset when assessment or client changes or flags change
  useEffect(() => {
    clearAlerts();
    
    if (flags.FEATURE_WORKSPACE_ALERTS_CONTEXT) {
      const clientData = activeClientId ? (MOCK_CLIENT_DATA as any)[activeClientId] : null;
      
      if (clientData) {
        setConflicts(clientData.conflicts || []);
        setMissingDocuments(clientData.missingDocuments || []);
        
        // Use evidence from client data for low confidence check if available, otherwise fallback
        const evidenceToUse = (clientData.evidence && clientData.evidence.length > 0) 
          ? clientData.evidence 
          : MOCK_EVIDENCE_ITEMS;

        setLowConfidenceMappings(
          evidenceToUse
            .filter((i: any) => {
               const s = i.score || "0";
               return !isNaN(parseFloat(s)) && parseFloat(s) < FEATURE_CONFIDENCE_THRESHOLD;
            })
            .map((i: any) => ({ id: i.label || i.type, label: i.label || i.type, confidence: parseFloat(i.score || "0") }))
        );
      } else {
        // Fallback for legacy behavior if no specific client data found
        setConflicts(MOCK_CONFLICTS);
        setMissingDocuments(MOCK_MISSING_DOCUMENTS);
        setLowConfidenceMappings(
          MOCK_EVIDENCE_ITEMS
            .filter(i => !isNaN(parseFloat(i.score)) && parseFloat(i.score) < FEATURE_CONFIDENCE_THRESHOLD)
            .map(i => ({ id: i.label, label: i.label, confidence: parseFloat(i.score) }))
        );
      }
    }
  }, [activeAssessmentId, activeClientId, flags.FEATURE_WORKSPACE_ALERTS_CONTEXT]);

  const value = React.useMemo(() => ({
    conflicts: isEnabled ? conflicts : [],
    missingDocuments: isEnabled ? missingDocuments : [],
    lowConfidenceMappings: (isEnabled && !flags.FEATURE_SINGLE_HYPOTHESIS) ? lowConfidenceMappings : [],
    acceptedMappings: isEnabled ? acceptedMappings : [],
    currentStep,
    stepReachedAt,
    hypothesisSubmitted,
    isDeferred,
    impressionFormulated,
    reportApproved,
    setConflicts: (c: ConflictItem[]) => isEnabled && setConflicts(c),
    setMissingDocuments: (d: MissingDocItem[]) => isEnabled && setMissingDocuments(d),
    setLowConfidenceMappings: (m: MappingItem[]) => isEnabled && setLowConfidenceMappings(m),
    setAcceptedMappings: (m: MappingItem[]) => isEnabled && setAcceptedMappings(m),
    setHypothesisSubmitted: (v: boolean) => isEnabled && setHypothesisSubmitted(v),
    setIsDeferred: (v: boolean) => isEnabled && setIsDeferred(v),
    setImpressionFormulated: (v: boolean) => isEnabled && setImpressionFormulated(v),
    setReportApproved: (v: boolean) => isEnabled && setReportApproved(v),
    clearAlerts
  }), [
    isEnabled, conflicts, missingDocuments, flags.FEATURE_SINGLE_HYPOTHESIS, 
    lowConfidenceMappings, acceptedMappings, currentStep, stepReachedAt, 
    hypothesisSubmitted, isDeferred, impressionFormulated, reportApproved, 
    clearAlerts
  ]);

  return (
    <WorkspaceAlertsContext.Provider value={value}>
      {children}
    </WorkspaceAlertsContext.Provider>
  );
}

export function useWorkspaceAlerts() {
  const context = useContext(WorkspaceAlertsContext);
  if (context === undefined) {
    throw new Error("useWorkspaceAlerts must be used within a WorkspaceAlertsProvider");
  }
  return context;
}
