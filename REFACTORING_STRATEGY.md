# Analysis App Consolidation & Refactoring Strategy

## 1. Goal
The primary objective is to make the codebase more maintainable, scalable, and consistent. As new pages and features are created, they should rely on a shared foundation of components and abstractions, reducing duplication and technical debt. Importantly, this strategy must ensure that the existing UI and UX remain completely unchanged.

## 2. Observations
*   **Duplicate Workspace Components:** There are multiple variations of similar layout components, such as `SessionListWorkspace` vs `MainSessionListWorkspace` and `EvidenceWorkspace` alongside `DocumentsWorkspace`. The basic structure of these screens (header, flexible container, sidebar/main content flow) is reinvented.
*   **Atypical Inline Styling:** Components like `ReviewItem.tsx` heavily use inline styles (`style={{ padding: "16px 24px", background: ... }}`) instead of the established Tailwind CSS paradigm. This makes theming and responsive design difficult and creates subtle inconsistencies.
*   **Hardcoded Colors and Magic Numbers:** Certain colors (`BRAND`, `BRAND_LIGHT`, exact hex codes for text colors) are redefined locally or managed outside of the standard Tailwind theme extensions. Magic numbers for padding and sizing exist within inline styles and specialized classes.
*   **Duplicate Logic:** Review Queue lists and similar item renders (such as mapping evidence, transcripts, or status pills) duplicate logic in multiple files (e.g. `EvidenceWorkspace`, `SessionListWorkspace`).
*   **Missing Generic Components:** Complex UI fragments (like the `EntityCard` and the workspace layout wrappers) try to handle too many responsibilities depending on their context.

## 3. Consolidation & Refactoring Strategy

### A. Component Unification & Generalization
1.  **Extract Shared Workspace Shell:**
    *   Create a robust, generalized `WorkspaceLayout` component built on top of `WorkspaceContainer`. It should standardize the header section (`SectionHeader`), the navigation/tab bar (`TabBar`), the main content area, and the sidebar wrapper. 
    *   Migrate `SessionListWorkspace`, `DocumentsWorkspace`, and `EvidenceWorkspace` to utilize this single shell.
2.  **Harmonize Entity & Card Components:**
    *   Refactor `EntityCard.tsx`, `AssessmentCard.tsx`, and standard list items to share a basic `BaseCard` component. This base component will handle hover states, borders, and rounded corners to guarantee uniform depth mapping.
3.  **Standardize Status Badging:**
    *   Consolidate `StatusBadge`, `ConfidenceBadge`, and raw `Badge` usages to ensure they use a single design system function for rendering colors and icons based on defined severity maps (info, success, warning, destructive).

### B. Inline Style Eradication & Tailwind Migration
1.  **Refactor `ReviewItem` and others:**
    *   Replace all inline styles in components (specifically `ReviewItem.tsx`) with dynamic Tailwind CSS classes wrapped in the `cn()` utility.
    *   Map the existing interactive feedback constants (`ACCEPTED_BG`, `REJECTED_BG`, `BRAND_LIGHT`, etc.) direct to semantic Tailwind variables or extend them in the Tailwind config to preserve the exact UI aesthetics.

### C. State & Logic Extraction
1.  **Custom Hooks for Shared Workflows:**
    *   Extract the sorting, transforming, grouping (e.g., grouping evidence items by diagnostic framework), and filtering logic out of React templates into reusable utility functions or custom hooks (e.g., `useGroupedEvidence()`).
    *   Pull out duplicate mapping and reduction behaviors currently living inside JSX expressions into well-tested pure functions.

### D. Architectural Reorganization
1.  **Directory Restructuring in Features:**
    *   Current domain logic and presentational sub-components are intermixed within `src/features/threadline`. We should consider moving smaller, domain-agnostic UI fragments up to `src/components/ui` or `src/components/shared`.
    *   Sub-divide the `threadline` directory further logically (e.g., `/threadline/workspaces`, `/threadline/cards`, `/threadline/hooks`).

By executing this approach sequentially, we can establish a firmer foundation. We will replace underlying structures silently while maintaining contract interfaces, guaranteeing that the visual representation and functional interaction (UX/UI) of the product remains identical.
