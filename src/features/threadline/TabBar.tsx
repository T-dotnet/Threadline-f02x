import React from 'react';
import { BRAND, TEXT_SECONDARY } from './constants';

interface TabBarProps {
  tabs: string[];
  active: string;
  onSelect: (t: string) => void;
  badges?: Record<string, number>;
}

export function TabBar({ tabs, active, onSelect, badges = {} }: TabBarProps) {
  return (
    <div className="flex gap-2 w-full">
      {tabs.map(tab => (
        <div 
          key={tab} 
          className={`flex ${tab === "Clinical Notes" ? "ml-auto border-l border-slate-200 pl-2" : ""}`}
        >
          <button 
            onClick={() => onSelect(tab)} 
            className={`flex items-center gap-2 px-6 py-4 text-[16px] font-semibold cursor-pointer outline-none transition-all duration-200 ${
              active === tab 
                ? "text-[#06302c] border-b-2 border-[#06302c] mb-[-1px]" 
                : "text-[#64748b] border-b-2 border-transparent hover:text-[#06302c]"
            }`}
          >
            {tab}
            {(badges[tab] ?? 0) > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center ${
                active === tab ? "bg-[#06302c] text-white" : "bg-slate-200 text-slate-500"
              }`}>
                {badges[tab]}
              </span>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
