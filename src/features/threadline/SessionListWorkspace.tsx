import React, { useState } from "react";
import { 
  Plus as AddIcon, 
  ChevronRight, 
  Play, 
  SkipBack, 
  Volume2, 
  Maximize, 
  Maximize2, 
  Info, 
  X, 
  Copy, 
  Edit3,
  Search,
  Calendar,
  ArrowLeft as BackArrow,
  Download as DownloadIcon,
  Trash2,
  Edit2
} from "lucide-react";
import { DIVIDER } from "./constants";
import { SimpleDropdown } from "../../components/common/UIElements";
import { EmptyState } from "../../components/shared/EmptyState";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";

import { MOCK_CLIENT_DATA, MOCK_CLIENTS } from "./mockData";

import { SectionHeader } from "../../components/shared/SectionHeader";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { EntityCard, TabBar, DetailViewLayout } from "./components";
import { 
  Button, 
  Card, 
  Typography, 
  Input, 
  Badge,
  DataPoint,
  Modal
} from "../../components/ui";
import { cn } from "../../lib/utils";
import { CreateSessionModal } from "./modals/CreateSessionModal";
import { CreateClinicalEvidenceModal } from "./Modals";

export function SessionListWorkspace({
  selectedSession,
  onSessionSelect,
  onBack,
  subHeaderContent
}: {
  selectedSession: any;
  onSessionSelect: (session: any) => void;
  onBack: () => void;
  subHeaderContent?: React.ReactNode;
}) {
  const { activeClientId } = useFeatureFlags();
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const clientData = activeClientId ? MOCK_CLIENT_DATA[activeClientId] : null;

  const initialSessions = clientData?.sessions?.map((s, idx) => ({
    id: s.id || `#SESSION-${idx + 1}`,
    timestamp: s.date,
    description: s.focus,
    notes: s.notes,
    evidence: s.evidence
  })) || [];

  const [sessions, setSessions] = useState(initialSessions);

  // Sync with mock data when client changes
  React.useEffect(() => {
    setSessions(initialSessions);
  }, [activeClientId]);

  const handleSessionCreate = (sessionInfo: { type: 'new' | 'existing', code?: string }) => {
    const newSession = {
      id: sessionInfo.type === 'existing' ? sessionInfo.code! : `#SESSION-${sessions.length + 1}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: sessionInfo.type === 'existing' ? `Added Session: ${sessionInfo.code}` : "New Clinical Session",
      notes: "Telehealth session automatically initialized.",
      evidence: []
    };
    
    setSessions([newSession, ...sessions]);
    setIsCreateModalOpen(false);
  };

  if (selectedSession) {
    return <SessionDetail session={selectedSession} onBack={onBack} />;
  }

  const mainContent = (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <SimpleDropdown 
          label="Status"
          value={statusFilter}
          options={["All Status", "Completed", "Scheduled", "Draft"]}
          onChange={setStatusFilter}
          width={200}
        />

        <div className="relative w-full md:w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
          <Input 
            placeholder="Search sessions..." 
            className="pl-10"
          />
        </div>
      </div>
    
      <div className="flex flex-col gap-5 flex-1">
        {sessions.length === 0 ? (
          <EmptyState 
            icon={Calendar}
            title="No sessions recorded"
            description="This client hasn't had any recorded sessions yet. Start a new session to begin collecting clinical data."
            actionLabel="New Session"
            onAction={() => setIsCreateModalOpen(true)}
            className="py-24"
          />
        ) : (
          sessions.map((s, i) => (
            <EntityCard
              key={s.id}
              title={s.description || 'Session details'}
              metadata={[
                { label: "Session ID", value: <span className="lowercase">{s.id}</span> },
                ...(s.timestamp ? [{ label: "Date", value: s.timestamp }] : []),
                ...(s.notes ? [{ label: "Session Summary", value: s.notes }] : [])
              ]}
              statusBadge={<StatusBadge status="completed" />}
              rightAction={<ChevronRight size={24} className="text-text-secondary" />}
              onClick={() => onSessionSelect(s)}
            />
          ))
        )}
      </div>
      
      <CreateSessionModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSessionCreate={handleSessionCreate}
        clientId={activeClientId}
      />
    </div>
  );

  return (
    <div className="pb-16">
      <WorkspaceLayout 
        singleColumn
        title="Session"
        subtitle="Manage telehealth sessions and generate clinical notes seamlessly."
        headerActions={<Button variant="brand" onClick={() => setIsCreateModalOpen(true)}><AddIcon size={18} /> New Session</Button>}
        subHeaderContent={subHeaderContent}
        mainContent={mainContent}
      />
    </div>
  );
}

export function SessionDetail({ session, onBack }: { session: any, onBack: () => void }) {
  const { activeClientId } = useFeatureFlags();
  const clientMeta = activeClientId ? MOCK_CLIENTS.find(c => c.id === activeClientId) : null;
  const [activeTabLeft, setActiveTabLeft] = useState("Context");
  const [activeTabRight, setActiveTabRight] = useState("Transcript");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingContext, setIsEditingContext] = useState(false);

  // New states for Evidence Creation
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceInitialText, setEvidenceInitialText] = useState("");
  const [evidenceInitialTags, setEvidenceInitialTags] = useState<string[]>([]);
  const [editingEvidenceItem, setEditingEvidenceItem] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [localEvidence, setLocalEvidence] = useState(session.evidence || []);

  const transcript = [
    { speaker: "Dr. Marcus Thorne", initials: "MT", time: "00:15", text: "Good morning, Maria. How have you been feeling since our last session?", isClient: false },
    { speaker: "Maria Santos", initials: "MS", time: "00:22", text: "Honestly, Marcus, the pain hasn't really let up. It's making it very difficult to stay focused at my desk and I'm starting to feel quite frustrated with the lack of progress.", isClient: true, tags: ["Physical Symptoms", "Frustration"] },
    { speaker: "Dr. Marcus Thorne", initials: "MT", time: "01:05", text: "I'm sorry to hear that. Does the pain feel any different than it did last week? Is it more sharp, or more of a dull ache today?", isClient: false },
    { speaker: "Maria Santos", initials: "MS", time: "01:20", text: "It's a bit of both. When I sit for more than twenty minutes, it starts as a dull ache in my lower back, but then I get these sharp, shooting pains down my right leg if I try to stand up too quickly.", isClient: true, tags: ["Physical Symptoms", "Pain Patterns"] },
    { speaker: "Dr. Marcus Thorne", initials: "MT", time: "02:45", text: "That sounds very radiating. Have you noticed any numbness or tingling in that leg, or is it purely pain?", isClient: false },
    { speaker: "Maria Santos", initials: "MS", time: "03:10", text: "Sometimes a little tingling in my toes, usually late in the afternoon. It's really affecting my sleep too. I can't find a comfortable position to lie in for long.", isClient: true, tags: ["Physical Symptoms", "Sleep Difficulty"] },
    { speaker: "Dr. Marcus Thorne", initials: "MT", time: "04:30", text: "Poor sleep definitely makes everything feel more intense. How are you managing that frustration you mentioned earlier? Is it spilling over into other areas?", isClient: false },
    { speaker: "Maria Santos", initials: "MS", time: "05:05", text: "A little bit. I'm shorter with my partner than I'd like to be. I just want to be able to go for a run again, you know? It's been my main way to de-stress for years.", isClient: true, tags: ["Relationship Impact", "Loss of Activities"] },
    { speaker: "Dr. Marcus Thorne", initials: "MT", time: "06:15", text: "Understandable. Losing that outlet is a big deal. Let's talk about the specific exercises I gave you last time. Have you been able to do any of them?", isClient: false },
    { speaker: "Maria Santos", initials: "MS", time: "06:40", text: "I've tried the gentle stretches. The cat-cow one feels okay in the moment, but the standing forward fold is definitely a no-go. It feels like my back is just going to lock up.", isClient: true, tags: ["Physical Limitations", "Exercise Tolerance"] },
  ];

  const handleOpenEvidenceModal = (text: string, tags: string[] = []) => {
    setEvidenceInitialText(text);
    setEvidenceInitialTags(tags);
    setEditingEvidenceItem(null);
    setIsEvidenceModalOpen(true);
  };

  const handleEditEvidenceModal = (item: any) => {
    setEditingEvidenceItem(item);
    setIsEvidenceModalOpen(true);
  };

  const handleDeleteEvidence = (id: string) => {
    const updated = localEvidence.filter((e: any) => e.id !== id);
    setLocalEvidence(updated);
    if (session) {
      session.evidence = updated;
    }
  };

  const handleCreateEvidence = (newEvidence: any) => {
    let updated;
    if (editingEvidenceItem) {
      updated = localEvidence.map((e: any) => e.id === newEvidence.id ? newEvidence : e);
    } else {
      updated = [newEvidence, ...localEvidence];
    }
    setLocalEvidence(updated);
    if (session) {
      session.evidence = updated;
    }
  };

  return (
    <DetailViewLayout
      onBack={onBack}
      backLabel="Back to Sessions"
      title={session.description || 'Session Details'}
      subtitle={
        <Typography variant="code" className="text-[13px] text-text-secondary">
          {session.id}{session.timestamp ? ` • ${session.timestamp}` : ''}
        </Typography>
      }
      headerBadges={
        <>
          <StatusBadge status="completed" />
        </>
      }
      headerActions={
        <Button variant="brand" className="shrink-0">
          <DownloadIcon size={18} /> Download Session Info
        </Button>
      }
      metaBanner={[
        { label: "Patient Name", value: clientMeta?.name || "Unknown Patient" },
        { label: "Date of Birth", value: "17 Dec 2001 (24y)" },
        { label: "Clinician", value: "Dr. Marcus Thorne" },
        { label: "Duration", value: "45 minutes" },
      ]}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column: Video & Info */}
        <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
          {/* Video Player */}
          <Card className="p-0 border-divider overflow-hidden shadow-sm bg-slate-900 aspect-video relative group shrink-0">
            {/* Video Header */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/40 to-transparent flex justify-between items-center text-white z-10">
              <span className="text-sm font-medium drop-shadow-md">
                {clientMeta?.name || "Client"} #{clientMeta?.id || ""}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="soft" className="bg-red-500/20 text-red-400 border-none text-[10px] font-bold">REC</Badge>
                <Info size={16} className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
              </div>
            </div>

            {/* Video Placeholder */}
            <div className="absolute inset-0 flex gap-0.5 p-0.5">
               <div className="flex-1 bg-slate-800 relative overflow-hidden group/view">
                  <img 
                     src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600&auto=format&fit=crop" 
                     alt="Clinician" 
                     className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover/view:scale-105" 
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">Clinician</div>
               </div>
               <div className="flex-1 bg-slate-700 relative overflow-hidden group/view">
                  <img 
                     src="https://images.unsplash.com/photo-1543132220-3ce99c5ae93c?q=80&w=600&auto=format&fit=crop" 
                     alt="Client" 
                     className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover/view:scale-105" 
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">Client</div>
               </div>
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="w-16 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white shadow-xl transition-all scale-100 active:scale-95 pointer-events-auto cursor-pointer border border-white/20">
                  <Play size={24} fill="currentColor" />
               </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
              <div className="h-1 bg-white/20 rounded-full mb-3 relative overflow-hidden cursor-pointer group/progress">
                 <div className="absolute left-0 top-0 bottom-0 w-[35%] bg-primary" />
                 <div className="absolute left-[35%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transition-transform scale-0 group-hover/progress:scale-100" />
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-5">
                    <Play size={18} fill="currentColor" className="cursor-pointer hover:text-primary transition-colors" />
                    <SkipBack size={18} className="cursor-pointer hover:text-primary transition-colors" />
                    <Volume2 size={18} className="cursor-pointer hover:text-primary transition-colors" />
                    <span className="text-xs font-medium tabular-nums shadow-sm">5:07 / 15:28</span>
                 </div>
                 <div className="flex items-center gap-5">
                    <span className="text-[10px] font-bold border border-white/40 px-1 py-0 rounded-sm opacity-80">HD</span>
                    <Maximize className="cursor-pointer hover:text-primary transition-colors" size={18} />
                 </div>
              </div>
            </div>
          </Card>

          {/* Session Documentation */}
          <Card className="p-0 border-divider overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
            <div className="p-4 border-b border-divider bg-slate-50/50 flex justify-between items-center">
              <div className="flex gap-4">
                {["Context", "Progress Note", "Risk Assessment"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTabLeft(tab)}
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-wider transition-colors",
                      activeTabLeft === tab ? "text-primary border-b-2 border-primary pb-1" : "text-text-disabled hover:text-text-secondary"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {activeTabLeft === "Context" && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn("h-7 px-2 hover:bg-primary/5", isEditingContext ? "text-primary bg-primary/10" : "text-text-secondary hover:text-primary")}
                    onClick={() => setIsEditingContext(!isEditingContext)}
                  >
                    <Edit3 size={14} />
                  </Button>
                )}
                {(activeTabLeft === "Progress Note" || activeTabLeft === "Risk Assessment") && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn("h-7 px-2 hover:bg-primary/5", isEditingNotes ? "text-primary bg-primary/10" : "text-primary")}
                    onClick={() => setIsEditingNotes(!isEditingNotes)}
                  >
                    <Edit3 size={14} />
                  </Button>
                )}
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
               {activeTabLeft === "Context" && (
                 <div className="space-y-6">
                 <div className="space-y-2">
                    <Typography variant="label-micro" className="text-text-secondary">Session Context</Typography>
                    {isEditingContext ? (
                      <textarea 
                        className="w-full text-sm text-text-primary leading-relaxed bg-white p-4 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-y" 
                        defaultValue="The session was conducted via telehealth. The client appeared in their home environment, which seemed stable. \nMaria expressed some anxiety regarding physical limitations but remained willing to engage in diagnostic questioning.\nClinical observation indicates consistent discomfort when shifting position."
                      />
                    ) : (
                      <Typography variant="body" className="text-text-primary leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                       The session was conducted via telehealth. The client appeared in their home environment, which seemed stable. 
                       Maria expressed some anxiety regarding physical limitations but remained willing to engage in diagnostic questioning.
                       Clinical observation indicates consistent discomfort when shifting position.
                      </Typography>
                    )}
                 </div>

                 <div className="space-y-2">
                    <Typography variant="label-micro" className="text-text-secondary">Reason For Referral</Typography>
                    {isEditingContext ? (
                      <textarea 
                        className="w-full text-sm text-text-primary leading-relaxed bg-white p-4 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[60px] resize-y" 
                        defaultValue="The Client Is Being Referred For Further Evaluation Due To Persistent Lower Back Pain That Has Not Improved With Initial Management."
                      />
                    ) : (
                      <Typography variant="body" className="text-text-primary leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                       The Client Is Being Referred For Further Evaluation Due To Persistent Lower Back Pain That Has Not Improved With Initial Management.
                      </Typography>
                    )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-divider">
                   <div className="space-y-2">
                      <Typography variant="label-micro" className="text-text-secondary">Referred To</Typography>
                      {isEditingContext ? (
                        <select className="w-full text-sm text-text-primary bg-white p-2.5 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                          <option>Dr. John Reyes (Orthopedic Specialist)</option>
                          <option>Dr. Emily Chen (Neurologist)</option>
                          <option>Dr. Sarah Miller (Physical Therapist)</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">JR</div>
                          <div>
                             <Typography variant="body" className="font-bold text-primary">Dr. John Reyes</Typography>
                             <Typography variant="label-micro" className="text-slate-400 normal-case font-normal">Orthopedic Specialist</Typography>
                          </div>
                        </div>
                      )}
                   </div>

                   <div className="space-y-2">
                      <Typography variant="label-micro" className="text-text-secondary">Referred By</Typography>
                      {isEditingContext ? (
                        <select className="w-full text-sm text-text-primary bg-white p-2.5 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                          <option>NP Anna Dela Cruz</option>
                          <option>Dr. Michael Thorne</option>
                          <option>Self Referral</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">AC</div>
                          <Typography variant="body" className="font-bold">NP Anna Dela Cruz</Typography>
                        </div>
                      )}
                   </div>
                 </div>
                </div>
               )}

               {activeTabLeft === "Progress Note" && (
                 <div className="space-y-6">
                  <div className="space-y-2">
                     <Typography variant="label-micro" className="text-text-secondary">Summary</Typography>
                     {isEditingNotes ? (
                       <textarea 
                         className="w-full text-sm text-text-primary leading-relaxed bg-white p-4 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px] resize-y" 
                         defaultValue="Maria Reports Ongoing Pain For 3 Weeks, Rated 6/10. No Red Flags Noted. Basic Assessment Completed, And Initial Interventions Provided. Further Assessment By A Specialist Is Recommended."
                       />
                     ) : (
                       <Typography variant="body" className="text-text-primary leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        Maria Reports Ongoing Pain For 3 Weeks, Rated 6/10. No Red Flags Noted. Basic Assessment Completed, And Initial Interventions Provided. Further Assessment By A Specialist Is Recommended.
                       </Typography>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Typography variant="label-micro" className="text-text-secondary">Session Observations</Typography>
                     {isEditingNotes ? (
                       <textarea 
                         className="w-full text-sm text-text-primary leading-relaxed bg-white p-4 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-y" 
                         defaultValue="Client appeared engaged but noted increased discomfort during prolonged sitting. Affect was congruent with reported pain levels." 
                       />
                     ) : (
                       <Typography variant="body" className="text-text-primary leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        Client appeared engaged but noted increased discomfort during prolonged sitting. Affect was congruent with reported pain levels.
                       </Typography>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Typography variant="label-micro" className="text-text-secondary">Clinical Findings</Typography>
                     {isEditingNotes ? (
                       <textarea 
                         className="w-full text-sm text-text-primary leading-relaxed bg-white p-4 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-y" 
                         defaultValue="Range of motion remains limited in lumbar extension. Muscle guarding noted in the right paraspinal region. No neurological deficits identified during this session." 
                       />
                     ) : (
                       <Typography variant="body" className="text-text-primary leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        Range of motion remains limited in lumbar extension. Muscle guarding noted in the right paraspinal region. No neurological deficits identified during this session.
                       </Typography>
                     )}
                  </div>
                 </div>
               )}

               {activeTabLeft === "Risk Assessment" && (
                 <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                    <DataPoint label="Overall Risk Level" value="Low / Stable" />
                    <StatusBadge 
                      status="completed" 
                      label="Minimal Risk" 
                      showIcon={false}
                      className="bg-emerald-100 text-slate-900 border-0"
                    />
                  </div>

                  <div className="space-y-2">
                     <Typography variant="label-micro" className="text-text-secondary">Key Risk Indicators</Typography>
                     {isEditingNotes ? (
                       <textarea 
                         className="w-full text-sm text-text-primary leading-relaxed bg-white p-4 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-y" 
                         defaultValue="No expressed intent of self-harm or harm to others. Client maintains good social supports and is future-oriented regarding rehabilitation." 
                       />
                     ) : (
                       <Typography variant="body" className="text-text-primary leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        No expressed intent of self-harm or harm to others. Client maintains good social supports and is future-oriented regarding rehabilitation.
                       </Typography>
                     )}
                  </div>
                 </div>
               )}
            </div>
            
            {(activeTabLeft === "Context" && isEditingContext) && (
              <div className="p-4 border-t border-divider bg-slate-50/30 flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setIsEditingContext(false)}>Reset</Button>
                <Button variant="brand" size="sm" onClick={() => setIsEditingContext(false)}>Save Context</Button>
              </div>
            )}
            {(isEditingNotes && (activeTabLeft === "Progress Note" || activeTabLeft === "Risk Assessment")) && (
              <div className="p-4 border-t border-divider bg-slate-50/30 flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(false)}>Reset</Button>
                <Button variant="brand" size="sm" onClick={() => setIsEditingNotes(false)}>Save Session Notes</Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Transcript, Context & Evidence */}
        <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
          {/* Transcript & Evidence Card */}
          <Card className="p-0 border-divider overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
            <div className="p-4 border-b border-divider bg-slate-50/50 flex justify-between items-center">
              <div className="flex gap-4">
                {["Transcript", "Clinical Evidence & Mappings"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTabRight(tab)}
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-wider transition-colors",
                      activeTabRight === tab ? "text-primary border-b-2 border-primary pb-1" : "text-text-disabled hover:text-text-secondary"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-text-secondary hover:text-primary">
                  <Copy size={14} />
                </Button>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {activeTabRight === "Transcript" && (
                <div className="space-y-6 pb-12">
                   <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 border border-slate-100 rounded-lg shrink-0">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     <Typography variant="label-micro" className="text-text-secondary">AI Transcription Active • Confidence 98%</Typography>
                   </div>
                   <div className="space-y-6">
                      {transcript.map((chunk, idx) => (
                        <div key={idx} className="flex gap-4 group/chunk relative">
                           <div className={cn(
                             "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold border",
                             chunk.isClient ? "bg-slate-100 border-slate-200 text-slate-600" : "bg-primary/10 border-primary/20"
                           )}>
                             {chunk.initials}
                           </div>
                           <div className="space-y-1 flex-1">
                              <Typography variant="label-micro" className="text-text-secondary">{chunk.speaker} • {chunk.time}</Typography>
                              <Typography variant="body" className="text-text-primary pr-8">{chunk.text}</Typography>
                           </div>
                           {chunk.isClient && (
                             <button 
                               onClick={() => handleOpenEvidenceModal(chunk.text, chunk.tags || [])}
                               className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-text-disabled hover:text-primary hover:bg-primary/5 transition-all border border-transparent hover:border-primary/20"
                               title="Create Clinical Evidence"
                             >
                                <AddIcon size={16} />
                             </button>
                           )}
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTabRight === "Clinical Evidence & Mappings" && (
                <div className="space-y-6">
                  {localEvidence && localEvidence.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {localEvidence.map((evidence: any) => (
                            <EntityCard 
                              key={evidence.id}
                              title={evidence.type === 'verbatim' ? `"${evidence.text}"` : evidence.text}
                              titleClassName={['verbatim', 'behavioural'].includes(evidence.type) ? "text-base font-bold leading-relaxed text-slate-800" : "font-bold"}
                              metadata={[
                                { label: "Timestamp", value: evidence.timestamp },
                                ...(evidence.tags?.length ? [{ label: "Clinical Tags", value: (
                                  <div className="flex flex-wrap gap-1">
                                    {evidence.tags.map((tag: string) => (
                                      <Badge key={tag} variant="soft" className="px-2 py-0.5 text-xs text-slate-500 font-mono">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}] : [])
                              ]}
                              statusBadge={
                                <div className="flex gap-2 items-center">
                                  <StatusBadge 
                                    status={evidence.type === 'verbatim' ? 'processing' : 'completed'} 
                                    label={evidence.type} 
                                    showIcon={false}
                                    className={evidence.type === 'verbatim' ? "bg-blue-100 text-slate-900 border-0" : "bg-emerald-100 text-slate-900 border-0"}
                                  />
                                  {evidence.isUserGenerated && (
                                    <span className="uppercase text-[10px] tracking-wider font-bold h-5 px-2 rounded flex items-center justify-center border border-[#f44336] text-[#f44336] bg-[#f44336]/10">
                                      USER
                                    </span>
                                  )}
                                </div>
                              }
                              rightAction={evidence.isUserGenerated ? (
                                <div className="flex gap-2 items-center">
                                  <button onClick={(e) => { e.stopPropagation(); handleEditEvidenceModal(evidence); }} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded">
                                    <Edit2 size={14} />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(evidence.id); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ) : undefined}
                              onClick={() => {}}
                              hoverable={true}
                            >
                              {/* Removed indicator line */}
                            </EntityCard>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-divider">
                      <Typography variant="label-micro" className="text-text-disabled uppercase font-bold">No evidence snippets extracted</Typography>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      <CreateClinicalEvidenceModal 
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        onCreate={handleCreateEvidence}
        initialText={evidenceInitialText}
        initialTags={evidenceInitialTags}
        editingItem={editingEvidenceItem}
      />
      <Modal 
        isOpen={!!deleteConfirmId} 
        onClose={() => setDeleteConfirmId(null)} 
        title="Delete Evidence" 
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => { if(deleteConfirmId) handleDeleteEvidence(deleteConfirmId); setDeleteConfirmId(null); }}>Delete</Button>
          </>
        } 
        width={400}
      >
        <div className="py-4">
          <Typography variant="body" className="text-slate-600">Are you sure you want to delete this clinical evidence? This action cannot be undone.</Typography>
        </div>
      </Modal>
    </DetailViewLayout>
  );
}
