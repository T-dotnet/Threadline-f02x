import * as React from "react";
import { cn } from "../../lib/utils";
import { WorkspaceContainer } from "./WorkspaceContainer";
import { SectionHeader } from "../shared/SectionHeader";
import { TabBar } from "../../features/threadline/TabBar";

export interface WorkspaceLayoutProps {
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  sidebarContent?: React.ReactNode;
  mainContent?: React.ReactNode;
  subHeaderContent?: React.ReactNode;
  sidebarWidth?: number | string;
  height?: string;
  className?: string;
  contentClassName?: string;
  singleColumn?: boolean;
  small?: boolean;
}

export function WorkspaceLayout({
  title,
  subtitle,
  headerActions,
  tabs,
  activeTab,
  onTabChange,
  sidebarContent,
  mainContent,
  subHeaderContent,
  sidebarWidth = 320,
  height,
  className,
  contentClassName = "p-8",
  singleColumn = false,
  small = true,
}: WorkspaceLayoutProps) {
  return (
    <div className="space-y-6 flex flex-col h-full">
      <SectionHeader title={title} subtitle={subtitle} actions={headerActions} small={small} />
      {subHeaderContent}
      {tabs && tabs.length > 0 && activeTab && onTabChange && (
        <TabBar tabs={tabs} active={activeTab} onSelect={onTabChange} />
      )}
      <div className={cn("flex-1", className)}>
        {singleColumn ? (
          <div className="bg-white border border-divider rounded-2xl flex flex-col shadow-sm overflow-hidden" style={{ minHeight: height || "400px" }}>
            <div className={cn("flex-1 overflow-y-auto", contentClassName)}>
              {mainContent}
            </div>
          </div>
        ) : (
          <WorkspaceContainer
            sidebarWidth={sidebarWidth}
            sidebarContent={sidebarContent}
            mainContent={mainContent}
            height={height}
          />
        )}
      </div>
    </div>
  );
}
