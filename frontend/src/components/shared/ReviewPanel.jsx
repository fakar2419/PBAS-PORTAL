import React, { useState } from 'react';
import { C } from '../../data/constants.js';
import { calcAPI, countProofFiles } from '../../utils/helpers.js';
import { StatusBadge, Btn, Card } from '../ui/index.jsx';
import ViewSubmission from './ViewSubmission.jsx';

// ─── REVIEW PANEL (HOD / Principal / Expert) ──────────────────────
export function ReviewPanel({ submissions, filterFn, emptyMsg, onAction, actions, title, subtitle }) {
  const [viewSub, setViewSub] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [sectionRemarks, setSectionRemarks] = useState({});
  const filtered = submissions.filter(filterFn);

  return (
    <div style={{ maxWidth:900 }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:C.navy }}>{title}</h2>
        <p style={{ margin:'4px 0 0', fontSize:13, color:C.muted }}>{subtitle} — {filtered.length} record(s)</p>
      </div>

      {filtered.length === 0 && (
        <Card><p style={{ textAlign:'center', color:C.muted, padding:'30px 0' }}>✅ {emptyMsg}</p></Card>
      )}

      {filtered.map(sub => {
        const sc     = sub.scores || calcAPI(sub.partB);
        const files  = countProofFiles(sub.partB, sub.partC);
        const remark = remarks[sub.id] || '';
        return (
          <Card key={sub.id} style={{ marginBottom:20 }}>
            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:14, marginBottom:14 }}>
              <div>
                <div style={{ fontWeight:800, fontSize:18, color:C.navy }}>{sub.partA?.name || sub.facultyName}</div>
                <div style={{ color:C.muted, fontSize:13, marginTop:2 }}>
                  {sub.partA?.dept || sub.dept} · {sub.partA?.designation || ''}  · AY {sub.year}
                </div>
                <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
                  <StatusBadge s={sub.status}/>
                  <span style={{ background:'#e0f2fe', color:'#0369a1', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>📎 {files} file(s)</span>
                  <span style={{ background:'#f0fdf4', color:'#166534', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>Submitted: {sub.submittedAt}</span>
                </div>
                {sub.hodRemark && (
                  <div style={{ marginTop:8, background:'#fef9c3', border:'1px solid #fde047', borderRadius:7, padding:'6px 10px', fontSize:12, color:'#713f12' }}>
                    HOD Remark: {sub.hodRemark}
                  </div>
                )}
                {sub.principalRemark && (
                  <div style={{ marginTop:6, background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:7, padding:'6px 10px', fontSize:12, color:'#991b1b' }}>
                    Principal Remark: {sub.principalRemark}
                  </div>
                )}
                {sub.expertComment && (
                  <div style={{ marginTop:6, background:'#f3e8ff', border:'1px solid #d8b4fe', borderRadius:7, padding:'6px 10px', fontSize:12, color:'#581c87' }}>
                    Expert Remark: {sub.expertComment}
                  </div>
                )}
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:44, fontWeight:900, color:C.blue, lineHeight:1 }}>{sc.total}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>C-I: {sc.c1} · C-II: {sc.c2} · C-III: {sc.c3}</div>
              </div>
            </div>

            {/* Category breakdown */}
            <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
              {[['Cat-I', sc.c1,'#1a4fa8','#dbeafe'],['Cat-II',sc.c2,'#0d6b6b','#d1fae5'],['Cat-III',sc.c3,'#6b21a8','#ede9fe']].map(([l,v,fg,bg]) => (
                <div key={l} style={{ flex:1, minWidth:80, background:bg, borderRadius:8, padding:'7px 12px', textAlign:'center' }}>
                  <div style={{ fontSize:11, color:fg, fontWeight:700 }}>{l}</div>
                  <div style={{ fontSize:20, fontWeight:900, color:fg }}>{v}</div>
                </div>
              ))}
            </div>

            <Btn v='outline' sz='sm' onClick={() => setViewSub(sub)} style={{ marginBottom:12 }}>
              📋 View Full PBAS Form & Proof Documents
            </Btn>

            {/* Remark textarea */}
            <div style={{ marginBottom:12 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:C.text, marginBottom:5 }}>
                Remark:
              </label>
              <textarea value={remark} onChange={e => setRemarks(r => ({ ...r, [sub.id]: e.target.value }))}
                rows={2} placeholder='Enter review remark…'
                style={{ width:'100%', boxSizing:'border-box', padding:'8px 12px', border:`1px solid ${C.border}`,
                  borderRadius:8, fontFamily:'inherit', fontSize:13, resize:'vertical', outline:'none' }}/>
            </div>

            {/* Action buttons */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {actions.map(a => (
                <Btn key={a.label} v={a.v} sz='sm'
                  onClick={() => {
                    const secRems = sectionRemarks[sub.id] || {};
                    const hasSecRems = Object.keys(secRems).some(k => secRems[k] && secRems[k].trim());
                    if (a.needRemark && !remark.trim() && !hasSecRems) return alert(`Please enter a remark or section remark before "${a.label}".`);
                    onAction(sub.id, a.action, remark, secRems);
                    setRemarks(r => ({ ...r, [sub.id]: '' }));
                    setSectionRemarks(r => ({ ...r, [sub.id]: {} }));
                  }}>
                  {a.label}
                </Btn>
              ))}
            </div>
          </Card>
        );
      })}

      {viewSub && (
        <ViewSubmission 
          sub={viewSub} 
          onClose={() => setViewSub(null)}
          sectionRemarks={sectionRemarks[viewSub.id] || {}}
          onSectionRemarkChange={(tabId, val) => {
            setSectionRemarks(prev => ({
              ...prev,
              [viewSub.id]: { ...(prev[viewSub.id] || {}), [tabId]: val }
            }));
          }}
          isReviewer={true}
        />
      )}
    </div>
  );
}

