import React from 'react';
import { Card, Input, Th, Td, TInput, TSelect, AddRow, DelBtn } from '../ui/index.jsx';

export default function PartA({ data, onChange, readOnly }) {
  const set = (k) => (v) => onChange({ ...data, [k]: v });
  const ro  = readOnly ? 'none' : 'auto';

  const updList = (key, i, field, val) =>
    onChange({ ...data, [key]: data[key].map((x, j) => j === i ? { ...x, [field]: val } : x) });
  const delRow  = (key, i) =>
    onChange({ ...data, [key]: data[key].filter((_, j) => j !== i) });
  const addRow  = (key, blank) =>
    onChange({ ...data, [key]: [...(data[key] || []), blank] });

  return (
    <div style={{ pointerEvents: ro }}>
      {/* Personal details */}
      <Card title='1–13. Personal & Service Details' accent='#1a4fa8'>
        <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
          <Input label='1. Name' value={data.name} onChange={set('name')} req half placeholder='Full Name with Title'/>
          <Input label="2. Father's Name" value={data.fatherName} onChange={set('fatherName')} half/>
          <Input label='3. Department' value={data.dept} onChange={set('dept')} half/>
          <Input label='4. Current Designation & Grade Pay' value={data.designation} onChange={set('designation')} half/>
          <Input label='5. Date of Last Promotion' value={data.lastPromoDate} onChange={set('lastPromoDate')} type='date' half/>
          <Input label='10. Date of Appointment (Govt. of Assam)' value={data.appointDate} onChange={set('appointDate')} type='date' half/>
          <Input label='11. Date of Joining' value={data.joiningDate} onChange={set('joiningDate')} type='date' half/>
          <Input label='12. CAS Position & AGP Applied For' value={data.casPosition} onChange={set('casPosition')} half/>
          <Input label='13. Date of Eligibility for Promotion' value={data.eligDate} onChange={set('eligDate')} type='date' half/>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
          <Input label='6. Address for Correspondence' value={data.corrAddress} onChange={set('corrAddress')} style={{ flex:'1 1 calc(50% - 6px)' }}/>
          <Input label='7. Permanent Address'          value={data.permAddress}  onChange={set('permAddress')} style={{ flex:'1 1 calc(50% - 6px)' }}/>
          <Input label='Mobile No.'  value={data.mobile} onChange={set('mobile')} half/>
          <Input label='Email ID'    value={data.email}  onChange={set('email')} type='email' half/>
        </div>
        <div style={{ marginTop:4 }}>
          <label style={{ fontSize:12, fontWeight:700, color:'#111827', marginBottom:4, display:'block' }}>
            8. Fresh Academic Qualifications Acquired During the Year
          </label>
          <input value={data.freshQual || 'NIL'} onChange={e => set('freshQual')(e.target.value)}
            style={{ padding:'7px 10px', border:'1px solid #d1d5db', borderRadius:7, fontSize:13, fontFamily:'inherit', width:'100%', boxSizing:'border-box' }}/>
        </div>
      </Card>

      {/* Educational qualifications */}
      <Card title='14. Educational Qualifications (Graduation onwards)' accent='#0d6b6b'>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Examination', 'University', 'Year of Passing', 'Marks (%)', 'Class / Grade', ''].map(h => <Th key={h}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {(data.edu || []).map((r, i) => (
                <tr key={i}>
                  <Td><TInput value={r.exam}  onChange={v => updList('edu', i, 'exam',  v)} placeholder='B.Tech / M.Tech…'/></Td>
                  <Td><TInput value={r.univ}  onChange={v => updList('edu', i, 'univ',  v)}/></Td>
                  <Td><TInput value={r.year}  onChange={v => updList('edu', i, 'year',  v)} placeholder='YYYY'/></Td>
                  <Td><TInput value={r.marks} onChange={v => updList('edu', i, 'marks', v)} placeholder='%'/></Td>
                  <Td><TInput value={r.grade} onChange={v => updList('edu', i, 'grade', v)} placeholder='First / Distinction'/></Td>
                  <Td>{!readOnly && <DelBtn onClick={() => delRow('edu', i)}/>}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!readOnly && <AddRow label='Add Qualification' onClick={() => addRow('edu', { exam:'', univ:'', year:'', marks:'', grade:'' })}/>}
      </Card>

      {/* Research degrees */}
      <Card title='15. Research Degrees' accent='#6b21a8'>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Degree', 'University', 'Date of Award', 'Title of Thesis', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {(data.research || []).map((r, i) => (
                <tr key={i}>
                  <Td><TSelect value={r.degree} onChange={v => updList('research', i, 'degree', v)} opts={[['phd','Ph.D./D.Phil.'],['dsc','D.Sc./D.Lit.'],['other','Other']]}/></Td>
                  <Td><TInput  value={r.univ}   onChange={v => updList('research', i, 'univ',  v)}/></Td>
                  <Td><TInput  type='date' value={r.date} onChange={v => updList('research', i, 'date', v)}/></Td>
                  <Td><TInput  value={r.title}  onChange={v => updList('research', i, 'title', v)}/></Td>
                  <Td>{!readOnly && <DelBtn onClick={() => delRow('research', i)}/>}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!readOnly && <AddRow label='Add Research Degree' onClick={() => addRow('research', { degree:'', univ:'', date:'', title:'' })}/>}
      </Card>

      {/* Experience */}
      <Card title='16. Teaching / Research / Academic Experience' accent='#b45309'>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Designation', 'Employer', 'From', 'To', 'Scale of Pay', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {(data.experience || []).map((r, i) => (
                <tr key={i}>
                  <Td><TInput value={r.desig}    onChange={v => updList('experience', i, 'desig',    v)}/></Td>
                  <Td><TInput value={r.employer} onChange={v => updList('experience', i, 'employer', v)}/></Td>
                  <Td><TInput type='date' value={r.from} onChange={v => updList('experience', i, 'from', v)}/></Td>
                  <Td><TInput type='date' value={r.to}   onChange={v => updList('experience', i, 'to',   v)}/></Td>
                  <Td><TInput value={r.scale}    onChange={v => updList('experience', i, 'scale',    v)}/></Td>
                  <Td>{!readOnly && <DelBtn onClick={() => delRow('experience', i)}/>}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!readOnly && <AddRow label='Add Experience' onClick={() => addRow('experience', { desig:'', employer:'', from:'', to:'', scale:'' })}/>}
      </Card>

      {/* Refresher courses */}
      <Card title='9. ASC / Refresher / Orientation Courses Attended' accent='#0d6b6b'>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Name of Course / Summer School', 'Place', 'Duration', 'Sponsoring Agency', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {(data.refresherCourses || []).map((r, i) => (
                <tr key={i}>
                  <Td><TInput value={r.name}     onChange={v => updList('refresherCourses', i, 'name',     v)}/></Td>
                  <Td><TInput value={r.place}    onChange={v => updList('refresherCourses', i, 'place',    v)}/></Td>
                  <Td><TInput value={r.duration} onChange={v => updList('refresherCourses', i, 'duration', v)} placeholder='e.g. 4 weeks'/></Td>
                  <Td><TInput value={r.agency}   onChange={v => updList('refresherCourses', i, 'agency',   v)}/></Td>
                  <Td>{!readOnly && <DelBtn onClick={() => delRow('refresherCourses', i)}/>}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!readOnly && <AddRow label='Add Course' onClick={() => addRow('refresherCourses', { name:'', place:'', duration:'', agency:'' })}/>}
      </Card>
    </div>
  );
}
