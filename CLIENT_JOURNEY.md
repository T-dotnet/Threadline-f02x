# Threadline Client Journey Documentation

## Overview
This document outlines the user's journey through the client management system within the Threadline platform. The application is designed to support clinicians in managing client data, diagnostic assessments, and clinical documentation in a streamlined, evidence-informed workflow.

## User Persona
Primary User: Clinical Practitioner / Therapist using Threadline to manage caseloads, perform structured diagnostics, and generate clinical reports.

---

## The User Journey

### Phase 1: Client Discovery & Selection
1.  **Client Dashboard (`ClientListScreen.tsx`)**:
    *   The clinician starts by viewing a list of all assigned clients.
    *   They can search/filter to find a specific client.
    *   Selecting a client transitions the user to the focused workspace for that individual.

### Phase 2: Client Engagement (The Workspace Tabs)
Once a client is selected, the clinician accesses the tabbed workspace, which acts as the hub for all activities related to this individual.

#### 1. Profile (`ProfileWorkspace.tsx`)
*   **Purpose**: Central repository for personal details, contact information, and critical client notes.
*   **Action**: Clinicians update demographic data or review essential background information.

#### 2. Assessments (`AssessmentListScreen.tsx`)
*   **Purpose**: Tracks historical and current diagnostic assessments.
*   **Action**: Clinicians view prior assessments or initiate a *New Assessment* to begin a diagnostic interaction.

#### 3. Documents (`DocumentsWorkspace.tsx`)
*   **Purpose**: File management hub.
*   **Action**: clinicians view, upload, or manage intake forms, previous reports, or clinical letters.

---

## Phase 3: Clinical Deep-Dive (Advanced Workspaces)
These tabs manage the core diagnostic process and evidence synthesis:

#### 4. Evidence Workspace (`EvidenceWorkspace.tsx`)
*   **Purpose**: The heart of the diagnostic interaction.
*   **Workflow**:
    *   Review extracted information from sessions.
    *   Map evidence to diagnostic criteria.
    *   Define necessary next steps.

#### 5. Analysis (`AnalysisWorkspace.tsx`)
*   **Purpose**: Synthesis of information.
*   **Workflow**: Clinician defines hypotheses, evaluates session-level observations, and organizes thoughts before final report generation.

#### 6. Report (`ReportWorkspace.tsx`)
*   **Purpose**: Final diagnostic documentation.
*   **Workflow**: The system compiles analyzed data into a formatted report, which the clinician reviews and downloads for clinical use or record-keeping.
