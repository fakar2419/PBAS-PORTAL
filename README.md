# 🎓 PBAS Faculty API Score Portal
**Annual Self-Assessment — Performance Based Appraisal System**  
Government of Assam · UGC / AICTE Guidelines

---

## 📁 Project Structure

```
pbas-portal/
├── index.html                          ← Vite HTML entry point
├── package.json                        ← NPM dependencies
├── vite.config.js                      ← Vite config (port 3000)
├── README.md
└── src/
    ├── main.jsx                        ← React DOM root
    ├── App.jsx                         ← Root state + role routing
    │
    ├── data/
    │   └── constants.js                ← Seed users, blank forms, design tokens, status meta
    │
    ├── utils/
    │   └── helpers.js                  ← calcAPI(), readFile(), fmtSize(), buildDemoSubmission()
    │
    ├── components/
    │   ├── ui/
    │   │   └── index.jsx               ← Btn, Input, Select, Card, Th, Td, TInput, TSelect, AddRow, DelBtn
    │   ├── auth/
    │   │   └── Login.jsx               ← Sign In / Register / Forgot Password
    │   ├── layout/
    │   │   └── Sidebar.jsx             ← Sidebar nav + PageWrap
    │   ├── forms/
    │   │   ├── PBASForm.jsx            ← Main form orchestrator (tabs + sticky bar)
    │   │   ├── PartA.jsx               ← Personal info, education, research, experience
    │   │   ├── CatI.jsx                ← Teaching, learning, evaluation
    │   │   ├── CatII.jsx               ← Co-curricular & professional development
    │   │   ├── CatIII.jsx              ← Research, publications, projects, guidance
    │   │   └── PartCD.jsx              ← Part C (other info) + Part D (summary)
    │   └── shared/
    │       ├── UploadZone.jsx          ← Drag-and-drop file upload (per section)
    │       ├── ViewSubmission.jsx      ← Read-only full-form modal
    │       └── ReviewPanel.jsx         ← ReviewPanel + AllSubs table
    │
    ├── screens/
    │   └── ManagementScreens.jsx       ← RegRequests, PwResets, ChangePw
    │
    └── dashboards/
        ├── FacultyDash.jsx             ← Faculty: submit form, my submissions, change PW
        ├── HODDash.jsx                 ← HOD: review, registrations, PW resets, all records
        ├── PrincipalDash.jsx           ← Principal: final review, send to expert
        └── ExpertDash.jsx              ← Expert: review & close
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **npm** v8 or higher

### 1. Install dependencies
```bash
cd pbas-portal
npm install
```

### 2. Start development server
```bash
npm run dev
```
Opens at **http://localhost:3000**

### 3. Build for production
```bash
npm run build        # outputs to dist/
npm run preview      # preview production build
```

---

## 🔐 Demo Login Accounts

| Role      | Email                        | Password       |
|-----------|------------------------------|----------------|
| HOD       | hod@college.ac.in            | hod123         |
| Principal | principal@college.ac.in      | principal123   |
| Expert    | expert@ugc.ac.in             | expert123      |
| Faculty   | ramesh@college.ac.in         | ramesh123      |

---

## 📋 PBAS Form Sections

### Part A — General Information
- Personal & service details (Name, Dept, Designation, Dates)
- Educational qualifications (Graduation onwards)
- Research degrees (Ph.D., D.Sc., etc.)
- Teaching/research experience
- ASC / Refresher / Orientation courses

### Part B — Academic Performance Indicators (API)

**Category I** — Teaching, Learning & Evaluation
| Section | Max Score |
|---------|-----------|
| (i) Classes taken (≥100% → 50, ≥80% proportionate) | 50 |
| (i-b) Teaching load excess of norms | 10 |
| (ii) Instructional material provided | 5 |
| (iii) Innovative teaching methodologies | 20 |
| (iv) Examination duties | 25 |

**Category II** — Co-curricular & Professional Development
| Section | Max Score |
|---------|-----------|
| (i) Extension & co-curricular activities | 20 |
| (ii) Corporate life & institutional management | 15 |
| (iii) Professional development | 15 |
| **Total** | **25** |

**Category III** — Research & Academic Contributions
| Publication Type | Score |
|-----------------|-------|
| International journal with impact factor (peer-reviewed, main author) | 15 |
| International journal without IF | 8–10 |
| National journal (peer reviewed) | 10 |
| National journal (other) | 5 |
| International conference proceedings | 10 |
| National conference proceedings | 7.5 |
| Book (single author, international publisher) | 50 |
| Ph.D. awarded | 10 per student |
| FDP ≥2 weeks | 20 |

### Part C — Other Relevant Information & Enclosures

### Part D — Summary Table (auto-generated)

---

## 🔄 Approval Workflow

```
Faculty → fills PBAS + uploads proofs → Submit to HOD
  ↓
HOD → reviews → Approve & Send to Principal
         OR → Return to Faculty (with remark)
  ↓
Principal → reviews → Send to Expert Panel
              OR → Return to HOD (with remark)
                     → HOD adds remark → returns to Faculty
  ↓
Expert → reviews → Submit Expert Review (closes the loop)
```

---

## 📎 Document Upload
- Every section has its own proof upload zone
- Accepted formats: JPG, PNG, PDF (max 8 MB each)
- Drag & drop or click to upload
- Files stored as base64 in React state (no backend required)
- All reviewers (HOD, Principal, Expert) can view and download proofs

---

## 🛠 Technologies
- **React 18** (hooks only, no class components)
- **Vite 5** (dev server + bundler)
- **Pure inline CSS** (no external CSS frameworks)
- **No backend** — all state in React memory
