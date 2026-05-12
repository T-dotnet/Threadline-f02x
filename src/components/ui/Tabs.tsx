import * as React from "react";
import { cn } from "../../lib/utils";

interface TabsProps {
  tabs: string[];
  active: string;
  onSelect: (tab: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onSelect, className }: TabsProps) {
  return (
    <div className={cn("flex gap-2 w-full", className)}>
      {tabs.map(tab => (
        <button 
          key={tab} 
          onClick={() => onSelect(tab)} 
          className={cn(
            "flex items-center gap-2 px-6 py-4 text-[16px] font-semibold cursor-pointer outline-none transition-all duration-200 border-b-2 hover:opacity-100",
            active === tab 
              ? "text-[#06302c] border-[#06302c] opacity-100" 
              : "text-[#64748b] border-transparent hover:text-[#06302c] opacity-70"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
