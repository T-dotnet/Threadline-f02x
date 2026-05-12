/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowLeft, Edit2, Share2, MoreVertical, FileText, Activity, Clock, ChevronRight } from "lucide-react";
import { 
  Button, 
  Typography,
  Badge,
  Separator,
} from "../../ui";
import { DetailViewLayout } from "../../../features/threadline/components/DetailViewLayout";
import { Breadcrumbs } from "../../../features/threadline/Breadcrumbs";
import { DataPoint } from "../../ui/DataPoint";

export function DetailViewTemplate() {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Header Mockup (outside layout for demo) */}
      <div className="p-4 bg-white border-b border-divider flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-slate-400">
            <ArrowLeft size={18} />
          </Button>
          <Breadcrumbs crumbs={["Entities", "Patient Profiles", "John Archer"]} />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Share2 size={14} />}>Share</Button>
          <Button variant="brand" size="sm" icon={<Edit2 size={14} />}>Modify Profile</Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <DetailViewLayout 
          title="John Archer"
          subtitle="Primary contact for Case #902. Active patient since February 2026."
          onBack={() => {}}
          backLabel="Back to Registry"
          headerBadges={<Badge variant="success" className="px-2 py-0.5">Verified</Badge>}
          metaBanner={[
            { label: "Account ID", value: "#902-X-2" },
            { label: "Last Update", value: "4h ago" },
            { label: "Location", value: <span className="flex items-center gap-1.5 font-bold text-primary italic">Sydney Office <ChevronRight size={10} /></span> }
          ]}
        >
          {/* Main Content Area */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-divider p-8 shadow-sm h-[600px] flex items-center justify-center italic text-slate-300">
              Main content workspace area (Assessments, Graphs, Notes, etc.)
            </div>
          </div>
        </DetailViewLayout>
      </div>
    </div>
  );
}
