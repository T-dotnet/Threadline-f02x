import React, { useState, useEffect } from "react";
import { Download as DownloadIcon, ChevronUp, Edit3 as EditIcon, CheckCircle2, Circle, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, BRAND, BRAND_LIGHT, ACCEPTED_BG, cardStyle, cardHeaderStyle, h1Style, subStyle, primaryBtn, outlineBtn, TYPE_SCALE } from "./constants";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { useWorkspaceAlerts } from "../../contexts/WorkspaceAlertsContext";

import { AssessmentGate } from "./AssessmentGate";
import { ReportSection } from "./components";
import { ProgressBanner } from "./components/ProgressBanner";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";
import { DataPoint } from "../../components/ui";

const REPORT_SECTIONS = ['Formulation', 'Evidence Summary', 'Caveats', 'Next Steps', 'Missing Information Notes'];

import { MOCK_REPORT_MAPPING_IDS as REPORT_MAPPING_IDS } from "./mockData";

function CompletenessWarningModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  missingItems 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  missingItems: { id: string, label: string }[] 
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 2000
    }}>
      <div style={{
        background: "white", borderRadius: 12, width: "100%", maxWidth: 500,
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", overflow: "hidden"
      }}>
        <div style={{ padding: "24px", borderBottom: `1px solid ${DIVIDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "#fef3c7", padding: 8, borderRadius: 8, color: "#92400e" }}>
              <AlertTriangle size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: TEXT_PRIMARY }}>Evidence not reflected in report</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_SECONDARY }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.5 }}>
            The following evidence items were accepted in the Evidence Workspace but are not currently reflected in this version of the report:
          </p>
          <div style={{ background: "#f9fafb", borderRadius: 8, border: `1px solid ${DIVIDER}`, maxHeight: 200, overflowY: "auto", padding: "12px 16px" }}>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {missingItems.map(item => (
                <li key={item.id} style={{ ...TYPE_SCALE.BodyStandard, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: TEXT_SECONDARY }} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
          <p style={{ margin: "16px 0 0", fontSize: 13, color: TEXT_SECONDARY, fontStyle: "italic" }}>
            This gap will be logged in the audit trail if you proceed.
          </p>
        </div>

        <div style={{ padding: "16px 24px", background: "#f9fafb", display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button onClick={onClose} style={{ ...outlineBtn, padding: "8px 24px" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ ...primaryBtn, background: BRAND, padding: "8px 24px" }}>
            Download anyway
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReportWorkspace({ onNavigateToAssessments, status }: { onNavigateToAssessments?: () => void, status?: string }) {
  const { flags, activeAssessmentId } = useFeatureFlags();
  const { acceptedMappings } = useWorkspaceAlerts();
  const [reviewedSections, setReviewedSections] = useState<Set<string>>(new Set());
  const [showCompletenessModal, setShowCompletenessModal] = useState(false);
  const [missingEvidence, setMissingEvidence] = useState<{ id: string, label: string }[]>([]);

  // TODO: acceptedMappings must be written to shared assessment state in EvidenceWorkspace for this check to function

  // REGULATORY NOTE: This is the primary control for RISK-006. The sequential review requirement must not be simplified to a single confirm without updating the risk control documentation.
  
  useEffect(() => {
    // Reset on mount / re-entry
    setReviewedSections(new Set());
  }, [activeAssessmentId]);

  const toggleReview = (section: string) => {
    const newSet = new Set(reviewedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setReviewedSections(newSet);
  };

  const isAllReviewed = reviewedSections.size === REPORT_SECTIONS.length;

  const { setReportApproved } = useWorkspaceAlerts();

  const proceedWithDownload = (acknowledgedGap = false) => {
    console.info("AUDIT LOG: Report Approved", {
      timestamp: new Date().toISOString(),
      assessmentId: activeAssessmentId,
      reviewedSections: Array.from(reviewedSections),
      clinicianId: "CLINICIAN_001", // Mock ID
      completenessCheckAcknowledged: acknowledgedGap,
      missingItems: acknowledgedGap ? missingEvidence.map(i => i.id) : []
    });
    setReportApproved(true);
    // Trigger download logic here
    alert("Report download triggered successfully.");
    setShowCompletenessModal(false);
  };

  const handleApprove = () => {
    if (!isAllReviewed && flags.FEATURE_SEQUENTIAL_REPORT_REVIEW) return;

    if (flags.FEATURE_REPORT_COMPLETENESS_CHECK) {
      const missing = acceptedMappings.filter(mapping => !REPORT_MAPPING_IDS.includes(mapping.id));
      if (missing.length > 0) {
        setMissingEvidence(missing.map(m => ({ id: m.id, label: m.label })));
        setShowCompletenessModal(true);
        return;
      }
    }
    
    proceedWithDownload();
  };

  const navItems = [
    "Information User",
    "Sources Of Information Reviewed",
    "Summary Of Current Concerns\n(Presenting Picture)",
    "Whole-Mind Snapshot",
    "Strengths",
    "Areas Under Pressure",
    "Assessment Insights",
    "Provisional Working Impression",
    "Differential Considerations",
    "Key Diagnostic Indicators",
    "Recommended Next Steps\nFor Diagnostic Clarity",
    "Summary Statement",
    "Safety Summary"
  ];

  const [activeNav, setActiveNav] = useState("Information User");

  const ReviewBadge = ({ section }: { section: string }) => {
    if (!flags.FEATURE_SEQUENTIAL_REPORT_REVIEW) return null;
    const isReviewed = reviewedSections.has(section);
    
    return (
      <button 
        onClick={() => toggleReview(section)}
        style={{ 
          background: isReviewed ? ACCEPTED_BG : "white",
          color: isReviewed ? BRAND : TEXT_SECONDARY,
          border: `1px solid ${isReviewed ? BRAND : DIVIDER}`,
          borderRadius: 20, padding: "6px 12px", fontSize: 12, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
          transition: "all 0.2s"
        }}
      >
        <AnimatePresence mode="wait">
                {isReviewed ? (
                  <motion.div
                    key="checked"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <CheckCircle2 size={16} color={BRAND} />
                  </motion.div>
          ) : (
            <motion.div key="unchecked">
              <Circle size={16} />
            </motion.div>
          )}
        </AnimatePresence>
        {isReviewed ? "Reviewed" : "Mark as reviewed"}
      </button>
    );
  };
  
  const sidebarContent = (
    <>
      <div style={{ padding: "24px 20px", borderBottom: `1px solid ${DIVIDER}` }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500, color: TEXT_PRIMARY }}>Report Sections</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflowY: "auto" }}>
        {navItems.map((item, idx) => (
          <div 
            key={idx}
            onClick={() => setActiveNav(item)}
            style={{
              padding: "16px 24px", 
              background: activeNav === item ? BRAND_LIGHT : "transparent",
              borderLeft: activeNav === item ? `4px solid ${BRAND}` : "4px solid transparent",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            <div style={{ fontSize: 14, color: activeNav === item ? BRAND : TEXT_PRIMARY, fontWeight: activeNav === item ? 500 : 400, lineHeight: 1.4, whiteSpace: "pre-line" }}>
              {item}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const mainContent = (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      {/* Banner */}
      <div className="p-8 bg-white border-b border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-100">
          <DataPoint label="Client Name" value="Liam Alexander O'Sullivan" />
          <DataPoint label="Date of Report" value="17 December 2025" />
          <DataPoint label="Prepared By" value="Threadline" />
          <DataPoint label="Clinician" value="[Clinician Name]" />
          <DataPoint label="Session IDs Reviewed" value="[IDs]" />
          
          <div className="col-span-full h-px bg-slate-200 my-1" />
          
          <DataPoint label="Assessments Completed" value="GAD-7, PHQ-9, SDS" />
          <div className="sm:col-span-2">
            <DataPoint label="Collateral Reviewed" value="Teacher notes, psychological evaluation, referral letter" />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", padding: "24px 40px", background: "#fcfcfc" }}>
        {/* 1. Sources of Information Reviewed */}
        <ReportSection title="Sources of Information Reviewed" reviewBadge={<ReviewBadge section="Missing Information Notes" />} noCollapse>
          <ul style={{ margin: 0, paddingLeft: 20, ...TYPE_SCALE.BodyStandard, lineHeight: 1.8, color: TEXT_SECONDARY }}>
            <li>Structured mental-health telehealth session transcript</li>
            <li>Self-reported assessments: GAD-7, PHQ-9, SDS</li>
            <li>Teacher comments and school report (Previous psychological evaluation)</li>
            <li>Referral information</li>
            <li>No parent/caregiver collateral available</li>
          </ul>
        </ReportSection>

        {/* 2. Summary of Current Concerns */}
        <ReportSection title="Summary of Current Concerns (Presenting Picture)" reviewBadge={<ReviewBadge section="Evidence Summary" />} noCollapse>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.6 }}>
            Alexa reports difficulty concentrating during school hours, feelings of overwhelm in the evenings, and sleep irregularity
            with late bedtimes. She describes increased irritability over the past term and moments of feeling emotionally
            overloaded. No acute safety concerns were expressed during sessions.
          </p>
          <p style={{ margin: 0, fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.6 }}>
            Teacher and school reports note reduced attention, difficulty with transitions, and intermittent irritability. Previous
            psychological evaluation described mild anxiety traits. Alexa has not provided detailed sleep logs or recent parent/
            caregiver insights.
          </p>
        </ReportSection>

        {/* 3. Whole-Mind Snapshot */}
        <ReportSection title="Whole-Mind Snapshot" noCollapse>
           <p style={{ margin: "0 0 8px", fontSize: 13, color: "#9ca3af", fontStyle: "italic" }}>A summary of Alexa's emotional, cognitive, physical, social, and environmental functioning.</p>
           <p style={{ margin: 0, fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.6 }}>
             Summary - Alexa appears to be experiencing a mild but noticeable emotional and cognitive load, influenced by worry,
             sleep disturbance, and situational demands. Her functioning remains generally intact, with preserved insight and strong
             relational awareness. Sleep irregularity and school-based challenges appear to be contributing factors.
           </p>
        </ReportSection>

        {/* 4. Strengths & Areas Under Pressure */}
        <ReportSection title="Strengths" noCollapse>
          <ul style={{ margin: 0, paddingLeft: 20, color: TEXT_SECONDARY, fontSize: 14, lineHeight: 1.8 }}>
            <li>Demonstrates insight and reflective capacity</li>
            <li>Strong interpersonal awareness</li>
            <li>Engages openly in sessions</li>
            <li>Motivated to improve routines</li>
          </ul>
        </ReportSection>
        <ReportSection title="Areas Under Pressure" noCollapse>
          <ul style={{ margin: 0, paddingLeft: 20, color: TEXT_SECONDARY, fontSize: 14, lineHeight: 1.8 }}>
            <li>Demonstrates insight and reflective capacity</li>
            <li>Strong interpersonal awareness</li>
            <li>Engages openly in sessions</li>
            <li>Motivated to improve routines</li>
          </ul>
        </ReportSection>

        {/* 5. Assessment Insights */}
        <ReportSection title="Assessment Insights" noCollapse>
          <div className="flex flex-col gap-4">
            <DataPoint label="Worry (GAD-7)" value="Demonstrates insight and reflective capacity" />
            <DataPoint label="Sleep (SDS)" value="Strong interpersonal awareness" />
            <DataPoint label="Mood (PHQ-9)" value="Motivated to improve routines" />
          </div>
        </ReportSection>

        {/* 6. Provisional Working Impression */}
        <ReportSection title="Provisional Working Impression" reviewBadge={<ReviewBadge section="Formulation" />} noCollapse>
          <p style={{ margin: 0, fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.6 }}>
            The combined information suggests a pattern of mild distress with early risk indicators across worry, sleep, mood, and
            attention domains. Impacts on functioning are present but currently limited. No indicators of acute risk were identified.
          </p>
        </ReportSection>

        {/* 7. Differential Considerations & Key Diagnostic Indicators */}
        <ReportSection title="Differential Considerations" reviewBadge={<ReviewBadge section="Caveats" />} noCollapse>
          <ul style={{ margin: 0, paddingLeft: 20, color: TEXT_SECONDARY, fontSize: 14, lineHeight: 1.8 }}>
            <li>Demonstrates insight and reflective capacity</li>
            <li>Strong interpersonal awareness</li>
            <li>Engages openly in sessions</li>
            <li>Motivated to improve routines</li>
          </ul>
        </ReportSection>
        <ReportSection title="Key Diagnostic Indicators" noCollapse>
          <ul style={{ margin: 0, paddingLeft: 20, color: TEXT_SECONDARY, fontSize: 14, lineHeight: 1.8 }}>
            <li>Demonstrates insight and reflective capacity</li>
            <li>Strong interpersonal awareness</li>
            <li>Engages openly in sessions</li>
            <li>Motivated to improve routines</li>
          </ul>
        </ReportSection>

        {/* 8. Recommended Next Steps for Diagnostic Clarity */}
        <ReportSection title="Recommended Next Steps for Diagnostic Clarity" reviewBadge={<ReviewBadge section="Next Steps" />} noCollapse>
          <div className="flex flex-col md:flex-row gap-8 mb-6">
            <div className="flex-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Targeted Diagnostic Steps</div>
              <ul className="margin-0 pl-5 text-slate-600 text-sm leading-relaxed space-y-2 list-disc">
                <li>Early generalised anxiety pattern</li>
                <li>Low mood pattern associated with situational influences</li>
                <li>Attention-related challenges</li>
                <li>Sleep-related symptom amplification</li>
                <li>No current indicators of acute risk</li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recommended Information to Gather</div>
              <ul className="margin-0 pl-5 text-slate-600 text-sm leading-relaxed space-y-2 list-disc">
                <li>Elevated worry across assessment items</li>
                <li>Low mood indicators affecting motivation</li>
                <li>Sleep disruption contributing to symptom load</li>
                <li>Screen-related strain affecting routine</li>
                <li>Attention challenges impacting concentration</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reason for Recommendations</div>
            <div className="text-sm text-slate-700 leading-relaxed italic">
              These areas represent domains with remaining uncertainty. Additional information will help differentiate between early-stage
              symptoms and situational responses and strengthen the provisional working impression.
            </div>
          </div>
        </ReportSection>

        {/* 9. Summary Statement */}
        <ReportSection title="Summary Statement" noCollapse>
          <p style={{ margin: 0, fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.6 }}>
            Alexa presents with a mild but coherent constellation of worry, low mood indicators, sleep disruption, and functional
            challenges related to school engagement. Her strengths, insight, and engagement provide a strong foundation for
            ongoing monitoring and clarity-building. A short period of targeted data gathering is recommended to refine the picture
            and confirm whether symptoms remain situational or represent an emerging early-stage pattern.
          </p>
        </ReportSection>

        {/* 10. Safety Summary */}
        <ReportSection title="Safety Summary" noBottomBorder>
          <ul style={{ margin: 0, paddingLeft: 20, color: TEXT_SECONDARY, fontSize: 14, lineHeight: 1.8 }}>
            <li>No acute risk indicators identified during sessions.</li>
            <li>No reports of suicidal ideation, self-harm behaviours, or threats to others.</li>
            <li>Client engaged, coherent, and future-oriented.</li>
          </ul>
        </ReportSection>

      </div>
    </div>
  );

  return (
    <AssessmentGate onNavigateToAssessments={onNavigateToAssessments || (() => {})}>
      <div style={{ padding: "0 0 64px" }}>
      
      <WorkspaceLayout 
        title="Report"
        subtitle="Threadline Diagnostic Summary Report"
        headerActions={
          !flags.FEATURE_SEQUENTIAL_REPORT_REVIEW && (
            <button 
              onClick={handleApprove}
              style={{ ...primaryBtn, width: "auto" }}
            >
              <DownloadIcon size={18} /> Download Report
            </button>
          )
        }
        subHeaderContent={flags.FEATURE_SEQUENTIAL_REPORT_REVIEW && (
          <ProgressBanner
            title="Report Quality Review"
            subtitle="Review all sections to enable approval and download"
            current={reviewedSections.size}
            total={REPORT_SECTIONS.length}
            progressLabel="Sections Reviewed"
            actionLabel="Approve and Download"
            actionIcon={DownloadIcon}
            onAction={handleApprove}
            isActionActive={isAllReviewed}
            className="mb-6"
          />
        )}
        sidebarWidth={280}
        sidebarContent={sidebarContent}
        mainContent={mainContent}
      />
      <CompletenessWarningModal 
        isOpen={showCompletenessModal}
        onClose={() => setShowCompletenessModal(false)}
        onConfirm={() => proceedWithDownload(true)}
        missingItems={missingEvidence}
      />
    </div>
  </AssessmentGate>
  );
}
