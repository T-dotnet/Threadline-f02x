import React, { useState, useEffect } from "react";
import { User, Phone, Mail, Hash, UserPlus, ShieldCheck, Save, X } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { ModalHeader } from "./shared/ModalHeader";
import { ModalFooter } from "./shared/ModalFooter";
import { FormSection } from "./shared/FormSection";
import { FormField } from "./shared/FormField";
import { cn } from "../../../lib/utils";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: {
    name: string;
    externalId: string;
    phone: string;
    referredBy: string;
    consentObtained: string;
    email: string;
  };
}

export function EditProfileModal({ isOpen, onClose, onSave, initialData }: EditProfileModalProps) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const consentOptions = [
    { label: "Yes (Digital)", value: "Yes (Digital)" },
    { label: "Yes (Physical Copy)", value: "Yes (Physical Copy)" },
    { label: "Pending", value: "Pending" },
    { label: "Declined", value: "Declined" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width={600}
    >
      <ModalHeader 
        title="Edit Client Profile" 
      />

      <div className="space-y-8">
        <FormSection title="Basic Information">
          <FormField label="Full Name" icon={<User size={16} />}>
            <Input 
              placeholder="e.g. Liam O'Sullivan" 
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="h-11"
            />
          </FormField>
        </FormSection>

        <FormSection title="Contact Details" columns={2}>
          <FormField label="Phone Number" icon={<Phone size={16} />}>
            <Input 
              placeholder="+61 000 000 000" 
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="h-11"
            />
          </FormField>

          <FormField label="Email Address" icon={<Mail size={16} />}>
            <Input 
              placeholder="example@mail.com" 
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="h-11"
            />
          </FormField>
        </FormSection>

        <FormSection title="Administrative" columns={2}>
          <FormField label="External ID" icon={<Hash size={16} />}>
            <Input 
              placeholder="ID Number" 
              value={formData.externalId}
              onChange={(e) => handleChange('externalId', e.target.value)}
              className="h-11"
            />
          </FormField>

          <FormField label="Referred By" icon={<UserPlus size={16} />}>
            <Input 
              placeholder="Referrer Name" 
              value={formData.referredBy}
              onChange={(e) => handleChange('referredBy', e.target.value)}
              className="h-11"
            />
          </FormField>
        </FormSection>

        <FormSection title="Clinical Consent">
          <FormField label="Consent Obtained" icon={<ShieldCheck size={16} />}>
            <Select
              value={formData.consentObtained}
              onChange={(e) => handleChange('consentObtained', e.target.value)}
              className="h-11 w-full"
            >
              {consentOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </FormField>
        </FormSection>

        <ModalFooter 
          onCancel={onClose}
          onConfirm={handleSave}
          confirmLabel="Save Changes"
          confirmIcon={<Save size={18} />}
        />
      </div>
    </Modal>
  );
}
