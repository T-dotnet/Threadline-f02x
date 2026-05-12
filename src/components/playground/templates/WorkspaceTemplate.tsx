/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { MessageSquare, FileText, CheckCircle2, ChevronRight, CornerDownRight, Activity } from "lucide-react";
import { 
  Button, 
  Typography,
  Badge,
  Separator,
  Progress,
} from "../../ui";
import { SectionHeader } from "../../shared/SectionHeader";
import { ReviewItem } from "../../../features/threadline/ReviewItem";

export function WorkspaceTemplate() {
  const [complete, setComplete] = useState(65);

  return (
    <div className="flex flex-col h-full bg-workspace-bg relative overflow-hidden">
      {/* Three Column Layout Mockup */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Navigation/Index */}
        <aside className="w-72 border-r border-divider bg-white/50 backdrop-blur-sm flex flex-col p-6 gap-8 overflow-y-auto hidden lg:flex">
          <SectionHeader title="Assessment Index" />
          
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-2 bg-primary-light text-primary rounded-lg font-bold text-xs uppercase tracking-widest cursor-pointer">
                <FileText size={14} />
                Intake Review
              </div>
              <div className="pl-6 space-y-1 mt-2">
                <div className="text-[11px] text-slate-500 font-medium py-1 px-2 hover:bg-slate-100 rounded cursor-pointer flex items-center justify-between">
                  Identity Details
                  <CheckCircle2 size={12} className="text-success" />
                </div>
                <div className="text-[11px] text-slate-500 font-medium py-1 px-2 hover:bg-slate-100 rounded cursor-pointer flex items-center justify-between">
                  Symptom Baseline
                  <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 text-slate-400 font-bold text-xs uppercase tracking-widest cursor-pointer hover:bg-slate-100 rounded-lg transition-colors">
              <MessageSquare size={14} />
              Session Transcript
            </div>
          </div>
        </aside>

        {/* Center: Main Verification Area */}
        <main className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 pb-32">
           <div className="flex items-center justify-between">
             <div className="flex flex-col gap-1">
               <Typography variant="h3" className="italic tracking-tight">Symptom Baseline Review</Typography>
               <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                 Source: Intake Questionnaire <ChevronRight size={12} /> Diagnostic Matrix
               </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="text-right">
                  <Typography variant="label-micro" className="text-slate-400 text-[9px] uppercase tracking-widest">Progress</Typography>
                  <div className="flex items-center gap-2">
                    <Progress value={complete} className="w-24 h-1" />
                    <span className="text-[10px] font-bold text-primary">{complete}%</span>
                  </div>
                </div>
             </div>
           </div>

           <div className="space-y-4">
              <ReviewItem 
                id="q1"
                title="Presence of Depressed Mood"
                description="Patient reports significant sadness for at least 2 weeks duration."
                source="Intake Section 4.2"
                confidence="high"
                onApprove={() => setComplete(prev => Math.min(prev + 5, 100))}
                onReject={() => {}}
              />
              <ReviewItem 
                id="q2"
                title="Marked Diminished Interest"
                description="Unable to enjoy typical recreational activities or social gatherings."
                source="Session 1 Transcript"
                confidence="medium"
                onApprove={() => setComplete(prev => Math.min(prev + 5, 100))}
                onReject={() => {}}
              />
           </div>
        </main>

        {/* Right: Context/Insights Sidebar */}
        <aside className="w-80 border-l border-divider bg-white flex flex-col hidden xl:flex">
           <div className="p-6 border-b border-divider bg-slate-50">
             <Typography variant="label-micro" className="text-slate-400 font-bold uppercase tracking-widest mb-4 block">AI Insights</Typography>
             <div className="p-4 bg-brand-light/20 border border-brand/10 rounded-xl space-y-3">
               <div className="flex items-center gap-2 text-brand font-bold text-[10px] uppercase tracking-widest">
                 <Activity size={14} />
                 Anomaly Detected
               </div>
               <p className="text-xs text-slate-600 leading-relaxed">
                 Intake reports 'Social Anxiety' but session transcript reflects 'General Distress' without specific social triggers.
               </p>
               <Button variant="brand" size="sm" className="w-full text-[10px] py-1.5 h-auto">Resolve Conflict</Button>
             </div>
           </div>
           
           <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="space-y-4">
                <Typography variant="label-micro" className="text-slate-400 font-bold uppercase tracking-widest">Linked Evidence</Typography>
                <div className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors">
                  <div className="mt-1 p-2 bg-slate-100 rounded text-slate-400 group-hover:bg-primary-light group-hover:text-primary transition-colors">
                    <FileText size={14} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-700">Initial Referral.pdf</div>
                    <div className="text-[10px] text-slate-400">Received Feb 12, 2026</div>
                  </div>
                </div>
              </div>
           </div>
        </aside>
      </div>

      {/* Persistent Status Bar Mockup */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-t border-divider p-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
           <div>
             <Typography variant="label-micro" className="text-slate-400 text-[9px] uppercase tracking-widest">Patient</Typography>
             <div className="text-xs font-bold text-primary">John Archer</div>
           </div>
           <div>
             <Typography variant="label-micro" className="text-slate-400 text-[9px] uppercase tracking-widest">Phase</Typography>
             <div className="text-xs font-bold text-slate-600">Clinical Review</div>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="ghost" size="sm">Save Draft</Button>
           <Button variant="brand" size="sm" onClick={() => alert('Advancing...')}>Finalize Review</Button>
        </div>
      </div>
    </div>
  );
}
