import React, { useState } from 'react';
import { C, blankPartA, blankPartB, blankPartC } from '../../data/constants.js';
import { calcAPI } from '../../utils/helpers.js';
import { StatusBadge } from '../ui/index.jsx';
import PartA from '../forms/PartA.jsx';
import CatI from '../forms/CatI.jsx';
import CatII from '../forms/CatII.jsx';
import CatIII from '../forms/CatIII.jsx';
import { PartC, PartD } from '../forms/PartCD.jsx';

const TABS = [
  { id:'A',  label:'Part A' },
  { id:'B1', label:'Cat-I'  },
  { id:'B2', label:'Cat-II' },
  { id:'B3', label:'Cat-III'},
  { id:'C',  label:'Part C' },
  { id:'D',  label:'Part D' },
];

export default function ViewSubmission({ sub, onClose, sectionRemarks = {}, onSectionRemarkChange, isReviewer }) {
  const [tab, setTab] = useState('A');
  const [printMode, setPrintMode] = useState(false);
  const scores = sub.scores || calcAPI(sub.partB || blankPartB());

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintMode(false), 100);
    }, 500);
  };

  return (
    <div id="print-mount" style={{ position: printMode ? 'absolute' : 'fixed', inset:0, background: printMode ? '#fff' : 'rgba(12,26,58,.65)', zIndex:400,
      display: printMode ? 'block' : 'flex', alignItems:'flex-start', justifyContent:'center', padding: printMode ? '0px' : '20px 12px', overflowY: printMode ? 'visible' : 'auto' }}>
      
      {printMode && (
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              #print-mount, #print-mount * { visibility: visible; }
              #print-mount { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; background: #fff !important; }
              .no-print { display: none !important; }
            }
          `}
        </style>
      )}

      <div style={{ background:C.bg, borderRadius: printMode ? 0 : 16, width:'100%', maxWidth: printMode ? '100%' : 1000, position:'relative', marginBottom: printMode ? 0 : 20 }}>

        {/* Modal header */}
        <div style={{ background:C.navy, padding:'16px 22px', borderRadius: printMode ? 0 : '16px 16px 0 0',
          display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
          <div>
            <div style={{ color:'#fff', fontWeight:800, fontSize:16 }}>
              PBAS Self-Assessment — {sub.partA?.name || sub.facultyName}
            </div>
            <div style={{ color:'rgba(255,255,255,.6)', fontSize:13, marginTop:3, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              {sub.partA?.dept || sub.dept} · AY {sub.year}
              <span className="no-print"><StatusBadge s={sub.status}/></span>
            </div>
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ background:'rgba(255,255,255,.12)', borderRadius:10, padding:'6px 16px', textAlign:'center' }}>
              <div style={{ color:'rgba(255,255,255,.55)', fontSize:11 }}>Total API</div>
              <div style={{ color:'#fbbf24', fontSize:24, fontWeight:900 }}>{scores.total}</div>
              <div className="no-print" style={{ color:'rgba(255,255,255,.45)', fontSize:10 }}>C-I:{scores.c1} · C-II:{scores.c2} · C-III:{scores.c3}</div>
            </div>
            {!printMode && (
              <>
                <button onClick={handlePrint} title="Print Summary"
                  style={{ background:'rgba(255,255,255,.15)', border:'none', color:'#fff', padding: '6px 14px',
                    borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
                  🖨️ Print
                </button>
                <button onClick={onClose}
                  style={{ background:'rgba(255,255,255,.15)', border:'none', color:'#fff',
                    width:32, height:32, borderRadius:'50%', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  ✕
                </button>
              </>
            )}
          </div>
        </div>

        {/* Remarks */}
        {(sub.hodRemark || sub.principalRemark || sub.expertComment) && (
          <div style={{ padding:'10px 22px', borderBottom:`1px solid ${C.border}`, display:'flex', flexDirection:'column', gap:6 }}>
            {sub.hodRemark && (
              <div style={{ background:'#fef9c3', border:'1px solid #fde047', borderRadius:7, padding:'6px 12px', fontSize:12, color:'#713f12' }}>
                <strong>HOD Remark:</strong> {sub.hodRemark}
              </div>
            )}
            {sub.principalRemark && (
              <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:7, padding:'6px 12px', fontSize:12, color:'#991b1b' }}>
                <strong>Principal Remark:</strong> {sub.principalRemark}
              </div>
            )}
            {sub.expertComment && (
              <div style={{ background:'#f5f3ff', border:'1px solid #ddd6fe', borderRadius:7, padding:'6px 12px', fontSize:12, color:'#5b21b6' }}>
                <strong>Expert Comment:</strong> {sub.expertComment}
              </div>
            )}
          </div>
        )}

        {/* Tab bar */}
        {!printMode && (
          <div style={{ display:'flex', gap:3, padding:'14px 20px 0', overflowX:'auto' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding:'6px 14px', borderRadius:'8px 8px 0 0', border:'none', cursor:'pointer',
                  fontFamily:'inherit', fontSize:12, fontWeight:700,
                  background: tab === t.id ? C.white : C.light,
                  color:      tab === t.id ? C.navy  : C.muted }}>
                {t.label}
                {sub.sectionRemarks?.[t.id] && <span style={{ marginLeft:6, fontSize:14 }}>⚠️</span>}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ padding: printMode ? '24px 32px' : '16px 20px 24px', maxHeight: printMode ? 'none' : '70vh', overflowY: printMode ? 'visible' : 'auto' }}>
          {!isReviewer && sub.sectionRemarks?.[tab] && !printMode && (
             <div style={{ marginBottom:16, background:'#fff1f2', border:'1px solid #fecdd3', borderRadius:8, padding:'12px 16px', color:'#9f1239' }}>
               <strong style={{ display:'block', marginBottom:4 }}>Reviewer Remark for this section:</strong> 
               {sub.sectionRemarks[tab]}
             </div>
          )}

          {(printMode || tab === 'A') && (
            <div style={{ marginBottom: printMode ? 40 : 0 }}>
              {printMode && <h3 style={{ borderBottom:`2px solid ${C.border}`, paddingBottom:8, marginBottom:16, color:C.navy }}>Part A: General Information</h3>}
              <PartA data={sub.partA || blankPartA()} onChange={() => {}} readOnly/>
            </div>
          )}
          
          {(printMode || tab === 'B1') && (
            <div style={{ marginBottom: printMode ? 40 : 0 }}>
              {printMode && <h3 style={{ borderBottom:`2px solid ${C.border}`, paddingBottom:8, marginBottom:16, color:C.navy }}>Category I: Teaching & Learning</h3>}
              <CatI data={sub.partB || blankPartB()} onChange={() => {}} scores={scores} readOnly/>
            </div>
          )}
          
          {(printMode || tab === 'B2') && (
            <div style={{ marginBottom: printMode ? 40 : 0 }}>
              {printMode && <h3 style={{ borderBottom:`2px solid ${C.border}`, paddingBottom:8, marginBottom:16, color:C.navy }}>Category II: Co-Curricular & Extension</h3>}
              <CatII data={sub.partB || blankPartB()} onChange={() => {}} scores={scores} readOnly/>
            </div>
          )}
          
          {(printMode || tab === 'B3') && (
            <div style={{ marginBottom: printMode ? 40 : 0 }}>
              {printMode && <h3 style={{ borderBottom:`2px solid ${C.border}`, paddingBottom:8, marginBottom:16, color:C.navy }}>Category III: Research & Publications</h3>}
              <CatIII data={sub.partB || blankPartB()} onChange={() => {}} scores={scores} readOnly/>
            </div>
          )}
          
          {(printMode || tab === 'C') && (
            <div style={{ marginBottom: printMode ? 40 : 0 }}>
              {printMode && <h3 style={{ borderBottom:`2px solid ${C.border}`, paddingBottom:8, marginBottom:16, color:C.navy }}>Part C: Other Relevant Information</h3>}
              <PartC data={sub.partC || blankPartC()} onChange={() => {}} readOnly/>
            </div>
          )}
          
          {(printMode || tab === 'D') && (
            <div style={{ marginBottom: printMode ? 40 : 0 }}>
              {printMode && <h3 style={{ borderBottom:`2px solid ${C.border}`, paddingBottom:8, marginBottom:16, color:C.navy }}>Part D: Summary of API Scores</h3>}
              <PartD scores={scores}/>
            </div>
          )}
          
          {isReviewer && !printMode && (
             <div style={{ marginTop:24, background:'#f8fafc', border:`1px solid ${C.border}`, borderRadius:8, padding:16 }}>
               <label style={{ display:'block', fontSize:13, fontWeight:700, color:C.navy, marginBottom:8 }}>
                 Add Remark for Section: {TABS.find(t => t.id === tab)?.label}
               </label>
               <textarea 
                  value={sectionRemarks[tab] || ''}
                  onChange={e => onSectionRemarkChange(tab, e.target.value)}
                  rows={3} placeholder='Enter remarks for this specific section/category (these will be attached to the form)...'
                  style={{ width:'100%', boxSizing:'border-box', padding:'10px', border:`1px solid ${C.border}`,
                  borderRadius:8, fontFamily:'inherit', fontSize:13, resize:'vertical', outline:'none' }}/>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
