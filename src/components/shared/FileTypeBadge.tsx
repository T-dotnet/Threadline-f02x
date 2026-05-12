import React from 'react';
import { FileText, File as FileIcon, FileType, FileCode } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface FileTypeBadgeProps {
  type: string;
  className?: string;
  showIcon?: boolean;
}

export function FileTypeBadge({ type, className, showIcon = true }: FileTypeBadgeProps) {
  const normalizedType = type.toLowerCase();
  
  let Icon = FileText;
  let variant: "outline" | "default" | "soft" = "outline";
  
  if (normalizedType === 'pdf') {
    Icon = FileText;
    variant = "outline";
  } else if (normalizedType === 'docs' || normalizedType === 'docx') {
    Icon = FileText;
    variant = "outline";
  } else if (normalizedType === 'xls' || normalizedType === 'csv') {
    Icon = FileType;
    variant = "outline";
  } else {
    Icon = FileIcon;
    variant = "outline";
  }

  return (
    <div className={cn("flex items-center gap-1.5 text-text-secondary font-medium", className)}>
      {showIcon && <Icon size={12} className="text-slate-400" />}
      <span className="text-[11px] font-bold uppercase tracking-wider">{type}</span>
    </div>
  );
}
