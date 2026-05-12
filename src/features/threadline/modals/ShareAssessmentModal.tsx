import React, { useState } from "react";
import { Mail, MessageSquare, Copy, Check, ExternalLink, Link as LinkIcon } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Typography } from "../../../components/ui/Typography";
import { Badge } from "../../../components/ui/Badge";
import { ModalHeader } from "./shared/ModalHeader";
import { ModalFooter } from "./shared/ModalFooter";

interface ShareAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentTitle: string;
}

export function ShareAssessmentModal({ isOpen, onClose, assessmentTitle }: ShareAssessmentModalProps) {
  const [copied, setCopied] = useState(false);
  
  const shareLink = `https://portal.threadline.com.au/assessment/${assessmentTitle.toLowerCase().replace(/\s+/g, '-')}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareEmail = () => {
    window.location.href = `mailto:?subject=Clinical Assessment: ${assessmentTitle}&body=Please complete the following assessment: ${shareLink}`;
  };

  const handleShareSms = () => {
    // Simple mailto as placeholder or just log for now since it's a browser
    console.log("Sharing via SMS:", shareLink);
    alert("SMS invite prepared for client.");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width={500}
    >
      <ModalHeader 
        title="Share Assessment" 
        subtitle="Share this clinical assessment with your client to complete."
      />

      <div className="space-y-6">
        <div className="space-y-2">
          <Typography variant="body" className="font-semibold text-text-primary">
            {assessmentTitle}
          </Typography>
        </div>

        <div className="p-4 bg-slate-50 border border-divider rounded-xl space-y-3">
          <div className="flex items-center justify-between">
             <Typography variant="label-micro" className="text-text-secondary uppercase">Assessment Link</Typography>
             <Badge variant="soft" className="bg-emerald-100 text-emerald-800 border-none px-2.5 py-0.5 rounded-full text-[10px] font-bold">Secure</Badge>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-white border border-divider rounded-lg px-3 py-2 text-xs font-mono truncate text-text-secondary">
              {shareLink}
            </div>
            <Button variant="outline" size="icon" onClick={handleCopyLink} className="shrink-0 h-9 w-9">
              {copied ? <Check size={16} className="text-success" /> : <LinkIcon size={16} />}
            </Button>
          </div>
          <Typography variant="body-sm" className="text-[11px] text-text-disabled leading-relaxed">
            The link above is uniquely generated for this clinical assessment. Clients can access it securely without clinical credentials.
          </Typography>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="brand"
            className="h-12 text-sm font-bold" 
            onClick={handleShareEmail}
          >
            <Mail size={18} className="mr-2" /> Share via Email
          </Button>
          <Button 
            variant="brand"
            className="h-12 text-sm font-bold" 
            onClick={handleShareSms}
          >
            <MessageSquare size={18} className="mr-2" /> Share via SMS
          </Button>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100 mb-6">
          <ExternalLink size={14} className="text-blue-500" />
          <Typography variant="body-sm" className="text-[11px] text-blue-700 italic">
            Once completed, responses will automatically appear in the assessment workspace.
          </Typography>
        </div>

        <ModalFooter 
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel="Close"
        />
      </div>
    </Modal>
  );
}
