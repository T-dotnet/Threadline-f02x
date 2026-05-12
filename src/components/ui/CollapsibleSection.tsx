import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  noCollapse?: boolean;
  bg?: string;
  headerAction?: React.ReactNode;
  iconColor?: string;
  className?: string;
  indicatorColor?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = true,
  noCollapse = false,
  bg = "bg-white",
  headerAction,
  className = "",
  indicatorColor
}) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const isOpen = noCollapse || open;

  return (
    <div className={`border border-slate-100 rounded-xl ${bg} overflow-hidden mb-3 ${className}`}>
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={noCollapse ? undefined : () => setOpen(o => !o)}
          disabled={noCollapse}
          className={`flex items-center gap-2.5 flex-1 w-full text-left outline-none ${noCollapse ? "cursor-default" : "cursor-pointer"}`}
        >
          <div 
            className={`w-2 h-2 shrink-0 rounded-full transition-colors duration-200`} 
            style={{ backgroundColor: indicatorColor || (isOpen ? "#06302c" : "#cbd5e1") }}
          />
          <span className="font-sans text-[15px] font-medium text-[#0f172a] flex-1">{title}</span>
          {!noCollapse && (
            <span className="text-[#64748b] flex items-center ml-auto shrink-0">
              {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </span>
          )}
        </button>
        {headerAction && (
          <div className="flex items-center gap-3">
            {headerAction}
          </div>
        )}
      </div>
      {isOpen && (
        <div className="px-5 pb-5 pl-[38px]">
          {children}
        </div>
      )}
    </div>
  );
};
