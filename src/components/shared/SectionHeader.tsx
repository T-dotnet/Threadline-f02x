/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { Typography } from "../ui";
import { cn } from "../../lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  small?: boolean;
  className?: string;
}

export function SectionHeader({ title, subtitle, actions, small, className }: SectionHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-1",
      className
    )}>
      <div className="space-y-1">
        <Typography 
          variant={small ? "h2" : "h1"} 
          className={cn(
            small && "font-sans"
          )}
        >
          {title}
        </Typography>
        {subtitle && (typeof subtitle === 'string' ? <Typography variant="sub">{subtitle}</Typography> : subtitle)}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
