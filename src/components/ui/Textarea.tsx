import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  containerClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative w-full group", containerClassName)}>
        {label && (
           <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] uppercase tracking-wider font-bold text-text-secondary z-10 transition-colors group-focus-within:text-primary">
             {label}
           </span>
        )}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-divider bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
