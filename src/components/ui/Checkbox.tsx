import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    return (
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-slate-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none checked:bg-[#06302c] checked:border-[#06302c]",
            className
          )}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <Check
          className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
          strokeWidth={4}
        />
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
