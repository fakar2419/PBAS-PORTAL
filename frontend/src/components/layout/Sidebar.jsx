import React from 'react';
import { C, ROLE_COL, ROLE_LBL } from '../../data/constants.js';

export default function Sidebar({ user, nav, active, setActive, onLogout }) {
  const col = ROLE_COL[user.role] || C.blue;

  return (
    <div style={{ width:220, background:C.navy, display:'flex', flexDirection:'column',
      position:'fixed', top:0, left:0, height:'100vh', zIndex:200, fontFamily:'inherit' }}>

      {/* Logo */}
      <div style={{ padding:'18px 16px 12px', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ fontSize:26 }}>🎓</div>
          <div>
            <div style={{ color:'#fff', fontWeight:800, fontSize:13 }}>PBAS Portal</div>
            <div style={{ color:'rgba(255,255,255,.35)', fontSize:10, letterSpacing:'0.5px', textTransform:'uppercase' }}>Govt. of Assam</div>
          </div>
        </div>
      </div>

      {/* User card */}
      <div style={{ padding:'10px 12px', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
        <div style={{ background:`${col}25`, border:`1px solid ${col}40`, borderRadius:8, padding:'9px 10px' }}>
          <div style={{ color:'#fff', fontSize:12, fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {user.name}
          </div>
          <div style={{ color:col, fontSize:10, fontWeight:700, marginTop:2 }}>{ROLE_LBL[user.role]}</div>
          <div style={{ color:'rgba(255,255,255,.35)', fontSize:10, marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {user.dept}
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
        {nav.map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:8,
              padding:'9px 10px', borderRadius:8, border:'none', cursor:'pointer',
              background: active === n.id ? `${col}30` : 'transparent',
              color:      active === n.id ? '#fff'     : 'rgba(255,255,255,.5)',
              fontSize:12, fontWeight: active === n.id ? 700 : 400,
              marginBottom:2, fontFamily:'inherit', textAlign:'left', transition:'all .15s' }}>
            <span style={{ fontSize:14 }}>{n.icon}</span>
            <span style={{ flex:1 }}>{n.label}</span>
            {n.badge > 0 && (
              <span style={{ background:'#ef4444', color:'#fff', borderRadius:10, padding:'1px 6px', fontSize:10, fontWeight:800 }}>
                {n.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding:10 }}>
        <button onClick={onLogout}
          style={{ width:'100%', padding:'9px 10px', background:'rgba(239,68,68,.12)',
            color:'#fca5a5', border:'1px solid rgba(239,68,68,.2)', borderRadius:8,
            cursor:'pointer', fontSize:12, fontWeight:700, fontFamily:'inherit' }}>
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}

// Page wrapper — leaves space for sidebar
export function PageWrap({ children }) {
  return (
    <div style={{ marginLeft:220, minHeight:'100vh', background:C.bg, padding:'24px 28px', fontFamily:'inherit' }}>
      {children}
    </div>
  );
}
