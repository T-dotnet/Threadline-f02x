import React, { useState } from "react";
import { 
  Search,
  ChevronDown,
  FileText,
  Upload
} from "lucide-react";
import { DIVIDER, TYPE_SCALE, TEXT_PRIMARY, TEXT_SECONDARY, h1Style, subStyle } from "./constants";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./mockData";
import { Button, Card, Typography, Badge } from "../../components/ui";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { FileTypeBadge } from "../../components/shared/FileTypeBadge";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";
import { UploadDocumentModal } from "./modals/UploadDocumentModal";
import { DocumentDetailsScreen } from "./DocumentDetailsScreen";

export function MainDocumentListWorkspace() {
  const [search, setSearch] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);

  const initialAllDocuments = MOCK_CLIENTS.flatMap(client => {
    const clientData = MOCK_CLIENT_DATA[client.id] || { documents: [] };
    const docs = clientData.documents || [];
    return docs.map(doc => ({
      ...doc,
      clientName: client.name,
      clientId: client.id
    }));
  });

  const [documents, setDocuments] = useState(initialAllDocuments);

  const handleUploadComplete = (docData: { name: string; type: string; file: File | null }) => {
    const newDoc = {
      name: docData.name,
      type: docData.type,
      status: "Uploaded",
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      creationDate: '-',
      version: "v1.0",
      clientName: "General / Unassigned",
      clientId: "000000"
    };
    setDocuments([newDoc, ...documents]);
    setIsUploadModalOpen(false);
  };

  const filtered = documents.filter(d => 
    d.clientName.toLowerCase().includes(search.toLowerCase()) || 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.type.toLowerCase().includes(search.toLowerCase())
  );

  const mainContent = (
    <div className="flex flex-col h-full">
      {/* Table Controls (Search) */}
      <div className="flex justify-end p-6">
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
          <input 
            type="text" 
            placeholder="Search by Client, Type, or Name" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 border border-divider rounded bg-white text-sm outline-none"
          />
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto flex-1">
        <div className="grid grid-cols-[1.5fr_1fr_0.6fr_0.8fr_0.8fr_0.6fr] px-6 py-4 border-b border-divider bg-slate-50 text-[13px] font-semibold text-text-secondary">
          <div className="flex items-center gap-1">Document Name <ChevronDown size={14} /></div>
          <div className="flex items-center gap-1">Client</div>
          <div className="flex items-center gap-1">Status</div>
          <div className="flex items-center gap-1">Type</div>
          <div className="flex items-center gap-1">Upload Date</div>
          <div className="text-right">Action</div>
        </div>

        {filtered.map((doc, i) => {
          return (
            <div key={i} className={`grid grid-cols-[1.5fr_1fr_0.6fr_0.8fr_0.8fr_0.6fr] p-6 items-center ${i < filtered.length - 1 ? 'border-b border-divider' : ''}`}>
              <div>
                <div 
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <FileText size={16} className="text-text-secondary group-hover:text-primary transition-colors" />
                  <span className="text-sm font-bold text-text-primary group-hover:text-primary group-hover:underline transition-all">
                    {doc.name}
                  </span>
                </div>
                <div className="text-xs text-text-secondary mt-1">{doc.version}</div>
              </div>
              <div>
                <div className="text-sm text-text-primary">{doc.clientName}</div>
                <div className="text-xs text-text-secondary">#{doc.clientId}</div>
              </div>
              <div>
                <StatusBadge status={doc.status.toLowerCase() as any} />
              </div>
              <div>
                <FileTypeBadge type={doc.type} />
              </div>
              <div>
                <div className="text-[13px] text-text-primary">{doc.uploadDate || 'N/A'}</div>
              </div>
              <div className="text-right flex items-center justify-end gap-4 whitespace-nowrap">
                <button 
                   onClick={() => setSelectedDocument(doc)}
                   className="text-primary bg-transparent border-none text-sm font-bold cursor-pointer hover:underline"
                >
                  View Document
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Pagination Footer */}
      <div className="px-6 py-5 border-t border-divider flex justify-end items-center gap-4 text-[13px] text-text-secondary">
          <div>Rows per page: <span className="text-text-primary font-medium">10</span> <ChevronDown size={14} className="inline align-middle ml-1" /></div>
          <div className="text-text-primary">1-{filtered.length} of {filtered.length}</div>
          <div className="flex gap-4">
              <button className="bg-transparent border-none cursor-pointer text-text-secondary disabled:opacity-50" disabled>{"<"}</button>
              <button className="bg-transparent border-none cursor-pointer text-text-secondary disabled:opacity-50" disabled={filtered.length <= 10}>{">"}</button>
          </div>
      </div>
    </div>
  );

  if (selectedDocument) {
    return (
      <div className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <DocumentDetailsScreen 
          document={selectedDocument} 
          onBack={() => setSelectedDocument(null)} 
        />
      </div>
    );
  }

  return (
    <div className="pb-16 pt-8">
      <WorkspaceLayout 
        singleColumn
        contentClassName="p-0"
        title="Documents"
        small={false}
        subtitle="View and manage all uploaded documentation across clients."
        headerActions={<Button icon={<Upload size={18} />} onClick={() => setIsUploadModalOpen(true)}>Upload Document</Button>}
        mainContent={
          <>
            {mainContent}
            <UploadDocumentModal 
              isOpen={isUploadModalOpen}
              onClose={() => setIsUploadModalOpen(false)}
              onUpload={handleUploadComplete}
            />
          </>
        }
      />
    </div>
  );
}
