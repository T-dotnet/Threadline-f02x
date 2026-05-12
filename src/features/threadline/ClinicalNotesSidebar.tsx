import React, { useState } from "react";
import { StickyNote, ChevronRight, ChevronLeft, Calendar, Plus, MessageSquare, Link as LinkIcon, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { MOCK_CLIENT_DATA } from "./mockData";
import { Typography, Badge, Button, Card, CardContent, Textarea } from "../../components/ui";
import { cn } from "../../lib/utils";

interface ClinicalNote {
  id: string;
  date: string;
  content: string;
  sessionId?: string;
  type: 'session' | 'standalone';
}

export function ClinicalNotesSidebar() {
  const { activeAssessmentId } = useFeatureFlags();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  
  // Use clientId "125566" as default for the demo assessment view if not specified
  const clientId = "125566";
  const clientData = MOCK_CLIENT_DATA[clientId];
  
  const [standaloneNotes, setStandaloneNotes] = useState<ClinicalNote[]>([]);

  if (!clientData) return null;

  // Convert sessions to notes
  const sessionNotes: ClinicalNote[] = clientData.sessions.map((s, idx) => ({
    id: `session-note-${idx}`,
    date: s.date,
    content: s.notes,
    sessionId: String(idx),
    type: 'session'
  }));

  const allNotes = [...sessionNotes, ...standaloneNotes].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleSaveNote = () => {
    if (!newNoteContent.trim()) return;
    
    const newNote: ClinicalNote = {
      id: `standalone-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      content: newNoteContent,
      type: 'standalone'
    };
    
    setStandaloneNotes([newNote, ...standaloneNotes]);
    setNewNoteContent("");
    setIsAdding(false);
  };

  return (
    <div className="fixed right-0 top-16 bottom-0 z-[101] flex pointer-events-none">
      {/* Toggle Button */}
      <div className="flex flex-col justify-start pt-[360px] h-full transform-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "border-none rounded-l-xl py-5 px-2.5 cursor-pointer shadow-[-4px_0_12px_rgba(0,0,0,0.1)] pointer-events-auto flex flex-col items-center gap-4 transition-all duration-300",
            isOpen ? "bg-white text-primary border-y border-l border-divider" : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          <div className="writing-vertical text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
            Clinical Notes
          </div>
          <StickyNote size={18} className={isOpen ? "text-primary" : "text-white"} />
        </button>
      </div>

      {/* Sidebar Content */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-[380px] bg-white border-l border-divider shadow-[-4px_0_24px_rgba(0,0,0,0.08)] flex flex-col pointer-events-auto"
          >
            <div className="px-6 py-5 border-b border-divider flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <StickyNote size={18} />
                </div>
                <Typography variant="h3" className="text-lg font-sans">Clinical Notes</Typography>
              </div>
              <Button 
                size="sm"
                variant={isAdding ? "ghost" : "brand"}
                onClick={() => setIsAdding(!isAdding)}
                className="h-8"
              >
                {isAdding ? <X size={16} /> : <><Plus size={16} className="mr-1" /> New Note</>}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence>
                {isAdding && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="mb-8"
                  >
                    <Card className="border-primary/20 bg-primary/5 shadow-md overflow-hidden">
                      <CardContent className="p-4 space-y-4">
                        <Typography variant="label-micro" className="text-primary font-bold tracking-widest block">
                          New Clinical Entry
                        </Typography>
                        <Textarea 
                          value={newNoteContent}
                          onChange={(e) => setNewNoteContent(e.target.value)}
                          placeholder="Document clinical observations, justifications, or session summaries..."
                          className="min-h-[140px] bg-white border-primary/20 focus:ring-primary/10"
                          autoFocus
                        />
                        <div className="flex justify-end gap-2 pt-2">
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsAdding(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="brand"
                            size="sm"
                            onClick={handleSaveNote}
                            icon={<Save size={14} />}
                          >
                            Save Note
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-5">
                {allNotes.length === 0 ? (
                  <div className="py-20 text-center text-text-disabled italic text-sm">
                    No clinical notes available.
                  </div>
                ) : (
                  allNotes.map((note) => (
                    <Card 
                      key={note.id} 
                      className={cn(
                        "transition-all duration-300 hover:shadow-md",
                        note.type === 'session' ? "bg-white border-divider" : "bg-indigo-50/30 border-indigo-100"
                      )}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar size={13} className="text-text-disabled" />
                            <Typography variant="label-micro" className="text-text-secondary font-bold">
                              {note.date}
                            </Typography>
                          </div>
                          <Badge variant={note.type === 'session' ? 'outline' : 'brand'} className="text-[9px] uppercase tracking-wider py-0 px-1.5 h-4">
                            {note.type === 'session' ? 'Session Linked' : 'Stand-alone'}
                          </Badge>
                        </div>
                        
                        <Typography variant="body-sm" className="leading-relaxed text-text-primary">
                          {note.content}
                        </Typography>

                        {note.type === 'session' && (
                          <div className="mt-2 pt-3 border-t border-dashed border-divider flex items-center justify-between group/link cursor-pointer">
                            <div className="flex items-center gap-2">
                              <LinkIcon size={12} className="text-primary/60" />
                              <Typography variant="label-micro" className="text-primary font-medium lowercase">
                                {clientData.sessions[parseInt(note.sessionId!)].focus}
                              </Typography>
                            </div>
                            <ChevronRight size={14} className="text-text-disabled group-hover/link:text-primary transition-colors" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            <div className="p-5 border-t border-divider bg-gray-50">
              <div className="flex items-center gap-2 text-[10px]/[15px] font-bold tracking-[0.1em] text-text-disabled uppercase">
                <MessageSquare size={12} className="opacity-50" />
                <span>Reference database for evaluation support</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
