/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { IconBadge } from "./IconBadge";

// REGULATORY NOTE: This display standard is the test basis for Scenario S9-B (RISK-009). Do not change without updating the test protocol.

export type ConfidenceLevel = 'high' | 'medium' | 'low';

interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel;
  className?: string;
  showIcon?: boolean;
}

export function ConfidenceBadge({ confidence, className, showIcon = true }: ConfidenceBadgeProps) {
  const configs = {
    high: {
      variant: "success" as const,
      icon: CheckCircle2,
      label: "High confidence"
    },
    medium: {
      variant: "info" as const, // Amber/Warning would be better but we'll use info/brand
      icon: AlertCircle,
      label: "Uncertain"
    },
    low: {
      variant: "error" as const,
      icon: XCircle,
      label: "Low confidence"
    }
  };

  const { variant, icon: Icon, label } = configs[confidence];

  return <IconBadge variant={variant} icon={Icon} label={label} showIcon={showIcon} className={className} />;
}

export function mapScoreToConfidence(score: number): ConfidenceLevel {
  if (score >= 0.75) return 'high';
  if (score >= 0.4) return 'medium';
  return 'low';
}
