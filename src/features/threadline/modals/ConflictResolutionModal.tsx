import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { Modal, Button, Typography } from "../../../components/ui";

interface ConflictResolutionModalProps {
  isOpen: boolean;
  conflicts: any[];
  onResolve: () => void;
  onSkip: () => void;
}

export function ConflictResolutionModal({ isOpen, conflicts, onResolve, onSkip }: ConflictResolutionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onSkip}
      title="Unresolved Conflicts"
      width={480}
      footer={
        <div className="flex gap-3 w-full">
          <Button variant="outline" onClick={onSkip} className="flex-1">
            Skip for Now
          </Button>
          <Button variant="error" onClick={onResolve} className="flex-1">
            Resolve Conflicts
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex gap-4 p-4 bg-error-light/30 rounded-xl border border-error/10">
          <AlertTriangle className="text-error shrink-0" size={24} />
          <Typography variant="body-sm" className="text-error-dark leading-relaxed">
            You have {conflicts.length} unresolved conflict{conflicts.length > 1 ? 's' : ''}. 
            These must be resolved before proceeding to clinical analysis or generating reports.
          </Typography>
        </div>

        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
          {conflicts.map((c, i) => (
            <div 
              key={i} 
              className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-divider text-xs text-text-secondary leading-relaxed"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-error mt-1.5 shrink-0" />
              {c.description}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
