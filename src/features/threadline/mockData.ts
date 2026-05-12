export const MOCK_CLIENTS = [
  { 
    name: "Liam Alexander O'Sullivan", 
    id: "125566", 
    extId: "C-8891", 
    clinicians: ["Dr. Sarah Jenkins", "Dr. Mark Ronson"], 
    extra: 0, 
    ref: "St. Jude Hospital", 
    last: "May 02, 2026 – 10:00 AM", 
    consent: true,
    hasConflicts: true,
    missingDocs: []
  },
  { 
    name: "Ella Grace Robinson", 
    id: "125570", 
    extId: "C-3349", 
    clinicians: ["Dr. Emily Blunt"], 
    extra: 0, 
    ref: "Family Practice", 
    last: "Apr 18, 2026 – 11:00 AM", 
    consent: true,
    hasConflicts: false,
    missingDocs: []
  },
  { 
    name: "Chloe Isabella Thompson", 
    id: "125567", 
    extId: "C-9012", 
    clinicians: ["Dr. Sarah Jenkins"], 
    extra: 1, 
    ref: "School Counseling", 
    last: "Apr 28, 2026 – 2:30 PM", 
    consent: false,
    hasConflicts: false,
    missingDocs: ["Consent Form", "Referral Letter", "School Reports"]
  },
  { 
    name: "Sophie Elizabeth Brown", 
    id: "125569", 
    extId: "C-1120", 
    clinicians: ["Dr. Sarah Jenkins", "Dr. Emily Blunt"], 
    extra: 1, 
    ref: "St. Jude Hospital", 
    last: "Apr 20, 2026 – 4:00 PM", 
    consent: true,
    hasConflicts: false,
    missingDocs: ["Standardized Assessment"]
  },
  { 
    name: "Noah James Wilson", 
    id: "125571", 
    extId: "C-1121", 
    clinicians: ["Dr. Sarah Jenkins"], 
    extra: 0, 
    ref: "St. Jude Hospital", 
    last: "May 10, 2026 – 4:00 PM", 
    consent: true,
    hasConflicts: false,
    missingDocs: []
  },
  { 
    name: "Oliver Mason Davies", 
    id: "125572", 
    extId: "C-1122", 
    clinicians: ["Dr. Emily Blunt"], 
    extra: 0, 
    ref: "Family Practice", 
    last: "May 11, 2026 – 10:00 AM", 
    consent: true,
    hasConflicts: false,
    missingDocs: []
  },
];

export const MOCK_ASSESSMENTS = [
  { 
    title: "GAD-7 (Generalized Anxiety Disorder)", 
    subtitle: "Feb 10, 2026 • Dr. Sarah Jenkins", 
    status: "completed",
    date: "Feb 10, 2026",
    description: "Evaluates the presence and severity of general anxiety symptoms over the past two weeks.",
    notes: "Client reported improved sleep but sustained anxiety triggers at workplace.",
    overallImpression: "Moderate Anxiety",
    score: "12",
    percentile: "85th",
    descriptor: "Moderate"
  },
  { 
    title: "PHQ-9 (Patient Health Questionnaire)", 
    subtitle: "Mar 15, 2026 • Dr. Mark Ronson", 
    status: "in-progress",
    date: "Mar 15, 2026",
    description: "Multipurpose instrument for screening, diagnosing, monitoring and measuring the severity of depression.",
    notes: "Pending review of items 7 and 8 with client during next session."
  },
  { 
    title: "WAI (Working Alliance Inventory)", 
    subtitle: "Apr 02, 2026 • Dr. Sarah Jenkins", 
    status: "not-started",
    date: "Apr 02, 2026",
    description: "Assesses the therapeutic bond and agreement on therapy goals.",
    notes: "Scheduled for next intake session to establish baseline."
  },
  { 
    title: "ASRS-6 (Adult ADHD Screening)", 
    subtitle: "Jan 20, 2026 • Dr. Emily Blunt", 
    status: "completed",
    date: "Jan 20, 2026",
    description: "Screening scale for adult ADHD based on DSM-V criteria.",
    notes: "Elevated score on inattention subscale. Requires further diagnostic interview.",
    overallImpression: "Highly Likely ADHD",
    score: "5/6",
    percentile: "92nd",
    descriptor: "Significant"
  },
  { 
    title: "DASS-21 (Depression Anxiety Stress Scale)", 
    subtitle: "Scheduled • Dr. Sarah Jenkins", 
    status: "not-started",
    date: "Apr 10, 2026",
    description: "A set of three self-report scales designed to measure the negative emotional states of depression, anxiety and stress.",
    notes: "Baseline assessment for new referral."
  },
];

