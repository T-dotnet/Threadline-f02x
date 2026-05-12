export const BRAND = "#06302c";
export const BRAND_LIGHT = "#f8fafc";
export const ACCEPTED_BG = "#f0fdf4";
export const REJECTED_BG = "#fef2f2";
export const DEFERRED_BG = "#fff7ed";
export const DEFERRED_ICON_COLOR = "#f97316";
export const INFO_LIGHT = "#eff6ff";
export const DIVIDER = "#f1f5f9";
export const TEXT_PRIMARY = "#0f172a";
export const TEXT_SECONDARY = "#64748b";
export const TEXT_DISABLED = "#94a3b8";

export const TYPE_SCALE = {
  LabelMicro: { fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.05em", color: "#64748b" },
  BodyStandard: { fontSize: 15, color: "#0f172a", lineHeight: 1.6 },
  HeadingSmall: { fontSize: 16, fontWeight: 600, color: "#0f172a" },
  HeadingHero: { fontSize: 36, fontFamily: "var(--font-serif)", fontWeight: 700, color: "#0f172a", lineHeight: 1.2, letterSpacing: "-0.02em" },
  IdLabel: { fontSize: 13, fontFamily: "var(--font-mono)", color: "#64748b" }
};

export const SPACING_SCALE = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
  32: 32,
};

export const primaryBtn = {
  background: BRAND, 
  color: "white", 
  border: "none", 
  borderRadius: 8,
  padding: "10px 24px", 
  fontSize: 14, 
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600, 
  cursor: "pointer", 
  letterSpacing: "0.01em",
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center",
  gap: 8,
  boxShadow: "0 4px 6px -1px rgba(6, 48, 44, 0.1), 0 2px 4px -2px rgba(6, 48, 44, 0.1)",
  transition: "all 0.2s ease"
};

export const outlineBtn = {
  background: "white", 
  color: TEXT_PRIMARY, 
  border: `1px solid #e2e8f0`, 
  borderRadius: 8,
  padding: "10px 24px", 
  fontSize: 14, 
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600, 
  cursor: "pointer", 
  letterSpacing: "0.01em",
  display: "flex", 
  alignItems: "center",
  justifyContent: "center", 
  gap: 8,
  transition: "all 0.2s ease"
};

export const cardStyle = {
  background: "white",
  border: `1px solid #f1f5f9`,
  borderRadius: 16,
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
  overflow: "hidden"
};

export const cardHeaderStyle = {
  padding: "24px 32px",
  borderBottom: `1px solid #f8fafc`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

export const cardContentStyle = {
  padding: "32px"
};

export const h1Style = {
  margin: "0",
  fontSize: 48,
  fontFamily: "var(--font-serif)",
  fontWeight: 700,
  color: TEXT_PRIMARY,
  lineHeight: 1.1,
  letterSpacing: "-0.03em"
};

export const h1SmallStyle = {
  ...h1Style,
  fontSize: 36,
};

export const subStyle = {
  margin: 0,
  fontSize: 14,
  color: TEXT_SECONDARY,
  lineHeight: 1.5
};

export const FEATURE_CONFIDENCE_THRESHOLD = 0.75;

export const STATUS_CONFIG = {
  // Action Required / Initial States
  'not-started': { label: 'Not Started', bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
  'required': { label: 'Required', bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'missing': { label: 'Missing', bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  
  // Active States
  'in-progress': { label: 'In Progress', bg: '#ecfeff', text: '#0891b2', border: '#a5f3fc' },
  'processing': { label: 'Processing', bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
  
  // Results / Completed States
  'completed': { label: 'Completed', bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  'uploaded': { label: 'Uploaded', bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  'ready': { label: 'Ready', bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  
  // Attention / Alerts
  'conflicts-unresolved': { label: 'Conflicts', bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  'missing-documents': { label: 'Missing Docs', bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  
  // Meta / Helper
  'new': { label: 'New', bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' },
  'optional': { label: 'Optional', bg: '#f8fafc', text: '#94a3b8', border: '#f1f5f9' },
  'clinician': { label: '', bg: '#ecf2eb', text: '#4caf50', border: 'rgba(76, 175, 80, 0.2)' },
  'idle': { label: '', bg: 'transparent', text: 'transparent', border: 'transparent' }
};
