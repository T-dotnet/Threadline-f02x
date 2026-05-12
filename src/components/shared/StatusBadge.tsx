/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { 
  AlertTriangle, 
  FileX, 
  Clock, 
  CheckCircle, 
  Plus as AddIcon, 
  HelpCircle,
  User
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";

const STATUS_META = {
  'not-started': { label: 'Not Started', variant: 'soft' as const, icon: Clock },
  'required': { label: 'Required', variant: 'info' as const, icon: Clock },
  'missing': { label: 'Missing', variant: 'error' as const, icon: FileX },
  'in-progress': { label: 'In Progress', variant: 'info' as const, icon: Clock },
  'processing': { label: 'Processing', variant: 'brand' as const, icon: Clock },
  'completed': { label: 'Completed', variant: 'success' as const, icon: CheckCircle },
  'uploaded': { label: 'Uploaded', variant: 'success' as const, icon: CheckCircle },
  'ready': { label: 'Ready', variant: 'success' as const, icon: CheckCircle },
  'conflicts-unresolved': { label: 'Conflicts', variant: 'error' as const, icon: AlertTriangle },
  'missing-documents': { label: 'Missing Docs', variant: 'info' as const, icon: FileX },
  'new': { label: 'New', variant: 'default' as const, icon: AddIcon },
  'optional': { label: 'Optional', variant: 'soft' as const, icon: HelpCircle },
  'clinician': { label: 'Clinician', variant: 'info' as const, icon: User },
  'approved': { label: 'Approved', variant: 'success' as const, icon: CheckCircle },
  'draft': { label: 'Draft', variant: 'default' as const, icon: Clock },
  'deprecated': { label: 'Deprecated', variant: 'error' as const, icon: AlertTriangle },
  'evidence': { label: 'Evidence', variant: 'warning' as const, icon: Clock },
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
  showIcon?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  key?: any;
}

export function StatusBadge({ status, label, className, showIcon = true, onClick, style }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');
  const config = (STATUS_META as any)[normalizedStatus] || STATUS_META['not-started'];
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      className={cn(
        "gap-1 uppercase text-[10px] tracking-wider font-bold h-5 px-2 rounded cursor-default", 
        normalizedStatus === 'evidence' && "text-[#0F172A]",
        onClick && "cursor-pointer", 
        className
      )}
      onClick={onClick}
      style={style}
    >
      {showIcon && <Icon size={12} strokeWidth={2.5} className="shrink-0" />}
      {label || config.label}
    </Badge>
  );
}
