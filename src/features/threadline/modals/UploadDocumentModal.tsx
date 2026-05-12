import React, { useState, useRef } from "react";
import { Upload, Check } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Typography } from "../../../components/ui/Typography";
import { Select } from "../../../components/ui/Select";
import { cn } from "../../../lib/utils";
import { ModalHeader } from "./shared/ModalHeader";
import { ModalFooter } from "./shared/ModalFooter";
import { FormSection } from "./shared/FormSection";
import { FormField } from "./shared/FormField";
import { SearchableSelect } from "../../../components/ui/SearchableSelect";
import { MOCK_CLIENTS } from "../mockData";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (docData: { name: string; type: string; file: File | null }) => void;
  clientId?: string;
}

export function UploadDocumentModal({ isOpen, onClose, onUpload, clientId }: UploadDocumentModalProps) {
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("Intake Form");
  const [selectedClient, setSelectedClient] = useState(clientId || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (clientId && isOpen) {
      setSelectedClient(clientId);
    }
  }, [clientId, isOpen]);

  const documentTypes = [
    { label: "Intake Form", value: "Intake Form" },
    { label: "Consent Form", value: "Consent Form" },
    { label: "Assessment Result", value: "Assessment Result" },
    { label: "Clinical Note", value: "Clinical Note" },
    { label: "External Referral", value: "External Referral" },
    { label: "Correspondence", value: "Correspondence" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!docName) setDocName(e.target.files[0].name.split('.')[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      if (!docName) setDocName(e.dataTransfer.files[0].name.split('.')[0]);
    }
  };

  const handleSubmit = () => {
    if (docName && docType && selectedClient) {
      onUpload({ name: docName, type: docType, file: selectedFile });
      resetForm();
    }
  };

  const resetForm = () => {
    setDocName("");
    setDocType("Intake Form");
    setSelectedClient("");
    setSelectedFile(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width={500}
    >
      <ModalHeader 
        title="Upload Document" 
        subtitle="Add clinical documents, referral letters, or assessment results to the client profile."
      />

      <div className="space-y-6">
        <FormSection title="Client Assignment">
          <FormField label="Assign to Client">
            <SearchableSelect 
              options={MOCK_CLIENTS.map(c => ({ value: c.id, label: c.name }))}
              value={selectedClient}
              onChange={setSelectedClient}
              placeholder="Select a client..."
            />
          </FormField>
        </FormSection>

        <FormSection title="Document Details">
          <FormField label="Document Name">
            <Input 
              placeholder="Enter document title..." 
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="h-11"
            />
          </FormField>

          <FormField label="Document Type">
            <Select 
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="h-11"
            >
              {documentTypes.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </FormField>
        </FormSection>

        <FormSection title="File Source">
           <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-3 text-center cursor-pointer group",
              isDragging ? "border-primary bg-primary/5" : "border-divider hover:border-primary/50 hover:bg-slate-50",
              selectedFile ? "border-success/50 bg-success/5" : ""
            )}
            onClick={() => fileInputRef.current?.click()}
           >
             <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
             />
             
             {selectedFile ? (
               <>
                 <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                   <Check size={24} />
                 </div>
                 <div>
                    <Typography variant="body" className="font-medium text-success">{selectedFile.name}</Typography>
                    <Typography variant="body-sm" className="text-text-disabled">
                      Click or drag to replace file
                    </Typography>
                 </div>
               </>
             ) : (
               <>
                 <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-text-secondary group-hover:scale-110 transition-transform">
                   <Upload size={28} />
                 </div>
                 <div>
                    <Typography variant="body" className="font-medium">Click to upload or drag & drop</Typography>
                    <Typography variant="body-sm" className="text-text-disabled text-[11px]">
                      PDF, DOCX, JPG, PNG (Max 10MB)
                    </Typography>
                 </div>
               </>
             )}
           </div>
        </FormSection>

        <ModalFooter 
          onCancel={onClose}
          onConfirm={handleSubmit}
          confirmLabel="Complete Upload"
          isConfirmDisabled={!docName || !selectedFile || !selectedClient}
        />
      </div>
    </Modal>
  );
}
