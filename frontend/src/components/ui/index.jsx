import React, { useState } from 'react';
import { C, SM } from '../../data/constants.js';

// ─── STATUS BADGE ─────────────────────────────────────────────────
export function StatusBadge({ s }) {
  const m = SM[s] || { label: s, dot: '#94a3b8', bg: '#f1f5f9', fg: '#475569' };
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:m.bg, color:m.fg,
      padding:'3px 10px 3px 7px', borderRadius:20, fontSize:12, fontWeight:700, whiteSpace:'nowrap' }}>
      <span style={{ width:7, height:7, borderRadius:'50%', background:m.dot, flexShrink:0 }}/>
      {m.label}
    </span>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────────
export function Btn({ children, onClick, v = 'primary', sz = 'md', full, disabled, style }) {
  const vs = {
    primary: { bg: C.blue,    fg: '#fff', br: C.blue    },
    success: { bg: '#059669', fg: '#fff', br: '#059669' },
    danger:  { bg: '#dc2626', fg: '#fff', br: '#dc2626' },
    warning: { bg: '#d97706', fg: '#fff', br: '#d97706' },
    outline: { bg: '#fff',    fg: C.text, br: C.border  },
    ghost:   { bg: 'transparent', fg: C.blue, br: 'transparent' },
    purple:  { bg: '#7c3aed', fg: '#fff', br: '#7c3aed' },
  };
  const x = vs[v] || vs.primary;
  const p = sz === 'sm' ? '4px 12px' : sz === 'lg' ? '11px 26px' : '8px 18px';
  const fs = sz === 'sm' ? 12 : sz === 'lg' ? 15 : 13;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background:x.bg, color:x.fg, border:`1.5px solid ${x.br}`, padding:p,
        borderRadius:8, fontSize:fs, fontWeight:700, fontFamily:'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1,
        width: full ? '100%' : 'auto', whiteSpace:'nowrap', ...style }}>
      {children}
    </button>
  );
}

// ─── FORM FIELD INPUTS ────────────────────────────────────────────
export function Input({ label, value, onChange, type = 'text', placeholder, req, half, style }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom:12, flex: half ? '0 0 calc(50% - 6px)' : undefined, ...style }}>
      {label && (
        <label style={{ display:'block', fontSize:12, fontWeight:700, color:C.text, marginBottom:4 }}>
          {label}{req && <span style={{ color:'#dc2626' }}>*</span>}
        </label>
      )}
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ width:'100%', boxSizing:'border-box', padding:'8px 10px',
          border:`1px solid ${focus ? C.blue : C.border}`, borderRadius:7,
          fontSize:13, fontFamily:'inherit', outline:'none', color:C.text, transition:'border-color .15s' }}/>
    </div>
  );
}

export function Select({ label, value, onChange, opts, req, half }) {
  return (
    <div style={{ marginBottom:12, flex: half ? '0 0 calc(50% - 6px)' : undefined }}>
      {label && (
        <label style={{ display:'block', fontSize:12, fontWeight:700, color:C.text, marginBottom:4 }}>
          {label}{req && <span style={{ color:'#dc2626' }}>*</span>}
        </label>
      )}
      <select value={value || ''} onChange={e => onChange(e.target.value)}
        style={{ width:'100%', padding:'8px 10px', border:`1px solid ${C.border}`, borderRadius:7,
          fontSize:13, fontFamily:'inherit', background:'#fff', color:C.text, outline:'none' }}>
        <option value=''>-- Select --</option>
        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────
export function Card({ children, style, title, accent }) {
  return (
    <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:12,
      overflow:'hidden', marginBottom:20, ...style }}>
      {title && (
        <div style={{ padding:'10px 18px', borderBottom:`2px solid ${accent || C.blue}`,
          background:C.light, display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:3, height:20, background: accent || C.blue, borderRadius:2 }}/>
          <span style={{ fontWeight:800, fontSize:14, color:C.navy }}>{title}</span>
        </div>
      )}
      <div style={{ padding:18 }}>{children}</div>
    </div>
  );
}

// ─── TABLE PRIMITIVES ─────────────────────────────────────────────
export function Th({ children, w }) {
  return (
    <th style={{ padding:'8px 10px', background:C.navy, color:'#fff', fontSize:11, fontWeight:700,
      textAlign:'left', whiteSpace:'nowrap', width:w, borderRight:'1px solid rgba(255,255,255,.1)' }}>
      {children}
    </th>
  );
}

export function Td({ children, style }) {
  return (
    <td style={{ padding:'7px 10px', borderBottom:`1px solid ${C.border}`, fontSize:12,
      color:C.text, verticalAlign:'top', ...style }}>
      {children}
    </td>
  );
}

export function TInput({ value, onChange, type = 'text', placeholder, min }) {
  return (
    <input type={type} value={value || ''} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} min={min}
      style={{ width:'100%', boxSizing:'border-box', padding:'5px 8px',
        border:`1px solid ${C.border}`, borderRadius:5, fontSize:12, fontFamily:'inherit', outline:'none' }}
      onFocus={e => e.target.style.borderColor = C.blue}
      onBlur={e  => e.target.style.borderColor = C.border}/>
  );
}

export function TSelect({ value, onChange, opts }) {
  return (
    <select value={value || ''} onChange={e => onChange(e.target.value)}
      style={{ width:'100%', padding:'5px 6px', border:`1px solid ${C.border}`, borderRadius:5,
        fontSize:12, fontFamily:'inherit', background:'#fff' }}>
      <option value=''>--</option>
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

// ─── ADD ROW / DELETE BUTTON ──────────────────────────────────────
export function AddRow({ label, onClick }) {
  return (
    <button onClick={onClick}
      style={{ display:'flex', alignItems:'center', gap:6, background:'transparent',
        border:`1.5px dashed ${C.blue}`, borderRadius:7, padding:'5px 14px',
        fontSize:12, color:C.blue, fontWeight:700, cursor:'pointer', marginTop:8, fontFamily:'inherit' }}>
      ＋ {label}
    </button>
  );
}

export function DelBtn({ onClick }) {
  return (
    <button onClick={onClick}
      style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:5,
        padding:'2px 8px', color:'#dc2626', fontSize:13, fontWeight:700, cursor:'pointer', lineHeight:1 }}>
      ✕
    </button>
  );
}

// ─── PAGE SECTION HEADER ──────────────────────────────────────────
export function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom:20 }}>
      <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:C.navy }}>{title}</h2>
      {subtitle && <p style={{ margin:'4px 0 0', fontSize:13, color:C.muted }}>{subtitle}</p>}
    </div>
  );
}
