import React, { useState } from 'react';
import { C, ASSESSMENT_YEARS, blankPartA, blankPartB, blankPartC } from '../../data/constants.js';
import { calcAPI } from '../../utils/helpers.js';
import { Btn } from '../ui/index.jsx';
import PartA from './PartA.jsx';
import CatI from './CatI.jsx';
import CatII from './CatII.jsx';
import CatIII from './CatIII.jsx';
import { PartC, PartD } from './PartCD.jsx';

const TABS = [
  { id: 'A',  label: 'Part A',  sub: 'General Info'   },
  { id: 'B1', label: 'Part B',  sub: 'Category I'     },
  { id: 'B2', label: 'Part B',  sub: 'Category II'    },
  { id: 'B3', label: 'Part B',  sub: 'Category III'   },
  { id: 'C',  label: 'Part C',  sub: 'Other Info'     },
  { id: 'D',  label: 'Part D',  sub: 'Summary'        },
];

export default function PBASForm({ user, existing, onSubmit }) {
  const isReturn = existing?.status === 'returned_to_faculty';
  const [year,   setYear]   = useState(existing?.year   || '2023-24');
  const [partA,  setPartA]  = useState(existing?.partA  || blankPartA());
  const [partB,  setPartB]  = useState(existing?.partB  || blankPartB());
  const [partC,  setPartC]  = useState(existing?.partC  || blankPartC());
  const [tab,    setTab]    = useState('A');
  const [done,   setDone]   = useState(false);

  const scores = calcAPI(partB);
  const curIdx = TABS.findIndex(t => t.id === tab);

  const handleSubmit = () => {
    if (!partA.name) return alert('Please fill your name in Part A before submitting.');
    onSubmit({ year, partA, partB, partC, scores, returnId: existing?.id });
    setDone(true);
  };

  if (done) return (
    <div style={{ textAlign:'center', padding:'60px 20px' }}>
      <div style={{ fontSize:64, marginBottom:16 }}>✅</div>
      <h2 style={{ color:'#059669', margin:'0 0 10px' }}>PBAS Form Submitted!</h2>
      <p style={{ color:C.muted, fontSize:15 }}>Your Annual Self-Assessment has been forwarded to HOD for review.</p>
      <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10,
        padding:'14px 20px', display:'inline-block', marginTop:16 }}>
        <div style={{ fontSize:12, color:C.muted }}>Total API Score</div>
        <div style={{ fontSize:44, fontWeight:900, color:'#059669' }}>{scores.total}</div>
        <div style={{ fontSize:12, color:C.muted }}>C-I: {scores.c1} · C-II: {scores.c2} · C-III: {scores.c3}</div>
      </div>
      <div style={{ marginTop:20 }}>
        <Btn v='outline' onClick={() => { setPartA(blankPartA()); setPartB(blankPartB()); setPartC(blankPartC()); setDone(false); setTab('A'); }}>
          Fill Another Year
        </Btn>
      </div>
    </div>
  );

  return (
    <div>
      {/* Form header */}
      <div style={{ background:C.navy, borderRadius:12, padding:'16px 22px', marginBottom:20 }}>
        <div style={{ color:'rgba(255,255,255,.55)', fontSize:11, textTransform:'uppercase', letterSpacing:'1px', marginBottom:4 }}>
          Annual Self-Assessment — PBAS (Performance Based Appraisal System)
        </div>
        <div style={{ color:'#fff', fontSize:18, fontWeight:800 }}>
          Govt. of Assam — UGC / AICTE Guidelines
        </div>
        <div style={{ display:'flex', gap:16, marginTop:10, flexWrap:'wrap', alignItems:'center' }}>
          <label style={{ color:'rgba(255,255,255,.7)', fontSize:13 }}>Session / Year:</label>
          <select value={year} onChange={e => setYear(e.target.value)}
            style={{ padding:'5px 10px', borderRadius:7, border:'none', fontFamily:'inherit', fontSize:13, fontWeight:700 }}>
            {ASSESSMENT_YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
          {isReturn && (
            <span style={{ background:'#fee2e2', color:'#991b1b', padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700 }}>
              ⚠️ Returned for Revision
              {(existing.hodRemark || existing.principalRemark) ? `: ${existing.hodRemark || existing.principalRemark}` : ''}
            </span>
          )}
          <div style={{ marginLeft:'auto', background:'rgba(255,255,255,.12)', borderRadius:10, padding:'8px 16px', textAlign:'center' }}>
            <div style={{ color:'rgba(255,255,255,.55)', fontSize:11 }}>Total API Score</div>
            <div style={{ color:'#fbbf24', fontSize:28, fontWeight:900 }}>{scores.total}</div>
            <div style={{ color:'rgba(255,255,255,.5)', fontSize:10 }}>C-I:{scores.c1} · C-II:{scores.c2} · C-III:{scores.c3}</div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display:'flex', gap:3, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding:'8px 14px', borderRadius:8, border: tab === t.id ? 'none' : `1px solid ${C.border}`,
              cursor:'pointer', fontFamily:'inherit', fontSize:11, fontWeight:700, textAlign:'center',
              lineHeight:1.4, minWidth:80, background: tab === t.id ? C.navy : '#fff',
              color: tab === t.id ? '#fff' : C.muted }}>
            {t.label}{'\n'}{t.sub}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      {tab === 'A'  && <PartA   data={partA} onChange={setPartA} readOnly={false}/>}
      {tab === 'B1' && <CatI   data={partB} onChange={setPartB} scores={scores} readOnly={false}/>}
      {tab === 'B2' && <CatII  data={partB} onChange={setPartB} scores={scores} readOnly={false}/>}
      {tab === 'B3' && <CatIII data={partB} onChange={setPartB} scores={scores} readOnly={false}/>}
      {tab === 'C'  && <PartC  data={partC} onChange={setPartC} readOnly={false}/>}
      {tab === 'D'  && <PartD  scores={scores}/>}

      {/* Sticky submit bar */}
      <div style={{ position:'sticky', bottom:0, background:'rgba(249,250,251,.97)',
        backdropFilter:'blur(8px)', borderTop:`1px solid ${C.border}`,
        padding:'12px 0', display:'flex', justifyContent:'space-between',
        alignItems:'center', gap:12, flexWrap:'wrap', marginTop:8 }}>
        <div style={{ fontSize:13, color:C.muted }}>
          Total: <strong style={{ color:C.text, fontSize:15 }}>{scores.total}</strong>
          <span style={{ marginLeft:8 }}>C-I: {scores.c1} | C-II: {scores.c2} | C-III: {scores.c3}</span>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <Btn v='outline' onClick={() => curIdx > 0 && setTab(TABS[curIdx - 1].id)}>◀ Prev</Btn>
          <Btn v='outline' onClick={() => curIdx < TABS.length - 1 && setTab(TABS[curIdx + 1].id)}>Next ▶</Btn>
          <Btn v='success' sz='lg' onClick={handleSubmit}>Submit to HOD →</Btn>
        </div>
      </div>
    </div>
  );
}
