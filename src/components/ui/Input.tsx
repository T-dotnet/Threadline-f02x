import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative w-full group", containerClassName)}>
        {label && (
           <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] uppercase tracking-wider font-bold text-text-secondary z-10 transition-colors group-focus-within:text-primary">
             {label}
           </span>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-md border border-divider bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
