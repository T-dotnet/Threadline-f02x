/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLORS, ICON_PATHS } from "../../../constants";
import { Icon } from "../../../components/common/UIElements";
import { DecisionUnit } from "../../../types";

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

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUnit: (unit: Partial<DecisionUnit>) => void;
  initialRuleType?: string;
}

export function AddUnitModal({ isOpen, onClose, onAddUnit, initialRuleType }: AddUnitModalProps) {
  const [selectedRuleType, setSelectedRuleType] = useState(RULE_TYPES[0]);
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [explanation, setExplanation] = useState("Explain what this rule means clinically and how it should be interpreted.");
  const [pop, setPop] = useState("Both");
  const [source, setSource] = useState("ICD-11");
  const [sourceLink, setSourceLink] = useState("example.com");

  // Sync state if initialRuleType or isOpen changes
  useEffect(() => {
    if (isOpen) {
      if (initialRuleType) {
        // Find the closest match in RULE_TYPES or use as is if it's broad
        const match = RULE_TYPES.find(r => r.startsWith(initialRuleType) || initialRuleType.startsWith(r.split(' ')[0]));
        const finalType = match || initialRuleType;
        setSelectedRuleType(finalType);
        setUnit(finalType.toLowerCase().includes("duration") ? "Months" : "Count");
      } else {
        const defaultType = RULE_TYPES[0];
        setSelectedRuleType(defaultType);
        setUnit(defaultType.toLowerCase().includes("duration") ? "Months" : "Count");
      }
      setValue("");
      // Reset form on open
      setExplanation("Explain what this rule means clinically.");
    }
  }, [isOpen, initialRuleType]);

  const handleSubmit = () => {
    const finalLogic = explanation.length > 80 ? explanation.substring(0, 80) + "..." : explanation;
    onAddUnit({
      type: selectedRuleType,
      logic: value ? `${selectedRuleType}: ${value} ${unit}` : finalLogic,
      explanation: explanation,
      pop: pop,
      source: source,
      sourceLink: sourceLink,
      status: "Draft",
      group: selectedRuleType.split(' ')[0]
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
              background: "rgba(0,0,0,0.5)",
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)"
            }}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 600,
                maxHeight: "90vh",
                background: "white",
                borderRadius: 8,
                boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
            >
              {/* Header */}
              <div style={{
                padding: "20px 24px",
                borderBottom: `1px solid ${COLORS.DIV}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 500, color: "rgba(0,0,0,0.87)" }}>
                  {selectedRuleType.includes("Duration") ? "Add Duration Unit" : "Add Decision Unit"}
                </span>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <Icon d={ICON_PATHS.close} size={20} color="black" />
                </button>
              </div>

              {/* Body */}
              <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  
                  {/* Rule Type Selector */}
                  <div style={{ position: "relative", width: "100%" }}>
                    <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "0 12px", display: "flex", alignItems: "center", position: "relative" }}>
                      <select 
                        value={selectedRuleType}
                        onChange={(e) => setSelectedRuleType(e.target.value)}
                        style={{ 
                          width: "100%", border: "none", background: "transparent", padding: "16px 0", 
                          fontFamily: "'Poppins', sans-serif", fontSize: 16, color: "rgba(0,0,0,0.87)",
                          appearance: "none", outline: "none", cursor: "pointer", zIndex: 2
                        }}
                      >
                        {RULE_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <div style={{ position: "absolute", right: 12, pointerEvents: "none", zIndex: 1 }}>
                        <Icon d={ICON_PATHS.chevD} size={10} color="rgba(0,0,0,0.56)" />
                      </div>
                    </div>
                    <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px", zIndex: 3 }}>
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.6)", letterSpacing: 0.15 }}>Rule type</p>
                    </div>
                  </div>

                  {/* Form Content - Simplified from sidebar for modal view */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                     {/* Row: Value/Unit */}
                     <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ position: "relative", flex: 1 }}>
                          <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "14px 12px" }}>
                            <input 
                              type="text" 
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                              placeholder="e.g. 6" 
                              style={{ width: "100%", border: "none", outline: "none", fontSize: 16 }} 
                            />
                          </div>
                          <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px" }}>
                            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.6)" }}>Value</p>
                          </div>
                        </div>
                        <div style={{ position: "relative", flex: 1 }}>
                          <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "14px 12px" }}>
                             <input 
                              type="text" 
                              value={unit}
                              onChange={(e) => setUnit(e.target.value)}
                              style={{ width: "100%", border: "none", outline: "none", fontSize: 16 }} 
                             />
                          </div>
                          <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px" }}>
                            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.6)" }}>Unit</p>
                          </div>
                        </div>
                     </div>

                     {/* Explanation */}
                     <div style={{ position: "relative" }}>
                        <textarea 
                          value={explanation}
                          onChange={(e) => setExplanation(e.target.value)}
                          style={{ 
                            width: "100%", minHeight: 100, border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, 
                            padding: "14px 12px", fontFamily: "inherit", fontSize: 16, outline: "none", resize: "none"
                          }} 
                        />
                        <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px" }}>
                          <p style={{ fontSize: 12, color: "rgba(0,0,0,0.6)" }}>Clinical Explanation</p>
                        </div>
                     </div>

                     {/* Pop / Source */}
                     <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ position: "relative", flex: 1 }}>
                          <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "14px 12px" }}>
                            <select value={pop} onChange={e => setPop(e.target.value)} style={{ width: "100%", border: "none", outline: "none", background: "none" }}>
                              <option>Both</option><option>Adult</option><option>Pediatric</option>
                            </select>
                          </div>
                          <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px" }}>
                            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.6)" }}>Population</p>
                          </div>
                        </div>
                        <div style={{ position: "relative", flex: 1 }}>
                           <div style={{ border: "1px solid rgba(0,0,0,0.23)", borderRadius: 4, padding: "14px 12px" }}>
                            <select value={source} onChange={e => setSource(e.target.value)} style={{ width: "100%", border: "none", outline: "none", background: "none" }}>
                              <option>ICD-11</option><option>DSM-5-TR</option>
                            </select>
                          </div>
                          <div style={{ position: "absolute", top: -8, left: 12, background: "white", padding: "0 4px" }}>
                            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.6)" }}>Source</p>
                          </div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: "16px 24px", borderTop: `1px solid ${COLORS.DIV}`, display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button onClick={onClose} style={{ padding: "10px 24px", border: "none", background: "none", color: COLORS.P, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
                <button 
                  onClick={handleSubmit}
                  style={{ padding: "10px 24px", border: "none", borderRadius: 4, background: COLORS.P, color: "white", fontWeight: 500, cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                >
                  Create Rule
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
