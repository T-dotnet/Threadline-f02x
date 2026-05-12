import * as React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  color?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, color = "#06302c", ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}
        {...props}
      >
        <motion.div
          className="h-full w-full flex-1 transition-all"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
