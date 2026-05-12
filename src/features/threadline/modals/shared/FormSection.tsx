import React from "react";
import { Typography } from "../../../../components/ui/Typography";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2;
}

export function FormSection({ title, children, className = "", columns = 1 }: FormSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <Typography 
        variant="label-micro" 
        className="text-text-secondary uppercase font-bold tracking-wider block border-b border-divider pb-1"
      >
        {title}
      </Typography>
      <div className={columns === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
        {children}
      </div>
    </div>
  );
}
