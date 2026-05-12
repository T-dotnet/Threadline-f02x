/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Button, Typography } from "../ui";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  icon: any;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className,
  style
}: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "border-2 border-dashed border-divider rounded-2xl flex flex-col items-center justify-center p-16 gap-6 bg-gray-50/20 text-center",
        className
      )}
      style={style}
    >
      <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-text-disabled border border-divider">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      
      <div className="space-y-2 max-w-sm">
        <Typography variant="h3">{title}</Typography>
        <Typography variant="body-sm" className="text-text-secondary leading-relaxed">
          {description}
        </Typography>
      </div>

      {actionLabel && onAction && (
        <Button 
          variant="brand" 
          onClick={onAction}
          className="mt-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
