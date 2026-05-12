/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { cn } from "../../lib/utils";

interface WorkspaceContainerProps {
  sidebarContent: React.ReactNode;
  mainContent: React.ReactNode;
  sidebarWidth?: number | string;
  className?: string;
  height?: string;
}

export function WorkspaceContainer({ 
  sidebarContent, 
  mainContent, 
  sidebarWidth = 320,
  className,
  height = "calc(100vh - 280px)"
}: WorkspaceContainerProps) {
  return (
    <div 
      className={cn(
        "bg-white border border-divider rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row",
        className
      )}
      style={{ height }}
    >
      {/* Sidebar Area */}
      <aside 
        className="border-b md:border-b-0 md:border-r border-divider bg-gray-50/30 overflow-y-auto shrink-0 flex flex-col"
        style={{ width: typeof sidebarWidth === 'number' ? `${sidebarWidth}px` : sidebarWidth }}
      >
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-workspace-bg">
        {mainContent}
      </main>
    </div>
  );
}
