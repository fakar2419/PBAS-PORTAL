// ─── DESIGN TOKENS ───────────────────────────────────────────────
export const C = {
  navy:   '#0c1a3a',
  blue:   '#1a4fa8',
  teal:   '#0d6b6b',
  purple: '#6b21a8',
  amber:  '#b45309',
  green:  '#166534',
  red:    '#991b1b',
  border: '#d1d5db',
  bg:     '#f9fafb',
  white:  '#ffffff',
  text:   '#111827',
  muted:  '#6b7280',
  light:  '#f3f4f6',
};

// ─── ROLE META ────────────────────────────────────────────────────
export const ROLE_COL = {
  faculty:   '#1a4fa8',
  hod:       '#0d6b6b',
  principal: '#6b21a8',
  expert:    '#b45309',
  admin:     '#dc2626',
};
export const ROLE_LBL = {
  faculty:   'Faculty Member',
  hod:       'Head of Department',
  principal: 'Principal',
  expert:    'Expert Reviewer',
  admin:     'System Administrator',
};

// ─── STATUS META ─────────────────────────────────────────────────
export const SM = {
  draft:                { label: 'Draft',                      dot: '#94a3b8', bg: '#f1f5f9', fg: '#475569' },
  pending_hod:          { label: 'Pending HOD Review',         dot: '#f59e0b', bg: '#fef3c7', fg: '#92400e' },
  returned_to_faculty:  { label: 'Returned to Faculty',        dot: '#ef4444', bg: '#fee2e2', fg: '#991b1b' },
  approved_hod:         { label: 'HOD Approved',               dot: '#10b981', bg: '#d1fae5', fg: '#065f46' },
  sent_to_principal:    { label: 'Sent to Principal',          dot: '#6366f1', bg: '#e0e7ff', fg: '#3730a3' },
  returned_to_hod:      { label: 'Returned to HOD',            dot: '#f97316', bg: '#ffedd5', fg: '#9a3412' },
  hod_remarked:         { label: 'HOD Remarked → Principal',   dot: '#8b5cf6', bg: '#ede9fe', fg: '#5b21b6' },
  sent_to_expert:       { label: 'Sent to Expert',             dot: '#0891b2', bg: '#cffafe', fg: '#164e63' },
  expert_reviewed:      { label: 'Expert Reviewed ✓',          dot: '#059669', bg: '#d1fae5', fg: '#064e3b' },
};

// ─── SEED USERS ───────────────────────────────────────────────────
export const SEED_USERS = [
  { id: 'u1', name: 'Gunajit Kalita',         email: 'gunajit.cse@aec.ac.in',   pw: 'hod123',       role: 'hod',       dept: 'Computer Science', approved: true  },
  { id: 'u2', name: 'Dr. Amrita Ganguly',     email: 'principal@aec.ac.in',     pw: 'principal123', role: 'principal', dept: 'Administration',   approved: true  },
  { id: 'u3', name: 'Dr. Anita Devi',         email: 'expert@ugc.ac.in',        pw: 'expert123',    role: 'expert',    dept: 'UGC Expert Panel', approved: true  },
  { id: 'u4', name: 'Prof. Ramesh Gogoi',     email: 'ramesh@college.ac.in',    pw: 'ramesh123',    role: 'faculty',   dept: 'Computer Science', approved: true  },
];

// ─── BLANK FORM DATA ──────────────────────────────────────────────
export function blankPartA() {
  return {
    name: '', fatherName: '', dept: '', designation: '', gradePay: '',
    lastPromoDate: '', corrAddress: '', permAddress: '', mobile: '', email: '',
    freshQual: 'NIL', appointDate: '', joiningDate: '', casPosition: '', eligDate: '',
    edu: [], research: [], experience: [], refresherCourses: [],
  };
}

export function blankPartB() {
  return {
    courses: [], extraLoad: 0,
    instrMaterial: [], innovTeaching: [], examDuties: [],
    extActivities: [], corpLife: [], profDev: [],
    journals: [], bookChapters: [], confProceedings: [], books: [],
    ongoingProjects: [], completedProjects: [],
    resGuidance: [], training: [], confPapers: [], invitedLectures: [],
    proofs: {},
  };
}

export function blankPartC() {
  return { otherInfo: '', proofs: {} };
}

// ─── ASSESSMENT YEARS ─────────────────────────────────────────────
export const ASSESSMENT_YEARS = [
  '2024-25', '2023-24', '2022-23', '2021-22', '2020-21',
];
