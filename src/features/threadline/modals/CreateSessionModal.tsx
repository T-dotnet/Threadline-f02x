import React, { useState } from "react";
import { Video, Link as LinkIcon, Hash, ArrowRight, Copy, Check } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Typography } from "../../../components/ui/Typography";
import { Badge } from "../../../components/ui/Badge";
import { Tabs } from "../../../components/ui/Tabs";
import { ModalHeader } from "./shared/ModalHeader";
import { FormField } from "./shared/FormField";
import { ModalFooter } from "./shared/ModalFooter";
import { SearchableSelect } from "../../../components/ui/SearchableSelect";
import { MOCK_CLIENTS } from "../mockData";

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCreate: (sessionInfo: { type: 'new' | 'existing', code?: string }) => void;
  clientId?: string;
}

export function CreateSessionModal({ isOpen, onClose, onSessionCreate, clientId }: CreateSessionModalProps) {
  const [activeTab, setActiveTab] = useState<string>("New Session");
  const [sessionCode, setSessionCode] = useState("");
  const [selectedClient, setSelectedClient] = useState(clientId || "");
  const [copied, setCopied] = useState(false);
  const meetingLink = "https://telehealth.threadline.com/room/clinical-session-xf92";

  React.useEffect(() => {
    if (clientId && isOpen) {
      setSelectedClient(clientId);
    }
  }, [clientId, isOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = ["New Session", "Add Existing"];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width={500}
    >
      <ModalHeader 
        title="Create New Session" 
        subtitle="Choose how you want to start this clinical session. You can create a new meeting room or add an existing one using a code."
      />

      <div className="space-y-6">
        <FormField label="Assign to Client">
          <SearchableSelect 
            options={MOCK_CLIENTS.map(c => ({ value: c.id, label: c.name }))}
            value={selectedClient}
            onChange={setSelectedClient}
            placeholder="Select a client..."
          />
        </FormField>
        <div className="w-full">
          <Tabs 
            tabs={tabs} 
            active={activeTab} 
            onSelect={setActiveTab} 
            className="mb-6 border-b border-divider"
          />

          {activeTab === "New Session" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 bg-slate-50 border border-divider rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                   <Typography variant="label-micro" className="text-text-secondary uppercase font-bold tracking-wider">Meeting Room Link</Typography>
                   <Badge variant="success">Ready</Badge>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white border border-divider rounded-lg px-3 py-2.5 text-xs font-mono truncate text-text-secondary shadow-sm">
                    {meetingLink}
                  </div>
                  <Button variant="outline" size="icon" onClick={handleCopyLink} className="shrink-0 h-10 w-10">
                    {copied ? <Check size={18} className="text-success" /> : <LinkIcon size={18} />}
                  </Button>
                </div>
                <Typography variant="body-sm" className="text-[11px] text-text-disabled leading-relaxed italic">
                  Share this link with your patient to invite them to the telehealth session. The session will automatically start gathering clinical evidence once connected.
                </Typography>
              </div>
              
              <ModalFooter 
                onCancel={onClose}
                onConfirm={() => onSessionCreate({ type: 'new' })}
                confirmLabel="Start Session Now"
                confirmIcon={<Video size={18} />}
                isConfirmDisabled={!selectedClient}
              />
            </div>
          )}

          {activeTab === "Add Existing" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-3">
                <FormField label="Session Code">
                  <Input 
                    placeholder="e.g. SES-9921-X" 
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value)}
                    className="h-12 text-lg font-mono uppercase tracking-widest"
                  />
                </FormField>
                <Typography variant="body-sm" className="text-[11px] text-text-disabled leading-relaxed">
                  Enter the unique 8-digit code provided for the existing session record. This will allow you to continue documentation from a previous intake.
                </Typography>
              </div>

              <ModalFooter 
                onCancel={onClose}
                onConfirm={() => onSessionCreate({ type: 'existing', code: sessionCode })}
                confirmLabel="Add Session"
                confirmIcon={<ArrowRight size={18} />}
                isConfirmDisabled={!sessionCode.trim() || !selectedClient}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