export const REQUIRED_DOCUMENTS = ['referral-letter', 'parent-questionnaire', 'school-report'];

export const MOCK_DOCUMENTS = [
  { id: "doc-1", name: "School Reports", type: "PDF", version: "Updated 2025-02-10", creationDate: "Mar 15, 2026", uploadDate: "Dec 01, 2026", uploadedAt: "2026-12-01T10:00:00Z", status: "uploaded" },
  { id: "doc-2", name: "Letters", type: "Docs", version: "Version 1.0", creationDate: "Apr 22, 2026", uploadDate: "Jan 18, 2027", uploadedAt: "2027-01-18T14:30:00Z", status: "required", description: "Provides initial context, reason for assessment, and primary concerns identified by the referring professional." },
  { id: "doc-3", name: "Client Digital Journal", type: "Docs", version: "Updated", creationDate: "May 01, 2026", uploadDate: "May 01, 2026", uploadedAt: "2026-05-01T09:00:00Z", status: "required", description: "Personal notes and journal entries documenting the client's daily experiences, thoughts, and reflections on their symptoms." },
  { id: "doc-4", name: "Medical Records", type: "PDF", version: "Initial", creationDate: "Jun 10, 2026", uploadDate: "Jun 12, 2026", uploadedAt: "2026-06-12T11:00:00Z", status: "optional", description: "Past medical history, medications, and physical health records that may relate to psychological functioning." },
  { id: "doc-5", name: "Previous Assessment Results", type: "PDF", version: "Final", creationDate: "Jan 05, 2026", uploadDate: "Jan 10, 2026", uploadedAt: "2026-01-10T11:00:00Z", status: "optional", description: "Results and reports from previously administered psychological or educational assessments." },
];

