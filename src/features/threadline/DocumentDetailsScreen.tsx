/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  MoreVertical, 
  FileText, 
  Clock, 
  User, 
  Database, 
  ExternalLink,
  History,
  Info,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { 
  Button, 
  Card, 
  Typography, 
  Badge, 
  Separator, 
  Avatar, 
  DataPoint 
} from "../../components/ui";
import { EntityCard } from "./components";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { DetailViewLayout } from "./components/DetailViewLayout";
import { SysBadge } from "../../components/shared/SysBadge";
import { cn } from "../../lib/utils";

interface DocumentDetailsScreenProps {
  document: any;
  onBack: () => void;
}

export function DocumentDetailsScreen({ document, onBack }: DocumentDetailsScreenProps) {
  if (!document) return null;

  const [activeTabEvidence, setActiveTabEvidence] = React.useState("Narrative Summary");

  return (
    <DetailViewLayout
      onBack={onBack}
      backLabel="Back to Documents"
      title={document.name}
      subtitle={
        <Typography variant="code" className="text-[13px] text-text-secondary">
          {document.id || `DOC-${Math.random().toString(36).substring(7).toUpperCase()}`} • Uploaded on {document.uploadDate || 'Jan 12, 2026'}
        </Typography>
      }
      headerBadges={
        <>
          <StatusBadge status={document.status.toLowerCase() as any} />
          <Badge variant="soft" className="bg-blue-100 text-blue-800 border-none font-bold text-[10px] uppercase tracking-wider">
            {document.type}
          </Badge>
        </>
      }
      headerActions={
        <>
          <Button variant="outline" size="sm" icon={<Share2 size={16} />}>Share</Button>
          <Button variant="brand" className="shrink-0" icon={<Download size={18} />}>
            Download Document
          </Button>
        </>
      }
      metaBanner={[
        { label: "Patient Name", value: document.clientName || "Unknown Patient" },
        { label: "Document Type", value: document.type || "Clinical Report" },
        { label: "Source System", value: "EMR Core - Clinical Port" },
        { label: "Compliance", value: "HIPAA Compliant" },
      ]}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column: Document Content */}
        <div className="space-y-8">
          {/* Document Content / Preview Placeholder */}
          <div className="space-y-4">
            <Typography variant="h3">Document Content</Typography>
            <div className="aspect-[3/4] bg-white rounded-2xl border border-divider shadow-inner flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center text-slate-300 opacity-50 group-hover:opacity-70 transition-opacity">
                <FileText size={120} strokeWidth={0.5} />
                <Typography variant="label-micro" className="mt-4 tracking-[0.2em]">PROTECTED CLINICAL MATERIAL</Typography>
              </div>
              <div className="relative z-10 p-12 text-center space-y-4">
                <Typography variant="h2" className="text-slate-400">PDF Preview Not Available</Typography>
                <Typography variant="body-sm" className="max-w-xs mx-auto">
                  For security reasons, full document previews are restricted in the basic workspace view. Please download the file to view original content.
                </Typography>
                <Button variant="outline" className="bg-white" icon={<Download size={16} />}>Download Original {document.type}</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative Summary & History */}
        <div className="space-y-6">
          <Card className="p-0 border-divider overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
            <div className="p-4 border-b border-divider bg-slate-50/50 flex justify-between items-center">
              <div className="flex gap-4">
                {["Narrative Summary", "Key Evidence Findings"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTabEvidence(tab)}
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-wider transition-colors",
                      activeTabEvidence === tab ? "text-primary border-b-2 border-primary pb-1" : "text-text-disabled hover:text-text-secondary"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {activeTabEvidence === "Narrative Summary" && (
                <div className="space-y-4">
                  <Typography variant="body" className="text-text-primary leading-relaxed">
                    {document.description || "The clinical analysis confirms consistent observations of neurodivergent traits. The report highlights significant overlaps in tactile hypersensitivity and social communication challenges, particularly in structured educational settings."}
                  </Typography>
                  <div className="grid grid-cols-1 gap-4 pt-4 border-t border-divider">
                    <div className="space-y-1">
                      <Typography variant="label-micro" className="text-text-secondary uppercase">Clinical Mappings</Typography>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Badge variant="soft" className="bg-slate-100 text-slate-800 border-none">Social-Emotional</Badge>
                        <Badge variant="soft" className="bg-slate-100 text-slate-800 border-none">Sensory Processing</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTabEvidence === "Key Evidence Findings" && (
                <div className="space-y-4">
                  {[
                    { id: '1', text: 'Sensory seeking behavior noted', timestamp: 'p. 4', tags: ['Sensory'] },
                    { id: '2', text: 'Communication delays reported in preschool', timestamp: 'p. 2', tags: ['Communication'] },
                    { id: '3', text: 'Family history of ASD mentioned', timestamp: 'p. 9', tags: ['History'] },
                  ].map((finding) => (
                    <EntityCard
                      key={finding.id}
                      title={finding.text}
                      titleClassName="text-base font-semibold text-slate-800 leading-snug"
                      metadata={[
                        { label: "Reference", value: finding.timestamp },
                        ...(finding.tags?.length ? [{ label: "Tags", value: (
                          <div className="flex flex-wrap gap-1">
                            {finding.tags.map((tag: string) => (
                              <Badge key={tag} variant="soft" className="px-2 py-0.5 text-xs text-slate-500 font-mono">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}] : [])
                      ]}
                      onClick={() => {}}
                      hoverable={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-0 border-divider overflow-hidden shadow-sm">
            <div className="p-4 border-b border-divider bg-slate-50/50 flex justify-between items-center">
              <Typography variant="label-micro" className="text-text-secondary">Version History</Typography>
              <History size={16} className="text-text-disabled" />
            </div>
            <div className="p-0">
              {[
                { v: 'v2.0', date: 'Jan 12, 2026', user: 'Dr. Sarah Wilson', reason: 'AI Extraction Finalized' },
                { v: 'v1.1', date: 'Jan 11, 2026', user: 'Clinical Support', reason: 'Metadata correction' },
                { v: 'v1.0', date: 'Jan 10, 2026', user: 'System Import', reason: 'Initial Upload' }
              ].map((v, i) => (
                <div key={i} className={cn(
                  "p-4 border-divider flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-default",
                  i !== 2 && "border-b"
                )}>
                  <div className="p-2 bg-white border border-divider rounded-lg shrink-0">
                    <Typography variant="label-micro" className="text-primary font-bold">{v.v}</Typography>
                  </div>
                  <div className="flex-1 space-y-1">
                    <Typography variant="body-sm" className="font-bold">{v.reason}</Typography>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-secondary uppercase tracking-wider">
                      <span>{v.date}</span>
                      <span>•</span>
                      <span>{v.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DetailViewLayout>
  );
}
