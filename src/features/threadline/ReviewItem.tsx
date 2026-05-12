import React from "react";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";
import { ConfidenceBadge, mapScoreToConfidence } from "../../components/shared/ConfidenceBadge";
import { AlertCircle, Check, X, Circle, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ReviewItemProps {
  label: string;
  score: string;
  active?: boolean;
  deferred?: boolean;
  accepted?: boolean;
  rejected?: boolean;
  hasConflict?: boolean;
  onClick: () => void;
  type?: string;
  sessionSource?: string;
  noStrike?: boolean;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ 
  label, 
  score, 
  active = false, 
  deferred = false, 
  accepted = false, 
  rejected = false, 
  hasConflict = false, 
  onClick, 
  type, 
  sessionSource, 
  noStrike = false 
}) => {
  const { flags } = useFeatureFlags();
  const isDeferredActive = active && deferred;
  const isAcceptedActive = active && accepted;
  const isRejectedActive = active && rejected;
  const isNextStep = type === 'nextstep';
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 py-4 px-6 relative transition-colors duration-200 border-l-4",
        "cursor-pointer",
        isAcceptedActive && "bg-[#ebf5eb]", // Light green background for accepted
        isRejectedActive && "bg-[#ffebee]", // Light red background for rejected
        isDeferredActive && "bg-orange-50", // Light orange for deferred/conflicting
        active && !isAcceptedActive && !isRejectedActive && !isDeferredActive && "bg-[#eceef2]", // Active but untouched
        !active && "bg-transparent", // Default background
        // Border colors based on state and active status
        active ? (
          accepted ? "border-green-700" :
          rejected ? "border-red-500" :
          deferred ? (noStrike ? "border-orange-500" : "border-red-500") :
          "border-[#2e5c8a]"
        ) : "border-transparent"
      )}
    >
      {!isNextStep ? (
        <>
          {hasConflict && !accepted && !rejected && !deferred && (
            <div title="Conflict detected" className="absolute top-2 right-2 text-orange-500">
              <AlertCircle size={12} />
            </div>
          )}
          {accepted ? (
            <div className="w-5 h-5 rounded-full border-2 border-green-700 flex items-center justify-center text-green-700 shrink-0">
              <Check size={12} strokeWidth={4} />
            </div>
          ) : rejected ? (
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[13px] font-bold shrink-0">
              !
            </div>
          ) : deferred ? (
            <div className={cn("shrink-0", noStrike ? "text-orange-500" : "text-gray-500")}>
              {noStrike ? (
                <AlertTriangle size={20} strokeWidth={2} />
              ) : (
                <Circle size={20} strokeWidth={2} />
              )}
            </div>
          ) : null}
        </>
      ) : null}
      
      <div className={cn(
        "flex-1",
        (isNextStep || (!accepted && !rejected && !deferred)) ? "pl-9" : ""
      )}>
        <div className={cn(
          "text-[15px] mb-1",
          (deferred && !noStrike) || rejected ? "text-red-500" : "text-slate-900",
          active ? "font-medium" : "font-normal",
          (deferred && !noStrike) ? "line-through" : "no-underline"
        )}>
          {label}
        </div>
        <div className="text-[13px] text-slate-500 flex flex-wrap items-center gap-1.5">
          {sessionSource && (
            <div className="text-[10px] text-[#2e5c8a] font-bold bg-[#eceef2] px-1.5 py-[1px] rounded uppercase">
              {sessionSource.split(',')[0]}
            </div>
          )}
          {flags.FEATURE_CONFIDENCE_BADGE ? (
            <div className="mt-1">
              <ConfidenceBadge 
                confidence={
                  !isNaN(parseFloat(score)) 
                    ? mapScoreToConfidence(parseFloat(score))
                    : (score.toLowerCase() === 'high' ? 'high' : score.toLowerCase() === 'medium' ? 'medium' : 'low')
                } 
              />
            </div>
          ) : (
            <>
              {isNextStep ? "Impact :" : (type === 'criteria' ? "Certainty score :" : "Relevance score :")} <span className="font-normal">{score}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
