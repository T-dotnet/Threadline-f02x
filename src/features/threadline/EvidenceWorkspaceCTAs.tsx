/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ThumbsUp, ThumbsDown, Edit3, Clock, XCircle } from "lucide-react";
import { Button } from "../../components/ui";

interface EvidenceWorkspaceCTAsProps {
  type: 'session' | 'criteria' | 'nextstep' | 'evidence';
  onAccept: () => void;
  onReject: () => void;
  onModify: () => void;
  onDefer: () => void;
  onSkip?: () => void;
  disabled?: boolean;
}

export function EvidenceWorkspaceCTAs({
  type,
  onAccept,
  onReject,
  onModify,
  onDefer,
  onSkip,
  disabled = false
}: EvidenceWorkspaceCTAsProps) {
  const isSession = type === 'session';
  const isNextStep = type === 'nextstep';

  return (
    <div className="w-full flex flex-wrap gap-4">
      <Button 
        variant="outline" 
        className="flex-1 min-w-[120px] py-6 text-base font-bold border-success text-success-dark hover:bg-success-light/20 bg-white shadow-sm"
        disabled={disabled}
        onClick={onAccept}
      >
        <ThumbsUp size={20} className="mr-2" /> Accept
      </Button>

      {isNextStep ? (
        <Button 
          variant="outline" 
          className="flex-1 min-w-[120px] py-6 text-base font-bold border-error text-error-dark hover:bg-error-light/20 bg-white shadow-sm"
          disabled={disabled}
          onClick={onSkip}
        >
          <XCircle size={20} className="mr-2" /> Skip
        </Button>
      ) : (
        <Button 
          variant="outline" 
          className="flex-1 min-w-[120px] py-6 text-base font-bold border-error text-error-dark hover:bg-error-light/20 bg-white shadow-sm"
          disabled={disabled}
          onClick={onReject}
        >
          <ThumbsDown size={20} className="mr-2" /> Reject
        </Button>
      )}

      <Button 
        variant="outline" 
        className="flex-1 min-w-[120px] py-6 text-base font-bold border-brand text-primary hover:bg-primary-light/20 bg-white shadow-sm"
        disabled={disabled}
        onClick={onModify}
      >
        <Edit3 size={20} className="mr-2" /> Modify
      </Button>
      
      {!isNextStep && (
        <Button 
          variant="outline" 
          className="flex-1 min-w-[120px] py-6 text-base font-bold border-orange-400 text-orange-600 hover:bg-orange-50 bg-white shadow-sm"
          disabled={disabled}
          onClick={onDefer}
        >
          <Clock size={20} className="mr-2" /> Defer
        </Button>
      )}
    </div>
  );
}
