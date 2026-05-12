import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
        brand: "border-transparent bg-primary text-white hover:opacity-90",
        success: "border-transparent bg-success-light text-success-dark hover:bg-success-light/80",
        info: "border-transparent bg-info-light text-info-dark hover:bg-info-light/80",
        error: "border-transparent bg-error-light text-error-dark hover:bg-error-light/80",
        warning: "border-transparent bg-amber-50 text-amber-700 hover:bg-amber-100",
        soft: "border-transparent bg-gray-100 text-gray-800 font-mono",
        outline: "text-text-primary border-divider",
        ghost: "border-transparent text-text-secondary hover:bg-gray-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  key?: any;
  status?: any; 
  label?: string; 
}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
