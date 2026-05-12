/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CSSProperties, ReactNode, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, X, Check } from "lucide-react";
import { COLORS, STATUS_COLORS, GUIDELINE_COLORS } from "../../constants";
import { Badge } from "../ui/Badge";

export function Icon({ d, size = 20, color = "currentColor", className = "", style }: { d: string; size?: number; color?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={`shrink-0 ${className}`} style={style}>
      <path d={d} />
    </svg>
  );
}

export function StatusChip({ status, center }: { status: string; center?: boolean; [key: string]: any }) {
  const { bg, c } = STATUS_COLORS[status] || { bg: COLORS.GL, c: COLORS.GM };
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${center ? 'mx-auto' : ''}`}
      style={{ backgroundColor: bg, color: c }}
    >
      {status}
    </span>
  );
}

export function GlChip({ label, ...props }: { label: string; [key: string]: any }) {
  const { bd, c } = GUIDELINE_COLORS[label] || { bd: COLORS.GM, c: COLORS.GM };
  return (
    <span 
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap"
      style={{ borderColor: bd, color: c }}
      {...props}
    >
      {label}
    </span>
  );
}

export function DUChip({ status, ...props }: { status: string; [key: string]: any }) {
  const isSls = status === "Active";
  const isStaged = status === "Staged";
  
  const bg = isSls ? "bg-green-50" : isStaged ? "bg-blue-50" : "bg-red-50";
  const text = isSls ? "text-green-700" : isStaged ? "text-blue-700" : "text-red-700";
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${bg} ${text}`}>
      {status}
    </span>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={onChange}
        className={`w-9 h-3.5 rounded-full relative border-none cursor-pointer transition-colors duration-200 flex items-center p-0 ${checked ? 'bg-[#06302c]' : 'bg-black/38'}`}
      >
        <motion.div 
          animate={{ x: checked ? 16 : -2 }} 
          className="w-5 h-5 rounded-full bg-white shadow-md absolute left-0"
        />
      </button>
      {label && <span className="text-base text-[#0f172a] font-medium">{label}</span>}
    </div>
  );
}

export function FilterChip({ label, onRemove }: { label: string; onRemove: (e: any) => void; [key: string]: any }) {
  return (
    <span className="inline-flex items-center gap-1 bg-black/5 rounded-full pl-2.5 pr-1 py-0.5 text-xs text-[#0f172a] whitespace-nowrap">
      {label.length > 20 ? label.slice(0, 20) + "…" : label}
      <button 
        onClick={onRemove} 
        className="bg-transparent border-none cursor-pointer flex items-center p-0.5 text-[#0f172a]/60 hover:text-[#0f172a] transition-colors"
      >
        <X size={13} />
      </button>
    </span>
  );
}

export function SimpleDropdown({ label, value, options, onChange, width = 160 }: { label: string; value: string; options: string[]; onChange: (v: string) => void; width?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative shrink-0" style={{ width }}>
      <button 
        onClick={() => setOpen(o => !o)} 
        className="flex items-center gap-1 border border-[#0f172a]/12 rounded bg-white cursor-pointer px-3 py-2 w-full text-sm text-[#0f172a] relative text-left min-h-[44px]"
      >
        <span className="absolute -top-2 left-2.5 bg-white px-1 text-[11px] text-[#0f172a]/60">{label}</span>
        <span className="flex-1 truncate mr-4">{value}</span>
        <ChevronDown size={20} className="text-[#0f172a]/60 absolute right-1.5 top-1/2 -translate-y-1/2" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div onClick={() => setOpen(false)} className="fixed inset-0 z-10" />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-[#0f172a]/12 rounded shadow-lg z-20 overflow-hidden"
            >
              {options.map(o => (
                <div 
                  key={o} 
                  onClick={() => { onChange(o); setOpen(false); }}
                  className={`px-3.5 py-2 cursor-pointer text-sm text-[#0f172a] hover:bg-black/5 transition-colors ${o === value ? 'bg-[#e8f0ef]' : ''}`}
                >
                  {o}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MultiDropdown({ label, value, options, onToggle, width = 160 }: { label: string; value: string[]; options: string[]; onToggle: (v: string) => void; width?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative shrink-0" style={{ width }}>
      <button 
        onClick={() => setOpen(o => !o)} 
        className="flex items-center gap-1 border border-[#0f172a]/12 rounded bg-white cursor-pointer px-3 py-2 w-full text-sm text-[#0f172a] relative text-left min-h-[44px]"
      >
        <span className="absolute -top-2 left-2.5 bg-white px-1 text-[11px] text-[#0f172a]/60">{label}</span>
        <span className="flex-1 truncate mr-4">
          {value.length === 0 ? "None" : value.length === 1 ? value[0] : `${value.length} selected`}
        </span>
        <ChevronDown size={20} className="text-[#0f172a]/60 absolute right-1.5 top-1/2 -translate-y-1/2" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div onClick={() => setOpen(false)} className="fixed inset-0 z-10" />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-[calc(100%+4px)] left-0 w-[320px] bg-white border border-[#0f172a]/12 rounded shadow-lg z-20 overflow-y-auto max-h-[400px] p-1"
            >
              {options.map(o => (
                <div 
                  key={o} 
                  onClick={() => onToggle(o)}
                  className={`px-3 py-2 rounded cursor-pointer text-sm text-[#0f172a] flex items-center gap-2.5 transition-colors hover:bg-black/5 ${value.includes(o) ? 'bg-[#06302c]/5' : ''}`}
                >
                  <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${value.includes(o) ? 'bg-[#06302c] border-[#06302c]' : 'bg-white border-[#0f172a]/60'}`}>
                    {value.includes(o) && <Check size={12} color="white" />}
                  </div>
                  {o}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Accordion({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#0f172a]/12 rounded p-4">
      <button 
        onClick={() => setOpen(o => !o)} 
        className="flex justify-between items-center w-full bg-transparent border-none cursor-pointer p-0 gap-4 group"
      >
        <span className="text-xl font-medium text-[#0f172a] tracking-tight text-left leading-relaxed">{title}</span>
        {open ? <ChevronUp size={24} className="text-[#0f172a] shrink-0" /> : <ChevronDown size={24} className="text-[#0f172a] shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#0f172a]/12 mt-3 pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
