/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Modal, Typography, Button } from "../../../components/ui";

export function DocumentCompletenessModal({ 
  isOpen, 
  onClose,
  missingDocuments = [],
  onProceed,
  onUploadNow
}: { 
  isOpen: boolean, 
  onClose: () => void,
  missingDocuments?: string[],
  onProceed?: () => void,
  onUploadNow?: () => void
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Missing Documentation">
       <div className="space-y-6">
          <div className="bg-error-light/30 border border-error/10 p-4 rounded-xl flex items-start gap-4">
            <AlertTriangle className="text-error shrink-0" size={20} />
            <div className="space-y-1">
                <Typography variant="body-sm" className="font-bold text-error-dark">
                  Required documents are missing
                </Typography>
                <Typography variant="body-sm" className="text-error-dark/80">
                  The diagnostic framework requires the following for high-confidence mapping:
                </Typography>
            </div>
          </div>

          <div className="space-y-3">
             {missingDocuments.map(doc => (
                 <div key={doc} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-divider">
                    <FileX size={16} className="text-text-disabled" />
                    <Typography variant="body-sm" className="font-semibold capitalize">{doc.replace(/-/g, ' ')}</Typography>
                 </div>
             ))}
          </div>

          <div className="p-4 bg-info-light/30 rounded-xl border border-info/10">
            <Typography variant="body-sm" className="text-info-dark">
              Proceeding without these may result in lower mapping confidence.
            </Typography>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={onUploadNow}>Upload Now</Button>
            <Button variant="brand" onClick={onProceed}>Proceed Anyway</Button>
          </div>
       </div>
    </Modal>
  );
}

import { AlertTriangle, FileX } from "lucide-react";
