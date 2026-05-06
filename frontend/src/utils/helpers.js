// ─── API SCORE CALCULATION (UGC / AICTE PBAS rules) ─────────────
export function calcAPI(b) {
  if (!b) return { c1: 0, c2: 0, c3: 0, total: 0, breakdown: {} };

  // ── Category I ──────────────────────────────────────────────────
  let totalAllotted = 0, totalConducted = 0;
  (b.courses || []).forEach(r => {
    totalAllotted  += Number(r.allotted)  || 0;
    totalConducted += Number(r.conducted) || 0;
  });
  const classPct = totalAllotted > 0 ? (totalConducted / totalAllotted) * 100 : 0;
  const c1a = classPct >= 100 ? 50 : classPct >= 80 ? +(50 * (classPct / 100)).toFixed(1) : 0;
  const c1b = Math.min(b.extraLoad || 0, 10);
  const c1ii = Math.min((b.instrMaterial || []).length * 2, 5);
  const c1iii = Math.min((b.innovTeaching || []).reduce((s, r) => s + (Number(r.score) || 0), 0), 20);
  const c1iv = Math.min((b.examDuties || []).reduce((s, r) => {
    const eff  = (Number(r.pct) || 0) / 100;
    const base = r.type === 'invigilation' ? 2 : r.type === 'paper-setting' ? 3 : r.type === 'evaluation' ? 2 : 1;
    return s + base * eff;
  }, 0), 25);
  const c1 = c1a + c1b + c1ii + c1iii + c1iv;

  // ── Category II ─────────────────────────────────────────────────
  const c2i   = Math.min((b.extActivities || []).reduce((s, r) => s + (Number(r.hrsPerWeek) || 0) * 0.5, 0), 20);
  const c2ii  = Math.min((b.corpLife || []).length * 3, 15);
  const c2iii = Math.min((b.profDev || []).reduce((s, r) => s + (Number(r.hrsPerWeek) || 0) * 0.5, 0), 15);
  const c2 = Math.min(c2i + c2ii + c2iii, 25);

  // ── Category III ────────────────────────────────────────────────
  const jScore = (b.journals || []).reduce((s, j) => {
    const peer = j.peerReviewed === 'yes';
    const main = j.mainAuthor === 'yes' ? 1 : 0.8;
    if (j.type === 'international-impact')  return s + (peer ? 15 * main : 8  * main);
    if (j.type === 'international-nimpact') return s + (peer ? 10 * main : 5  * main);
    if (j.type === 'national-peer')         return s + (peer ? 10 * main : 5  * main);
    if (j.type === 'national-other')        return s + (peer ? 5  * main : 2  * main);
    return s;
  }, 0);

  const chapScore = (b.bookChapters || []).reduce((s, c) => {
    const main = c.mainAuthor === 'yes' ? 1 : 0.8;
    return s + (c.pubType === 'international' ? 10 * main : 5 * main);
  }, 0);

  const confProcScore = (b.confProceedings || []).reduce((s, c) => {
    const main = c.mainAuthor === 'yes' ? 1 : 0.8;
    if (c.level === 'international') return s + 10  * main;
    if (c.level === 'national')      return s + 7.5 * main;
    if (c.level === 'state')         return s + 5   * main;
    return s + 3 * main;
  }, 0);

  const bookScore = (b.books || []).reduce((s, bk) => {
    const solo = bk.authorship === 'single';
    const intl = bk.publisher  === 'international';
    if (solo && intl)  return s + 50;
    if (!solo && intl) return s + 25;
    if (solo && !intl) return s + 25;
    return s + 10;
  }, 0);

  const projScore =
    (b.ongoingProjects || []).reduce((s, p) => {
      const amt = Number(p.amount) || 0;
      return s + (amt >= 30 ? 20 : amt >= 5 ? 15 : 10);
    }, 0) +
    (b.completedProjects || []).reduce((s, p) => {
      const amt   = Number(p.amount) || 0;
      const bonus = p.patent === 'yes' ? 5 : 0;
      return s + (amt >= 30 ? 20 : amt >= 5 ? 15 : 10) + bonus;
    }, 0);

  const guidScore = (b.resGuidance || []).reduce((s, g) => {
    const isPhd = g.level === 'phd';
    return s + (Number(g.awarded) || 0) * (isPhd ? 10 : 3)
             + (Number(g.submitted) || 0) * (isPhd ? 5 : 1);
  }, 0);

  const trainScore = (b.training || []).reduce((s, t) => {
    const wks = Number(t.duration) || 0;
    return s + (wks >= 2 ? 20 : wks >= 1 ? 10 : 5);
  }, 0);

  const confPapScore = (b.confPapers || []).reduce((s, p) => {
    if (p.level === 'international') return s + 10;
    if (p.level === 'national')      return s + 7.5;
    if (p.level === 'state')         return s + 5;
    return s + 3;
  }, 0);

  const invScore = (b.invitedLectures || []).reduce((s, l) => {
    return s + (l.level === 'international' ? 10 : 5);
  }, 0);

  const c3 = jScore + chapScore + confProcScore + bookScore +
             projScore + guidScore + trainScore + confPapScore + invScore;

  return {
    c1: +c1.toFixed(1),
    c2: +c2.toFixed(1),
    c3: +c3.toFixed(1),
    total: +(c1 + c2 + c3).toFixed(1),
    breakdown: {
      c1a, c1b, c1ii, c1iii, c1iv,
      c2i, c2ii, c2iii,
      jScore, chapScore, confProcScore, bookScore,
      projScore, guidScore, trainScore, confPapScore, invScore,
    },
  };
}

