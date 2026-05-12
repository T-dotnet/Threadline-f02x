import React, { useState, useEffect } from "react";
import { Edit3, Copy, Link } from "lucide-react";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./mockData";
import { Typography, Button, Input } from "../../components/ui";
import { DataPoint } from "../../components/ui";
import { EditProfileModal } from "./modals/EditProfileModal";

export function ProfileWorkspace() {
  const { activeClientId } = useFeatureFlags();
  const clientMeta = MOCK_CLIENTS.find(c => c.id === activeClientId);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: clientMeta?.name || "Liam O'Sullivan",
    externalId: activeClientId || "125566",
    phone: "+61 412 345 678",
    referredBy: "Dr. Alicia Smith",
    consentObtained: "Yes (Digital)",
    email: "liam.osullivan@example.com",
    lastSession: "19/03/2025"
  });

  // Update if client changes
  useEffect(() => {
    if (clientMeta) {
      setProfileData(prev => ({
        ...prev,
        name: clientMeta.name,
        externalId: clientMeta.id
      }));
    }
  }, [activeClientId, clientMeta]);

  const handleSaveProfile = (newData: any) => {
    setProfileData(prev => ({ ...prev, ...newData }));
    setIsEditModalOpen(false);
  };

  const mainContent = (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* Left Column */}
      <div className="flex-1">
        <div className="border-b border-divider pb-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "External ID", value: profileData.externalId },
              { label: "Phone Number", value: profileData.phone },
              { label: "Referred By", value: profileData.referredBy },
              { label: "Consent Obtained", value: profileData.consentObtained },
              { label: "Email Address", value: profileData.email },
              { label: "Last Session", value: profileData.lastSession },
            ].map((item) => (
              <DataPoint key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </div>

        <div>
          <Typography variant="label-micro" className="text-text-disabled uppercase tracking-widest mb-3 block">Clinicians</Typography>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="clinician" label="Primary Clinician" className="text-[11px]" />
            <StatusBadge status="required" label="Secondary Clinician" className="text-[11px]" />
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-[400px] flex flex-col gap-5">
        {/* Meeting Room Link Card */}
        <div className="border border-divider rounded-xl p-6 bg-white">
          <Typography variant="h3" className="mb-1">Meeting Room Link</Typography>
          <Typography variant="code" className="text-xs text-text-disabled mb-4 block">Started 1:43:14 AM</Typography>
          
          <Typography variant="label-micro" className="text-text-disabled uppercase tracking-widest mb-2 block">Client Join link</Typography>
          <div className="flex gap-2 mb-2">
            <div className="flex-1 relative">
              <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
              <input 
                type="text" 
                readOnly 
                value="https://telehealth.threadline.com.au/join/{sessionId}?.." 
                className="w-full pl-9 pr-3 py-2 border border-divider rounded-lg text-xs bg-white text-text-secondary focus:outline-none" 
              />
            </div>
            <button className="p-2 border border-divider rounded-lg text-text-secondary hover:bg-slate-50 transition-colors">
              <Copy size={16} />
            </button>
          </div>
          <Typography variant="label-micro" className="text-text-disabled mb-5 italic block normal-case font-normal">Share this link with your patient to join the session</Typography>
          
          <Button variant="brand" className="w-full justify-center">
            Join Session As Clinician
          </Button>
        </div>

        {/* Consent Link Card */}
        <div className="border border-divider rounded-xl p-6 bg-white">
          <Typography variant="h3" className="mb-1">Consent Link</Typography>
          <Typography variant="body-sm" className="text-text-secondary mb-4">Your privacy is incredibly important to us! Click here to discover how we manage your consent.</Typography>
          
          <Typography variant="label-micro" className="text-text-disabled uppercase tracking-widest mb-2 block">Consent link</Typography>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
              <input 
                type="text" 
                readOnly 
                value="https://telehealth.threadline.com.au/consent/{sessionId}?.." 
                className="w-full pl-9 pr-3 py-2 border border-divider rounded-lg text-xs bg-white text-text-secondary focus:outline-none" 
              />
            </div>
            <button className="p-2 border border-divider rounded-lg text-text-secondary hover:bg-slate-50 transition-colors">
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-16">
      <WorkspaceLayout 
        singleColumn
        title="Client Profile"
        subtitle={`${profileData.name} #${profileData.externalId}`}
        headerActions={
          <Button 
            variant="outline" 
            icon={<Edit3 size={16} />}
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Profile
          </Button>
        }
        mainContent={
          <>
            {mainContent}
            <EditProfileModal 
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSave={handleSaveProfile}
              initialData={profileData}
            />
          </>
        }
      />
    </div>
  );
}

