import React from 'react';
import { C } from '../../data/constants.js';
import { Card, Th, Td, TInput, AddRow, DelBtn } from '../ui/index.jsx';
import UploadZone from '../shared/UploadZone.jsx';

export default function CatII({ data, onChange, scores, readOnly }) {
  const up = (k, v) => onChange({ ...data, [k]: v });
  const upList = (key, i, field, val) =>
    up(key, data[key].map((x, j) => j === i ? { ...x, [field]: val } : x));
  const delRow = (key, i) => up(key, data[key].filter((_, j) => j !== i));
  const addProof = (k, files) => up('proofs', { ...data.proofs, [k]: [...(data.proofs?.[k] || []), ...files] });
  const remProof = (k, i)     => up('proofs', { ...data.proofs, [k]: (data.proofs?.[k] || []).filter((_, j) => j !== i) });
  const { c2i, c2ii, c2iii } = scores.breakdown;

  return (
    <div>
      <div style={{ background:'#0d6b6b', color:'#fff', padding:'10px 18px', borderRadius:'10px 10px 0 0', fontWeight:800, fontSize:15 }}>
        CATEGORY II: Co-curricular, Extra-curricular & Professional Development Activities
        <span style={{ float:'right', background:'rgba(255,255,255,.15)', padding:'3px 14px', borderRadius:20, fontSize:13 }}>
          Total: {scores.c2} / 25
        </span>
      </div>

      {/* (i) Extension */}
      <Card title='(i) Extension, Co-curricular & Field-Based Activities (max 20)' accent='#0d6b6b'
        style={{ borderRadius:'0 0 12px 12px', marginTop:0 }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Type of Activity', 'Avg. Hrs / Week', 'API Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {(data.extActivities || []).map((r, i) => (
              <tr key={i}>
                <Td><TInput value={r.activity}   onChange={v => upList('extActivities', i, 'activity',   v)} placeholder='NSS / NCC / Sports / Cultural'/></Td>
                <Td><TInput type='number' value={r.hrsPerWeek} onChange={v => upList('extActivities', i, 'hrsPerWeek', v)} min={0}/></Td>
                <Td style={{ fontWeight:700, color:'#0d6b6b' }}>{+(Number(r.hrsPerWeek || 0) * 0.5).toFixed(1)}</Td>
                <Td>{!readOnly && <DelBtn onClick={() => delRow('extActivities', i)}/>}</Td>
              </tr>
            ))}
          </tbody>
        </table>
        {!readOnly && <AddRow label='Add Activity' onClick={() => up('extActivities', [...(data.extActivities || []), { activity:'', hrsPerWeek:'' }])}/>}
        <div style={{ marginTop:8, fontWeight:700, color:'#0d6b6b' }}>Total: {c2i} / 20</div>
        <div style={{ marginTop:6 }}>
          <UploadZone sectionKey='extAct' files={data.proofs?.extAct}
            onAdd={addProof} onRemove={remProof} readOnly={readOnly}
            hint='Certificates, activity reports, event photos'/>
        </div>
      </Card>

      {/* (ii) Corporate Life */}
      <Card title='(ii) Contribution to Corporate Life & Management of Institution (max 15)' accent='#0d6b6b'>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Yearly / Semester Responsibilities', 'Period', 'API Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {(data.corpLife || []).map((r, i) => (
              <tr key={i}>
                <Td><TInput value={r.responsibility} onChange={v => upList('corpLife', i, 'responsibility', v)} placeholder='NAAC Coordinator / Exam Controller…'/></Td>
                <Td><TInput value={r.period}          onChange={v => upList('corpLife', i, 'period',         v)} placeholder='2023-24'/></Td>
                <Td style={{ fontWeight:700, color:'#0d6b6b' }}>3</Td>
                <Td>{!readOnly && <DelBtn onClick={() => delRow('corpLife', i)}/>}</Td>
              </tr>
            ))}
          </tbody>
        </table>
        {!readOnly && <AddRow label='Add Responsibility' onClick={() => up('corpLife', [...(data.corpLife || []), { responsibility:'', period:'' }])}/>}
        <div style={{ marginTop:8, fontWeight:700, color:'#0d6b6b' }}>Total: {c2ii} / 15</div>
        <div style={{ marginTop:6 }}>
          <UploadZone sectionKey='corpLife' files={data.proofs?.corpLife}
            onAdd={addProof} onRemove={remProof} readOnly={readOnly}
            hint='Office orders, appointment letters, notifications'/>
        </div>
      </Card>

      {/* (iii) Professional Development */}
      <Card title='(iii) Professional Development Activities (max 15)' accent='#0d6b6b'>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Activity Description', 'Avg. Hrs / Week', 'API Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {(data.profDev || []).map((r, i) => (
              <tr key={i}>
                <Td><TInput value={r.activity}   onChange={v => upList('profDev', i, 'activity',   v)} placeholder='Professional memberships, workshops…'/></Td>
                <Td><TInput type='number' value={r.hrsPerWeek} onChange={v => upList('profDev', i, 'hrsPerWeek', v)} min={0}/></Td>
                <Td style={{ fontWeight:700, color:'#0d6b6b' }}>{+(Number(r.hrsPerWeek || 0) * 0.5).toFixed(1)}</Td>
                <Td>{!readOnly && <DelBtn onClick={() => delRow('profDev', i)}/>}</Td>
              </tr>
            ))}
          </tbody>
        </table>
        {!readOnly && <AddRow label='Add Activity' onClick={() => up('profDev', [...(data.profDev || []), { activity:'', hrsPerWeek:'' }])}/>}
        <div style={{ marginTop:8, fontWeight:700, color:'#0d6b6b' }}>Total: {c2iii} / 15</div>
        <div style={{ marginTop:6 }}>
          <UploadZone sectionKey='profDev' files={data.proofs?.profDev}
            onAdd={addProof} onRemove={remProof} readOnly={readOnly}
            hint='Professional membership certificates, seminar attendance proofs'/>
        </div>
      </Card>
    </div>
  );
}
