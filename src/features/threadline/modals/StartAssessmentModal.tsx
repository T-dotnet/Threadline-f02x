/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  ClipboardCheck, 
  Search, 
  Copy, 
  Check, 
  ChevronRight,
  Info
} from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Typography } from "../../../components/ui/Typography";
import { Badge } from "../../../components/ui/Badge";
import { ModalHeader } from "./shared/ModalHeader";
import { FormField } from "./shared/FormField";
import { ModalFooter } from "./shared/ModalFooter";
import { SearchableSelect } from "../../../components/ui/SearchableSelect";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "../mockData";
import { cn } from "../../../lib/utils";

interface AssessmentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
}

const ASSESSMENT_TEMPLATES: AssessmentTemplate[] = [
  { 
    id: "gad-7", 
    name: "GAD-7 (Generalized Anxiety Disorder)", 
    description: "Evaluates the presence and severity of general anxiety symptoms over the past two weeks.",
    category: "Anxiety"
  },
  { 
    id: "phq-9", 
    name: "PHQ-9 (Patient Health Questionnaire)", 
    description: "Multipurpose instrument for screening, diagnosing, monitoring and measuring the severity of depression.",
    category: "Depression"
  },
  { 
    id: "wai", 
    name: "WAI (Working Alliance Inventory)", 
    description: "Assesses the therapeutic bond and agreement on therapy goals.",
    category: "Clinical Alliance"
  },
  { 
    id: "asrs-6", 
    name: "ASRS-6 (Adult ADHD Screening)", 
    description: "Screening scale for adult ADHD based on DSM-V criteria.",
    category: "Neurodivergence"
  },
  { 
    id: "dass-21", 
    name: "DASS-21 (Depression Anxiety Stress Scale)", 
    description: "Measures the negative emotional states of depression, anxiety and stress.",
    category: "General Health"
  },
];

interface StartAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
  onStart: (assessment: any) => void;
}

export function StartAssessmentModal({ isOpen, onClose, clientId, onStart }: StartAssessmentModalProps) {
  const [selectedClient, setSelectedClient] = useState(clientId || "");
  const [search, setSearch] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  React.useEffect(() => {
    if (clientId && isOpen) {
      setSelectedClient(clientId);
    }
  }, [clientId, isOpen]);

  // Extract existing assessment titles for the selected client
  const existingAssessmentTitles = useMemo(() => {
    if (!selectedClient) return [];
    const clientData = MOCK_CLIENT_DATA[selectedClient];
    if (!clientData || !clientData.assessments) return [];
    return clientData.assessments.map(a => a.title.toUpperCase());
  }, [selectedClient]);

  const filteredTemplates = ASSESSMENT_TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleStart = () => {
    if (!selectedTemplateId || !selectedClient) return;
    const template = ASSESSMENT_TEMPLATES.find(t => t.id === selectedTemplateId);
    onStart({
      ...template,
      clientId: selectedClient,
      status: 'not-started',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width={600}
    >
      <ModalHeader 
        title="Start New Assessment" 
        subtitle="Assign a standardized clinical assessment to your client. The selected assessment will be registered in the client's workspace."
      />

      <div className="space-y-6">
        <FormField label="Assign to Client">
          <SearchableSelect 
            options={MOCK_CLIENTS.map(c => ({ value: c.id, label: c.name }))}
            value={selectedClient}
            onChange={setSelectedClient}
            placeholder="Search and select a client..."
          />
        </FormField>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="label-micro" className="text-text-secondary uppercase">Available Assessments</Typography>
            <div className="relative w-48">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-disabled" />
              <input 
                type="text" 
                placeholder="Filter assessments..." 
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-divider rounded-md outline-none focus:ring-1 focus:ring-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-[320px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            {filteredTemplates.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-divider">
                <Typography variant="body-sm" className="text-text-disabled">No assessments match your search.</Typography>
              </div>
            ) : (
              filteredTemplates.map((template) => {
                const isExisting = existingAssessmentTitles.some(title => 
                  template.name.toUpperCase().includes(title) || title.includes(template.id.toUpperCase())
                );

                return (
                  <div 
                    key={template.id}
                    onClick={() => {
                      if (!isExisting) {
                        setSelectedTemplateId(template.id);
                      }
                    }}
                    className={cn(
                      "p-4 border rounded-xl transition-all relative group",
                      isExisting 
                        ? "border-divider bg-slate-50/50 cursor-not-allowed opacity-70"
                        : cn(
                            "cursor-pointer",
                            selectedTemplateId === template.id 
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                              : "border-divider bg-white hover:border-slate-300 hover:bg-slate-50"
                          )
                    )}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Typography variant="body-sm" className={cn("font-bold text-text-primary", isExisting && "text-text-secondary")}>
                            {template.name}
                          </Typography>
                          <Badge variant="soft" className="text-[9px] uppercase tracking-wider py-0 px-1.5">
                            {template.category}
                          </Badge>
                          {isExisting && (
                            <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-none text-[9px] uppercase tracking-wider py-0 px-1.5">
                              Existing
                            </Badge>
                          )}
                        </div>
                        <Typography variant="body-sm" className="text-[11px] text-text-secondary leading-relaxed">
                          {template.description}
                        </Typography>
                      </div>
                    </div>
                    
                    {!isExisting && selectedTemplateId === template.id && (
                      <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-l-full" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <ModalFooter 
          onCancel={onClose}
          onConfirm={handleStart}
          confirmLabel="Assign Assessment"
          confirmIcon={<ClipboardCheck size={18} />}
          isConfirmDisabled={!selectedClient || !selectedTemplateId}
        />
      </div>
    </Modal>
  );
}
