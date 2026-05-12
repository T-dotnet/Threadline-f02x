import React from "react";
import { Typography } from "../../../../components/ui/Typography";

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
}

export function ModalHeader({ title, subtitle }: ModalHeaderProps) {
  return (
    <div className="space-y-1 mb-6">
      <Typography variant="h3" className="text-text-primary">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body-sm" className="text-text-secondary">
          {subtitle}
        </Typography>
      )}
    </div>
  );
}
