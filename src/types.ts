/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Condition {
  id: number;
  name: string;
  category: string;
  code: string;
  guideline: string;
  status: string;
  updated: string;
  population: string;
  reviewer: string;
  overview: string;
  refs: string[];
}

export interface DecisionUnit {
  id: number;
  type: string;
  status: string;
  group: string;
  logic: string;
  pop: string;
  source: string;
  ok: boolean;
  explanation?: string;
  notes?: string;
  createdBy?: string;
  lastUpdated?: string;
  version?: string;
  changeNotes?: string;
  sourceLink?: string;
}

export interface GuidelineSection {
  id: string;
  label: string;
}

export type SortDirection = "asc" | "desc";
export type SortField = keyof Condition;

export enum WorkFlowStatus {
  NOT_STARTED = 'not-started',
  REQUIRED = 'required',
  MISSING = 'missing',
  IN_PROGRESS = 'in-progress',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  UPLOADED = 'uploaded',
  READY = 'ready',
  CONFLICT = 'conflicts-unresolved',
  OPTIONAL = 'optional',
  IDLE = 'idle'
}
