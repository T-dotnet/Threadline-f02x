import React from "react";
import { Typography } from "../../../../components/ui/Typography";
import { cn } from "../../../../lib/utils";

interface FormFieldProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  error?: string;
}

export function FormField({ label, icon, children, className, error }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Typography variant="label" className="text-sm font-medium text-text-secondary text-left block">
        {label}
      </Typography>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled z-10 pointer-events-none">
            {icon}
          </div>
        )}
        {React.isValidElement(children) 
          ? React.cloneElement(children as React.ReactElement<any>, {
              className: cn(
                (children.props as any).className,
                icon ? "pl-10" : ""
              )
            })
          : children}
      </div>
      {error && (
        <Typography variant="label-micro" className="text-danger mt-1">
          {error}
        </Typography>
      )}
    </div>
  );
}