export const MOCK_EVIDENCE_ITEMS = [
  { 
    label: "Journal Entry", 
    score: "0.92", 
    type: "evidence", 
    sourceDocumentId: "doc-3", 
    sourceDocumentName: "Client Digital Journal", 
    hasConflict: true,
    verbatim: "I felt very anxious today when I had to speak in the meeting. My hands were shaking and I thought everyone could see it.",
    sessionSource: "Session [S-8821], May 02, 2026"
  },
  { 
    label: "Behavioural pattern", 
    score: "0.65", 
    type: "evidence", 
    sourceDocumentId: "doc-1", 
    sourceDocumentName: "School Reports", 
    hasConflict: true,
    verbatim: "Client was fidgeting with a pen and looking down frequently during the social recall task.",
    sessionSource: "Session [S-8821], May 02, 2026"
  },
  { 
    label: "Avoidance Indicator", 
    score: "0.78", 
    type: "evidence", 
    sourceDocumentId: "doc-1", 
    sourceDocumentName: "School Reports", 
    hasConflict: false,
    verbatim: "I often skip lunch in the breakroom to avoid small talk.",
    sessionSource: "Session [S-8821], May 02, 2026"
  },
  { 
    label: "Cognitive Distortion", 
    score: "0.85", 
    type: "evidence", 
    sourceDocumentId: "doc-3", 
    sourceDocumentName: "Client Digital Journal", 
    hasConflict: false,
    verbatim: "If I don't get this right, then everything is a failure.",
    sessionSource: "Session [S-8822], May 03, 2026"
  },
  { 
    label: "Negative Thought Pattern", 
    score: "0.82", 
    type: "evidence", 
    sourceDocumentId: "doc-3", 
    sourceDocumentName: "Client Digital Journal", 
    hasConflict: false,
    verbatim: "I think everyone is judging how I move and speak.",
    sessionSource: "Session [S-8822], May 03, 2026"
  },
  { 
    label: "Exposure Result", 
    score: "0.90", 
    type: "evidence", 
    sourceDocumentId: "doc-1", 
    sourceDocumentName: "School Reports", 
    hasConflict: false,
    verbatim: "Successfully maintained eye contact for 30 seconds during roleplay.",
    sessionSource: "Session [S-8823], May 04, 2026"
  },
  { 
    label: "Mindfulness Feedback", 
    score: "0.75", 
    type: "evidence", 
    sourceDocumentId: "doc-2", 
    sourceDocumentName: "Letters", 
    hasConflict: false,
    verbatim: "I found it hard to focus on my breath when the room was so quiet.",
    sessionSource: "Session [S-8823], May 04, 2026"
  },
  { 
    label: "Verbatim Quote", 
    score: "0.88", 
    type: "evidence", 
    sourceDocumentId: "doc-2", 
    sourceDocumentName: "Letters", 
    hasConflict: false,
    verbatim: "It's a burning sensation that radiates down my leg when I've been sitting too long.",
    sessionSource: "Session [S-8822], May 03, 2026"
  },
  { 
    label: "Mood Symptom", 
    score: "0.42", 
    type: "evidence", 
    sourceDocumentId: "doc-2", 
    sourceDocumentName: "Letters", 
    hasConflict: false,
    verbatim: "Client reports feeling low most days and lack of energy.",
    sessionSource: "Session [S-8823], May 04, 2026"
  },
  { label: "Assessment Result", score: "0.95", type: "evidence", hasConflict: false },
  { label: "PHQ-9 Result Interpretation", score: "0.91", type: "assessment", hasConflict: false, findings: [
    { id: '1', text: 'Significant impairment in social communication during structured play', timestamp: 'Standardized Score: 85', tags: ['Social'] },
    { id: '2', text: 'Elevated tactile sensitivity reported on questionnaire', timestamp: 'Sub-scale: Sensory', tags: ['Sensory'] },
  ] },
  { label: "GAD-7 Severity Score", score: "0.88", type: "assessment", hasConflict: true, findings: [
    { id: '1', text: 'Frequent excessive worry over workplace responsibilities', timestamp: 'p. 1', tags: ['Work', 'Anxiety'] }
  ] },
  { label: "Referral Letter Summary", score: "0.94", type: "document", hasConflict: false, findings: [
    { id: '1', text: 'Sensory seeking behavior noted', timestamp: 'p. 4', tags: ['Sensory'] },
    { id: '2', text: 'Communication delays reported in preschool', timestamp: 'p. 2', tags: ['Communication'] },
    { id: '3', text: 'Family history of ASD mentioned', timestamp: 'p. 9', tags: ['History'] },
  ] },
  { label: "Parent Questionnaire Findings", score: "0.85", type: "document", hasConflict: false, findings: [
    { id: '1', text: 'Reports of difficulty with transitions', timestamp: 'p. 1', tags: ['Behavior'] },
  ] },
  { label: "Depressed mood", score: "0.84", type: "criteria", hasConflict: false, status: "Met", findings: [
    { id: "e8", text: "Client sighed deeply and paused for several seconds before answering questions about self-worth.", type: "behavioural", timestamp: "35:00", framework: "Depressive Features", tags: ["Affective", "Processing Speed"] },
    { id: "e10", text: "I found it hard to focus on my breath when the room was so quiet.", type: "verbatim", timestamp: "28:10", framework: "Anxiety Management", tags: ["Mindfulness", "Difficulty"] }
  ] },
  { label: "Fear of negative evaluation (Criteria)", score: "0.55", type: "criteria", hasConflict: false, status: "Deferred", findings: [
    { id: "e1", text: "I feel like my heart is racing whenever I have to speak in front of others.", type: "verbatim", timestamp: "05:12", framework: "Social Anxiety Disorder (SAD)", tags: ["Physical Symptoms", "Social Trigger"] },
    { id: "e7", text: "I think everyone is judging how I move and speak.", type: "verbatim", timestamp: "22:30", framework: "Social Anxiety Disorder (SAD)", tags: ["Paranoia", "Self-Consciousness"] }
  ] },
  { label: "Persistent concern about additional", score: "0.32", type: "criteria", hasConflict: false, status: "Not Met", findings: [
    { id: "e4", text: "Sometimes I just can't breathe properly when the phone rings.", type: "verbatim", timestamp: "15:20", framework: "Panic Disorder", tags: ["Physical Symptoms", "Arousal"] }
  ] },
  { label: "Fear of negative evaluation", score: "High", type: "nextstep", impact: "High information gain", rationale: "Standardised tool identifies this as the primary driver of social avoidance.", suggestedClinicalFocus: "Social Evaluation", hasConflict: false },
  { label: "Severity of depressive symptoms", score: "Medium", type: "nextstep", impact: "Quantifies symptom severity", rationale: "Client describes significant mood dips but hasn't had clinical scoring since Feb.", suggestedClinicalFocus: "Mood Regulation", hasConflict: false },
  { label: "Duration of mood symptoms", score: "Low", type: "nextstep", impact: "Medium", rationale: "Establishing timeline is critical for differentiating between episode types.", suggestedClinicalFocus: "Cognitive Functioning", hasConflict: false }
];