// ─── ALL SUBMISSIONS TABLE ─────────────────────────────────────────
export function AllSubs({ submissions, title = 'All Submissions', onDelete }) {
  const [viewSub, setViewSub] = useState(null);
  const canDelete = typeof onDelete === 'function';

  return (
    <div style={{ maxWidth:1000 }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:C.navy }}>{title}</h2>
        <p style={{ margin:'4px 0 0', fontSize:13, color:C.muted }}>{submissions.length} record(s)</p>
      </div>

      {submissions.length === 0
        ? <Card><p style={{ textAlign:'center', color:C.muted, padding:'30px 0' }}>No records found.</p></Card>
        : (
          <Card style={{ padding:0, overflow:'hidden' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr>
                    {['Faculty Name','Department','Designation','AY','Cat-I','Cat-II','Cat-III','Total','Files','Status',''].map(h => (
                      <th key={h} style={{ padding:'9px 12px', background:C.navy, color:'#fff', fontSize:11, fontWeight:700, textAlign:'left', whiteSpace:'nowrap', borderRight:'1px solid rgba(255,255,255,.1)' }}>{h}</th>
                    ))}
                    {canDelete && (
                      <th style={{ padding:'9px 12px', background:C.navy, color:'#fff', fontSize:11, fontWeight:700, textAlign:'left', whiteSpace:'nowrap' }}></th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(sub => {
                    const sc    = sub.scores || calcAPI(sub.partB);
                    const files = countProofFiles(sub.partB, sub.partC);
                    return (
                      <tr key={sub.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                        <td style={{ padding:'9px 12px', fontWeight:700, color:C.text }}>{sub.partA?.name || sub.facultyName}</td>
                        <td style={{ padding:'9px 12px', color:C.muted, maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{sub.partA?.dept || sub.dept}</td>
                        <td style={{ padding:'9px 12px', color:C.muted, whiteSpace:'nowrap' }}>{sub.partA?.designation || '—'}</td>
                        <td style={{ padding:'9px 12px', color:C.text }}>{sub.year}</td>
                        <td style={{ padding:'9px 12px', textAlign:'center', fontWeight:700, color:'#1a4fa8' }}>{sc.c1}</td>
                        <td style={{ padding:'9px 12px', textAlign:'center', fontWeight:700, color:'#0d6b6b' }}>{sc.c2}</td>
                        <td style={{ padding:'9px 12px', textAlign:'center', fontWeight:700, color:'#6b21a8' }}>{sc.c3}</td>
                        <td style={{ padding:'9px 12px', textAlign:'center', fontWeight:900, color:C.navy, fontSize:14 }}>{sc.total}</td>
                        <td style={{ padding:'9px 12px', textAlign:'center' }}>
                          <span style={{ background:'#e0f2fe', color:'#0369a1', padding:'2px 7px', borderRadius:8, fontWeight:700 }}>📎 {files}</span>
                        </td>
                        <td style={{ padding:'9px 12px' }}><StatusBadge s={sub.status}/></td>
                        <td style={{ padding:'9px 12px' }}>
                          <button onClick={() => setViewSub(sub)}
                            style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:6,
                              padding:'3px 10px', cursor:'pointer', fontSize:11, color:C.blue, fontWeight:700 }}>
                            View
                          </button>
                        </td>
                        {canDelete && (
                          <td style={{ padding:'9px 12px' }}>
                            <button onClick={() => onDelete(sub.id)}
                              style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:6,
                                padding:'3px 10px', cursor:'pointer', fontSize:11, color:'#dc2626', fontWeight:700 }}>
                              🗑 Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )
      }

      {viewSub && <ViewSubmission sub={viewSub} onClose={() => setViewSub(null)}/>}
    </div>
  );
}
