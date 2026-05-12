/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";

export type ImpactLevel = 'high' | 'medium' | 'low';

interface ImpactBadgeProps {
  impact: ImpactLevel;
  className?: string;
  showIcon?: boolean;
}

export function ImpactBadge({ impact, className, showIcon = true }: ImpactBadgeProps) {
  const configs = {
    high: {
      variant: "success" as const,
      icon: CheckCircle2,
      label: "High impact"
    },
    medium: {
      variant: "info" as const,
      icon: AlertCircle,
      label: "Medium impact"
    },
    low: {
      variant: "error" as const,
      icon: XCircle,
      label: "Low impact"
    }
  };

  const { variant, icon: Icon, label } = configs[impact];

  return (
    <Badge 
      variant={variant} 
      className={cn("gap-1.5 px-3 h-6", className)}
    >
      {showIcon && <Icon size={14} className="shrink-0" />}
      <span className="font-semibold tracking-tight">{label}</span>
    </Badge>
  );
}

export function mapScoreToImpact(score: number): ImpactLevel {
  if (score >= 0.75) return 'high';
  if (score >= 0.4) return 'medium';
  return 'low';
}
