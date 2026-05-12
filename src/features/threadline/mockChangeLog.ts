/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChangeLogEntry {
  id: string;
  timestamp: string;
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  entityType: 'session' | 'assessment' | 'evidence' | 'client' | 'criteria' | 'nextstep';
  entityName: string;
  action: 'create' | 'modify' | 'status_change' | 'share' | 'delete';
  summary: string;
  details?: {
    reason?: string;
    changes?: {
      field: string;
      oldValue: string;
      newValue: string;
    }[];
    metadata?: Record<string, any>;
  };
}

export const MOCK_CHANGE_LOG: ChangeLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2024-04-21T14:30:00Z',
    user: { name: 'Sarah Miller', role: 'Clinical Lead' },
    entityType: 'session',
    entityName: 'Weekly Review - Anxiety Management',
    action: 'create',
    summary: 'New clinical session created for John Doe',
    details: {
      metadata: { clientId: 'client-1', sessionType: 'Verbatim' }
    }
  },
  {
    id: 'log-2',
    timestamp: '2024-04-21T15:00:00Z',
    user: { name: 'Sarah Miller', role: 'Clinical Lead' },
    entityType: 'criteria',
    entityName: 'Social Avoidance Patterns',
    action: 'modify',
    summary: 'Updated supporting evidence for Social Avoidance criterion',
    details: {
      reason: 'Additional findings from latest session provide clearer mapping to avoidance behaviors.',
      changes: [
        { field: 'Supporting Evidence', oldValue: '2 findings', newValue: '5 findings' },
        { field: 'Confidence Score', oldValue: '0.85', newValue: '0.92' }
      ]
    }
  },
  {
    id: 'log-3',
    timestamp: '2024-04-20T11:20:00Z',
    user: { name: 'David Chen', role: 'Psychologist' },
    entityType: 'assessment',
    entityName: 'PHQ-9 Assessment',
    action: 'share',
    summary: 'Assessment shared with patient via secure portal',
    details: {
      metadata: { recipientEmail: 'john.doe@example.com', expiry: '2024-05-20' }
    }
  },
  {
    id: 'log-4',
    timestamp: '2024-04-19T09:45:00Z',
    user: { name: 'Sarah Miller', role: 'Clinical Lead' },
    entityType: 'client',
    entityName: 'John Doe',
    action: 'status_change',
    summary: 'Client status changed from Active to Review Required',
    details: {
      reason: 'Upcoming NDIS review requires updated clinical formulation.',
      changes: [
        { field: 'Status', oldValue: 'Active', newValue: 'Review Required' }
      ]
    }
  },
  {
    id: 'log-5',
    timestamp: '2024-04-18T16:15:00Z',
    user: { name: 'David Chen', role: 'Psychologist' },
    entityType: 'evidence',
    entityName: 'Self-harm ideation report',
    action: 'create',
    summary: 'New evidence extracted from clinical document (idx-8822)',
    details: {
      metadata: { documentId: 'doc-44', extractor: 'AI Assistant (v2.1)' }
    }
  },
  {
    id: 'log-6',
    timestamp: '2024-04-18T16:30:00Z',
    user: { name: 'Sarah Miller', role: 'Clinical Lead' },
    entityType: 'evidence',
    entityName: 'Self-harm ideation report',
    action: 'modify',
    summary: 'Corrected extraction score and focus area',
    details: {
      reason: 'AI over-interpreted frequency of mentions. Adjusted to reflect intermittent nature.',
      changes: [
        { field: 'Score', oldValue: '0.98', newValue: '0.82' },
        { field: 'Focus', oldValue: 'Active Ideation', newValue: 'Passive History' }
      ]
    }
  }
];
