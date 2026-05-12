import React, { useState, useRef } from "react";
import { Search, Filter, Plus, MoreVertical, Cpu, CheckCircle, FileText } from "lucide-react";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { DocumentCompletenessModal } from "./modals/DocumentCompletenessModal";
import { UploadDocumentModal } from "./modals/UploadDocumentModal";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { FileTypeBadge } from "../../components/shared/FileTypeBadge";
import { EmptyState } from "../../components/shared/EmptyState";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";
import { EntityCard } from "./components";
import { Button } from "../../components/ui";
import { cn } from "../../lib/utils";

import { REQUIRED_DOCUMENTS, MOCK_DOCUMENTS as fallbackDocuments, MOCK_CLIENT_DATA } from "./mockData";
import { DocumentDetailsScreen } from "./DocumentDetailsScreen";

// Helper to map document names to types for the demo
const mapDocNameToType = (name: string): string => {
  if (name.toLowerCase().includes('letter')) return 'referral-letter';
  if (name.toLowerCase().includes('questionnaire')) return 'parent-questionnaire';
  if (name.toLowerCase().includes('school')) return 'school-report';
  return 'other';
};

export function DocumentsWorkspace({ 
  subHeaderContent,
  onDocumentSelect
}: { 
  subHeaderContent?: React.ReactNode,
  onDocumentSelect?: (doc: any) => void
}) {
  const { flags, activeClientId } = useFeatureFlags();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [missingDocs, setMissingDocs] = useState<string[]>([]);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const clientData = activeClientId ? (MOCK_CLIENT_DATA as any)[activeClientId] : null;
  const initialDocuments = clientData?.documents || fallbackDocuments;

  const [documents, setDocuments] = useState(initialDocuments);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Sync with client change
  React.useEffect(() => {
    setDocuments(initialDocuments);
  }, [activeClientId, initialDocuments]);

  const handleUploadComplete = (docData: { name: string; type: string; file: File | null }) => {
    const newDoc = {
      name: docData.name,
      type: docData.type,
      status: "Uploaded",
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      creationDate: '-',
      version: "v1.0"
    };
    setDocuments([newDoc, ...documents]);
    setIsUploadModalOpen(false);
  };

  const handleStartAnalysis = () => {
    if (!flags.FEATURE_DOCUMENT_COMPLETENESS_GATE) {
      triggerAIProcessing();
      return;
    }

    const currentDocTypes = documents.map((d: any) => mapDocNameToType(d.name));
    const notFound = REQUIRED_DOCUMENTS.filter(req => !currentDocTypes.includes(req));

    if (notFound.length > 0) {
      setMissingDocs(notFound);
      setIsModalOpen(true);
    } else {
      triggerAIProcessing();
    }
  };

  const triggerAIProcessing = (acknowledged = false) => {
    if (acknowledged) {
      // SCOPE NOTE: Log to audit state
      console.info("AUDIT LOG:", {
        timestamp: new Date().toISOString(),
        missingDocuments: missingDocs,
        clinicianAcknowledged: true,
        action: "PROCEED_WITH_MISSING_DOCUMENTS"
      });
    }

    setIsProcessing(true);
    setIsModalOpen(false);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccessVisible(true);
      setTimeout(() => setIsSuccessVisible(false), 3000);
    }, 2000);
  };

  const handleUploadNow = () => {
    setIsModalOpen(false);
    // Focus search or simulation focus of upload area
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const mainContent = (
    <>
      <div className="pb-6 mb-6 flex justify-between items-center gap-4">
        <Button variant="outline" icon={<Filter size={16} />}>
          Filter
        </Button>
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search Document" 
            className="w-full h-11 pl-10 pr-4 border border-divider rounded-lg text-sm outline-none bg-white font-sans text-text-primary placeholder:text-text-disabled focus:border-primary/50" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 min-h-[400px]">
        {documents.length === 0 ? (
          <EmptyState 
            icon={FileText}
            title="No documents found"
            description="This client has no documents uploaded yet. Upload assessment reports or clinical notes to get started."
            actionLabel="Upload File"
            onAction={() => setIsUploadModalOpen(true)}
          />
        ) : (
          documents.map((doc: any, idx: number) => (
            <EntityCard
              key={idx}
              title={doc.name}
              statusBadge={<StatusBadge status={doc.status.toLowerCase() as any} />}
              metadata={
                doc.status.toLowerCase() === 'uploaded' ? [
                  ...(doc.type ? [{ label: "Type", value: <FileTypeBadge type={doc.type} /> }] : []),
                  ...(doc.creationDate && doc.creationDate !== '-' && doc.creationDate !== 'TBD' ? [{ label: "Creation Date", value: doc.creationDate }] : []),
                  ...(doc.uploadDate && doc.uploadDate !== '-' ? [{ label: "Upload Date", value: doc.uploadDate }] : [])
                ] : []
              }
              summary={doc.status.toLowerCase() !== 'uploaded' ? doc.description : undefined}
              rightAction={
                <Button variant="ghost" size="icon" className="text-text-disabled group-hover:text-primary transition-colors">
                  <MoreVertical size={20} />
                </Button>
              }
              onClick={() => onDocumentSelect?.(doc)}
            />
          ))
        )}
      </div>
    </>
  );

  return (
    <div className="pb-16">
      <DocumentCompletenessModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        missingDocuments={missingDocs}
        onProceed={() => triggerAIProcessing(true)}
        onUploadNow={handleUploadNow}
      />

      <UploadDocumentModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadComplete}
        clientId={activeClientId}
      />

      {/* Success Notification */}
      {isSuccessVisible && (
        <div className="fixed top-20 right-8 bg-emerald-50 border border-emerald-500 text-emerald-800 px-6 py-3 rounded-lg shadow-sm flex items-center gap-3 z-[1000]">
          <CheckCircle size={20} />
          <span className="font-semibold">AI Analysis initialized successfully</span>
        </div>
      )}

      <WorkspaceLayout 
        singleColumn
        title="Documents"
        subtitle="View, upload, and manage assessment reports, letters, and clinical documents."
        headerActions={
          <>
            {!flags.FEATURE_SINGLE_HYPOTHESIS && (
              <Button
                variant="brand"
                disabled={isProcessing}
                onClick={handleStartAnalysis}
                className={cn(isProcessing ? "opacity-70 cursor-not-allowed" : "")}
                icon={isProcessing ? <Cpu size={16} className="animate-spin" /> : <Cpu size={16} />}
              >
                {isProcessing ? "Processing..." : "Run AI Analysis"}
              </Button>
            )}
            <Button variant="brand" icon={<Plus size={16} />} onClick={() => setIsUploadModalOpen(true)}>
              Add File
            </Button>
          </>
        }
        subHeaderContent={subHeaderContent}
        mainContent={mainContent}
      />
    </div>
  );
}
