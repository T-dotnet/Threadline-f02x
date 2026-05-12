import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface Option {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  className,
  label,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      {label && (
        <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] uppercase tracking-wider font-bold text-text-secondary z-10 transition-colors">
          {label}
        </span>
      )}
      
      <div 
        className={cn(
          "flex items-center justify-between min-h-11 w-full rounded-md border border-divider bg-white px-3 py-2 text-sm cursor-pointer transition-all hover:border-text-disabled",
          isOpen ? "ring-2 ring-primary ring-offset-1 border-primary" : ""
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={cn("truncate", !selectedOption && "text-text-disabled")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={cn("text-gray-400 transition-transform duration-200", isOpen && "rotate-180 text-primary")} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-divider rounded-md shadow-lg max-h-60 flex flex-col animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-divider sticky top-0 bg-white z-10 rounded-t-md">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded border border-divider focus:outline-none focus:border-primary transition-colors"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div 
                  key={option.value}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between",
                    value === option.value && "bg-primary/5 text-primary font-medium"
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && <Check size={14} />}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-center text-text-disabled">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
