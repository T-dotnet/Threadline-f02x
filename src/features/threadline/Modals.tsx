import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BRAND, TEXT_PRIMARY, TEXT_SECONDARY, TYPE_SCALE } from "./constants";
import { Modal, Card, CardContent, Typography, Badge, Button, Toast, Select, Input, Textarea } from "../../components/ui";
import { X, ChevronDown, BookOpen, Search, Plus, Check, MessageSquare, FileText } from "lucide-react";
import { cn, normalizeTags } from "../../lib/utils";
import { MOCK_EVIDENCE_ITEMS, MOCK_CLIENT_DATA, MOCK_CLIENTS } from "./mockData";
import { CreateSessionModal } from "./modals/CreateSessionModal";
import { StartAssessmentModal } from "./modals/StartAssessmentModal";
import { UploadDocumentModal } from "./modals/UploadDocumentModal";

const GLOBAL_FINDINGS_POOL = Object.values(MOCK_CLIENT_DATA)
  .flatMap(data => data.sessions || [])
  .flatMap(s => (s.evidence || []).map((ev: any) => ({
    ...ev,
    sourceSession: s.focus
  })));

const COMMON_TAGS = [
  "Physical Symptoms", "Social Trigger", "Avoidance", "Anxiety", "Arousal", 
  "Work Stress", "Perfectionism", "Distortion", "Paranoia", "Self-Consciousness",
  "Affective", "Processing Speed", "Progress", "Skill Acquisition", 
  "Mindfulness", "Difficulty", "Symptom Reduction", "Social", "Sensory", 
  "Work", "Communication", "History", "Behavior"
];

const COMMON_FRAMEWORKS = [
  "Social Anxiety Disorder (SAD)", "Panic Disorder", 
  "Generalized Anxiety Disorder (GAD)", "Cognitive Appraisal", 
  "Depressive Features", "Anxiety Management", "DSM-V", "ICD-11"
];

const CLINICAL_STATUSES = [
  "Met", "Not Met", "Rule Out", "Deferred", "Inconclusive"
];

const CLINICAL_FOCUS_OPTIONS = [
  "Social Evaluation", "Mood Regulation", "Cognitive Functioning", 
  "Behavioral Patterns", "Physical Symptoms", "Sensory Processing",
  "Communication Skills", "Emotional Literacy"
];

const IMPACT_OPTIONS = [
  "High information gain", "Medium information gain", "Quantifies symptom severity",
  "High", "Medium", "Low"
];

export function GlobalModals() {
  const [searchParams, setSearchParams] = useSearchParams();
  const modalType = searchParams.get("modal");
  const itemId = searchParams.get("itemId");
  const [showToast, setShowToast] = useState(false);
  
  const closeModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("modal");
    newParams.delete("itemId");
    setSearchParams(newParams);
  };

  if (!modalType) return null;

  // Try to find the real item from mock data if itemId is present
  const realItem = itemId ? MOCK_EVIDENCE_ITEMS.find(i => i.label === itemId) : null;

  const mockItem = realItem || { 
    type: 'evidence', 
    label: 'Behavioural pattern', 
    impact: 'Moderate',
    findings: [
      { id: 'f1', text: 'Significant impairment in social communication', tags: ['Social'], included: true, framework: "Panic Disorder" },
      { id: 'f2', text: 'Elevated tactile sensitivity reported', tags: ['Sensory'], included: true, framework: "Anxiety Management" }
    ]
  };

  const handleSave = (updatedData: any) => {
    setShowToast(true);
    closeModal(); // Close the modal immediately
    
    // Auto-hide toast after delay
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const handleAddEvidenceSelect = (type: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (type === 'session') {
      newParams.set("modal", "create_session");
    } else if (type === 'assessment') {
      newParams.set("modal", "start_assessment");
    } else if (type === 'document') {
      newParams.set("modal", "upload_document");
    } else {
      newParams.set("modal", "modify");
      newParams.set("addMode", "true");
      newParams.set("addType", type);
    }
    setSearchParams(newParams);
  };

  const isAddMode = searchParams.get("addMode") === "true";
  const addType = (searchParams.get("addType") || "criteria") as any;

  return (
    <>
      {modalType && (
        <>
          <AddEvidenceTypeModal
            isOpen={modalType === "add_evidence"}
            onClose={closeModal}
            onSelect={handleAddEvidenceSelect}
          />
          <ModifyModal 
            isOpen={modalType === "modify"} 
            onClose={closeModal} 
            item={isAddMode ? null : mockItem} 
            isAddMode={isAddMode}
            addType={addType}
            onSave={handleSave} 
          />
          <CreateSessionModal
            isOpen={modalType === "create_session"}
            onClose={closeModal}
            onSessionCreate={(info) => {
              handleSave({ type: 'session', ...info });
            }}
          />
          <StartAssessmentModal
            isOpen={modalType === "start_assessment"}
            onClose={closeModal}
            onStart={(assessment) => {
              handleSave({ type: 'assessment', ...assessment });
            }}
          />
          <UploadDocumentModal
            isOpen={modalType === "upload_document"}
            onClose={closeModal}
            onUpload={(doc) => {
              handleSave({ type: 'document', ...doc });
            }}
          />
          <SkipNextStepModal
            isOpen={modalType === "skip"}
            onClose={closeModal}
            item={mockItem}
            onConfirm={() => {}}
          />
          <CognitiveLoopModal 
            isOpen={modalType === "cognitive_loop"} 
            onClose={closeModal} 
          />
        </>
      )}
      <Toast message="Changes saved successfully!" visible={showToast} />
    </>
  );
}

