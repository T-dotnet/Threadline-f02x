import React from "react";
import { Button } from "../../../../components/ui/Button";

interface ModalFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel: string;
  isConfirmDisabled?: boolean;
  confirmIcon?: React.ReactNode;
  isDanger?: boolean;
}

export function ModalFooter({ 
  onCancel, 
  onConfirm, 
  cancelLabel = "Cancel", 
  confirmLabel, 
  isConfirmDisabled = false,
  confirmIcon,
  isDanger = false
}: ModalFooterProps) {
  return (
    <div className="flex justify-end gap-3 pt-4">
      <Button variant="outline" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button 
        variant={isDanger ? "danger" : "brand"} 
        onClick={onConfirm} 
        disabled={isConfirmDisabled}
        className="px-6"
      >
        {confirmIcon && <span className="mr-2">{confirmIcon}</span>}
        {confirmLabel}
      </Button>
    </div>
  );
}
