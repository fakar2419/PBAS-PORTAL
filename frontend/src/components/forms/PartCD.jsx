import React from 'react';
import { C } from '../../data/constants.js';
import { Card, Th, Td } from '../ui/index.jsx';
import UploadZone from '../shared/UploadZone.jsx';

// ─── PART C ───────────────────────────────────────────────────────
export function PartC({ data, onChange, readOnly }) {
  const up = (k) => (v) => onChange({ ...data, [k]: v });
  const addProof = (k, files) => onChange({ ...data, proofs: { ...data.proofs, [k]: [...(data.proofs?.[k] || []), ...files] } });
  const remProof = (k, i)     => onChange({ ...data, proofs: { ...data.proofs, [k]: (data.proofs?.[k] || []).filter((_, j) => j !== i) } });

  return (
    <Card title='PART C: Other Relevant Information' accent='#b45309'>
      <p style={{ fontSize:13, color:C.muted, marginBottom:10 }}>
        Credentials, significant contributions, awards received etc. not mentioned earlier.
        Please mention year, value etc. where relevant.
      </p>
      {readOnly
        ? <div style={{ background:C.light, borderRadius:8, padding:'10px 14px', fontSize:13, color:C.text, minHeight:80, whiteSpace:'pre-wrap' }}>
            {data.otherInfo || '—'}
          </div>
        : <textarea value={data.otherInfo || ''} onChange={e => up('otherInfo')(e.target.value)} rows={6}
            placeholder='e.g. Best Teacher Award 2023 (₹25,000), Patent filed for IoT-based irrigation system...'
            style={{ width:'100%', boxSizing:'border-box', padding:'9px 12px', border:`1px solid ${C.border}`,
              borderRadius:8, fontSize:13, fontFamily:'inherit', resize:'vertical', outline:'none' }}/>
      }
      <div style={{ marginTop:18 }}>
        <div style={{ fontWeight:700, fontSize:13, color:C.text, marginBottom:8 }}>
          LIST OF ENCLOSURES
          <span style={{ fontWeight:400, color:C.muted, marginLeft:8, fontSize:12 }}>
            (Attach copies of certificates, sanction orders, papers etc. wherever necessary)
          </span>
        </div>
        <UploadZone sectionKey='enclosures' files={data.proofs?.enclosures}
          onAdd={addProof} onRemove={remProof} readOnly={readOnly}
          hint='All supporting documents, certificates, sanction orders, publications'/>
      </div>
    </Card>
  );
}

// ─── PART D ───────────────────────────────────────────────────────
export function PartD({ scores }) {
  const rows = [
    ['I',    'Teaching, Learning and Evaluation Related Activities', scores.c1],
    ['II',   'Co-curricular, Extension, Professional Development',   scores.c2],
    ['I+II', 'Total (Category I + II)',                              +(scores.c1 + scores.c2).toFixed(1)],
    ['III',  'Research and Academic Contribution',                   scores.c3],
  ];

  return (
    <Card title='PART D: Summary of API Scores' accent={C.navy}>
      <p style={{ fontSize:12, color:C.muted, marginBottom:14 }}>
        I certify that the information provided is correct as per records available with the institution
        and / or documents enclosed along with the duly filled PBAS Performa.
      </p>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr>
              <Th w={60}>Sl. No.</Th>
              <Th>Criteria</Th>
              <Th w={140}>Last Academic Year Score</Th>
              <Th w={140}>Total API Score for Assessment Period</Th>
              <Th w={160}>Annual Average API Score for Assessment Period</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([sl, label, sc]) => (
              <tr key={sl} style={{ background: sl === 'I+II' ? C.light : '#fff' }}>
                <Td style={{ textAlign:'center', fontWeight:700 }}>{sl}</Td>
                <Td style={{ fontWeight: sl === 'I+II' ? 700 : 400 }}>{label}</Td>
                <Td style={{ textAlign:'center', fontWeight:800, color:C.blue, fontSize:15 }}>{sc}</Td>
                <Td style={{ textAlign:'center', fontWeight:800, color:C.blue, fontSize:15 }}>{sc}</Td>
                <Td style={{ textAlign:'center', fontWeight:800, color:C.blue, fontSize:15 }}>{sc}</Td>
              </tr>
            ))}
            <tr style={{ background:C.navy }}>
              <td colSpan={2} style={{ padding:'10px 14px', color:'#fff', fontWeight:800, fontSize:15 }}>GRAND TOTAL</td>
              <td colSpan={3} style={{ padding:'10px 14px', color:'#fbbf24', fontWeight:900, fontSize:24, textAlign:'center' }}>
                {scores.total}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signature blocks */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginTop:24,
        borderTop:`2px solid ${C.border}`, paddingTop:18 }}>
        {['Signature of Incumbent\n(Designation, Place & Date)', 'Signature of HOD\n(with Date & Seal)', 'Signature of Principal\n(with Date & Seal)'].map(t => (
          <div key={t} style={{ border:`1px solid ${C.border}`, borderRadius:8, padding:'30px 12px 10px', textAlign:'center' }}>
            <div style={{ fontSize:11, color:C.muted, whiteSpace:'pre-line', lineHeight:1.7 }}>{t}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
