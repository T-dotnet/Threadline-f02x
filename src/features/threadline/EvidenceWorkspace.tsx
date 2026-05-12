/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useMemo } from "react";
import { 
  ArrowLeft, 
  RotateCcw, 
  AlertTriangle, 
  AlertCircle, 
  Edit3, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Info,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  FileText,
  BookOpen,
  Tag,
  Maximize2,
  Minimize2,
  ArrowRight,
  ChevronDown,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// UI Components
import {
  Button,
  Badge,
  Card,
  Typography,
  Input,
  Modal,
  Toast,
  DataPoint
} from "../../components/ui";
import { CollapsibleSection } from "../../components/ui/CollapsibleSection";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { ConfidenceBadge, mapScoreToConfidence } from "../../components/shared/ConfidenceBadge";
import { ImpactBadge, mapScoreToImpact } from "../../components/shared/ImpactBadge";
import { SectionHeader } from "../../components/shared/SectionHeader";
import { WorkspaceContainer } from "../../components/layout/WorkspaceContainer";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";
import { cn, normalizeTags } from "../../lib/utils";
import { ProgressBanner } from "./components/ProgressBanner";

// Context & Domain
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { useWorkspaceAlerts } from "../../contexts/WorkspaceAlertsContext";
import { MOCK_EVIDENCE_ITEMS, MOCK_CLIENT_DATA, MOCK_ASSESSMENTS } from "./mockData";
import { FEATURE_CONFIDENCE_THRESHOLD as CONFIDENCE_THRESHOLD } from "./constants";

// Sub-components
import { AssessmentGate } from "./AssessmentGate";
import { ReviewItem } from "./ReviewItem";
import { ModifyModal, SkipNextStepModal, AddEvidenceTypeModal } from "./Modals";
import { ConflictResolutionModal } from "./modals/ConflictResolutionModal";
import { CreateSessionModal } from "./modals/CreateSessionModal";
import { StartAssessmentModal } from "./modals/StartAssessmentModal";
import { UploadDocumentModal } from "./modals/UploadDocumentModal";
import { EntityCard } from "./components";

import { EvidenceWorkspaceCTAs } from "./EvidenceWorkspaceCTAs";

export function EvidenceWorkspace({ 
  onViewProfile, 
  onNavigateToAssessments,
  onNavigateToDocuments,
  onNavigateToSession,
  onUnlockReport,
  clientId = "125566"
}: { 
  onViewProfile?: () => void, 
  onNavigateToAssessments?: () => void,
  onNavigateToDocuments?: () => void,
  onNavigateToSession?: (session: any) => void,
  onUnlockReport?: () => void,
  clientId?: string
}) {
  const { flags } = useFeatureFlags();
  const { setAcceptedMappings, conflicts } = useWorkspaceAlerts();

  const clientData = (MOCK_CLIENT_DATA as any)[clientId];
  const sessions = clientData?.sessions || [];
  
  const [localEvidenceItems, setLocalEvidenceItems] = useState(MOCK_EVIDENCE_ITEMS);
  const [localSessions, setLocalSessions] = useState<any[]>(sessions);

  // Sync localSessions when clientId changes
  React.useEffect(() => {
    setLocalSessions(clientData?.sessions || []);
  }, [clientId, clientData]);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(sessions[0]?.id || null);
  const [activeItemLabel, setActiveItemLabel] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'session' | 'criteria' | 'nextstep' | 'assessment' | 'document' | 'tag'>('session');
  const [groupByUI, setGroupByUI] = useState<'source' | 'tag'>('source');
  const groupBy = flags.FEATURE_HIDE_EVIDENCE_BY_TAG ? 'source' : groupByUI;
  
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isAddEvidenceTypeOpen, setIsAddEvidenceTypeOpen] = useState(false);
  const [addEvidenceType, setAddEvidenceType] = useState<'session' | 'assessment' | 'document' | 'criteria' | 'nextstep'>('criteria');
  const [isAddMode, setIsAddMode] = useState(false);
  const [isSkipOpen, setIsSkipOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [hasSkippedConflicts, setHasSkippedConflicts] = useState(false);
  const [deferredItems, setDeferredItems] = useState<string[]>([]);
  const [acceptedItems, setAcceptedItems] = useState<string[]>([]);
  const [rejectedItems, setRejectedItems] = useState<Record<string, string>>({});

  const [showToast, setShowToast] = useState(false);

  const [activeAction, setActiveAction] = useState<'accept' | 'reject' | 'modify' | 'defer' | null>(null);
  const [rationale, setRationale] = useState("");
  const rationaleRef = useRef<HTMLTextAreaElement>(null);

  // Derived data — memoized to avoid recomputing on every render
  const currentSession = useMemo(
    () => localSessions.find((s: any) => s.id === activeSessionId),
    [localSessions, activeSessionId]
  );
  const criteriaItems = useMemo(() => localEvidenceItems.filter(i => i.type === 'criteria'), [localEvidenceItems]);
  const nextStepItems = useMemo(() => localEvidenceItems.filter(i => i.type === 'nextstep'), [localEvidenceItems]);
  const assessmentItems = useMemo(() => localEvidenceItems.filter(i => i.type === 'assessment'), [localEvidenceItems]);
  const documentItems = useMemo(() => localEvidenceItems.filter(i => i.type === 'document'), [localEvidenceItems]);

  // Compute Tag Groups — only recomputes when source data changes
  const tagGroups = useMemo(() => {
    const allEvidenceSnippets = [
      ...localSessions.flatMap((s: any) => (s.evidence || []).map((f: any) => ({ ...f, sourceSession: s.focus || 'Clinical Snapshot', sourceTimestamp: s.date }))),
      ...assessmentItems.flatMap(a => (a.findings || []).map((f: any) => ({ ...f, sourceSession: a.label, sourceTimestamp: "Apr 21, 2024" }))),
      ...documentItems.flatMap(d => (d.findings || []).map((f: any) => ({ ...f, sourceSession: d.label, sourceTimestamp: "Apr 21, 2024" })))
    ];
    const tagsMap = new Map<string, any[]>();
    allEvidenceSnippets.forEach(snippet => {
      let tags = normalizeTags(snippet.tags ?? snippet.tag);
      if (tags.length === 0) tags = ["untagged"];
      tags.forEach((t: string) => {
        const lowerT = t.toLowerCase();
        if (!tagsMap.has(lowerT)) tagsMap.set(lowerT, []);
        tagsMap.get(lowerT)!.push(snippet);
      });
    });
    return Array.from(tagsMap.entries()).map(([tag, items]) => ({
      id: `tag-${tag}`,
      label: tag.charAt(0).toUpperCase() + tag.slice(1),
      type: 'tag' as const,
      score: "0.95",
      findings: items
    })).sort((a, b) => b.findings.length - a.findings.length);
  }, [localSessions, assessmentItems, documentItems]);

  // Sync state when client changes
  React.useEffect(() => {
    if (localSessions.length > 0) {
      setActiveSessionId(localSessions[0].id);
      setActiveType('session');
      setActiveItemLabel(null);
    } else if (criteriaItems.length > 0) {
      setActiveType('criteria');
      setActiveItemLabel(criteriaItems[0].label);
      setActiveSessionId(null);
    }
  }, [clientId, localSessions.length, criteriaItems.length]);

  React.useEffect(() => {
    if (clientData?.allAccepted) {
      const allRequired = [
        ...localSessions.map((s:any) => s.id),
        ...criteriaItems.map(i => i.label),
        ...assessmentItems.map(i => i.label),
        ...documentItems.map(i => i.label)
      ];
      setAcceptedItems(allRequired);
      
      // Also sync mappings for analysis
      const mappings = [
        ...criteriaItems.map(i => ({ id: i.label, label: i.label, confidence: parseFloat(i.score) || 0 })),
        ...assessmentItems.map(i => ({ id: i.label, label: i.label, confidence: parseFloat(i.score) || 0 })),
        ...documentItems.map(i => ({ id: i.label, label: i.label, confidence: parseFloat(i.score) || 0 }))
      ];
      setAcceptedMappings(mappings);
    } else {
      setAcceptedItems([]);
      setAcceptedMappings([]);
    }
    // Only run when client ID changes to avoid clearing manual progress
  }, [clientId]);
  
  const currentList = useMemo(() => {
    if (activeType === 'session') return [];
    if (activeType === 'tag') return tagGroups;
    if (activeType === 'criteria') return criteriaItems;
    if (activeType === 'assessment') return assessmentItems;
    if (activeType === 'document') return documentItems;
    return nextStepItems;
  }, [activeType, tagGroups, criteriaItems, assessmentItems, documentItems, nextStepItems]);

  const currentItem = useMemo(() => {
    if (activeType === 'session') {
      return currentSession ? { ...currentSession, type: 'session', label: currentSession.focus, findings: currentSession.evidence } : null;
    }
    return currentList.find(i => (i.id || i.label) === activeItemLabel) || null;
  }, [activeType, currentSession, currentList, activeItemLabel]);

  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  const requiredItems = useMemo(() => [
    ...(groupBy === 'source' ? [
      ...localSessions.map((s: any) => s.id),
      ...assessmentItems.map(i => i.label),
      ...documentItems.map(i => i.label)
    ] : tagGroups.map(t => t.id)),
    ...criteriaItems.map(i => i.label)
  ], [groupBy, localSessions, assessmentItems, documentItems, tagGroups, criteriaItems]);

  const totalRequiredItems = requiredItems.length;

  const currentRequiredProgress = useMemo(() =>
    requiredItems.filter(id => acceptedItems.includes(id) || !!rejectedItems[id]).length,
    [requiredItems, acceptedItems, rejectedItems]
  );

  const isAllRequiredReviewed = currentRequiredProgress === totalRequiredItems;

  const isCriteria = activeType === 'criteria';
  const isNextStep = activeType === 'nextstep';
  const isAssessment = activeType === 'assessment';
  const isDocument = activeType === 'document';
  const isTag = activeType === 'tag';
  const itemConfidence = currentItem ? parseFloat(currentItem.score) : 0;
  const activeId = activeType === 'session' ? activeSessionId : activeItemLabel;

  const requiresRationale = (action: 'accept' | 'reject' | 'modify' | 'defer') => {
    if (action === 'reject') return true;
    return false;
  };

  const handleActionClick = (action: 'accept' | 'reject' | 'modify' | 'defer') => {
    if (requiresRationale(action)) {
      setActiveAction(action);
      setRationale("");
      setTimeout(() => rationaleRef.current?.focus(), 50);
    } else {
      if (action === 'accept') handleAccept();
      if (action === 'modify') setIsModifyOpen(true);
      if (action === 'defer') handleDefer();
    }
  };

  const commitAction = () => {
    if (activeAction === 'accept') handleAccept();
    else if (activeAction === 'reject') {
        const id = activeType === 'session' ? activeSessionId : activeItemLabel;
        if (id) {
          setRejectedItems({ ...rejectedItems, [id]: rationale });
          autoAdvance();
        }
    } else if (activeAction === 'defer') handleDefer();
    
    setActiveAction(null);
    setRationale("");
  };

  const autoAdvance = () => {
    const id = activeType === 'session' ? activeSessionId : activeItemLabel;
    if (!id) return;

    setTimeout(() => {
      if (activeType === 'session') {
        const currentIndex = sessions.findIndex((s: any) => s.id === activeSessionId);
        const nextSession = sessions.slice(currentIndex + 1).find((s: any) => 
          !acceptedItems.includes(s.id) && 
          !rejectedItems[s.id] && 
          !deferredItems.includes(s.id)
        ) || sessions[currentIndex + 1] || null;
        
        if (nextSession) {
          setActiveSessionId(nextSession.id);
        } else {
          // Move to criteria if no more sessions
          if (criteriaItems.length > 0) {
            setActiveType('criteria');
            setActiveItemLabel(criteriaItems[0].label);
            setActiveSessionId(null);
          }
        }
      } else {
        const currentIndex = currentList.findIndex(i => (i.id || i.label) === activeItemLabel);
        
        const nextItem = currentList.slice(currentIndex + 1).find(i => 
          !acceptedItems.includes(i.id || i.label) && 
          !rejectedItems[i.id || i.label] && 
          !deferredItems.includes(i.id || i.label)
        ) || currentList[currentIndex + 1] || null;
        
        if (nextItem) {
          setActiveItemLabel(nextItem.id || nextItem.label);
        } else if (activeType === 'tag' && criteriaItems.length > 0) {
          setActiveType('criteria');
          setActiveItemLabel(criteriaItems[0].label);
        } else if (activeType === 'criteria' && assessmentItems.length > 0) {
          setActiveType('assessment');
          setActiveItemLabel(assessmentItems[0].label);
        } else if (activeType === 'assessment' && documentItems.length > 0) {
          setActiveType('document');
          setActiveItemLabel(documentItems[0].label);
        } else if (activeType === 'document' && nextStepItems.length > 0) {
          setActiveType('nextstep');
          setActiveItemLabel(nextStepItems[0].label);
        }
      }
    }, 1500);
  };

  const handleDefer = () => {
    const id = activeType === 'session' ? activeSessionId : activeItemLabel;
    if (id && !deferredItems.includes(id)) {
        setDeferredItems([...deferredItems, id]);
        autoAdvance();
    }
  };

  const handleRestore = (label: string) => {
    setDeferredItems(deferredItems.filter(l => l !== label));
    if (activeType === 'session') setActiveSessionId(label);
    else setActiveItemLabel(label);
  };

  const handleUndoAccept = () => {
    const id = activeType === 'session' ? activeSessionId : activeItemLabel;
    if (!id) return;
    setAcceptedItems(prev => prev.filter(l => l !== id));
    if (activeType !== 'session') {
      setAcceptedMappings((prev: any[]) => prev.filter(m => m.id !== id));
    }
  };

  const handleUndoReject = () => {
    const id = activeType === 'session' ? activeSessionId : activeItemLabel;
    if (!id) return;
    setRejectedItems(prev => {
       const copy = { ...prev };
       delete copy[id];
       return copy;
    });
  };

  const handleAccept = () => {
    const id = activeType === 'session' ? activeSessionId : activeItemLabel;
    if (!id) return;
    
    if (!acceptedItems.includes(id)) {
      setAcceptedItems(prev => [...prev, id]);
    }
    
    if (activeType !== 'session' && activeItemLabel) {
      setAcceptedMappings((prev: any[]) => {
        if (prev.find(m => m.id === activeItemLabel)) return prev;
        return [...prev, { id: activeItemLabel, label: activeItemLabel, confidence: itemConfidence || 0 }];
      });
    }

    autoAdvance();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gray-50/50">
      <div className={cn("px-5 py-6 border-b border-divider", isSidebarCollapsed ? "flex items-center justify-center" : "")}>
        {!isSidebarCollapsed ? (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
              <Typography variant="h4" className="font-sans text-[20px] font-medium text-slate-800">Review Queue</Typography>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="h-8 w-8 text-text-secondary shrink-0"
                title="Collapse Sidebar"
              >
                <ChevronLeft size={18} />
              </Button>
            </div>
            {!flags.FEATURE_HIDE_EVIDENCE_BY_TAG && (
              <div className="flex p-1 bg-gray-200/50 rounded-lg w-full mt-2">
                 <button
                    className={cn("flex-1 text-xs font-semibold py-1.5 rounded-md transition-all text-center", groupBy === 'source' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    onClick={() => {
                        setGroupByUI('source'); 
                        if (activeType === 'tag') {
                          if (localSessions.length > 0) {
                            setActiveType('session'); setActiveSessionId(localSessions[0].id); setActiveItemLabel(null);
                          }
                        }
                    }}
                 >By Source</button>
                 <button
                    className={cn("flex-1 text-xs font-semibold py-1.5 rounded-md transition-all text-center", groupBy === 'tag' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    onClick={() => {
                        setGroupByUI('tag'); 
                        if (activeType === 'session' || activeType === 'assessment' || activeType === 'document') {
                          if (tagGroups.length > 0) {
                            setActiveType('tag'); setActiveItemLabel(tagGroups[0].id); setActiveSessionId(null);
                          }
                        }
                    }}
                 >By Tag</button>
              </div>
            )}
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="h-8 w-8 text-text-secondary mx-auto"
            title="Expand Sidebar"
          >
            <ChevronRight size={18} />
          </Button>
        )}
      </div>
      
      {!isSidebarCollapsed && (
        <div className="flex-1 overflow-y-auto p-3">
          {/* Evidence Category */}
          {groupBy === 'source' ? (
            <ReviewCategory 
              title={flags.FEATURE_HIDE_EVIDENCE_BY_TAG ? `EVIDENCE (${localSessions.length + assessmentItems.length + documentItems.length})` : `Evidence by Source (${localSessions.length + assessmentItems.length + documentItems.length})`}
              items={[
                ...localSessions.map((s: any) => ({ label: s.focus || "Clinical Snapshot", score: "0.95", type: "session", id: s.id, hasConflict: s.hasConflict })),
                ...assessmentItems,
                ...documentItems
              ]}
              activeType={activeType}
              activeItemLabel={activeType === 'session' ? activeSessionId : activeItemLabel}
              deferredItems={deferredItems}
              acceptedItems={acceptedItems}
              rejectedItems={rejectedItems}
              onSelect={(id, type) => {
                if (type === 'session') {
                  setActiveSessionId(id);
                } else {
                  setActiveItemLabel(id);
                  setActiveSessionId(null);
                }
                setActiveType(type as any);
              }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 h-8 flex items-center justify-center gap-2 rounded-lg"
                onClick={() => setIsAddEvidenceTypeOpen(true)}
              >
                <Plus size={14} /> Add Evidence
              </Button>
            </ReviewCategory>
          ) : (
            <ReviewCategory 
              title={`Evidence by Tag (${tagGroups.length})`}
              items={tagGroups}
              activeType={activeType}
              activeItemLabel={activeItemLabel}
              deferredItems={deferredItems}
              acceptedItems={acceptedItems}
              rejectedItems={rejectedItems}
              onSelect={(id, type) => {
                  setActiveItemLabel(id);
                  setActiveSessionId(null);
                  setActiveType(type as any);
              }}
            />
          )}

          {/* Criteria Category */}
          <ReviewCategory 
            title={groupBy === 'tag' ? `SUPPORTING TAGS (${criteriaItems.length})` : `Diagnostic Criteria (${criteriaItems.length})`}
            items={criteriaItems}
            activeType={activeType}
            activeItemLabel={activeItemLabel}
            deferredItems={deferredItems}
            acceptedItems={acceptedItems}
            rejectedItems={rejectedItems}
            onSelect={(id, type) => {
              setActiveItemLabel(id);
              setActiveType('criteria');
              setActiveSessionId(null);
            }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 h-8 flex items-center justify-center gap-2 rounded-lg"
              onClick={() => {
                setAddEvidenceType('criteria');
                setIsAddMode(true);
                setIsModifyOpen(true);
              }}
            >
              <Plus size={14} /> {groupBy === 'tag' ? 'Add Tag' : 'Add Criteria'}
            </Button>
          </ReviewCategory>

          {/* Next Steps Category */}
          <ReviewCategory 
            title={`Follow-up & Next Steps (${nextStepItems.length})`}
            items={nextStepItems}
            activeType={activeType}
            activeItemLabel={activeItemLabel}
            deferredItems={deferredItems}
            acceptedItems={acceptedItems}
            rejectedItems={rejectedItems}
            onSelect={(id, type) => {
              setActiveItemLabel(id);
              setActiveType('nextstep');
              setActiveSessionId(null);
            }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 h-8 flex items-center justify-center gap-2 rounded-lg"
              onClick={() => {
                setAddEvidenceType('nextstep');
                setIsAddMode(true);
                setIsModifyOpen(true);
              }}
            >
              <Plus size={14} /> Add Next Step
            </Button>
          </ReviewCategory>

          {/* Deferred Items Category */}
          {deferredItems.length > 0 && (
            <CollapsibleSection title={`Deferred Review (${deferredItems.length})`} bg="bg-orange-50" indicatorColor="#f97316">
              {deferredItems.map(id => {
                // Try to find the item in sessions, criteria, assessments, documents or next steps
                const session = localSessions.find((s: any) => s.id === id);
                const criteria = criteriaItems.find(i => i.label === id);
                const assessment = assessmentItems.find(i => i.label === id);
                const document = documentItems.find(i => i.label === id);
                const nextStep = nextStepItems.find(i => i.label === id);
                
                if (session) {
                  return (
                    <ReviewItem 
                      key={id}
                      label={session.focus || "Clinical"} 
                      score="0.95" 
                      type="session"
                      active={activeType === 'session' && activeSessionId === id} 
                      deferred={true} 
                      noStrike={true}
                      accepted={acceptedItems.includes(id)}
                      rejected={!!rejectedItems[id]}
                      onClick={() => {
                        setActiveSessionId(id);
                        setActiveType('session');
                        setActiveItemLabel(null);
                      }} 
                    />
                  );
                }
                
                const item = criteria || assessment || document || nextStep;
                if (item) {
                  return (
                    <ReviewItem 
                      key={id}
                      label={item.label} 
                      score={item.score} 
                      type={item.type}
                      active={(activeType === 'criteria' || activeType === 'assessment' || activeType === 'document' || activeType === 'nextstep') && activeItemLabel === id} 
                      deferred={true} 
                      noStrike={true}
                      accepted={acceptedItems.includes(id)}
                      rejected={!!rejectedItems[id]}
                      onClick={() => {
                        setActiveItemLabel(item.label);
                        setActiveType(item.type as any);
                        setActiveSessionId(null);
                      }} 
                    />
                  );
                }
                return null;
              })}
            </CollapsibleSection>
          )}
        </div>
      )}
    </div>
  );

  const allEvidenceFindingsPool = useMemo(() =>
    localSessions.flatMap((s: any) => (s.evidence || []).map((ev: any) => ({
      ...ev,
      sourceSession: s.focus
    }))),
    [localSessions]
  );

  const mainContent = (
    <div className="flex flex-col h-full bg-workspace-bg overflow-hidden relative">
      <AddEvidenceTypeModal 
        isOpen={isAddEvidenceTypeOpen}
        onClose={() => setIsAddEvidenceTypeOpen(false)}
        onSelect={(type) => {
          setAddEvidenceType(type);
          setIsAddEvidenceTypeOpen(false);
          setIsAddMode(true);
          // Only open ModifyModal for criteria/nextstep
          if (type === 'criteria' || type === 'nextstep') {
            setIsModifyOpen(true);
          }
        }}
      />
      
      <CreateSessionModal
        isOpen={isAddMode && addEvidenceType === 'session'}
        onClose={() => setIsAddMode(false)}
        onSessionCreate={(info) => {
          const newId = `new-session-${Date.now()}`;
          const newSession = {
            id: newId,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            focus: "New Clinical Session",
            notes: "",
            evidence: []
          };
          setLocalSessions(prev => [...prev, newSession]);
          setActiveSessionId(newId);
          setActiveType('session');
          setActiveItemLabel(null);
          setIsAddMode(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        }}
      />

      <StartAssessmentModal
        isOpen={isAddMode && addEvidenceType === 'assessment'}
        onClose={() => setIsAddMode(false)}
        onStart={(assessment) => {
          const newId = `new-assessment-${Date.now()}`;
          const newItem = {
            ...assessment,
            type: 'assessment',
            id: newId,
            label: assessment.name,
            findings: []
          };
          setLocalEvidenceItems(prev => [...prev, newItem]);
          setActiveType('assessment');
          setActiveItemLabel(newId);
          setActiveSessionId(null);
          setIsAddMode(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        }}
      />

      <UploadDocumentModal
        isOpen={isAddMode && addEvidenceType === 'document'}
        onClose={() => setIsAddMode(false)}
        onUpload={(doc) => {
          const newId = `new-document-${Date.now()}`;
          const newItem = {
            id: newId,
            label: doc.name,
            type: 'document',
            findings: []
          };
          setLocalEvidenceItems(prev => [...prev, newItem]);
          setActiveType('document');
          setActiveItemLabel(newId);
          setActiveSessionId(null);
          setIsAddMode(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        }}
      />

      <ModifyModal 
        isOpen={isModifyOpen} 
        onClose={() => {
          setIsModifyOpen(false);
          setIsAddMode(false);
        }} 
        item={isAddMode ? null : currentItem} 
        isAddMode={isAddMode}
        addType={isAddMode ? addEvidenceType : 'criteria'}
        allFindingsPool={allEvidenceFindingsPool}
        groupBy={groupBy}
        onSave={(data) => {
          if (isAddMode) {
            const newId = `new-${addEvidenceType}-${Date.now()}`;
            const newItem = {
              ...data,
              type: addEvidenceType,
              id: newId,
              findings: data.findings.filter((f: any) => f.included)
            };
            setLocalEvidenceItems(prev => [...prev, newItem]);
            setActiveType(addEvidenceType as any);
            setActiveItemLabel(newId);
            setActiveSessionId(null);
          } else if (activeType === 'session' && activeSessionId) {
            setLocalSessions(prev => prev.map(s => 
              s.id === activeSessionId 
                ? { ...s, focus: data.label, evidence: data.findings } 
                : s
            ));
          } else if (activeItemLabel) {
            setLocalEvidenceItems(prev => prev.map(i => 
              (i.id || i.label) === activeItemLabel 
                ? { ...i, label: data.label, score: data.score, status: data.status, findings: data.findings.filter((f: any) => f.included) } 
                : i
            ));
            setActiveItemLabel(data.label || activeItemLabel);
          }
 
          setIsModifyOpen(false);
          setIsAddMode(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        }}
      />
      <SkipNextStepModal isOpen={isSkipOpen} onClose={() => setIsSkipOpen(false)} item={currentItem} onConfirm={handleAccept} />
      <Toast message="Correction saved successfully!" visible={showToast} />

      {/* Detail Head */}
      <div className="px-8 py-5 border-b border-divider bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-8">
            <Step label="Sessions" num={1} active={activeType === 'session'} />
            <div className="w-10 h-px bg-divider" />
            <Step label="Findings Review" num={2} active={activeType === 'criteria' || activeType === 'assessment' || activeType === 'document'} />
            <div className="w-10 h-px bg-divider" />
            <Step label="Clinical Plan" num={3} active={activeType === 'nextstep'} />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/30">
        <AnimatePresence mode="wait">
            <motion.div
                key={activeSessionId || activeItemLabel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
            >
                {activeType === 'session' ? (
                  <div className="space-y-8">
                    <div className="flex justify-between items-end border-b border-divider pb-6">
                      <div className="space-y-1">
                        <Typography variant="label-micro" className="text-text-disabled uppercase tracking-[0.2em] font-bold">Clinical Session Profile</Typography>
                        <Typography variant="h3" className="font-serif">{currentSession?.focus || "Anxiety Management"}</Typography>
                        <div className="flex items-center gap-3 mt-1">
                          <Typography variant="body-sm" className="text-text-secondary font-medium">
                            <span className="lowercase">{currentSession?.id}</span> • {currentSession?.date}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="success" className="h-7 gap-2 px-3 bg-white border-success/20 text-success-dark">
                            <div className="w-2 h-2 rounded-full bg-success shrink-0" />
                            <span className="font-semibold tracking-tight">High Relevance</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {(currentSession?.evidence || [])
                        .filter((snippet: any) => snippet.included !== false)
                        .length ? (
                        <>
                          <Typography variant="label-micro" className="text-text-disabled uppercase font-bold tracking-wider">Supporting Evidence</Typography>
                          {(currentSession.evidence || [])
                            .filter((snippet: any) => snippet.included !== false)
                            .map((snippet: any) => (
                            <EntityCard 
                              key={snippet.id} 
                              title={snippet.type === 'verbatim' ? `"${snippet.text}"` : snippet.text}
                              titleClassName={['verbatim', 'behavioural'].includes(snippet.type) ? "text-base font-bold leading-relaxed text-slate-800" : "font-bold"}
                              statusBadge={
                                <StatusBadge 
                                  status={snippet.type === 'verbatim' ? 'processing' : 'completed'} 
                                  label={snippet.type} 
                                  showIcon={false}
                                  className={snippet.type === 'verbatim' ? "bg-blue-100 text-slate-900 border-0" : "bg-emerald-100 text-slate-900 border-0"}
                                />
                              }
                              metadata={[
                                { 
                                  label: "SOURCE", 
                                  value: <MetadataValue icon={Clock} text={`${currentSession?.focus} • ${snippet.timestamp}`} /> 
                                },
                                ...(normalizeTags(snippet.tags ?? snippet.tag).length ? [{
                                  label: "TAGS",
                                  value: (
                                    <div className="flex flex-wrap gap-1">
                                      {normalizeTags(snippet.tags ?? snippet.tag).map((tag: string) => (
                                        <Badge key={tag} variant="soft" className="px-2 py-0.5 text-xs text-slate-500 font-mono">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )
                                }] : []),
                                { 
                                  label: "FRAMEWORK", 
                                  value: <MetadataValue icon={BookOpen} text={snippet.framework} /> 
                                }
                              ]}
                              rightAction={
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap h-8"
                                  onClick={() => onNavigateToSession && currentSession ? onNavigateToSession(currentSession) : undefined}
                                >
                                  <ExternalLink size={12} className="mr-1.5" /> Jump to Spot
                                </Button>
                              }
                              summary={null}
                            />
                          ))}
                        </>
                      ) : (
                        <div className="py-20 text-center bg-white border border-dashed border-divider rounded-2xl">
                          <Typography variant="body" className="text-text-disabled italic">No snippets found for this session</Typography>
                        </div>
                      )}
                    </div>
                  </div>
                ) : isTag ? (
                  <div className="space-y-8">
                    <div className="flex justify-between items-end border-b border-divider pb-6">
                      <div className="space-y-1">
                        <Typography variant="label-micro" className="text-text-disabled uppercase tracking-[0.2em] font-bold">Tag Group</Typography>
                        <Typography variant="h3" className="font-serif">{currentItem?.label}</Typography>
                        <div className="flex items-center gap-3 mt-1">
                          <Typography variant="body-sm" className="text-text-secondary font-medium">
                            {(currentItem as any)?.findings?.length} findings
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <Typography variant="label-micro" className="text-text-disabled uppercase font-bold tracking-wider">Grouped Evidence</Typography>
                      {(currentItem as any)?.findings?.map((snippet: any, idx: number) => (
                        <EntityCard 
                          key={snippet.id || idx} 
                          title={snippet.type === 'verbatim' ? `"${snippet.text}"` : snippet.text}
                          titleClassName={['verbatim', 'behavioural'].includes(snippet.type) ? "text-base font-bold leading-relaxed text-slate-800" : "font-bold"}
                          statusBadge={
                            <StatusBadge 
                              status={snippet.type === 'verbatim' ? 'processing' : 'completed'} 
                              label={snippet.type || 'observation'} 
                              showIcon={false}
                              className={snippet.type === 'verbatim' ? "bg-blue-100 text-slate-900 border-0" : "bg-emerald-100 text-slate-900 border-0"}
                            />
                          }
                          metadata={[
                            { 
                              label: "SOURCE", 
                              value: <MetadataValue icon={Clock} text={`${snippet.sourceSession} • ${snippet.sourceTimestamp || snippet.timestamp || ''}`} /> 
                            },
                            { 
                              label: "FRAMEWORK", 
                              value: <MetadataValue icon={BookOpen} text={snippet.framework || 'DSM-5'} /> 
                            }
                          ]}
                          rightAction={
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap h-8"
                            >
                              <ExternalLink size={12} className="mr-1.5" /> Jump to Spot
                            </Button>
                          }
                          summary={null}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-end border-b border-divider pb-6">
                        <div className="space-y-1">
                            <Typography variant="label-micro" className="text-text-disabled uppercase font-bold tracking-wider">
                                {isCriteria ? (groupBy === 'tag' ? "Tag Name" : "Criterion Name") : (isAssessment ? "Assessment Type" : (isDocument ? "Document Type" : `${currentItem?.type} type`))}
                            </Typography>
                            <Typography variant="h3" className="font-serif">{currentItem?.label || activeItemLabel}</Typography>
                            <div className="flex items-center gap-3 mt-1">
                                <Typography variant="body-sm" className="text-text-secondary font-medium">
                                    <span className="lowercase">idx-29491</span> • Apr 21, 2024
                                </Typography>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            {isCriteria || isAssessment || isDocument ? (
                               <Badge variant="success" className="h-7 gap-2 px-3 bg-white border-success/20 text-success-dark">
                                   <div className="w-2 h-2 rounded-full bg-success shrink-0" />
                                   <span className="font-semibold tracking-tight">
                                     {isCriteria ? "High Certainty" : "High Relevance"}
                                   </span>
                               </Badge>
                            ) : isNextStep ? (
                               <ImpactBadge
                                    impact={mapScoreToImpact(itemConfidence)}
                                    className="h-auto py-0.5"
                               />
                            ) : (
                               <ConfidenceBadge 
                                    confidence={mapScoreToConfidence(itemConfidence)} 
                                    className="h-auto py-0.5"
                               />
                            )}
                        </div>
                    </div>

                    {currentItem?.hasConflict && (
                       <div className="p-4 bg-[#fef2f2] border border-[#fecaca] rounded-lg flex items-start gap-3">
                           <AlertTriangle size={20} className="shrink-0 text-[#ef4444] mt-0.5" />
                           <div className="space-y-1">
                               <Typography variant="body" className="font-semibold text-[#991b1b]">Unresolved Conflict</Typography>
                               <Typography variant="body-sm" className="text-[#991b1b]/90">
                                   This finding conflicts with other recorded evidence. Please review carefully before accepting.
                               </Typography>
                           </div>
                       </div>
                    )}

                    {isAssessment ? (() => {
                        const assessmentDetail = MOCK_ASSESSMENTS.find(a => activeItemLabel?.includes(a.title.split(' ')[0])) || MOCK_ASSESSMENTS[0];
                        return (
                            <div className="space-y-6">
                                <EntityCard
                                    title={assessmentDetail.title}
                                    summary={assessmentDetail.description}
                                    hoverable={false}
                                    rightAction={
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap h-8"
                                        onClick={() => {}}
                                      >
                                        View Workspace
                                      </Button>
                                    }
                                    metadata={[
                                        ...(assessmentDetail.score ? [{
                                            label: "Score / Result",
                                            value: `${assessmentDetail.score}${assessmentDetail.descriptor ? ` - ${assessmentDetail.descriptor}` : ''}`
                                        }] : []),
                                        ...(assessmentDetail.overallImpression ? [{
                                            label: "Overall Impression",
                                            value: assessmentDetail.overallImpression
                                        }] : []),
                                        ...(assessmentDetail.percentile ? [{
                                            label: "Percentile",
                                            value: assessmentDetail.percentile
                                        }] : [])
                                    ]}
                                />
                                <div className="space-y-4">
                                  <Typography variant="label-micro" className="text-text-disabled uppercase font-bold tracking-wider">Supporting Evidence</Typography>
                                  {(currentItem as any)?.findings?.filter((f: any) => f.included !== false).map((finding: any) => (
                                    <EntityCard
                                      key={finding.id}
                                      title={finding.text}
                                      titleClassName="text-base font-semibold text-slate-800 leading-snug"
                                      metadata={[
                                        { label: "SOURCE", value: `${currentItem?.label} • ${finding.timestamp}` },
                                        ...(normalizeTags(finding.tags ?? finding.tag).length ? [{ label: "TAGS", value: (
                                          <div className="flex flex-wrap gap-1">
                                            {normalizeTags(finding.tags ?? finding.tag).map((tag: string) => (
                                              <Badge key={tag} variant="soft" className="px-2 py-0.5 text-xs text-slate-500 font-mono">
                                                {tag}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}] : []),
                                        ...(finding.framework ? [{ label: "FRAMEWORK", value: finding.framework }] : [])
                                      ]}
                                      onClick={() => {}}
                                      hoverable={true}
                                    />
                                  ))}
                                </div>
                            </div>
                        );
                    })() : isDocument ? (
                      <div className="space-y-6">
                        <Typography variant="label-micro" className="text-text-disabled uppercase font-bold tracking-wider">Supporting Evidence</Typography>
                        {(currentItem as any)?.findings?.filter((f: any) => f.included !== false).map((finding: any) => (
                          <EntityCard
                            key={finding.id}
                            title={finding.text}
                            titleClassName="text-base font-semibold text-slate-800 leading-snug"
                            metadata={[
                              { label: "SOURCE", value: `${currentItem?.label} • ${finding.timestamp}` },
                              ...(normalizeTags(finding.tags ?? finding.tag).length ? [{ label: "TAGS", value: (
                                <div className="flex flex-wrap gap-1">
                                  {normalizeTags(finding.tags ?? finding.tag).map((tag: string) => (
                                    <Badge key={tag} variant="soft" className="px-2 py-0.5 text-xs text-slate-500 font-mono">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}] : []),
                              ...(finding.framework ? [{ label: "FRAMEWORK", value: finding.framework }] : [])
                            ]}
                            rightAction={
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 whitespace-nowrap h-8"
                                onClick={() => {}}
                              >
                                <ExternalLink size={12} className="mr-1.5" /> Jump to Spot
                              </Button>
                            }
                            onClick={() => {}}
                            hoverable={true}
                          />
                        ))}
                      </div>
                    ) : (
                    <Card className="p-8 space-y-8 bg-white">
                        {isNextStep ? (
                            <div className="space-y-6">
                                <DataPoint 
                                    label="SUGGESTED CLINICAL FOCUS" 
                                    value={(currentItem as any)?.suggestedClinicalFocus || "Standard Evaluation"} 
                                />
                                <DataPoint 
                                    label="EXPECTED IMPACT" 
                                    value={(currentItem as any)?.impact || "High information gain"} 
                                />
                                <DataPoint 
                                    label="RATIONALE" 
                                    value={(currentItem as any)?.rationale || "Resolves ambiguity for this specific topic."} 
                                />
                            </div>
                        ) : isCriteria ? (
                            <div className="space-y-10">
                                <DataPoint 
                                    label="SUGGESTED STATUS" 
                                    value={currentItem?.status || "Supported"} 
                                />

                                <div className="space-y-4">
                                    <Typography variant="label-micro" className="text-text-disabled uppercase font-bold tracking-wider">{groupBy === 'tag' && isCriteria ? "Supporting Tags" : "Supporting Evidence"}</Typography>
                                    <div className="grid grid-cols-1 gap-4">
                                        {(currentItem as any)?.findings?.filter((f: any) => f.included !== false).map((evidence: any, idx: number) => (
                                            <EntityCard 
                                                key={evidence.id || idx} 
                                                title={evidence.type === 'verbatim' ? `"${evidence.text}"` : evidence.text}
                                                titleClassName="text-base font-bold leading-relaxed text-slate-800"
                                                statusBadge={
                                                  <StatusBadge 
                                                    status={evidence.type === 'verbatim' ? 'processing' : 'completed'} 
                                                    label={evidence.type || 'observation'} 
                                                    showIcon={false}
                                                    className={evidence.type === 'verbatim' ? "bg-blue-100 text-slate-900 border-0" : "bg-emerald-100 text-slate-900 border-0"}
                                                  />
                                                }
                                                metadata={[
                                                  { 
                                                    label: "SOURCE", 
                                                    value: <MetadataValue icon={Clock} text={`${evidence.sourceSession || currentItem?.label} • ${evidence.timestamp}`} /> 
                                                  },
                                                  ...(normalizeTags(evidence.tags ?? evidence.tag).length ? [{
                                                    label: "TAGS",
                                                    value: (
                                                      <div className="flex flex-wrap gap-1">
                                                        {normalizeTags(evidence.tags ?? evidence.tag).map((tag: string) => (
                                                          <Badge key={tag} variant="soft" className="px-2 py-0.5 text-xs text-slate-500 font-mono">
                                                            {tag}
                                                          </Badge>
                                                        ))}
                                                      </div>
                                                    )
                                                  }] : []),
                                                  { 
                                                    label: "FRAMEWORK", 
                                                    value: <MetadataValue icon={BookOpen} text={evidence.framework} /> 
                                                  }
                                                ]}
                                                summary={null}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </Card>
                    )}
                  </>
                )}

                {/* Inline Rationale Flow */}
                <AnimatePresence>
                    {activeAction && activeAction !== 'reject' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-primary/5 border-2 border-primary/20 p-8 rounded-2xl space-y-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-full",
                                    activeAction === 'accept' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                                )}>
                                    {activeAction === 'accept' ? <ThumbsUp size={20} /> : <ThumbsDown size={20} />}
                                </div>
                                <Typography variant="h3">Reason for {activeAction.charAt(0).toUpperCase() + activeAction.slice(1)}</Typography>
                            </div>
                            
                            <div className="space-y-4">
                                <textarea 
                                    ref={rationaleRef}
                                    value={rationale}
                                    onChange={(e) => setRationale(e.target.value)}
                                    placeholder="Provide justification for this mapping decision..."
                                    className="w-full bg-white border border-divider rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                                <div className="flex justify-end gap-3">
                                    <Button variant="ghost" onClick={() => setActiveAction(null)}>Cancel</Button>
                                    <Button variant="brand" onClick={commitAction} disabled={!rationale.trim()}>
                                        Commit {activeAction}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-8 border-t border-divider bg-gray-50/50 flex flex-col gap-6 shrink-0 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        <div className="w-full flex flex-wrap gap-4">
          {(!activeItemLabel && !activeSessionId) ? (
            <div className="w-full p-4 text-center bg-gray-100/50 rounded-xl border border-divider">
               <Typography variant="body-sm" className="text-text-disabled font-bold italic">Select an item from the review queue to begin assessment</Typography>
            </div>
          ) : (activeId && acceptedItems.includes(activeId)) ? (
              <div className="w-full bg-success-light/30 border border-success/10 p-4 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-success" size={20} />
                      <Typography variant="body-sm" className="text-success-dark font-bold">
                          {activeType === 'session' ? 'Session accepted successfully.' : 'Mapping accepted successfully.'}
                      </Typography>
                  </div>
                  <Button variant="ghost" size="xs" onClick={handleUndoAccept} className="text-success-dark hover:bg-success/10 border border-success/20">Undo Accept</Button>
              </div>
          ) : (activeId && rejectedItems[activeId]) ? (
              <div className="w-full bg-error-light/30 border border-error/10 p-4 rounded-xl flex items-start justify-between gap-3">
                  <div className="space-y-2">
                      <div className="flex items-center gap-3">
                          <XCircle className="text-error" size={20} />
                          <Typography variant="body-sm" className="text-error-dark font-bold">{activeType === 'session' ? 'Session rejected' : 'Evidence rejected'}</Typography>
                      </div>
                      <Typography variant="body-sm" className="text-error-dark/80 pl-8">Reason: {rejectedItems[activeId]}</Typography>
                  </div>
                  <Button variant="ghost" size="xs" onClick={handleUndoReject} className="text-error-dark hover:bg-error/10 border border-error/20">Undo Reject</Button>
              </div>
          ) : (activeId && deferredItems.includes(activeId)) ? (
              <div className="w-full bg-orange-50 border border-orange-500/10 p-4 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                      <Clock className="text-orange-600" size={20} />
                      <Typography variant="body-sm" className="text-orange-700 font-bold">{activeType === 'session' ? 'Session deferred' : 'Evidence deferred'}</Typography>
                  </div>
                  <Button variant="ghost" size="xs" onClick={() => handleRestore(activeId)} className="text-orange-700 hover:bg-orange-100 border border-orange-200">Undo Defer</Button>
              </div>
          ) : activeAction === 'reject' ? (
              <div className="w-full flex justify-between items-center gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(activeType === 'session' ? [
                          "Insufficient data",
                          "Unreliable transcript",
                          "Duplicate session"
                      ] : [
                          "Wrong criterion",
                          "Not diagnostic evidence",
                          "Too weak"
                      ]).map(reason => (
                          <Button
                              key={reason}
                              variant="outline"
                              onClick={() => {
                                  if (activeId) {
                                      setRejectedItems({ ...rejectedItems, [activeId]: reason });
                                      autoAdvance();
                                      setActiveAction(null);
                                  }
                              }}
                              className="py-6 whitespace-normal h-auto text-center font-bold border-error/30 text-error-dark hover:bg-error-light/10 hover:border-error w-full shadow-sm"
                          >
                              {reason}
                          </Button>
                      ))}
                  </div>
                  <Button 
                      variant="ghost" 
                      className="flex-shrink-0 h-full py-6 text-text-secondary hover:bg-gray-100/50 hover:text-text-primary px-6 border border-transparent font-bold"
                      onClick={() => setActiveAction(null)}
                  >
                      <XCircle size={20} className="mr-2 text-error/60" /> Cancel
                  </Button>
              </div>
          ) : (
              <EvidenceWorkspaceCTAs 
                  type={activeType}
                  disabled={activeAction !== null}
                  onAccept={() => handleActionClick('accept')}
                  onReject={() => handleActionClick('reject')}
                  onModify={() => handleActionClick('modify')}
                  onDefer={() => handleActionClick('defer')}
                  onSkip={() => setIsSkipOpen(true)}
              />
          )}
        </div>
      </div>
    </div>
  );

  const workspaceContainer = (
    <WorkspaceContainer
      sidebarWidth={isSidebarCollapsed ? 64 : 320}
      sidebarContent={sidebarContent}
      mainContent={mainContent}
      height={isFullScreen ? "100%" : "800px"}
    />
  );

  const progressBanner = (
    <ProgressBanner
      title="Evidence Review"
      subtitle="Review all extracted evidence to unlock the report analysis"
      current={currentRequiredProgress}
      total={totalRequiredItems}
      progressLabel="Items Reviewed"
      actionLabel="See analysis"
      actionIcon={ArrowRight}
      onAction={() => {
        if (flags.FEATURE_CONFLICT_RESOLUTION_GATE && conflicts.length > 0 && !hasSkippedConflicts) {
          setIsConflictModalOpen(true);
        } else {
          setIsAnalysisModalOpen(true);
        }
      }}
      isActionActive={isAllRequiredReviewed}
      className="mb-6 mx-0"
    />
  );

  const analysisModal = (
    <Modal
      isOpen={isAnalysisModalOpen}
      onClose={() => setIsAnalysisModalOpen(false)}
      title="Clinical Analysis"
      width={720}
    >
      <div className="space-y-6">
        <Typography variant="body" className="text-text-secondary">
          Review the generated analysis before unlocking the final report.
        </Typography>

        <div className="max-h-[50vh] overflow-y-auto pr-2">
          <Card className="divide-y divide-divider p-0 overflow-hidden border-none shadow-none">
              {[
                  { id: 1, title: "Initial Evidence Summary", sub: "Core observations from sessions and collateral", items: ["Assessment Data", "Session Insights", "Document Collateral"] },
                  { id: 2, title: "Symptom Patterns", sub: "Whole Mind Snapshot & Observed Themes", items: ["Symptom Clusters", "Functional Impact"] },
                  { id: 3, title: "Working Impression", sub: "Provisional status based on combined signals", items: ["Working Impression (Likely Social Anxiety)", "Differential Considerations"] },
                  { id: 4, title: "Clarity Roadmap", sub: "Next steps to resolve uncertainty", items: ["Suggested Diagnostic Actions", "Information Gaps"] },
              ].map(step => (
                  <div key={step.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 hover:bg-gray-50/50 transition-colors">
                      <div className="w-8 h-8 rounded-full border-2 border-divider flex items-center justify-center font-bold text-text-disabled shrink-0 bg-white">
                          {step.id}
                      </div>
                      <div className="flex-1 space-y-4">
                          <div className="space-y-1">
                              <Typography variant="h3">{step.title}</Typography>
                              <Typography variant="body-sm" className="text-text-secondary">{step.sub}</Typography>
                          </div>
                          <div className="flex flex-col gap-2">
                              {step.items.map(item => (
                                  <div key={item} className="flex items-center justify-between p-3 bg-white border border-divider rounded-lg shadow-sm group cursor-pointer hover:border-primary/30 transition-all">
                                      <Typography variant="body" className="font-medium text-sm text-text-primary leading-tight">{item}</Typography>
                                      <ChevronDown size={14} className="text-text-disabled group-hover:text-primary transition-colors" />
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              ))}
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-divider">
          <Button variant="secondary" onClick={() => setIsAnalysisModalOpen(false)}>
             Back to Evidence
          </Button>
          <Button variant="brand" onClick={() => {
             setIsAnalysisModalOpen(false);
             if (onUnlockReport) onUnlockReport();
          }}>
             Accept & Unlock Report
          </Button>
        </div>
      </div>
    </Modal>
  );

  if (isFullScreen) {
    return (
      <AssessmentGate onNavigateToAssessments={onNavigateToAssessments || (() => {})}>
        <div className="fixed inset-0 z-50 bg-workspace-bg flex flex-col items-center">
           <div className="w-full bg-white border-b border-divider shrink-0 flex justify-center">
              <div className="w-full max-w-[1400px] flex justify-between items-center p-4">
                <Typography variant="h2" className="font-sans">Evidence Workspace</Typography>
                <Button variant="ghost" onClick={() => setIsFullScreen(false)}>
                   <Minimize2 size={18} className="mr-2" /> Exit Focus Mode
                </Button>
              </div>
           </div>
           <div className="flex-1 w-full flex flex-col max-w-[1400px] px-4 md:px-8 py-6 overflow-hidden">
              {progressBanner}
              {workspaceContainer}
           </div>
        </div>
        {analysisModal}
      </AssessmentGate>
    );
  }

  return (
    <AssessmentGate onNavigateToAssessments={onNavigateToAssessments || (() => {})}>
      <WorkspaceLayout
        title="Evidence Workspace"
        subtitle="Review extracted evidence, assess diagnostic criteria, and identify next steps"
        headerActions={
          <Button variant="secondary" onClick={() => setIsFullScreen(true)}>
             <Maximize2 size={18} className="mr-2" /> Focus Mode
          </Button>
        }
        subHeaderContent={progressBanner}
        sidebarWidth={isSidebarCollapsed ? 64 : 320}
        sidebarContent={sidebarContent}
        mainContent={mainContent}
        height="800px"
      />
      {analysisModal}
      <ConflictResolutionModal 
        isOpen={isConflictModalOpen} 
        conflicts={conflicts} 
        onResolve={() => setIsConflictModalOpen(false)}
        onSkip={() => {
          setHasSkippedConflicts(true);
          setIsConflictModalOpen(false);
          setIsAnalysisModalOpen(true);
        }}
      />
    </AssessmentGate>
  );
}

function MetadataValue({ icon: Icon, text }: { icon: React.ElementType, text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={12} className="text-slate-400" />
      <span className="text-[#06302c] font-normal">{text}</span>
    </div>
  );
}

function Step({ label, num, active }: { label: string, num: number, active: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors shadow-sm",
                active ? "bg-primary text-white scale-110" : "bg-gray-100 text-text-disabled"
            )}>
                {num}
            </div>
            <Typography variant="body-sm" className={cn("font-bold", active ? "text-primary" : "text-text-disabled")}>
                {label}
            </Typography>
        </div>
    );
}

interface ReviewCategoryProps {
  title: string;
  items: any[];
  activeType: string;
  activeItemLabel: string | null;
  deferredItems: string[];
  acceptedItems: string[];
  rejectedItems: Record<string, string>;
  onSelect: (id: string, type: string) => void;
  children?: React.ReactNode;
}

function ReviewCategory({
  title,
  items,
  activeType,
  activeItemLabel,
  deferredItems,
  acceptedItems,
  rejectedItems,
  onSelect,
  children
}: ReviewCategoryProps) {
  if (items.length === 0) return null;
  return (
    <CollapsibleSection title={title}>
      <div className="space-y-px">
        {items.map((item) => {
          const id = item.id || item.label;
          const isActive = activeType === item.type && activeItemLabel === id;
            
          return (
            <ReviewItem 
              key={id}
              label={item.label} 
              score={item.score} 
              type={item.type}
              active={isActive} 
              deferred={deferredItems.includes(id)} 
              accepted={acceptedItems.includes(id)}
              rejected={!!rejectedItems[id]}
              hasConflict={item.hasConflict}
              onClick={() => onSelect(id, item.type)} 
            />
          );
        })}
        {children}
      </div>
    </CollapsibleSection>
  );
}

