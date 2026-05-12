/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { COLORS, ICON_PATHS } from "../../../constants";
import { Icon } from "../../../components/common/UIElements";
import { Condition, DecisionUnit } from "../../../types";

const RULE_TYPES = [
  "Duration / persistence requirement",
  "Symptom threshold",
  "Domain requirement",
  "Functional impairment requirement",
  "Onset requirement",
  "Context / setting requirement",
  "Exclusion rule",
  "Severity classification rule",
  "Modifier (e.g. age, context, presentation)",
  "Differential diagnosis flag",
  "Informational / illustrative rule"
];

interface CoverageSidebarProps {
  onClose: () => void;
  onDimensionClick?: (ruleType: string) => void;
  units: DecisionUnit[];
}

export function CoverageSidebar({ onClose, onDimensionClick, units }: CoverageSidebarProps) {
  const checkOk = (label: string) => {
    return units.some(u => u.type.toLowerCase().startsWith(label.toLowerCase()));
  };

  const dimensions = [
    { l: "Duration / persistence", d: "Minimum symptom duration required" },
    { l: "Symptom threshold", d: "Minimum number of symptoms required" },
    { l: "Domain requirement", d: "Requirements across symptom categories" },
    { l: "Functional impairment", d: "Functional impairment criteria" },
    { l: "Onset requirement", d: "Age or timing of onset rules" },
    { l: "Context / setting", d: "Cross-situational requirements" },
    { l: "Exclusion rule", d: "Differential diagnosis rules" },
    { l: "Severity classification", d: "Subtyping or severity levels" },
  ].map(d => ({ ...d, ok: checkOk(d.l) }));

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 100,
          backdropFilter: "blur(2px)"
        }}
      />
      
      {/* Sidebar Content */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 400,
          background: "white",
          zIndex: 101,
          boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div style={{
          padding: "16px 24px",
          borderBottom: `1px solid ${COLORS.DIV}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 72
        }}>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 24, color: COLORS.TP }}>
            Coverage & Validation
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <Icon d={ICON_PATHS.close} size={20} color="black" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            
            {/* Required Rules Section */}
            <div>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 16, color: COLORS.TP, marginBottom: 16, fontWeight: 500 }}>
                Required Rule Dimensions
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {dimensions.map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => onDimensionClick && onDimensionClick(item.l)}
                    style={{ 
                      display: "flex", gap: 12, padding: "12px 16px", borderRadius: 4, 
                      background: item.ok ? "#edf7ed" : "#fafafa",
                      border: `1px solid ${item.ok ? "transparent" : COLORS.DIV}`,
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ marginTop: 2 }}>
                      {item.ok ? (
                        <Icon d={ICON_PATHS.checkCircle} size={22} color="#8BC34A" />
                      ) : (
                        <div style={{ width: 24, height: 24, borderRadius: 4, border: `1px solid rgba(15,23,42,0.4)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon d={ICON_PATHS.add} size={14} color="rgba(15,23,42,0.56)" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 500, color: item.ok ? "#1e4620" : COLORS.TP }}>{item.l}</p>
                      <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: item.ok ? "#1e4620" : COLORS.TS }}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings Section */}
            <div>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 16, color: "#f57c00", marginBottom: 16, fontWeight: 500 }}>Active Warnings (2)</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                   { l: "Numeric threshold recommended", d: "Symptom threshold rule is currently based on clinical judgment only." },
                   { l: "Impairment settings", d: "Functional impairment should specify at least two environments." }
                ].map((item, i) => (
                  <div key={i} style={{ 
                    display: "flex", gap: 12, padding: "12px 16px", borderRadius: 4, 
                    background: "#fff4e5"
                  }}>
                    <div style={{ marginTop: 2 }}>
                       <Icon d={ICON_PATHS.warning} size={22} color="#F57C00" />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 500, color: "#663c00" }}>{item.l}</p>
                      <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "#663c00" }}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </>
  );
}
