import React, { useState } from "react";
import { 
  Search,
  ChevronDown,
  ClipboardCheck
} from "lucide-react";
import { DIVIDER, TYPE_SCALE, TEXT_PRIMARY, TEXT_SECONDARY, h1Style, subStyle } from "./constants";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./mockData";
import { Button, Card, Typography, Input, TableFooter } from "../../components/ui";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";
import { cn } from "../../lib/utils";
import { ShareAssessmentModal } from "./modals/ShareAssessmentModal";
import { StartAssessmentModal } from "./modals/StartAssessmentModal";
import { AssessmentResultScreen } from "./AssessmentResultScreen";
import { Share2, ExternalLink, ArrowRight } from "lucide-react";

export function MainAssessmentListWorkspace() {
  const [search, setSearch] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isStartAssessmentModalOpen, setIsStartAssessmentModalOpen] = useState(false);
  const [sharingAssessmentTitle, setSharingAssessmentTitle] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);

  const allAssessments = MOCK_CLIENTS.flatMap(client => {
    const clientData = MOCK_CLIENT_DATA[client.id] || { assessments: [] };
    return clientData.assessments.map(assessment => ({
      ...assessment,
      clientName: client.name,
      clientId: client.id,
      leadClinician: client.clinicians[0]
    }));
  });

  const filtered = allAssessments.filter(a => 
    a.clientName.toLowerCase().includes(search.toLowerCase()) || 
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.leadClinician.toLowerCase().includes(search.toLowerCase())
  );

  const mainContent = (
    <div className="flex flex-col h-full">
      {/* Table Controls (Search) */}
      <div className="flex justify-end p-6 bg-gray-50/30 border-b border-divider">
        <div className="relative w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
          <Input 
            placeholder="Search by Clients, Clinicians, or Assessments..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto flex-1">
        <div className="grid grid-cols-[1.5fr_1fr_0.8fr_1fr_0.6fr] px-6 py-4 border-b border-divider bg-gray-50/50">
          <div className="flex items-center gap-1"><Typography variant="label-micro" className="uppercase font-bold text-text-secondary">Assessment Title</Typography> <ChevronDown size={14} className="text-text-disabled" /></div>
          <div className="flex items-center gap-1"><Typography variant="label-micro" className="uppercase font-bold text-text-secondary">Client</Typography></div>
          <div className="flex items-center gap-1"><Typography variant="label-micro" className="uppercase font-bold text-text-secondary">Status</Typography></div>
          <div className="flex items-center gap-1"><Typography variant="label-micro" className="uppercase font-bold text-text-secondary">Lead Clinician</Typography></div>
          <div className="text-right"><Typography variant="label-micro" className="uppercase font-bold text-text-secondary">Action</Typography></div>
        </div>

        {filtered.map((assessment, i) => {
          return (
            <div key={i} className={cn(
              "grid grid-cols-[1.5fr_1fr_0.8fr_1fr_0.6fr] px-6 py-6 items-center transition-colors hover:bg-gray-50/50 group",
              i < filtered.length - 1 ? 'border-b border-divider' : ''
            )}>
              <div className="space-y-1">
                <Typography 
                  variant="body" 
                  className="font-bold text-primary group-hover:underline cursor-pointer decoration-primary/30 underline-offset-4"
                  onClick={() => setSelectedAssessment(assessment)}
                >
                  {assessment.title}
                </Typography>
                {assessment.date && (
                   <Typography variant="label-micro" className="text-text-disabled">{assessment.date}</Typography>
                )}
              </div>
              <div className="space-y-0.5">
                <Typography variant="body-sm" className="text-text-primary font-medium">{assessment.clientName}</Typography>
                <Typography variant="label-micro" className="text-text-disabled">#{assessment.clientId}</Typography>
              </div>
              <div>
                <StatusBadge status={assessment.status.toLowerCase() as any} />
              </div>
              <div className="flex flex-col items-start gap-2">
                <StatusBadge status="clinician" label={assessment.leadClinician} className="normal-case h-6 text-[11px]" />
              </div>
              <div className="text-right flex items-center justify-end gap-3 whitespace-nowrap">
                {(assessment.status.toLowerCase() === 'not-started' || assessment.status.toLowerCase() === 'not started') ? (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSharingAssessmentTitle(assessment.title);
                        setIsShareModalOpen(true);
                      }}
                      className="text-primary font-bold h-8"
                      icon={<Share2 size={14} />}
                    >
                      Share
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-text-secondary hover:text-text-primary font-bold h-8"
                      onClick={() => setSelectedAssessment(assessment)}
                      icon={<ExternalLink size={14} />}
                    >
                      Questionnaire
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary font-bold h-8"
                      onClick={() => setSelectedAssessment(assessment)}
                      iconRight={<ArrowRight size={14} />}
                    >
                      Workspace
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-text-secondary hover:text-text-primary font-bold h-8"
                      onClick={() => setSelectedAssessment(assessment)}
                      icon={<ExternalLink size={14} />}
                    >
                      Questionnaire
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <ShareAssessmentModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        assessmentTitle={sharingAssessmentTitle}
      />

      <StartAssessmentModal 
        isOpen={isStartAssessmentModalOpen}
        onClose={() => setIsStartAssessmentModalOpen(false)}
        onStart={(assessment) => {
          console.log("Starting assessment:", assessment);
        }}
      />

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-divider bg-gray-50/30">
          <TableFooter 
            page={0}
            setPage={() => {}}
            rpp={10}
            setRpp={() => {}}
            total={Math.ceil(filtered.length / 10)}
            s={1}
            e={Math.min(10, filtered.length)}
            count={filtered.length}
          />
      </div>
    </div>
  );

  if (selectedAssessment) {
    return (
      <div className="p-8">
        <AssessmentResultScreen 
          clientId={selectedAssessment.clientId} 
          onBack={() => setSelectedAssessment(null)} 
        />
      </div>
    );
  }

  return (
    <div className="pb-16 pt-8">
      <WorkspaceLayout 
        singleColumn
        contentClassName="p-0"
        title="Assessments"
        small={false}
        subtitle="Track and manage diagnostic assessments for all clients."
        headerActions={
          <Button 
            icon={<ClipboardCheck size={18} />} 
            onClick={() => setIsStartAssessmentModalOpen(true)}
          >
            Start New Assessment
          </Button>
        }
        mainContent={mainContent}
      />
    </div>
  );
}
