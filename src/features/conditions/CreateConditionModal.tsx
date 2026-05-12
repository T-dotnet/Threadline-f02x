/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { ALL_CATS } from "../../constants";
import { Modal, Input, Select, Button, Typography } from "../../components/ui";

interface CreateConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; category: string; guideline: string }) => void;
}

const CATEGORY_GUIDELINES: Record<string, string[]> = {
  "Feeding & Eating": ["DSM-5-TR", "ICD-11"],
  "Neurodevelopmental": ["ICD-11", "DSM-5-TR"],
  "Anxiety & Fear-Related": ["DSM-5-TR", "ICD-11", "National Health Service (NHS)"],
  "Obsessive-Compulsive & Related": ["ICD-11", "WHO Guidelines"],
  "Trauma & Stress-Related": ["DSM-5-TR", "ICD-11"],
  "Mood Disorders": ["ICD-11", "DSM-5-TR", "Internal Expert Consensus"],
  "Psychotic Disorders": ["DSM-5-TR", "ICD-11"],
  "Personality Disorders": ["ICD-11", "DSM-5-TR"],
};

export function CreateConditionModal({ isOpen, onClose, onCreate }: CreateConditionModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(ALL_CATS[0]);
  const [guideline, setGuideline] = useState("");

  const availableGuidelines = useMemo(() => {
    return CATEGORY_GUIDELINES[category] || ["ICD-11", "DSM-5-TR"];
  }, [category]);

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    const newGuidelines = CATEGORY_GUIDELINES[val] || ["ICD-11", "DSM-5-TR"];
    setGuideline(newGuidelines[0]);
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({ name, category, guideline: guideline || availableGuidelines[0] });
    setName("");
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create New Condition"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="brand" onClick={handleCreate} disabled={!name.trim()}>
            Create Guidelines
          </Button>
        </>
      }
    >
      <div className="space-y-6 py-2">
        <div className="space-y-2">
          <Typography variant="label-micro">Condition Details</Typography>
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Major Depressive Disorder"
          />
        </div>

        <div className="space-y-4">
          <Select 
            label="Category" 
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {ALL_CATS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>

          <Select 
            label="Guideline Source" 
            value={guideline}
            onChange={(e) => setGuideline(e.target.value)}
          >
            {availableGuidelines.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
}