export function AddEvidenceTypeModal({ 
  isOpen, 
  onClose, 
  onSelect 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSelect: (type: 'session' | 'assessment' | 'document' | 'criteria' | 'nextstep') => void 
}) {
  const options = [
    { id: 'session', label: 'Session', description: 'Raw clinical notes or verbatim transcripts', icon: MessageSquare },
    { id: 'assessment', label: 'Assessment', description: 'Structured clinical tests or specialized assessments', icon: FileText },
    { id: 'document', label: 'Document', description: 'External reports, referrals, or clinical history', icon: BookOpen }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Evidence" width={480}>
      <div className="grid grid-cols-1 gap-3 py-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id as any)}
            className="flex items-start gap-4 p-4 text-left bg-white border border-divider rounded-xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all group outline-none"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors shrink-0">
              <opt.icon size={20} />
            </div>
            <div>
              <Typography variant="body" className="font-bold text-slate-800">{opt.label}</Typography>
              <Typography variant="body-sm" className="text-slate-500 mt-0.5 leading-snug">{opt.description}</Typography>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}

export function ModifyModal({ 
  isOpen, 
  onClose, 
  item, 
  onSave, 
  allFindingsPool, 
  isAddMode = false,
  addType = 'criteria',
  groupBy = 'source'
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  item: any, 
  onSave?: (data: any) => void, 
  allFindingsPool?: any[], 
  isAddMode?: boolean,
  addType?: 'criteria' | 'nextstep' | 'session' | 'assessment' | 'document',
  groupBy?: 'source' | 'tag'
}) {
  const pool = allFindingsPool || GLOBAL_FINDINGS_POOL;
  if (!item && !isAddMode) return null;
  
  // Create a default item for add mode if none provided
  const effectiveItem = item || {
    type: addType,
    label: '',
    score: '',
    status: 'Met',
    findings: []
  };

  const isCriteria = effectiveItem.type === 'criteria';
  const isNextStep = effectiveItem.type === 'nextstep';
  const isEvidence = !isCriteria && !isNextStep;

  // Use useEffect to reset state when item changes, ensuring the modal reflects the correct item
  useEffect(() => {
    if (effectiveItem) {
      setName(effectiveItem.label || "");
      setScore(effectiveItem.score || (isAddMode ? "" : "0.95"));
      
      let initialFindings = [];
      if ((isCriteria || isNextStep) && pool) {
        // Source directly from the pool if it's a criteria or nextstep modal
        initialFindings = pool.map((f: any) => ({
          ...f,
          included: (effectiveItem.findings || []).some((itemFinding: any) => itemFinding.id === f.id)
        }));
      } else {
        initialFindings = (effectiveItem.findings || []).map((f: any) => ({ ...f, included: f.included !== false }));
      }
      
      setFindings(initialFindings);
      setStatus(effectiveItem.status || (isCriteria ? "Met" : ""));
      setClinicalFocus(effectiveItem.suggestedClinicalFocus || "");
      setImpact(effectiveItem.impact || "");
      setRationale(effectiveItem.rationale || "");
      setReason("");
      setIsAddingMore(isAddMode);
    }
  }, [effectiveItem?.label, allFindingsPool, isOpen, isAddMode, effectiveItem.type]);

  const [name, setName] = useState(effectiveItem.label);
  const [score, setScore] = useState(effectiveItem.score);
  const [status, setStatus] = useState(effectiveItem.status);
  const [clinicalFocus, setClinicalFocus] = useState(effectiveItem.suggestedClinicalFocus || "");
  const [impact, setImpact] = useState(effectiveItem.impact || "");
  const [rationale, setRationale] = useState(effectiveItem.rationale || "");
  const [reason, setReason] = useState("");

  const [findings, setFindings] = useState([]);
  const [isAddingMore, setIsAddingMore] = useState(isAddMode);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = () => {
    const updatedData = {
      ...effectiveItem,
      label: name,
      score,
      status,
      suggestedClinicalFocus: clinicalFocus,
      impact,
      rationale,
      reason,
      findings
    };
    if (onSave) {
      onSave(updatedData);
    } else {
      onClose();
    }
  };

  const toggleFinding = (id: string) => {
    setFindings(findings.map(f => f.id === id ? { ...f, included: !f.included } : f));
  };

  const updateFinding = (id: string, field: string, value: any) => {
    setFindings(findings.map((f: any) => f.id === id ? { ...f, [field]: value } : f));
  };

  const addTag = (findingId: string, tagToAdd: string) => {
    const finding = findings.find(f => f.id === findingId);
    if (!finding) return;
    const current = normalizeTags(finding.tags ?? finding.tag);
    if (!current.includes(tagToAdd)) {
      updateFinding(findingId, 'tags', [...current, tagToAdd]);
    }
  };

  const removeTag = (findingId: string, tagToRemove: string) => {
    const finding = findings.find(f => f.id === findingId);
    if (!finding) return;
    const newTags = normalizeTags(finding.tags ?? finding.tag).filter(t => t !== tagToRemove.trim());
    updateFinding(findingId, 'tags', newTags);
  };

  const toggleTag = (findingId: string, tag: string) => {
    const finding = findings.find(f => f.id === findingId);
    if (!finding) return;
    const currentTags = normalizeTags(finding.tags ?? finding.tag);
    if (currentTags.includes(tag)) {
      removeTag(findingId, tag);
    } else {
      addTag(findingId, tag);
    }
  };

  const title = isAddMode 
    ? (addType === 'session' ? 'Add Clinical Session' : 
       addType === 'assessment' ? 'Add Assessment' : 
       addType === 'document' ? 'Add Document' : 
       addType === 'nextstep' ? "Add next step" : (groupBy === 'tag' ? "Add tag" : "Add criteria")) 
    : (isNextStep ? "Modify Next Step" : isCriteria ? (groupBy === 'tag' ? "Modify Tag" : "Modify Criteria") : "Modify Evidence");

  const footer = (
    <>
      <Button 
        variant="ghost" 
        onClick={onClose} 
        className="px-6 py-2.5 text-[#06302c] font-semibold"
      >
        {isAddMode ? "Cancel" : (isEvidence ? "Discard" : "Cancel")}
      </Button>
      <Button 
        onClick={handleSave}
        className="px-6 py-2.5 bg-[#06302c] text-white font-semibold rounded-md shadow-md hover:opacity-90 transition-all border-none"
      >
        {isAddMode ? (
          addType === 'session' ? 'Add session' : 
          addType === 'assessment' ? 'Add assessment' : 
          addType === 'document' ? 'Add document' : 
          addType === 'nextstep' ? 'Add next step' : (groupBy === 'tag' ? 'Add tag' : 'Add criterion')
        ) : (isEvidence ? "Save Correction" : "Save Changes")}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} width={600}>
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-4">
            <Input
              label={isCriteria ? (groupBy === 'tag' ? "Tag Name" : "Criterion Name") : 
                     isNextStep ? "Next Step" : 
                     addType === 'session' ? "Clinical Focus" :
                     addType === 'assessment' ? "Assessment Name" :
                     addType === 'document' ? "Document Name" :
                     "Finding Name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <Input
              label={isCriteria ? "Certainty score" : isNextStep ? "Impact score" : "Relevance Score"}
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />

            {isCriteria && (
              <Select 
                label="Suggested Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {CLINICAL_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            )}

            {isNextStep && (
              <>
                <Select 
                  label="Suggested Clinical Focus"
                  value={clinicalFocus}
                  onChange={(e) => setClinicalFocus(e.target.value)}
                >
                  <option value="" disabled>Select focus</option>
                  {CLINICAL_FOCUS_OPTIONS.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </Select>

                <Select 
                  label="Expected Impact"
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                >
                  <option value="" disabled>Select impact</option>
                  {IMPACT_OPTIONS.map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </Select>

                <Textarea
                  label="Rationale"
                  containerClassName="col-span-2"
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Enter the rationale for this next step..."
                />
              </>
            )}
        </div>

        {/* Supporting Evidence Section */}
        <div>
            <div className="flex items-center justify-between mb-4">
                <Typography variant="label-micro" className="text-text-disabled uppercase font-bold tracking-wider">
                  {isNextStep ? "Key Evidence Findings" : "Supporting Evidence"} ({findings.filter(f => f.included).length} included)
                </Typography>
                {(isCriteria || isNextStep) && !isAddingMore && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsAddingMore(true)}
                      className="h-7 text-xs font-semibold text-primary hover:bg-primary/5 gap-1.5"
                    >
                      <Plus size={14} />
                      Add more
                    </Button>
                  )}
              </div>

              {isCriteria && isAddingMore ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      autoFocus
                      placeholder="Search all clinical evidence..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                    {findings
                      .filter(f => f.text.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(finding => (
                        <Card 
                          key={finding.id} 
                          className={cn(
                            "transition-all border-divider cursor-pointer hover:border-primary/30", 
                            finding.included ? "bg-primary/[0.02] border-primary/20 shadow-sm" : "bg-white opacity-80"
                          )}
                          onClick={() => toggleFinding(finding.id)}
                        >
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                finding.included ? "bg-primary border-primary text-white" : "bg-white border-slate-300 text-transparent"
                              )}>
                                <Check size={12} strokeWidth={3} />
                              </div>
                              <div>
                                  <Typography variant="body" className="font-medium text-slate-900 line-clamp-1">{finding.text}</Typography>
                                  <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{finding.sourceSession || "Clinical Evidence"}</span>
                                      {finding.timestamp && <span className="text-[10px] text-slate-300">•</span>}
                                      {finding.timestamp && <span className="text-[10px] text-slate-400">{finding.timestamp}</span>}
                                  </div>
                              </div>
                            </div>
                            <Badge variant="soft" className="bg-slate-50 text-slate-400 border-none font-mono text-[9px] uppercase">
                              {finding.type || "observation"}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    
                    {findings.filter(f => f.text.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                      <div className="py-12 text-center">
                        <Typography variant="body" className="text-slate-400 italic">No matching evidence found in clinical pool.</Typography>
                      </div>
                    )}
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm"
                    fullWidth 
                    onClick={() => {
                      setIsAddingMore(false);
                      setSearchQuery("");
                    }}
                    className="mt-2 text-[#06302c] border-[#06302c] hover:bg-[#06302c]/5 h-8 font-bold"
                  >
                    Done adding findings
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                    {findings.filter(f => f.included).map(finding => (
                        <Card key={finding.id} className={cn("transition-all duration-300 border-divider", !finding.included && "bg-gray-50 border-gray-100 opacity-60")}>
                            <CardContent className="p-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={finding.included} onChange={() => toggleFinding(finding.id)} className="w-4 h-4" />
                                        <Typography variant="body" className="font-medium text-slate-900">{finding.text}</Typography>
                                    </label>
                                    {finding.sourceSession ? (
                                      <Badge variant="soft" className="bg-slate-100 text-slate-500 border-none font-medium">
                                        {finding.sourceSession}
                                      </Badge>
                                    ) : (
                                      <button className="text-xs text-slate-400 hover:text-slate-600">Edit</button>
                                    )}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {/* Existing Tags */}
                                        {normalizeTags(finding.tags ?? finding.tag).map((t: string) => (
                                            <Badge key={t} variant="soft" className="px-2 py-0.5 text-xs text-slate-500 font-mono flex items-center gap-1 group">
                                                {t}
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        removeTag(finding.id, t);
                                                    }}
                                                    className="opacity-40 hover:opacity-100 hover:text-red-500 transition-all cursor-pointer"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </Badge>
                                        ))}
                                        
                                        {/* Existing Framework */}
                                        {finding.framework && (
                                            <Badge variant="soft" className="px-2 py-0.5 text-xs text-slate-400 bg-gray-50 border border-gray-100 font-mono">
                                                <BookOpen size={10} className="mr-1" />
                                                {finding.framework}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <Select 
                                              label="Add Tag"
                                              value=""
                                              onChange={(e) => toggleTag(finding.id, e.target.value)}
                                            >
                                              <option value="" disabled>Select Tag</option>
                                              {COMMON_TAGS.map(tag => (
                                                <option key={tag} value={tag}>{tag}</option>
                                              ))}
                                            </Select>
                                        </div>
                                        <div className="flex-1">
                                            <Select 
                                              label="Framework"
                                              value={finding.framework || ""}
                                              onChange={(e) => updateFinding(finding.id, 'framework', e.target.value)}
                                            >
                                              <option value="">None</option>
                                              {COMMON_FRAMEWORKS.map(fw => (
                                                <option key={fw} value={fw}>{fw}</option>
                                              ))}
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {findings.filter(f => f.included).length === 0 && (
                      <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <Typography variant="body" className="text-slate-400 italic">No supporting evidence selected.</Typography>
                      </div>
                    )}
                </div>
              )}
          </div>

        <Textarea
          label={isAddMode ? "Reason to add" : "Reason to modify"}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="min-h-[100px]"
          placeholder={isAddMode ? (isNextStep ? "Explain why you are adding this next step..." : "Explain why you are adding this criterion...") : "Explain why you are making these modifications..."}
        />
      </div>
    </Modal>
  );
}

function DropdownPicker({ 
  label, 
  options, 
  selected, 
  onToggle, 
  single = false 
}: { 
  label: string, 
  options: string[], 
  selected: string[], 
  onToggle: (val: string) => void,
  single?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-[11px] border border-gray-200 rounded px-2 py-1.5 bg-white text-slate-600 hover:border-gray-300 transition-colors"
      >
        <span className="truncate">{selected.length > 0 ? selected.join(', ') : `Select ${label}`}</span>
        <ChevronDown size={12} className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <Search size={12} className="text-gray-400" />
            <input 
              autoFocus
              className="w-full bg-transparent text-xs outline-none"
              placeholder={`Search ${label}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {filtered.length > 0 ? (
              filtered.map(opt => {
                const isSelected = selected.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      onToggle(opt);
                      if (single) setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-2 py-1.5 text-xs rounded transition-colors flex items-center justify-between group",
                      isSelected ? "bg-primary/5 text-primary font-medium" : "hover:bg-gray-50 text-slate-600"
                    )}
                  >
                    <span>{opt}</span>
                    <div className="flex items-center gap-1.5">
                      {isSelected ? (
                        <span className="text-[10px] text-red-500 opacity-0 group-hover:opacity-100">Remove</span>
                      ) : (
                        <Plus size={10} className="text-gray-400 group-hover:text-primary" />
                      )}
                      {isSelected && <Check size={10} className="text-primary" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-gray-400">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SkipNextStepModal({ isOpen, onClose, item, onConfirm }: { isOpen: boolean, onClose: () => void, item: any, onConfirm: () => void }) {
  if (!item) return null;
  const footer = (
    <>
      <button 
        onClick={onClose} 
        className="px-6 py-2.5 text-[#06302c] font-semibold hover:bg-gray-100 rounded-md transition-colors"
      >
        Cancel
      </button>
      <button 
        onClick={() => {
          onConfirm();
          onClose();
        }}
        className="px-6 py-2.5 bg-[#06302c] text-white font-semibold rounded-md shadow-md hover:opacity-90 transition-all"
      >
        Skip Step
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Skip Next Step" footer={footer} width={520}>
      <div className="flex flex-col gap-8">
        <div className="relative w-full">
          <div className="border border-gray-300 rounded p-4 bg-gray-100 text-base text-gray-500">
            {item?.label}
          </div>
          <div className="absolute -top-2 left-3 bg-white px-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Next step name:</p>
          </div>
        </div>

        <div>
          <div className="text-lg font-medium text-[#06302c] mb-4">Target level :</div>
          <div className="relative w-full">
            <div className="border border-gray-300 rounded px-4 py-3 flex justify-between items-center min-h-[56px]">
              <div className="flex flex-wrap gap-2">
                <div className="bg-sky-50 text-sky-600 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border border-sky-100">
                  {item?.impact}
                  <button className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-white text-[10px]">✕</button>
                </div>
              </div>
            </div>
            <div className="absolute -top-2 left-3 bg-white px-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Impact setting</p>
            </div>
          </div>
        </div>

        <div className="relative w-full">
          <div className="border border-gray-300 rounded p-3">
            <textarea 
              placeholder="Type here..."
              className="w-full border-none outline-none text-base text-gray-900 resize-none min-h-[120px] bg-transparent"
            />
          </div>
          <div className="absolute -top-2 left-3 bg-white px-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Why are you skipping this next step?</p>
          </div>
          <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">Reason (optional)</div>
        </div>
      </div>
    </Modal>
  );
}

export function CreateClinicalEvidenceModal({ 
  isOpen, 
  onClose, 
  onCreate,
  initialText = "",
  initialTags = [],
  editingItem = null,
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onCreate: (data: any) => void,
  initialText?: string,
  initialTags?: string[],
  editingItem?: any | null,
}) {
  const [text, setText] = useState(initialText);
  const [type, setType] = useState<'verbatim' | 'behavioural'>('verbatim');
  const [tags, setTags] = useState<string[]>(initialTags);
  const [notes, setNotes] = useState("");
  const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    if (editingItem) {
      setText(editingItem.text || "");
      setType(editingItem.type || "verbatim");
      setTags(editingItem.tags || []);
      setNotes(editingItem.notes || "");
    } else {
      setText(initialText);
      setTags(initialTags);
      setType('verbatim');
      setNotes("");
    }
  }, [initialText, initialTags, editingItem, isOpen]);

  const handleCreate = () => {
    onCreate({
      ...editingItem,
      id: editingItem ? editingItem.id : `ev-${Date.now()}`,
      text,
      type,
      tags,
      notes,
      timestamp: editingItem?.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      framework: editingItem?.framework || "DSM-5",
      isUserGenerated: true,
    });
    // Reset state handled by useEffect on close/open
    onClose();
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} className="px-6 py-2.5">
        Cancel
      </Button>
      <Button 
        onClick={handleCreate}
        className="px-6 py-2.5 bg-[#06302c] text-white font-semibold rounded-md shadow-md hover:opacity-90 transition-all"
      >
        {editingItem ? 'Save Changes' : 'Create Clinical Evidence'}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? "Edit Clinical Evidence" : "Create Clinical Evidence"} footer={footer} width={600}>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <button 
              onClick={() => setType('verbatim')}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                type === 'verbatim' ? "border-[#06302c] bg-[#06302c]/5" : "border-divider bg-white hover:border-gray-300"
              )}
            >
              <Typography variant="body" className={cn("font-bold", type === 'verbatim' ? "text-[#06302c]" : "text-slate-600")}>Verbatim</Typography>
              <Typography variant="label-micro" className="text-slate-400">Direct client quote</Typography>
            </button>
            <button 
              onClick={() => setType('behavioural')}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                type === 'behavioural' ? "border-[#06302c] bg-[#06302c]/5" : "border-divider bg-white hover:border-gray-300"
              )}
            >
              <Typography variant="body" className={cn("font-bold", type === 'behavioural' ? "text-[#06302c]" : "text-slate-600")}>Behavioural</Typography>
              <Typography variant="label-micro" className="text-slate-400">Observed clinical pattern</Typography>
            </button>
          </div>

          <div className="space-y-2">
            <Typography variant="label-micro" className="text-text-secondary uppercase font-bold tracking-wider">
              {type === 'verbatim' ? 'Evidence Text (Quote)' : 'Observation Summary'}
            </Typography>
            <Textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              className="min-h-[100px]"
              placeholder={type === 'verbatim' ? "Enter verbatim text from transcript..." : "Describe the observed clinical behavior..."}
            />
          </div>

          <div className="space-y-2">
             <Typography variant="label-micro" className="text-text-secondary uppercase font-bold tracking-wider">Clinical Tags</Typography>
             <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] p-3 bg-slate-50 border border-divider rounded-xl">
               {tags.map(tag => (
                 <Badge key={tag} variant="soft" className="bg-[#06302c]/10 text-[#06302c] border-none px-2 py-1 flex items-center gap-1.5 animate-in fade-in zoom-in-75 duration-200">
                   {tag}
                   <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => toggleTag(tag)} />
                 </Badge>
               ))}
               {tags.length === 0 && <span className="text-xs text-slate-400 italic">No tags selected yet...</span>}
             </div>
             
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <Input 
                  placeholder="Search and add clinical tags..." 
                  className="pl-9 h-10 text-sm"
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                />
             </div>
             
             <div className="flex flex-wrap gap-1.5 mt-3 max-h-[120px] overflow-y-auto pr-1">
                {COMMON_TAGS.filter(t => t.toLowerCase().includes(searchTag.toLowerCase())).map(tag => (
                  <button 
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border",
                      tags.includes(tag) 
                        ? "bg-[#06302c] text-white border-[#06302c]" 
                        : "bg-white text-slate-500 border-divider hover:border-gray-400"
                    )}
                  >
                    {tag}
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-2">
            <Typography variant="label-micro" className="text-text-secondary uppercase font-bold tracking-wider">Clinical Notes</Typography>
            <Textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Add additional context or notes for this evidence..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function CognitiveLoopModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const footer = (
    <button 
      onClick={onClose}
      className="px-8 py-2.5 bg-[#06302c] text-white font-semibold rounded-md shadow-md hover:opacity-90 transition-all"
    >
      Close
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="The Cognitive Loop" footer={footer} width={640}>
      <div className="flex flex-col gap-6">
        <p className="text-[15px] text-gray-600 leading-relaxed">
          The Cognitive Loop is a structured sequential process designed to guide clinical reasoning and ensure thorough evaluation of diagnostic evidence.
        </p>

        <div className="flex flex-col gap-5">
          {[
            { step: 1, label: "Initial Evidence Collection", desc: "Gathering and documenting raw clinical observations and data points." },
            { step: 2, label: "Feature Extraction", desc: "Identifying key clinical features and patterns from the collected evidence." },
            { step: 3, label: "Criterion Mapping", desc: "Mapping clinical features to formal diagnostic criteria from established guidelines." },
            { step: 4, label: "Uncertainty Analysis", desc: "Reviewing mapping confidence and identifying gaps or contradictions in evidence." },
            { step: 5, label: "Refinement & Next Steps", desc: "Defining specific actions to resolve clinical uncertainty or gather missing data." },
            { step: 6, label: "Clinical Formulation", desc: "Finalising the working impression based on the validated evidence chain." }
          ].map(s => (
            <div key={s.step} className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-[#06302c] text-white flex items-center justify-center text-sm font-bold shrink-0">
                {s.step}
              </div>
              <div>
                <div className="text-[15px] font-semibold text-gray-900 mb-1">{s.label}</div>
                <div className="text-sm text-gray-600 leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
