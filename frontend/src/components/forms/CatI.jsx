import React from 'react';
import { C } from '../../data/constants.js';
import { Card, Th, Td, TInput, TSelect, AddRow, DelBtn } from '../ui/index.jsx';
import UploadZone from '../shared/UploadZone.jsx';

export default function CatI({ data, onChange, scores, readOnly }) {
  const up = (k, v) => onChange({ ...data, [k]: v });
  const upList = (key, i, field, val) =>
    up(key, data[key].map((x, j) => j === i ? { ...x, [field]: val } : x));
  const delRow = (key, i) => up(key, data[key].filter((_, j) => j !== i));
  const addProof = (k, files) => up('proofs', { ...data.proofs, [k]: [...(data.proofs?.[k] || []), ...files] });
  const remProof = (k, i)     => up('proofs', { ...data.proofs, [k]: (data.proofs?.[k] || []).filter((_, j) => j !== i) });

  const { c1a, c1b, c1ii, c1iii, c1iv } = scores.breakdown;

  return (
    <div>
      {/* Category header */}
      <div style={{ background:C.navy, color:'#fff', padding:'10px 18px', borderRadius:'10px 10px 0 0', fontWeight:800, fontSize:15 }}>
        CATEGORY I: Teaching, Learning and Evaluation Related Activities
        <span style={{ float:'right', background:'rgba(255,255,255,.15)', padding:'3px 14px', borderRadius:20, fontSize:13 }}>
          Total: {scores.c1}
        </span>
      </div>

      {/* (i) Courses */}
      <Card title='(i) Lectures, Seminars, Tutorials, Practicals, Contact Hours' accent='#1a4fa8'
        style={{ borderRadius:'0 0 12px 12px', marginTop:0 }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:680 }}>
            <thead>
              <tr>
                {['Course / Paper', 'Level', 'Mode (L/S/T/P/C)', 'Classes/Wk Allotted', 'Classes Conducted', '% Taken', ''].map(h => <Th key={h}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {(data.courses || []).map((r, i) => (
                <tr key={i}>
                  <Td><TInput value={r.paper}     onChange={v => upList('courses', i, 'paper',     v)} placeholder='Subject name'/></Td>
                  <Td><TSelect value={r.level}    onChange={v => upList('courses', i, 'level',     v)} opts={[['ug','UG'],['pg','PG'],['phd','Ph.D.']]}/></Td>
                  <Td><TSelect value={r.mode}     onChange={v => upList('courses', i, 'mode',      v)} opts={[['L','Lecture'],['S','Seminar'],['T','Tutorial'],['P','Practical'],['C','Contact Hours']]}/></Td>
                  <Td><TInput type='number' value={r.allotted}   onChange={v => upList('courses', i, 'allotted',   v)} min={0}/></Td>
                  <Td><TInput type='number' value={r.conducted}  onChange={v => upList('courses', i, 'conducted',  v)} min={0}/></Td>
                  <Td style={{ fontWeight:700, color:C.blue }}>
                    {r.allotted > 0 ? (Number(r.conducted) / Number(r.allotted) * 100).toFixed(0) + '%' : '—'}
                  </Td>
                  <Td>{!readOnly && <DelBtn onClick={() => delRow('courses', i)}/>}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!readOnly && <AddRow label='Add Course' onClick={() => up('courses', [...(data.courses || []), { paper:'', level:'', mode:'', allotted:'', conducted:'' }])}/>}

        {/* Score panels */}
        <div style={{ display:'flex', gap:14, marginTop:14, flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:200, background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:8, padding:'10px 16px' }}>
            <div style={{ fontSize:12, color:C.muted }}>API (a): Classes Taken — max 50 for ≥100%, proportionate ≥80%, else 0</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.blue, marginTop:4 }}>{c1a} <span style={{ fontSize:12, fontWeight:400 }}>/ 50</span></div>
          </div>
          <div style={{ flex:1, minWidth:200, background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8, padding:'10px 16px' }}>
            <div style={{ fontSize:12, color:C.muted }}>API (b): Teaching Load in Excess of Institute Norms — max 10</div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:4 }}>
              {!readOnly
                ? <input type='number' value={data.extraLoad || 0} min={0} max={10}
                    onChange={e => up('extraLoad', Math.min(10, Number(e.target.value)))}
                    style={{ width:60, padding:'5px 8px', border:`1px solid ${C.border}`, borderRadius:6, fontSize:14, fontWeight:700, color:C.blue }}/>
                : <span style={{ fontSize:22, fontWeight:800, color:'#059669' }}>{c1b}</span>
              }
              <span style={{ fontSize:13, color:C.muted }}>/ 10</span>
            </div>
          </div>
        </div>
      </Card>

      {/* (ii) Instructional material */}
      <Card title='(ii) Reading / Instructional Material Consulted & Additional Resources Provided to Students (max 5)' accent='#0d6b6b'>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Course / Paper', 'Material Consulted', 'Additional Resources Provided', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {(data.instrMaterial || []).map((r, i) => (
                <tr key={i}>
                  <Td><TInput value={r.course}     onChange={v => upList('instrMaterial', i, 'course',     v)}/></Td>
                  <Td><TInput value={r.consulted}  onChange={v => upList('instrMaterial', i, 'consulted',  v)}/></Td>
                  <Td><TInput value={r.additional} onChange={v => upList('instrMaterial', i, 'additional', v)}/></Td>
                  <Td>{!readOnly && <DelBtn onClick={() => delRow('instrMaterial', i)}/>}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!readOnly && <AddRow label='Add Entry' onClick={() => up('instrMaterial', [...(data.instrMaterial || []), { course:'', consulted:'', additional:'' }])}/>}
        <div style={{ marginTop:8, fontWeight:700, color:'#059669' }}>API Score: {c1ii} / 5</div>
        <div style={{ marginTop:6 }}>
          <UploadZone sectionKey='instrMaterial' files={data.proofs?.instrMaterial}
            onAdd={addProof} onRemove={remProof} readOnly={readOnly}
            hint='Course material, resource documents, question bank'/>
        </div>
      </Card>

      {/* (iii) Innovative Teaching */}
      <Card title='(iii) Use of Participatory & Innovative Teaching-Learning Methodologies, Course Improvement (max 20)' accent='#6b21a8'>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Sl.', 'Short Description', 'API Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {(data.innovTeaching || []).map((r, i) => (
              <tr key={i}>
                <Td style={{ width:40 }}>{i + 1}</Td>
                <Td><TInput value={r.desc}  onChange={v => upList('innovTeaching', i, 'desc',  v)} placeholder='e.g. MOOC, e-content, simulation tools'/></Td>
                <Td style={{ width:80 }}><TInput type='number' value={r.score} onChange={v => upList('innovTeaching', i, 'score', v)} min={0}/></Td>
                <Td>{!readOnly && <DelBtn onClick={() => delRow('innovTeaching', i)}/>}</Td>
              </tr>
            ))}
          </tbody>
        </table>
        {!readOnly && <AddRow label='Add Activity' onClick={() => up('innovTeaching', [...(data.innovTeaching || []), { desc:'', score:'' }])}/>}
        <div style={{ marginTop:8, fontWeight:700, color:'#7c3aed' }}>Score: {c1iii} / 20</div>
        <div style={{ marginTop:6 }}>
          <UploadZone sectionKey='innovTeach' files={data.proofs?.innovTeach}
            onAdd={addProof} onRemove={remProof} readOnly={readOnly}
            hint='MOOC/e-content links, innovation certificates'/>
        </div>
      </Card>

      {/* (iv) Exam Duties */}
      <Card title='(iv) Examination Duties Assigned and Performed (max 25)' accent='#b45309'>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Type of Examination Duty', 'Duties Assigned', '% Carried Out', 'API Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {(data.examDuties || []).map((r, i) => {
                const eff  = (Number(r.pct) || 0) / 100;
                const base = r.type === 'invigilation' ? 2 : r.type === 'paper-setting' ? 3 : r.type === 'evaluation' ? 2 : 1;
                return (
                  <tr key={i}>
                    <Td><TSelect value={r.type} onChange={v => upList('examDuties', i, 'type', v)}
                      opts={[['invigilation','Invigilation'],['paper-setting','Question Paper Setting'],['evaluation','Evaluation / Assessment'],['other','Other']]}/></Td>
                    <Td><TInput value={r.assigned} onChange={v => upList('examDuties', i, 'assigned', v)}/></Td>
                    <Td><TInput type='number' value={r.pct} onChange={v => upList('examDuties', i, 'pct', v)} min={0} max={100} placeholder='0–100'/></Td>
                    <Td style={{ fontWeight:700, color:'#b45309' }}>{+(base * eff).toFixed(1)}</Td>
                    <Td>{!readOnly && <DelBtn onClick={() => delRow('examDuties', i)}/>}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!readOnly && <AddRow label='Add Duty' onClick={() => up('examDuties', [...(data.examDuties || []), { type:'', assigned:'', pct:'' }])}/>}
        <div style={{ marginTop:8, fontWeight:700, color:'#b45309' }}>Total Score: {c1iv} / 25</div>
        <div style={{ marginTop:6 }}>
          <UploadZone sectionKey='examDuty' files={data.proofs?.examDuty}
            onAdd={addProof} onRemove={remProof} readOnly={readOnly}
            hint='Invigilation letters, duty allotment orders'/>
        </div>
      </Card>
    </div>
  );
}
