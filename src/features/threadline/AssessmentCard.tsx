import React from 'react';
import { FileText, Calendar, Share2, Link as LinkIcon, Check, ExternalLink } from 'lucide-react';
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { StatusBadge } from '../../components/shared/StatusBadge';
import { EntityCard } from './EntityCard';
import { Button, Typography } from '../../components/ui';
import { cn } from '../../lib/utils';

export interface AssessmentCardProps {
  title: string;
  subtitle: string;
  status: string;
  onViewResult: () => void;
  onShare?: () => void;
  key?: React.Key;
  date?: string;
  description?: string;
  notes?: string;
  overallImpression?: string;
  score?: string;
  percentile?: string;
  descriptor?: string;
}

export function AssessmentCard({ 
  title, 
  subtitle, 
  status, 
  onViewResult, 
  onShare,
  date, 
  description, 
  notes,
  overallImpression,
  score,
  percentile,
  descriptor
}: AssessmentCardProps) {
  const { flags } = useFeatureFlags();
  const [copied, setCopied] = React.useState(false);
  const joinLink = "https://telehealth.threadline.com.au/join/{sessionId}?token=...";

  return (
    <EntityCard
      title={title}
      summary={subtitle}
      statusBadge={<StatusBadge status={status as any} />}
      hoverable={true}
      metadata={[
        ...(overallImpression ? [{ label: "Overall Impression", value: <span className="text-primary font-medium">{overallImpression}</span> }] : []),
        ...(score ? [{ label: "Relevance score", value: score }] : []),
        ...(percentile ? [{ label: "Percentile", value: percentile }] : []),
        ...(descriptor ? [{ label: "Descriptor", value: descriptor }] : [])
      ]}
      rightAction={
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost"
            size="sm"
            className="font-bold text-xs"
            iconRight={<ExternalLink size={14} />}
            onClick={(e) => { 
              e.stopPropagation(); 
              // View questionnaire logic
            }}
          >
            View Questionnaire
          </Button>
          
          <div className="flex items-center gap-3">
            {status.toLowerCase() !== 'completed' && status.toLowerCase() !== 'not-started' && status.toLowerCase() !== 'not started' && (
              <div className="flex items-center gap-3 bg-gray-50/80 px-3 py-1.5 rounded-lg border border-divider shadow-sm">
                <Typography variant="label-micro" className="text-text-disabled uppercase tracking-widest hidden md:block">Session Access</Typography>
                <div className="flex items-center gap-2">
                  <LinkIcon size={12} className="text-text-disabled" />
                  <span className="text-[10px] text-text-secondary max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap font-mono bg-white px-1.5 py-0.5 rounded border border-divider">
                    {joinLink}
                  </span>
                  <Button 
                    size="sm"
                    variant={copied ? "ghost" : "ghost"}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setCopied(true); 
                      navigator.clipboard.writeText(joinLink);
                      setTimeout(() => setCopied(false), 1500); 
                    }} 
                    className={cn(
                      "h-6 px-2 text-[10px] font-bold transition-all duration-300",
                      copied ? "text-success-dark bg-success-light/30" : "text-primary hover:bg-primary/5"
                    )}
                  >
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => { 
                e.stopPropagation(); 
                if ((status.toLowerCase() === 'not-started' || status.toLowerCase() === 'not started') && onShare) {
                  onShare();
                } else if (status.toLowerCase() === 'not-started' || status.toLowerCase() === 'not started') {
                  const link = `https://portal.threadline.com.au/assessment/${title.toLowerCase().replace(/\s+/g, '-')}`;
                  navigator.clipboard.writeText(link);
                  alert("Link copied to clipboard for sharing with client");
                } else {
                  onViewResult();
                }
              }} 
              className="font-bold border-divider hover:bg-gray-50"
              icon={(status.toLowerCase() === 'not-started' || status.toLowerCase() === 'not started') ? <Share2 size={14} /> : undefined}
            >
              {(status.toLowerCase() === 'not-started' || status.toLowerCase() === 'not started') ? "Share" : "View Workspace"}
            </Button>
          </div>
        </div>
      }
      onClick={onViewResult}
    >
      {flags.FEATURE_ASSESSMENT_DETAILS && (description || notes) && (
        <div className="flex flex-col gap-4">
          {description && (
            <div className="flex gap-3 items-start bg-gray-50/50 p-3 rounded-lg border border-divider/50">
              <FileText size={16} className="text-text-disabled mt-0.5 shrink-0" />
              <Typography variant="body-sm" className="text-text-primary leading-relaxed">
                {description}
              </Typography>
            </div>
          )}
          {notes && (
            <div className="flex gap-3 items-start">
              <Calendar size={16} className="text-text-disabled mt-0.5 shrink-0" />
              <div className="text-sm leading-relaxed">
                <span className="font-bold text-text-primary text-xs uppercase tracking-wider mr-2">Clinical Notes</span>
                <Typography variant="body-sm" className="text-text-secondary inline">
                  {notes}
                </Typography>
              </div>
            </div>
          )}
        </div>
      )}
    </EntityCard>
  );
}
