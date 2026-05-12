import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  containerClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, label, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative w-full group", containerClassName)}>
        {label && (
           <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] uppercase tracking-wider font-bold text-text-secondary z-10 transition-colors group-focus-within:text-primary">
             {label}
           </span>
        )}
        <select
          className={cn(
            "flex h-11 w-full appearance-none rounded-md border border-divider bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within:text-primary" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