export const MOCK_REPORT_MAPPING_IDS = ["Journal Entry", "Mood Symptom", "Assessment Result"];

export const MOCK_CONFLICTS = [
  { id: "c1", description: "Teacher notes contradict parent report on social anxiety" },
  { id: "c2", description: "Journal entry frequency does not match reported symptom severity" }
];

export const MOCK_MISSING_DOCUMENTS = [
  { id: "d1", name: "School Report", description: "Required for comprehensive understanding of academic performance and behavioral patterns in an educational setting." },
  { id: "d2", name: "Referral Letter", description: "Provides initial context, reason for assessment, and primary concerns identified by the referring professional." }
];

export const MOCK_CLIENT_DATA: Record<string, {
  reportUnlocked?: boolean,
  allAccepted?: boolean,
  sessions: { 
    id?: string, 
    date: string, 
    focus: string, 
    notes: string,
    evidence?: {
      id: string,
      text: string,
      type: 'verbatim' | 'behavioural',
      timestamp: string,
      framework: string,
      tags: string[]
    }[]
  }[],
  assessments: { 
    title: string, 
    subtitle: string, 
    status: string, 
    date?: string, 
    description?: string, 
    notes?: string,
    overallImpression?: string,
    score?: string,
    percentile?: string,
    descriptor?: string
  }[],
  evidence: { type: string, description: string, date: string, label?: string, score?: string, hasConflict?: boolean, verbatim?: string }[],
  analysis: { thread: string, insight: string }[],
  reports: { title: string, date: string }[],
  conflicts?: { id: string, description: string }[],
  missingDocuments?: { id: string, name: string }[],
  documents?: { id: string, name: string, type: string, version: string, creationDate: string, uploadDate: string, uploadedAt: string | null, status: string }[]
}> = {
  "125566": {
    sessions: [
      { 
        id: "S-8821",
        date: "2026-05-02", 
        focus: "Anxiety Management", 
        notes: "Review of GAD-7 results.",
        evidence: [
          { id: "e1", text: "I feel like my heart is racing whenever I have to speak in front of others.", type: "verbatim", timestamp: "05:12", framework: "Social Anxiety Disorder (SAD)", tags: ["Physical Symptoms", "Social Trigger"] },
          { id: "e2", text: "Client was fidgeting with a pen and looking down frequently during the social recall task.", type: "behavioural", timestamp: "08:30", framework: "Social Anxiety Disorder (SAD)", tags: ["Avoidance", "Anxiety"] },
          { id: "e3", text: "I often skip lunch in the breakroom to avoid small talk.", type: "verbatim", timestamp: "12:45", framework: "Social Anxiety Disorder (SAD)", tags: ["Avoidance"] },
          { id: "e4", text: "Sometimes I just can't breathe properly when the phone rings.", type: "verbatim", timestamp: "15:20", framework: "Panic Disorder", tags: ["Physical Symptoms", "Arousal"] },
          { id: "e5", text: "Noticeable shallow breathing and increased rate of speech when discussing work deadlines.", type: "behavioural", timestamp: "18:10", framework: "Generalized Anxiety Disorder (GAD)", tags: ["Physical Symptoms", "Work Stress"] }
        ]
      },
      { 
        id: "S-8822",
        date: "2026-05-03", 
        focus: "Cognitive Restructuring", 
        notes: "Addressing negative thought patterns.",
        evidence: [
          { id: "e6", text: "If I don't get this right, then everything is a failure.", type: "verbatim", timestamp: "10:15", framework: "Cognitive Appraisal", tags: ["Perfectionism", "Distortion"] },
          { id: "e7", text: "I think everyone is judging how I move and speak.", type: "verbatim", timestamp: "22:30", framework: "Social Anxiety Disorder (SAD)", tags: ["Paranoia", "Self-Consciousness"] },
          { id: "e8", text: "Client sighed deeply and paused for several seconds before answering questions about self-worth.", type: "behavioural", timestamp: "35:00", framework: "Depressive Features", tags: ["Affective", "Processing Speed"] }
        ]
      },
      { 
        id: "S-8823",
        date: "2026-05-04", 
        focus: "Exposure Therapy", 
        notes: "Practicing mindfulness in high-anxiety triggers.",
        evidence: [
          { id: "e9", text: "Successfully maintained eye contact for 30 seconds during roleplay.", type: "behavioural", timestamp: "15:45", framework: "Social Anxiety Disorder (SAD)", tags: ["Progress", "Skill Acquisition"] },
          { id: "e10", text: "I found it hard to focus on my breath when the room was so quiet.", type: "verbatim", timestamp: "28:10", framework: "Anxiety Management", tags: ["Mindfulness", "Difficulty"] },
          { id: "e11", text: "Hand tremors subsided significantly during the second half of the exercise.", type: "behavioural", timestamp: "42:20", framework: "Social Anxiety Disorder (SAD)", tags: ["Symptom Reduction"] }
        ]
      }
    ],
    assessments: [
      { 
        title: "GAD-7", 
        subtitle: "Feb 10, 2026 • Dr. Sarah Jenkins", 
        status: "completed",
        overallImpression: "Moderate Anxiety",
        score: "12",
        percentile: "85th",
        descriptor: "Moderate"
      },
      { 
        title: "PHQ-9", 
        subtitle: "Mar 15, 2026 • Dr. Mark Ronson", 
        status: "completed",
        overallImpression: "Mild Depression",
        score: "7",
        percentile: "62nd",
        descriptor: "Mild"
      },
      {
        title: "DASS-21",
        subtitle: "Scheduled • Dr. Sarah Jenkins",
        status: "not-started"
      }
    ],
    evidence: [
      { 
        type: "Journal", 
        description: "Entry regarding social situations.", 
        date: "2026-05-01", 
        label: "Journal Entry", 
        score: "0.92", 
        hasConflict: true,
        verbatim: "I felt very anxious today when I had to speak in the meeting. My hands were shaking and I thought everyone could see it."
      }
    ],
    analysis: [{ thread: "Anxiety", insight: "High social anxiety." }],
    reports: [{ title: "Initial Assessment", date: "2026-04-10" }],
    conflicts: [MOCK_CONFLICTS[0]],
    missingDocuments: [],
    documents: [
      { id: "doc-1", name: "School Reports", type: "PDF", version: "Updated 2025-02-10", creationDate: "Mar 15, 2026", uploadDate: "Dec 01, 2026", uploadedAt: "2026-12-01T10:00:00Z", status: "uploaded" },
      { id: "doc-2", name: "Letters", type: "Docs", version: "Version 1.0", creationDate: "Apr 22, 2026", uploadDate: "May 01, 2026", uploadedAt: "2026-05-01T14:30:00Z", status: "uploaded" },
      { id: "doc-4", name: "Medical Records", type: "PDF", version: "Initial", creationDate: "Jun 10, 2026", uploadDate: "Jun 12, 2026", uploadedAt: "2026-06-12T11:00:00Z", status: "uploaded" }
    ]
  },
  "125567": {
    sessions: [],
    assessments: [
      { title: "GAD-7", subtitle: "Scheduled • Dr. Sarah Jenkins", status: "not-started" },
      { title: "PHQ-9", subtitle: "Scheduled • Dr. Sarah Jenkins", status: "not-started" },
      { title: "WAI", subtitle: "Scheduled • Dr. Sarah Jenkins", status: "not-started" }
    ],
    evidence: [],
    analysis: [],
    reports: [],
    conflicts: [],
    missingDocuments: [
      { id: "md-chloe-1", name: "Consent Form" },
      { id: "md-chloe-2", name: "Referral Letter" },
      { id: "md-chloe-3", name: "School Reports" }
    ],
    documents: [
      { id: "doc-chloe-1", name: "School Reports", type: "PDF", version: "-", creationDate: "-", uploadDate: "-", uploadedAt: null, status: "required" },
      { id: "doc-chloe-2", name: "Consent Form", type: "Docs", version: "-", creationDate: "-", uploadDate: "-", uploadedAt: null, status: "required" },
      { id: "doc-chloe-3", name: "Referral Letter", type: "Docs", version: "-", creationDate: "-", uploadDate: "-", uploadedAt: null, status: "required" }
    ]
  },
  "125569": {
    sessions: [
      { date: "2026-04-20", focus: "ADHD Management", notes: "Coping with distractibility." },
      { date: "2026-04-22", focus: "Social Skills", notes: "Roleplay exercise." }
    ],
    assessments: [
      { title: "ASRS-6", subtitle: "Jan 20, 2026 • Dr. Emily Blunt", status: "completed" },
      { title: "WAI", subtitle: "Apr 20, 2026 • Dr. Sarah Jenkins", status: "completed" }
    ],
    evidence: [{ type: "Focus Log", description: "Tracked productive hours.", date: "2026-04-19" }],
    analysis: [{ thread: "Focus", insight: "Morning productivity is higher." }],
    reports: [{ title: "Baseline Report", date: "2026-04-05" }],
    conflicts: [],
    missingDocuments: [MOCK_MISSING_DOCUMENTS[0]],
    documents: [
      { id: "doc-sophie-1", name: "Consent Form", type: "PDF", status: "uploaded", version: "1.0", creationDate: "2026-01-01", uploadDate: "2026-04-20", uploadedAt: "2026-04-20" }
    ]
  },
  "125570": {
    reportUnlocked: true,
    sessions: [
      { date: "2026-04-18", focus: "Goal Setting", notes: "Setting SMART goals." },
      { date: "2026-04-20", focus: "Implementation", notes: "Starting daily checklists." },
      { date: "2026-04-22", focus: "Review", notes: "Adjusting goals based on feedback." }
    ],
    assessments: [
      { title: "WAI", subtitle: "Apr 15, 2026 • Dr. Emily Blunt", status: "completed" },
      { title: "ASRS-6", subtitle: "Apr 16, 2026 • Dr. Emily Blunt", status: "completed" }
    ],
    evidence: [{ type: "Goal Sheet", description: "Weekly task list.", date: "2026-04-17", label: "Goal Sheet", score: "0.95" }],
    analysis: [{ thread: "Motivation", insight: "Strong internal motivation." }],
    reports: [{ title: "Treatment Plan", date: "2026-04-01" }],
    conflicts: [],
    missingDocuments: [],
    documents: [
      { id: "doc-ella-1", name: "Referral Letter", type: "PDF", version: "Final", creationDate: "2026-04-01", uploadDate: "2026-04-02", uploadedAt: "2026-04-02T10:00:00Z", status: "uploaded" },
      { id: "doc-ella-2", name: "Consent Form", type: "Docs", version: "V1", creationDate: "2026-04-01", uploadDate: "2026-04-02", uploadedAt: "2026-04-02T10:30:00Z", status: "uploaded" }
    ]
  },
  "125571": {
    reportUnlocked: false,
    sessions: [
      { id: "SN-1", date: "2026-05-01", focus: "Initial Consultation", notes: "First intake session." },
      { id: "SN-2", date: "2026-05-05", focus: "Baseline Assessment", notes: "Reviewing history." }
    ],
    assessments: [
      { title: "GAD-7", subtitle: "Completed", status: "completed", date: "2026-05-02" },
      { title: "PHQ-9", subtitle: "Completed", status: "completed", date: "2026-05-03" }
    ],
    evidence: [],
    analysis: [],
    reports: [],
    documents: [
      { id: "DN-1", name: "Medical History", type: "PDF", status: "uploaded", version: "1.0", creationDate: "2026-01-01", uploadDate: "2026-05-01", uploadedAt: "2026-05-01" },
      { id: "DN-2", name: "School Consent", type: "Docs", status: "uploaded", version: "1.0", creationDate: "2026-01-01", uploadDate: "2026-05-01", uploadedAt: "2026-05-01" }
    ]
  },
  "125572": {
    reportUnlocked: false,
    allAccepted: true,
    sessions: [
      { id: "SO-1", date: "2026-05-01", focus: "Intake", notes: "Intake complete." },
      { id: "SO-2", date: "2026-05-05", focus: "Session 2", notes: "Following up." }
    ],
    assessments: [
      { title: "ASRS-6", subtitle: "Completed", status: "completed", date: "2026-05-02" },
      { title: "WAI", subtitle: "Completed", status: "completed", date: "2026-05-03" }
    ],
    evidence: [],
    analysis: [],
    reports: [],
    documents: [
      { id: "DO-1", name: "ID Document", type: "PDF", status: "uploaded", version: "1.0", creationDate: "2026-01-01", uploadDate: "2026-05-01", uploadedAt: "2026-05-01" },
      { id: "DO-2", name: "Insurance Info", type: "Docs", status: "uploaded", version: "1.0", creationDate: "2026-01-01", uploadDate: "2026-05-01", uploadedAt: "2026-05-01" }
    ]
  },
};
