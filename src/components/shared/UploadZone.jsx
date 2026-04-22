import React, { useState, useRef, useCallback } from 'react';
import { C } from '../../data/constants.js';
import { readFile, fmtSize } from '../../utils/helpers.js';

export default function UploadZone({ sectionKey, files, onAdd, onRemove, readOnly, hint }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState(null);

  const handle = useCallback(async (fileList) => {
    const out = [];
    for (const f of Array.from(fileList)) {
      if (f.size > 8 * 1024 * 1024) { alert(`${f.name}: max 8 MB allowed`); continue; }
      if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(f.type)) {
        alert(`${f.name}: Only JPG, PNG, or PDF allowed`); continue;
      }
      out.push({ name: f.name, type: f.type, size: f.size, data: await readFile(f), addedAt: new Date().toLocaleDateString('en-IN') });
    }
    if (out.length) onAdd(sectionKey, out);
  }, [sectionKey, onAdd]);

  const existing = files || [];

  return (
    <div>
      {/* File list */}
      {existing.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:6 }}>
          {existing.map((f, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background:'#f0fdf4',
              border:'1px solid #bbf7d0', borderRadius:7, padding:'5px 10px' }}>
              <span style={{ fontSize:16 }}>{f.type === 'application/pdf' ? '📄' : '🖼️'}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#166534', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</div>
                <div style={{ fontSize:11, color:C.muted }}>{fmtSize(f.size)} · {f.addedAt}</div>
              </div>
              {f.type.startsWith('image/') && (
                <button onClick={() => setPreview(f)}
                  style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:5, padding:'2px 8px', fontSize:11, color:C.blue, cursor:'pointer', fontWeight:700 }}>
                  👁 View
                </button>
              )}
              <button onClick={() => { const a = document.createElement('a'); a.href = f.data; a.download = f.name; a.click(); }}
                style={{ background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:5, padding:'2px 8px', fontSize:11, color:'#0369a1', cursor:'pointer', fontWeight:700 }}>
                ⬇ DL
              </button>
              {!readOnly && (
                <button onClick={() => onRemove(sectionKey, i)}
                  style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:5, padding:'2px 8px', color:'#dc2626', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {!readOnly && (
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
          onClick={() => ref.current?.click()}
          style={{ border:`2px dashed ${drag ? C.blue : '#cbd5e1'}`, borderRadius:8, padding:'9px 14px',
            textAlign:'center', cursor:'pointer', background: drag ? '#eff6ff' : '#f8fafc', transition:'all .2s' }}>
          <input ref={ref} type='file' multiple accept='.jpg,.jpeg,.png,.pdf'
            style={{ display:'none' }} onChange={e => handle(e.target.files)}/>
          <div style={{ fontSize:20 }}>📎</div>
          <div style={{ fontSize:12, fontWeight:700, color:C.text, marginTop:2 }}>
            {existing.length ? 'Add more proof files' : 'Upload proof documents'}
          </div>
          {hint && <div style={{ fontSize:11, color:C.muted, marginTop:1 }}>{hint}</div>}
          <div style={{ fontSize:11, color:'#94a3b8', marginTop:1 }}>JPG · PNG · PDF · Max 8 MB · Drag & drop or click</div>
        </div>
      )}

      {readOnly && !existing.length && (
        <div style={{ background:'#fef9c3', border:'1px solid #fde047', borderRadius:7, padding:'5px 10px', fontSize:12, color:'#713f12' }}>
          ⚠️ No proof document uploaded for this section
        </div>
      )}

      {/* Image lightbox */}
      {preview && (
        <div onClick={() => setPreview(null)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.88)', zIndex:9999,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
          <img src={preview.data} alt='' style={{ maxWidth:'90vw', maxHeight:'90vh', borderRadius:8 }}/>
        </div>
      )}
    </div>
  );
}