// ─── FILE UTILITIES ───────────────────────────────────────────────
export const readFile = (f) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(f);
  });

export const fmtSize = (b) =>
  b < 1024      ? b + ' B'
  : b < 1048576 ? (b / 1024).toFixed(1) + ' KB'
                : (b / 1048576).toFixed(1) + ' MB';

export const countProofFiles = (partB, partC) =>
  Object.values(partB?.proofs || {}).reduce((a, arr) => a + (arr?.length || 0), 0) +
  (partC?.proofs?.enclosures?.length || 0);

// ─── DEMO SUBMISSION BUILDER ──────────────────────────────────────
import { blankPartB } from '../data/constants.js';

export function buildDemoSubmission() {
  const b = blankPartB();
  b.courses = [
    { paper: 'Data Structures', level: 'ug', mode: 'L', allotted: 60, conducted: 58 },
    { paper: 'DBMS Lab',        level: 'ug', mode: 'P', allotted: 30, conducted: 29 },
  ];
  b.extraLoad   = 4;
  b.instrMaterial  = [{ course: 'Data Structures', consulted: 'Cormen CLRS', additional: 'Prepared notes on BST' }];
  b.innovTeaching  = [{ desc: 'Simulation tools for algorithm visualization', score: 8 }];
  b.examDuties     = [
    { type: 'invigilation', assigned: 'End-sem exams', pct: 100 },
    { type: 'evaluation',   assigned: 'Answer scripts', pct: 90 },
  ];
  b.extActivities  = [{ activity: 'NSS Camp Coordinator', hrsPerWeek: 2 }];
  b.corpLife       = [{ responsibility: 'NAAC Coordinator', period: '2023-24' }];
  b.profDev        = [{ activity: 'AICTE FDP on ML', hrsPerWeek: 5 }];
  b.journals       = [{ title: 'ML for Crop Prediction', journal: 'IEEE Trans.', issn: '0018-9340',
                        type: 'international-impact', peerReviewed: 'yes', impactFactor: '3.2',
                        coAuthors: 2, mainAuthor: 'yes' }];
  b.confPapers     = [{ title: 'Deep Learning in Medical Imaging', conf: 'ICML 2023', organisedBy: 'IEEE', level: 'international' }];
  b.training       = [{ programme: 'FDP on Deep Learning', duration: 2, organisedBy: 'NPTEL/AICTE' }];

  const partA = {
    name: 'Prof. Ramesh Gogoi', fatherName: 'Kiran Gogoi',
    dept: 'Computer Science', designation: 'Assistant Professor', gradePay: '6000',
    lastPromoDate: '2020-01-01', corrAddress: 'Guwahati, Assam', permAddress: 'Jorhat, Assam',
    mobile: '9876543210', email: 'ramesh@college.ac.in',
    appointDate: '2018-07-01', joiningDate: '2018-07-15',
    casPosition: 'Associate Professor AGP 8000', eligDate: '2024-07-01',
    edu: [
      { exam: 'B.Tech', univ: 'Gauhati University', year: '2010', marks: '78', grade: 'First' },
      { exam: 'M.Tech', univ: 'IIT Guwahati',       year: '2013', marks: '85', grade: 'Distinction' },
    ],
    research: [{ degree: 'phd', univ: 'Gauhati University', date: '2019-05-12', title: 'ML Applications in Agriculture' }],
    experience: [{ desig: 'Assistant Professor', employer: 'ABC College, Assam', from: '2018-07-15', to: '', scale: '15600-39100' }],
    refresherCourses: [],
  };

  const scores = calcAPI(b);
  return {
    id: 'demo1', facultyId: 'u4', facultyName: 'Prof. Ramesh Gogoi',
    dept: 'Computer Science', year: '2023-24',
    partA, partB: b,
    partC: { otherInfo: 'Received best paper award at national conference 2023.', proofs: {} },
    scores, status: 'pending_hod',
    hodRemark: '', principalRemark: '', expertComment: '',
    submittedAt: '15/01/2024',
  };
}
