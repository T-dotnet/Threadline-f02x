import React, { useState } from "react";
import { User, Phone, Mail, Hash, UserPlus, ShieldCheck, Plus } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { ModalHeader } from "./shared/ModalHeader";
import { ModalFooter } from "./shared/ModalFooter";
import { FormSection } from "./shared/FormSection";
import { FormField } from "./shared/FormField";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: any) => void;
}

export function AddClientModal({ isOpen, onClose, onAdd }: AddClientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    externalId: "",
    phone: "",
    email: "",
    referredBy: "",
    consentObtained: "Pending",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (formData.name) {
      onAdd({
        ...formData,
        id: formData.externalId || Math.random().toString(36).substr(2, 9),
      });
      setFormData({
        name: "",
        externalId: "",
        phone: "",
        email: "",
        referredBy: "",
        consentObtained: "Pending",
      });
      onClose();
    }
  };

  const consentOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Yes (Digital)", value: "Yes (Digital)" },
    { label: "Yes (Physical Copy)", value: "Yes (Physical Copy)" },
    { label: "Declined", value: "Declined" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width={600}
    >
      <ModalHeader 
        title="Add New Client" 
        subtitle="Create a new client profile. You can add more detailed clinical information once the profile is created."
      />

      <div className="space-y-8">
        <FormSection title="Basic Information">
          <FormField label="Full Name" icon={<User size={16} />}>
            <Input 
              placeholder="e.g. Sarah Jenkins" 
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
              placeholder="client@email.com" 
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
          <FormField label="Consent Status" icon={<ShieldCheck size={16} />}>
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
          onConfirm={handleAdd}
          confirmLabel="Create Profile"
          confirmIcon={<Plus size={18} />}
          isConfirmDisabled={!formData.name}
        />
      </div>
    </Modal>
  );
}
