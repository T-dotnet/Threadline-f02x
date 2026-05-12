# Threadline Analytics & User Journey Documentation

## Overview
This document provides a technical and functional analysis of the critical user journey within the Threadline platform, specifically focusing on the progression from **Evidence** to **Report** via the **Analysis** hub.

---

## 1. Lifecycle of Clinical Evidence
Every piece of information (session transcript snippet, assessment result, or document) follows a strict state-based lifecycle to ensure clinical integrity.

### Decision States
*   **Neutral (Discovery):** Items in the Review Queue that have not yet been evaluated.
*   **Accepted:** The clinician validates the item. It is actively moved into the `acceptedMappings` state, making it available for clinical synthesis in the **Analysis** workspace.
*   **Declined (Rejected):** The clinician explicitly discounts the evidence. A mandatory rationale is required. Rejected items are excluded from further processing and diagnostic interpretation.
*   **Deferred:** The item is moved to a temporary "Deferred" category. 
    *   *Functional Purpose:* Allows clinicians to signal that more context is needed (e.g., waiting for another session) without permanently rejecting the data.
    *   *Requirement:* Deferred items must eventually be resolved (Accepted or Rejected) to achieve a "Complete" review status.

---

## 2. Transition requirements (Gating)

### A. Entering the Evidence Workspace
*   **Path:** Documents/Sessions -> Evidence.
*   **Requirements:** 
    *   An active client must be selected.
    *   An active Assessment must be initialized (`AssessmentGate` check).
    *   The system must have processed at least one artifact (Session, Assessment, or Document).

### B. Moving from Evidence to Analysis
*   **Path:** Evidence -> Analysis.
*   **Gatekeeping Logic:** 
    *   The system tracks `currentRequiredProgress`. 
    *   **Requirement:** All primary clinical sessions, required diagnostic criteria, and uploaded assessments must be in an `Accepted` or `Rejected` state.
    *   Items in the `Deferred` state act as a soft block, signaling that the evidence base is incomplete.

### C. Moving from Analysis to Report
*   **Path:** Analysis -> Report.
*   **The Hub (Analysis) Logic:**
    1.  **Hypothesis Framing:** If enabled, the user must record their own clinical hypothesis *before* the system filters its interpretation. This prevents automation bias.
    2.  **Uncertainty Assessment:** If the `acceptedMappings` have low confidence scores (< threshold), the user is warned that diagnostic uncertainty is high.
    3.  **Gatekeeping Action:** The user must click **"Formulate Impression"**. This sets `impressionFormulated = true` in the `WorkspaceAlertsContext`, signaling that the synthesis is complete.

---

## 3. The Report Finalization Flow
The Report is the final regulatory and clinical output. It contains secondary gates:

1.  **Sequential Review Gate:**
    *   *Requirement:* The user must mark five critical sections as "Reviewed" (Formulation, Evidence, Caveats, Next Steps, Missing Info). 
    *   *Impact:* The "Download Report" button remains locked until 100% review completeness is achieved.

2.  **Completeness Audit:**
    *   *Requirement:* The system compares `acceptedMappings` against the `REPORT_MAPPING_IDS`.
    *   *Alert:* If evidence was accepted in the Evidence Workspace but is not technically mapped into the report template, a **Completeness Warning Modal** appears.
    *   *Audit Trail:* The user can "Download anyway," but the event is logged into the audit trail as a clinical gap.

---

## 4. Audit & Cognitive Loop Tracking
Threadline tracks the user's progress through a 6-step **Cognitive Loop**:
1.  **Evidence Review:** Actively reviewing items in the queue.
2.  **Reliability Evaluation:** At least one item is accepted.
3.  **Conflict Resolution:** All evidence conflicts have been addressed.
4.  **Hypothesis Formation:** Clinician has submitted their hypothesis in the Analysis hub.
5.  **Uncertainty Assessment:** The final impression is formulated or deferred.
6.  **Decision and Output:** The report is approved and downloaded.

Each transition is timestamped and logged for clinical audit purposes.
