/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { Button, Typography } from "../ui";
import { StatusBadge } from "../shared/StatusBadge";
import { cn } from "../../lib/utils";

interface WorkspaceHeaderProps {
  title: string;
  subtitle: string;
  status: any;
  onBack?: () => void;
  actions?: React.ReactNode;
  alerts?: React.ReactNode;
}

export function WorkspaceHeader({ 
  title, 
  subtitle, 
  status, 
  onBack,
  actions,
  alerts
}: WorkspaceHeaderProps) {
  return (
    <div className="px-6 md:px-[60px] pt-[60px] pb-6 bg-white border-b border-divider flex flex-col sm:flex-row justify-between items-start gap-4">
      <div className="flex gap-4">
        {onBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="mt-1 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} className="text-text-secondary" />
          </Button>
        )}
        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <Typography variant="h1" className="m-0 font-serif text-5xl">{title}</Typography>
            <Typography variant="code" className="text-xs text-text-secondary font-bold tracking-wider">{subtitle}</Typography>
          </div>
          
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            <div className="flex items-center gap-2">
              {alerts}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actions}
      </div>
    </div>
  );
}
