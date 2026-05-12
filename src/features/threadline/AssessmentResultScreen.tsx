import React from "react";
import { InterpRow } from "./components";
import { DataPoint } from "../../components/ui";
import { Download as DownloadIcon, ArrowLeft as BackArrow } from "lucide-react";
import { MOCK_CLIENTS } from "./mockData";
import { 
  Button, 
  Card, 
  Typography, 
  Badge 
} from "../../components/ui";
import { cn } from "../../lib/utils";

import { DetailViewLayout } from "./components/DetailViewLayout";

export function AssessmentResultScreen({ clientId, onBack, onGuidelinesClick }: { clientId: string, onBack: () => void, onGuidelinesClick?: () => void }) {
  const clientMeta = MOCK_CLIENTS.find(c => c.id === clientId) || MOCK_CLIENTS[0];
  
  return (
    <DetailViewLayout
      onBack={onBack}
      backLabel="Back to Assessments"
      title="WHO-5 (World Health Organization-5 Well-Being Index)"
      subtitle="View and download assessment results and clinical reports for this client."
      metaBanner={[
        { label: "Patient Name", value: clientMeta.name },
        { label: "Date Administered", value: "17 December 2025" },
        { label: "Date of Birth", value: "17 Dec 2001 (24y)" },
        { label: "Assessor", value: "Dr. Marcus Thorne" },
        { label: "Completion Time", value: "12 minutes" },
      ]}
      headerActions={
        <Button variant="brand" className="shrink-0">
          <DownloadIcon size={18} /> Download Results
        </Button>
      }
    >
      <div className="space-y-12">
        {/* Visual Summary */}
        <div className="bg-white border border-divider rounded-xl overflow-hidden shadow-sm">
          <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
              <Typography variant="h3">Overall Severity Level</Typography>
            </div>
            
            <div className="relative pt-6 pb-2">
              <div className="h-8 w-full bg-[#f5f5f5] rounded-full overflow-hidden relative">
                {/* Fill */}
                <div className="absolute top-0 bottom-0 left-0 bg-[#f7c5a8] rounded-full transition-all duration-1000 ease-out" style={{ width: '70%' }} />
              </div>
              
              {/* Clinical Threshold Marker */}
              <div className="absolute top-6 bottom-[-8px] left-[58.3%] w-0.5 bg-emerald-900 z-10 overflow-visible">
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-text-secondary font-medium pt-0.5">Clinical Threshold</div>
                 <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold text-text-primary pt-1">35</div>
              </div>

              {/* Labels below */}
              <div className="flex justify-between text-sm text-text-secondary font-medium mt-6">
                <span>0 - Minimal</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>
          </div>

          {/* Score table */}
          <div className="border-t border-divider w-full">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-divider">
                  {["Metric", "Relevance Score", "Percentile", "Descriptor"].map(h => (
                    <th key={h} className="px-6 py-4">
                      <Typography variant="label-micro" className="text-text-primary uppercase tracking-wider">{h}</Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-divider bg-white">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <Typography variant="body" className="font-bold text-text-primary">Total Score</Typography>
                  </td>
                  <td className="px-6 py-5">
                    <Typography variant="body" className="text-text-secondary">42 / 60</Typography>
                  </td>
                  <td className="px-6 py-5">
                    <Typography variant="body" className="text-text-secondary">70th</Typography>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant="soft" className="bg-amber-100 text-amber-800 border-none font-bold px-4">Moderate</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Interpretation section */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-6">
             <Typography variant="h3">Clinical Interpretation</Typography>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <InterpRow 
              title="Overall Impression" 
              content="Liam's responses indicate a moderate level of well-being over the past two weeks. While several domains show resilience, there are specific areas related to sleep quality and daily energy levels that fall below the expected threshold for his age group." 
              defaultOpen={true} 
            />
            <InterpRow 
              title="Symptom Analysis" 
              content="The raw scores suggest a pattern of intermittent anxiety specifically triggered by academic deadlines. His 'Worry' thread scores were elevated (14/21), indicating a need for targeted mindfulness interventions." 
            />
            <InterpRow 
              title="Recommended Next Steps" 
              content="" 
              isNextStep={true} 
              editable={true} 
            />
          </div>
        </div>
      </div>
    </DetailViewLayout>
  );
}
