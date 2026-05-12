import React, { createContext, useContext, useState, useEffect } from "react";

export type FeatureFlags = {
  FEATURE_CLIENT_STATUS_BADGES: boolean;
  FEATURE_CLINICAL_NOTES_STRIP: boolean;
  FEATURE_ASSESSMENT_GATE: boolean;
  FEATURE_PRIOR_ASSESSMENT_COMPARE: boolean;
  FEATURE_DOCUMENT_COMPLETENESS_GATE: boolean;
  FEATURE_EVIDENCE_SOURCE_LINKS: boolean;
  FEATURE_WORKSPACE_STATUS_BAR: boolean;
  FEATURE_EQUALISED_MAPPING_ACTIONS: boolean;
  FEATURE_CONFIDENCE_BADGE: boolean;
  FEATURE_CONFLICT_RESOLUTION_GATE: boolean;
  FEATURE_HYPOTHESIS_FRAMING_PROMPT: boolean;
  FEATURE_DEFER_AS_PRIMARY_ACTION: boolean;
  FEATURE_UNCERTAINTY_INDICATOR: boolean;
  FEATURE_SEQUENTIAL_REPORT_REVIEW: boolean;
  FEATURE_REPORT_COMPLETENESS_CHECK: boolean;
  FEATURE_WORKSPACE_ALERTS_CONTEXT: boolean;
  FEATURE_COGNITIVE_LOOP_TRACKER: boolean;
  FEATURE_ASSESSMENT_DETAILS: boolean;
  FEATURE_SESSION_DETAILS: boolean;
  FEATURE_SINGLE_HYPOTHESIS: boolean;
  FEATURE_COMPACT_HUD: boolean;
};

const DEFAULT_FLAGS: FeatureFlags = {
  FEATURE_CLIENT_STATUS_BADGES: false,
  FEATURE_CLINICAL_NOTES_STRIP: false,
  FEATURE_ASSESSMENT_GATE: false,
  FEATURE_PRIOR_ASSESSMENT_COMPARE: true,
  FEATURE_DOCUMENT_COMPLETENESS_GATE: false,
  FEATURE_EVIDENCE_SOURCE_LINKS: false,
  FEATURE_WORKSPACE_STATUS_BAR: false,
  FEATURE_EQUALISED_MAPPING_ACTIONS: false,
  FEATURE_CONFIDENCE_BADGE: false,
  FEATURE_CONFLICT_RESOLUTION_GATE: false,
  FEATURE_HYPOTHESIS_FRAMING_PROMPT: false,
  FEATURE_DEFER_AS_PRIMARY_ACTION: false,
  FEATURE_UNCERTAINTY_INDICATOR: false,
  FEATURE_SEQUENTIAL_REPORT_REVIEW: false,
  FEATURE_REPORT_COMPLETENESS_CHECK: false,
  FEATURE_WORKSPACE_ALERTS_CONTEXT: false,
  FEATURE_COGNITIVE_LOOP_TRACKER: false,
  FEATURE_ASSESSMENT_DETAILS: false,
  FEATURE_SESSION_DETAILS: false,
  FEATURE_SINGLE_HYPOTHESIS: false,
  FEATURE_COMPACT_HUD: true,
};

interface FeatureToggleContextType {
  flags: FeatureFlags;
  setFlag: (key: keyof FeatureFlags, value: boolean) => void;
  setAllFlags: (value: boolean) => void;
  resetToDefaults: () => void;
  activeCount: number;
  activeAssessmentId: string | null;
  setActiveAssessmentId: (id: string | null) => void;
  activeClientId: string | null;
  setActiveClientId: (id: string | null) => void;
  useGroupedTabs: boolean;
  setUseGroupedTabs: (value: boolean) => void;
}

const FeatureToggleContext = createContext<FeatureToggleContextType | undefined>(undefined);

export function FeatureToggleProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(() => {
    const saved = localStorage.getItem("feature_flags");
    return saved ? JSON.parse(saved) : DEFAULT_FLAGS;
  });

  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>("1");
  const [activeClientId, setActiveClientId] = useState<string | null>("125566");
  const [useGroupedTabs, setUseGroupedTabs] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem("feature_flags", JSON.stringify(flags));
  }, [flags]);

  const activeCount = Object.values(flags).filter(Boolean).length;

  const setFlag = (key: keyof FeatureFlags, value: boolean) => {
    setFlags((prev) => {
      const next = { ...prev, [key]: value };
      
      // Enforce dependencies for FEATURE_SINGLE_HYPOTHESIS
      if (key === "FEATURE_SINGLE_HYPOTHESIS" && value === true) {
        next.FEATURE_HYPOTHESIS_FRAMING_PROMPT = false;
        next.FEATURE_UNCERTAINTY_INDICATOR = false;
        next.FEATURE_DOCUMENT_COMPLETENESS_GATE = false;
      }
      
      return next;
    });
  };

  const setAllFlags = (value: boolean) => {
    setFlags((prev) => {
      const newFlags = { ...prev };
      Object.keys(newFlags).forEach((key) => {
        (newFlags as any)[key] = value;
      });
      return newFlags;
    });
  };

  const resetToDefaults = () => {
    setFlags(DEFAULT_FLAGS);
  };

  return (
    <FeatureToggleContext.Provider value={{ flags, setFlag, setAllFlags, resetToDefaults, activeCount, activeAssessmentId, setActiveAssessmentId, activeClientId, setActiveClientId, useGroupedTabs, setUseGroupedTabs }}>
      {children}
    </FeatureToggleContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureToggleContext);
  if (!context) throw new Error("useFeatureFlags must be used within a FeatureToggleProvider");
  return context;
}
