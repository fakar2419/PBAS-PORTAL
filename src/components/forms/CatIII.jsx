import React from 'react';
import { C } from '../../data/constants.js';
import { Card, Th, Td, TInput, TSelect, AddRow, DelBtn } from '../ui/index.jsx';
import UploadZone from '../shared/UploadZone.jsx';

export default function CatIII({ data, onChange, scores, readOnly }) {
  const up = (k, v) => onChange({ ...data, [k]: v });
  const upList = (key, i, field, val) =>
    up(key, (data[key] || []).map((x, j) => j === i ? { ...x, [field]: val } : x));
  const delRow  = (key, i) => up(key, (data[key] || []).filter((_, j) => j !== i));
  const addProof = (k, files) => up('proofs', { ...data.proofs, [k]: [...(data.proofs?.[k] || []), ...files] });
  const remProof = (k, i)     => up('proofs', { ...data.proofs, [k]: (data.proofs?.[k] || []).filter((_, j) => j !== i) });
  const br = scores.breakdown;

  return (
    <div>
      <div style={{ background:'#6b21a8', color:'#fff', padding:'10px 18px', borderRadius:'10px 10px 0 0', fontWeight:800, fontSize:15 }}>
        CATEGORY III: Research, Publications & Academic Contributions
        <span style={{ float:'right', background:'rgba(255,255,255,.15)', padding:'3px 14px', borderRadius:20, fontSize:13 }}>
          Total: {scores.c3}
        </span>
      </div>

      {/* A) Journals */}
      <Card title='A) Published Papers in Journals' accent='#6b21a8' style={{ borderRadius:'0 0 12px 12px', marginTop:0 }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:900 }}>
            <thead>
              <tr>{['Title (with pg nos)', 'Journal', 'ISSN/ISBN', 'Type', 'Peer Rev.', 'Impact Factor', 'Co-Authors', 'Main Author?', 'Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr>
            </thead>
            <tbody>
              {(data.journals || []).map((r, i) => {
                const peer = r.peerReviewed === 'yes'; const main = r.mainAuthor === 'yes' ? 1 : 0.8;
                let sc = 0;
                if (r.type === 'international-impact')  sc = peer ? 15 * main : 8  * main;
                if (r.type === 'international-nimpact') sc = peer ? 10 * main : 5  * main;
                if (r.type === 'national-peer')         sc = peer ? 10 * main : 5  * main;
                if (r.type === 'national-other')        sc = peer ? 5  * main : 2  * main;
                return (
                  <tr key={i}>
                    <Td style={{ minWidth:120 }}><TInput value={r.title}        onChange={v => upList('journals', i, 'title',        v)}/></Td>
                    <Td style={{ minWidth:120 }}><TInput value={r.journal}      onChange={v => upList('journals', i, 'journal',      v)}/></Td>
                    <Td><TInput value={r.issn}         onChange={v => upList('journals', i, 'issn',         v)}/></Td>
                    <Td style={{ minWidth:160 }}>
                      <TSelect value={r.type} onChange={v => upList('journals', i, 'type', v)}
                        opts={[['international-impact','Intl. (with Impact Factor)'],['international-nimpact','Intl. (no Impact Factor)'],['national-peer','National (Peer Reviewed)'],['national-other','National (Other)']]}/>
                    </Td>
                    <Td><TSelect value={r.peerReviewed} onChange={v => upList('journals', i, 'peerReviewed', v)} opts={[['yes','Yes'],['no','No']]}/></Td>
                    <Td><TInput value={r.impactFactor}  onChange={v => upList('journals', i, 'impactFactor', v)} placeholder='e.g. 2.5'/></Td>
                    <Td><TInput type='number' value={r.coAuthors} onChange={v => upList('journals', i, 'coAuthors', v)} min={0}/></Td>
                    <Td><TSelect value={r.mainAuthor}   onChange={v => upList('journals', i, 'mainAuthor',   v)} opts={[['yes','Yes'],['no','No']]}/></Td>
                    <Td style={{ fontWeight:700, color:'#6b21a8' }}>{+sc.toFixed(1)}</Td>
                    <Td>{!readOnly && <DelBtn onClick={() => delRow('journals', i)}/>}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!readOnly && <AddRow label='Add Journal Paper' onClick={() => up('journals', [...(data.journals||[]), { title:'', journal:'', issn:'', type:'', peerReviewed:'', impactFactor:'', coAuthors:'', mainAuthor:'' }])}/>}
        <div style={{ marginTop:8, fontWeight:700, color:'#6b21a8' }}>Score: {+br.jScore.toFixed(1)}</div>
        <div style={{ marginTop:6 }}>
          <UploadZone sectionKey='journals' files={data.proofs?.journals} onAdd={addProof} onRemove={remProof} readOnly={readOnly} hint='First page of paper + journal listing (UGC/Scopus/WoS/SCI)'/>
        </div>
      </Card>

      {/* B(i) Book Chapters */}
      <Card title='B(i) Articles / Chapters Published in Books' accent='#6b21a8'>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:800 }}>
            <thead><tr>{['Title (pg nos)', 'Book Title / Editor', 'Publisher', 'Publisher Type', 'ISSN/ISBN', 'Peer Rev.', 'Co-Authors', 'Main Author?', 'Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {(data.bookChapters || []).map((r, i) => {
                const main = r.mainAuthor === 'yes' ? 1 : 0.8;
                const sc   = r.pubType === 'international' ? 10 * main : 5 * main;
                return (
                  <tr key={i}>
                    <Td><TInput value={r.title}       onChange={v => upList('bookChapters', i, 'title',       v)}/></Td>
                    <Td><TInput value={r.bookTitle}   onChange={v => upList('bookChapters', i, 'bookTitle',   v)}/></Td>
                    <Td><TInput value={r.publisher}   onChange={v => upList('bookChapters', i, 'publisher',   v)}/></Td>
                    <Td><TSelect value={r.pubType}    onChange={v => upList('bookChapters', i, 'pubType',     v)} opts={[['international','International'],['national','National']]}/></Td>
                    <Td><TInput value={r.issn}        onChange={v => upList('bookChapters', i, 'issn',        v)}/></Td>
                    <Td><TSelect value={r.peerReviewed} onChange={v => upList('bookChapters', i, 'peerReviewed', v)} opts={[['yes','Yes'],['no','No']]}/></Td>
                    <Td><TInput type='number' value={r.coAuthors} onChange={v => upList('bookChapters', i, 'coAuthors', v)}/></Td>
                    <Td><TSelect value={r.mainAuthor} onChange={v => upList('bookChapters', i, 'mainAuthor',  v)} opts={[['yes','Yes'],['no','No']]}/></Td>
                    <Td style={{ fontWeight:700, color:'#6b21a8' }}>{+sc.toFixed(1)}</Td>
                    <Td>{!readOnly && <DelBtn onClick={() => delRow('bookChapters', i)}/>}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!readOnly && <AddRow label='Add Book Chapter' onClick={() => up('bookChapters', [...(data.bookChapters||[]), { title:'', bookTitle:'', publisher:'', pubType:'', issn:'', peerReviewed:'', coAuthors:'', mainAuthor:'' }])}/>}
        <div style={{ marginTop:8, fontWeight:700, color:'#6b21a8' }}>Score: {+br.chapScore.toFixed(1)}</div>
        <div style={{ marginTop:6 }}><UploadZone sectionKey='bookChap' files={data.proofs?.bookChap} onAdd={addProof} onRemove={remProof} readOnly={readOnly} hint='Chapter copy + book cover + ISBN certificate'/></div>
      </Card>

      {/* B(ii) Conference Proceedings */}
      <Card title='B(ii) Full Papers in Conference Proceedings' accent='#6b21a8'>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:750 }}>
            <thead><tr>{['Title (pg nos)', 'Conference Details', 'ISSN/ISBN', 'Level', 'Peer Rev.', 'Co-Authors', 'Main Author?', 'Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {(data.confProceedings || []).map((r, i) => {
                const main = r.mainAuthor === 'yes' ? 1 : 0.8;
                const sc   = r.level === 'international' ? 10 * main : r.level === 'national' ? 7.5 * main : r.level === 'state' ? 5 * main : 3 * main;
                return (
                  <tr key={i}>
                    <Td><TInput value={r.title} onChange={v => upList('confProceedings', i, 'title', v)}/></Td>
                    <Td><TInput value={r.conf}  onChange={v => upList('confProceedings', i, 'conf',  v)}/></Td>
                    <Td><TInput value={r.issn}  onChange={v => upList('confProceedings', i, 'issn',  v)}/></Td>
                    <Td><TSelect value={r.level} onChange={v => upList('confProceedings', i, 'level', v)} opts={[['international','International'],['national','National'],['state','State'],['regional','Regional']]}/></Td>
                    <Td><TSelect value={r.peerReviewed} onChange={v => upList('confProceedings', i, 'peerReviewed', v)} opts={[['yes','Yes'],['no','No']]}/></Td>
                    <Td><TInput type='number' value={r.coAuthors} onChange={v => upList('confProceedings', i, 'coAuthors', v)}/></Td>
                    <Td><TSelect value={r.mainAuthor}   onChange={v => upList('confProceedings', i, 'mainAuthor',   v)} opts={[['yes','Yes'],['no','No']]}/></Td>
                    <Td style={{ fontWeight:700, color:'#6b21a8' }}>{+sc.toFixed(1)}</Td>
                    <Td>{!readOnly && <DelBtn onClick={() => delRow('confProceedings', i)}/>}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!readOnly && <AddRow label='Add Proceedings' onClick={() => up('confProceedings', [...(data.confProceedings||[]), { title:'', conf:'', issn:'', level:'', peerReviewed:'', coAuthors:'', mainAuthor:'' }])}/>}
        <div style={{ marginTop:8, fontWeight:700, color:'#6b21a8' }}>Score: {+br.confProcScore.toFixed(1)}</div>
        <div style={{ marginTop:6 }}><UploadZone sectionKey='confProc' files={data.proofs?.confProc} onAdd={addProof} onRemove={remProof} readOnly={readOnly} hint='Acceptance letter + first page of paper'/></div>
      </Card>

      {/* B(iii) Books */}
      <Card title='B(iii) Books Published as Single Author or Editor' accent='#6b21a8'>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:800 }}>
            <thead><tr>{['Title', 'Type of Book', 'Authorship', 'Publisher & ISSN/ISBN', 'Publisher Type', 'Peer Rev.', 'Co-Authors', 'Main Author?', 'Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {(data.books || []).map((r, i) => {
                const solo = r.authorship === 'single'; const intl = r.publisher === 'international';
                const sc   = solo && intl ? 50 : !solo && intl ? 25 : solo && !intl ? 25 : 10;
                return (
                  <tr key={i}>
                    <Td><TInput value={r.title}      onChange={v => upList('books', i, 'title',      v)}/></Td>
                    <Td><TSelect value={r.type}      onChange={v => upList('books', i, 'type',       v)} opts={[['textbook','Textbook'],['reference','Reference'],['monograph','Monograph'],['edited','Edited Volume']]}/></Td>
                    <Td><TSelect value={r.authorship} onChange={v => upList('books', i, 'authorship', v)} opts={[['single','Single Author'],['editor','Editor']]}/></Td>
                    <Td><TInput value={r.pubDetails} onChange={v => upList('books', i, 'pubDetails', v)}/></Td>
                    <Td><TSelect value={r.publisher} onChange={v => upList('books', i, 'publisher',  v)} opts={[['international','International'],['national','National']]}/></Td>
                    <Td><TSelect value={r.peerReviewed} onChange={v => upList('books', i, 'peerReviewed', v)} opts={[['yes','Yes'],['no','No']]}/></Td>
                    <Td><TInput type='number' value={r.coAuthors} onChange={v => upList('books', i, 'coAuthors', v)}/></Td>
                    <Td><TSelect value={r.mainAuthor}  onChange={v => upList('books', i, 'mainAuthor',  v)} opts={[['yes','Yes'],['no','No']]}/></Td>
                    <Td style={{ fontWeight:700, color:'#6b21a8' }}>{sc}</Td>
                    <Td>{!readOnly && <DelBtn onClick={() => delRow('books', i)}/>}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!readOnly && <AddRow label='Add Book' onClick={() => up('books', [...(data.books||[]), { title:'', type:'', authorship:'', pubDetails:'', publisher:'', peerReviewed:'', coAuthors:'', mainAuthor:'' }])}/>}
        <div style={{ marginTop:8, fontWeight:700, color:'#6b21a8' }}>Score: {br.bookScore}</div>
        <div style={{ marginTop:6 }}><UploadZone sectionKey='books' files={data.proofs?.books} onAdd={addProof} onRemove={remProof} readOnly={readOnly} hint='Cover page + ISBN certificate + publisher letter'/></div>
      </Card>

      {/* C) Projects */}
      <Card title='C(i-ii) Ongoing Research Projects / Consultancies' accent='#b45309'>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Title', 'Funding Agency', 'Period', 'Grant / Amount (₹ Lakhs)', 'API Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {(data.ongoingProjects || []).map((r, i) => {
                const amt = Number(r.amount) || 0; const sc = amt >= 30 ? 20 : amt >= 5 ? 15 : 10;
                return (
                  <tr key={i}>
                    <Td><TInput value={r.title}  onChange={v => upList('ongoingProjects', i, 'title',  v)}/></Td>
                    <Td><TInput value={r.agency} onChange={v => upList('ongoingProjects', i, 'agency', v)}/></Td>
                    <Td><TInput value={r.period} onChange={v => upList('ongoingProjects', i, 'period', v)}/></Td>
                    <Td><TInput type='number' value={r.amount} onChange={v => upList('ongoingProjects', i, 'amount', v)} min={0}/></Td>
                    <Td style={{ fontWeight:700, color:'#b45309' }}>{sc}</Td>
                    <Td>{!readOnly && <DelBtn onClick={() => delRow('ongoingProjects', i)}/>}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!readOnly && <AddRow label='Add Ongoing Project' onClick={() => up('ongoingProjects', [...(data.ongoingProjects||[]), { title:'', agency:'', period:'', amount:'' }])}/>}
        <div style={{ marginTop:6 }}><UploadZone sectionKey='ongoingProj' files={data.proofs?.ongoingProj} onAdd={addProof} onRemove={remProof} readOnly={readOnly} hint='Sanction letter, MOU, work order'/></div>
      </Card>

      <Card title='C(iii-iv) Completed Research Projects / Consultancies' accent='#b45309'>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Title', 'Agency', 'Period', 'Amount (₹ Lakhs)', 'Patent / Policy Output?', 'API Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {(data.completedProjects || []).map((r, i) => {
                const amt = Number(r.amount) || 0; const bonus = r.patent === 'yes' ? 5 : 0;
                const sc  = (amt >= 30 ? 20 : amt >= 5 ? 15 : 10) + bonus;
                return (
                  <tr key={i}>
                    <Td><TInput value={r.title}  onChange={v => upList('completedProjects', i, 'title',  v)}/></Td>
                    <Td><TInput value={r.agency} onChange={v => upList('completedProjects', i, 'agency', v)}/></Td>
                    <Td><TInput value={r.period} onChange={v => upList('completedProjects', i, 'period', v)}/></Td>
                    <Td><TInput type='number' value={r.amount} onChange={v => upList('completedProjects', i, 'amount', v)}/></Td>
                    <Td><TSelect value={r.patent} onChange={v => upList('completedProjects', i, 'patent', v)} opts={[['yes','Yes'],['no','No']]}/></Td>
                    <Td style={{ fontWeight:700, color:'#b45309' }}>{sc}</Td>
                    <Td>{!readOnly && <DelBtn onClick={() => delRow('completedProjects', i)}/>}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!readOnly && <AddRow label='Add Completed Project' onClick={() => up('completedProjects', [...(data.completedProjects||[]), { title:'', agency:'', period:'', amount:'', patent:'' }])}/>}
        <div style={{ marginTop:6 }}><UploadZone sectionKey='compProj' files={data.proofs?.compProj} onAdd={addProof} onRemove={remProof} readOnly={readOnly} hint='Completion certificate, patent document, utilisation certificate'/></div>
      </Card>

      {/* D) Research Guidance */}
      <Card title='D) Research Guidance' accent='#0d6b6b'>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Level', 'No. Enrolled', 'Thesis Submitted', 'Degree Awarded', 'API Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {(data.resGuidance || []).map((r, i) => {
              const isPhd = r.level === 'phd';
              const sc = (Number(r.awarded)||0)*(isPhd?10:3) + (Number(r.submitted)||0)*(isPhd?5:1);
              return (
                <tr key={i}>
                  <Td><TSelect value={r.level} onChange={v => upList('resGuidance', i, 'level', v)} opts={[['phd','Ph.D. / Equivalent'],['mtech','M.E./M.Tech/Masters']]}/></Td>
                  <Td><TInput type='number' value={r.enrolled}  onChange={v => upList('resGuidance', i, 'enrolled',  v)} min={0}/></Td>
                  <Td><TInput type='number' value={r.submitted} onChange={v => upList('resGuidance', i, 'submitted', v)} min={0}/></Td>
                  <Td><TInput type='number' value={r.awarded}   onChange={v => upList('resGuidance', i, 'awarded',   v)} min={0}/></Td>
                  <Td style={{ fontWeight:700, color:'#0d6b6b' }}>{sc}</Td>
                  <Td>{!readOnly && <DelBtn onClick={() => delRow('resGuidance', i)}/>}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!readOnly && <AddRow label='Add Guidance Entry' onClick={() => up('resGuidance', [...(data.resGuidance||[]), { level:'', enrolled:'', submitted:'', awarded:'' }])}/>}
        <div style={{ marginTop:8, fontWeight:700, color:'#0d6b6b' }}>Score: {br.guidScore}</div>
        <div style={{ marginTop:6 }}><UploadZone sectionKey='resGuide' files={data.proofs?.resGuide} onAdd={addProof} onRemove={remProof} readOnly={readOnly} hint='Ph.D. award letters, university records'/></div>
      </Card>

      {/* E(i) Training */}
      <Card title='E(i) Training / FDP / Faculty Development Programmes (min 1 week duration)' accent='#6b21a8'>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Programme Name', 'Duration (weeks)', 'Organised By', 'API Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {(data.training || []).map((r, i) => {
              const wks = Number(r.duration) || 0; const sc = wks >= 2 ? 20 : wks >= 1 ? 10 : 5;
              return (
                <tr key={i}>
                  <Td><TInput value={r.programme}   onChange={v => upList('training', i, 'programme',   v)}/></Td>
                  <Td><TInput type='number' value={r.duration} onChange={v => upList('training', i, 'duration',    v)} min={1}/></Td>
                  <Td><TInput value={r.organisedBy} onChange={v => upList('training', i, 'organisedBy', v)}/></Td>
                  <Td style={{ fontWeight:700, color:'#6b21a8' }}>{sc}</Td>
                  <Td>{!readOnly && <DelBtn onClick={() => delRow('training', i)}/>}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!readOnly && <AddRow label='Add Training / FDP' onClick={() => up('training', [...(data.training||[]), { programme:'', duration:'', organisedBy:'' }])}/>}
        <div style={{ marginTop:8, fontWeight:700, color:'#6b21a8' }}>Score: {br.trainScore}</div>
        <div style={{ marginTop:6 }}><UploadZone sectionKey='training' files={data.proofs?.training} onAdd={addProof} onRemove={remProof} readOnly={readOnly} hint='FDP/refresher participation certificate (min 1 week)'/></div>
      </Card>

      {/* E(ii) Conference papers */}
      <Card title='E(ii) Papers Presented in Conferences / Seminars / Workshops / Symposia' accent='#6b21a8'>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Title of Paper', 'Conference / Seminar Title', 'Organised By', 'Level', 'API Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {(data.confPapers || []).map((r, i) => {
              const sc = r.level === 'international' ? 10 : r.level === 'national' ? 7.5 : r.level === 'state' ? 5 : 3;
              return (
                <tr key={i}>
                  <Td><TInput value={r.title}       onChange={v => upList('confPapers', i, 'title',       v)}/></Td>
                  <Td><TInput value={r.conf}        onChange={v => upList('confPapers', i, 'conf',        v)}/></Td>
                  <Td><TInput value={r.organisedBy} onChange={v => upList('confPapers', i, 'organisedBy', v)}/></Td>
                  <Td><TSelect value={r.level} onChange={v => upList('confPapers', i, 'level', v)} opts={[['international','International'],['national','National'],['state','State / Regional'],['college','College / University']]}/></Td>
                  <Td style={{ fontWeight:700, color:'#6b21a8' }}>{sc}</Td>
                  <Td>{!readOnly && <DelBtn onClick={() => delRow('confPapers', i)}/>}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!readOnly && <AddRow label='Add Paper' onClick={() => up('confPapers', [...(data.confPapers||[]), { title:'', conf:'', organisedBy:'', level:'' }])}/>}
        <div style={{ marginTop:8, fontWeight:700, color:'#6b21a8' }}>Score: {br.confPapScore}</div>
        <div style={{ marginTop:6 }}><UploadZone sectionKey='confPap' files={data.proofs?.confPap} onAdd={addProof} onRemove={remProof} readOnly={readOnly} hint='Presentation certificate, conference proceedings'/></div>
      </Card>

      {/* E(iii) Invited Lectures */}
      <Card title='E(iii) Invited Lectures and Chairmanships at National / International Conferences' accent='#6b21a8'>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Title of Lecture / Session', 'Academic Conference / Seminar', 'Organised By', 'Level', 'API Score', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {(data.invitedLectures || []).map((r, i) => {
              const sc = r.level === 'international' ? 10 : 5;
              return (
                <tr key={i}>
                  <Td><TInput value={r.title}       onChange={v => upList('invitedLectures', i, 'title',       v)}/></Td>
                  <Td><TInput value={r.session}     onChange={v => upList('invitedLectures', i, 'session',     v)}/></Td>
                  <Td><TInput value={r.organisedBy} onChange={v => upList('invitedLectures', i, 'organisedBy', v)}/></Td>
                  <Td><TSelect value={r.level} onChange={v => upList('invitedLectures', i, 'level', v)} opts={[['international','International'],['national','National']]}/></Td>
                  <Td style={{ fontWeight:700, color:'#6b21a8' }}>{sc}</Td>
                  <Td>{!readOnly && <DelBtn onClick={() => delRow('invitedLectures', i)}/>}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!readOnly && <AddRow label='Add Lecture' onClick={() => up('invitedLectures', [...(data.invitedLectures||[]), { title:'', session:'', organisedBy:'', level:'' }])}/>}
        <div style={{ marginTop:8, fontWeight:700, color:'#6b21a8' }}>Score: {br.invScore}</div>
        <div style={{ marginTop:6 }}><UploadZone sectionKey='invLec' files={data.proofs?.invLec} onAdd={addProof} onRemove={remProof} readOnly={readOnly} hint='Invitation letter + certificate of lecture delivery'/></div>
      </Card>
    </div>
  );
}
