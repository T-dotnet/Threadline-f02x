/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Button, 
  Input, 
  Select, 
  Typography,
  Label,
  Textarea,
  Checkbox,
  Separator
} from "../../ui";

export function FormTemplate() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    notes: "",
    consent: false
  });

  return (
    <div className="max-w-2xl mx-auto p-12 bg-white rounded-2xl border border-divider shadow-sm my-12">
      <div className="space-y-1 mb-8">
        <Typography variant="h3" className="italic tracking-tight">Entity Configuration</Typography>
        <Typography variant="body-sm" className="text-slate-500">Configure the primary details for the new clinical subject.</Typography>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              placeholder="e.g. John" 
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              placeholder="e.g. Archer" 
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Assigned Gender</Label>
          <Select 
            id="gender" 
            value={formData.gender}
            onChange={e => setFormData({...formData, gender: e.target.value})}
          >
            <option value="">Select Gender...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Clinical Background</Label>
          <Textarea 
            id="notes" 
            placeholder="Enter relevant history or intake notes..." 
            className="min-h-[120px]"
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <Separator />

        <div className="flex items-start gap-3">
          <Checkbox 
            id="consent" 
            checked={formData.consent}
            onChange={e => setFormData({...formData, consent: e.target.checked})}
          />
          <div className="space-y-1">
            <Label htmlFor="consent" className="cursor-pointer">Patient Consent Verified</Label>
            <p className="text-[11px] text-slate-400 italic leading-relaxed">
              By checking this box, you confirm that physical or digital consent forms have been received and verified for this patient profile.
            </p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-divider pt-6">
          <Button variant="ghost">Reset Form</Button>
          <Button variant="brand">Create Subject Profile</Button>
        </div>
      </form>
    </div>
  );
}
