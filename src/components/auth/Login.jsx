import React, { useState } from 'react';
import { C } from '../../data/constants.js';
import { Btn } from '../ui/index.jsx';
import { api } from '../../utils/api.js';

function DoneBox({ icon, title, msg }) {
  return (
    <div style={{ background:'#fff', borderRadius:12, border:`1px solid ${C.border}`, padding:28, textAlign:'center' }}>
      <div style={{ fontSize:48, marginBottom:10 }}>{icon}</div>
      <h3 style={{ margin:'0 0 8px', color:'#059669' }}>{title}</h3>
      <p style={{ color:C.muted, fontSize:13, lineHeight:1.6 }}>{msg}</p>
    </div>
  );
}

export default function Login({ onLogin }) {
  const [tab,    setTab]    = useState('login');
  const [email,  setEmail]  = useState('');
  const [pw,     setPw]     = useState('');
  const [err,    setErr]    = useState('');
  const [done,   setDone]   = useState('');

  // Register fields
  const [rName,  setRName]  = useState('');
  const [rEmail, setREmail] = useState('');
  const [rDept,  setRDept]  = useState('');

  // Forgot password
  const [fEmail, setFEmail] = useState('');

  const doLogin = async () => {
    try {
      const u = await api.login(email, pw);
      if (u.role === 'faculty' && !u.approved) return setErr('Account pending HOD approval. Please wait.');
      setErr('');
      onLogin(u);
    } catch (e) {
      setErr(e.message || 'Invalid email or password.');
    }
  };

  const fieldStyle = { width:'100%', boxSizing:'border-box', padding:'9px 12px', border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, fontFamily:'inherit', outline:'none', color:C.text };

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:'inherit' }}>
      {/* Left panel */}
      <div style={{ width:400, background:C.navy, display:'flex', flexDirection:'column', justifyContent:'center', padding:'50px 48px' }}>
        <div style={{ fontSize:48, marginBottom:20 }}>🎓</div>
        <h1 style={{ color:'#fff', fontSize:26, fontWeight:900, margin:'0 0 8px', lineHeight:1.25 }}>
          PBAS<br/>Self-Assessment<br/>Portal
        </h1>
        <p style={{ color:'rgba(255,255,255,.5)', fontSize:13, lineHeight:1.7, marginBottom:28 }}>
          Annual Performance Based Appraisal System<br/>Government of Assam — UGC / AICTE Guidelines
        </p>
        {[
          ['📋', 'Full PBAS Form (Part A, B, C, D)'],
          ['📊', 'Automated UGC API Score Calculation'],
          ['📎', 'Document Proof Upload per Section'],
          ['🔄', '4-Level Approval Workflow'],
          ['🔒', 'HOD-Managed Access Control'],
        ].map(([ic, lb]) => (
          <div key={lb} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ width:30, height:30, background:'rgba(255,255,255,.08)', borderRadius:7,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{ic}</div>
            <span style={{ color:'rgba(255,255,255,.6)', fontSize:12 }}>{lb}</span>
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f4ff', padding:40 }}>
        <div style={{ width:'100%', maxWidth:400 }}>
          {/* Tab switcher */}
          <div style={{ display:'flex', background:'#e2e8f0', borderRadius:10, padding:4, marginBottom:24, gap:2 }}>
            {[['login','Sign In'],['register','New Faculty'],['forgot','Forgot PW']].map(([k, l]) => (
              <button key={k} onClick={() => { setTab(k); setErr(''); setDone(''); }}
                style={{ flex:1, padding:'7px 4px', borderRadius:7, border:'none', fontSize:11, fontWeight:700,
                  cursor:'pointer', fontFamily:'inherit',
                  background: tab === k ? '#fff'        : 'transparent',
                  color:      tab === k ? C.blue        : C.muted }}>
                {l}
              </button>
            ))}
          </div>

          {/* ── SIGN IN ── */}
          {tab === 'login' && (
            <div style={{ background:'#fff', borderRadius:12, border:`1px solid ${C.border}`, padding:24 }}>
              <h2 style={{ margin:'0 0 20px', fontSize:18, color:C.navy }}>Sign In to PBAS Portal</h2>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:C.text, marginBottom:4 }}>Official Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type='email' placeholder='you@college.ac.in'
                  style={fieldStyle} onKeyDown={e => e.key === 'Enter' && doLogin()}/>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:C.text, marginBottom:4 }}>Password</label>
                <input value={pw} onChange={e => setPw(e.target.value)} type='password' placeholder='••••••••'
                  style={fieldStyle} onKeyDown={e => e.key === 'Enter' && doLogin()}/>
              </div>
              {err && (
                <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:8, padding:'8px 12px', fontSize:13, color:'#991b1b', marginBottom:14 }}>
                  {err}
                </div>
              )}
              <Btn v='primary' sz='lg' full onClick={doLogin}>Sign In →</Btn>
            </div>
          )}

          {/* ── REGISTER ── */}
          {tab === 'register' && (
            done === 'reg'
              ? <DoneBox icon='✅' title='Request Sent to HOD!' msg='Once the HOD approves your registration, you can log in with the temporary password: change@123'/>
              : (
                <div style={{ background:'#fff', borderRadius:12, border:`1px solid ${C.border}`, padding:24 }}>
                  <h2 style={{ margin:'0 0 4px', fontSize:18, color:C.navy }}>New Faculty Registration</h2>
                  <p style={{ fontSize:12, color:C.muted, marginBottom:16 }}>HOD approval is required before your first login.</p>
                  {[['Full Name', rName, setRName, 'Dr. / Prof. Full Name'],
                    ['Official Email', rEmail, setREmail, 'name@college.ac.in'],
                    ['Department', rDept, setRDept, 'Computer Science']].map(([l, v, sv, ph]) => (
                    <div key={l} style={{ marginBottom:12 }}>
                      <label style={{ display:'block', fontSize:12, fontWeight:700, color:C.text, marginBottom:4 }}>{l}</label>
                      <input value={v} onChange={e => sv(e.target.value)} placeholder={ph} style={fieldStyle}/>
                    </div>
                  ))}
                  <Btn v='primary' full onClick={async () => {
                    if (!rName || !rEmail || !rDept) return alert('Please fill Name, Email and Department.');
                    try {
                      await api.requestRegistration({ name: rName, email: rEmail, dept: rDept });
                      setDone('reg');
                    } catch (e) {
                      alert('Registration request failed');
                    }
                  }}>Submit Registration Request</Btn>
                </div>
              )
          )}

          {/* ── FORGOT PASSWORD ── */}
          {tab === 'forgot' && (
            done === 'pw'
              ? <DoneBox icon='🔒' title='Request Sent to HOD!' msg='The HOD will reset your password. You will receive a new temporary password once approved.'/>
              : (
                <div style={{ background:'#fff', borderRadius:12, border:`1px solid ${C.border}`, padding:24 }}>
                  <h2 style={{ margin:'0 0 4px', fontSize:18, color:C.navy }}>Forgot Password</h2>
                  <p style={{ fontSize:12, color:C.muted, marginBottom:16 }}>Password reset requires HOD approval for security.</p>
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:'block', fontSize:12, fontWeight:700, color:C.text, marginBottom:4 }}>Registered Email</label>
                    <input value={fEmail} onChange={e => setFEmail(e.target.value)} type='email' placeholder='your@college.ac.in' style={fieldStyle}/>
                  </div>
                  <Btn v='primary' full onClick={async () => {
                    if (!fEmail) return alert('Please enter your registered email.');
                    try {
                      await api.requestPasswordReset(fEmail);
                      setDone('pw');
                    } catch (e) {
                      alert('Password reset request failed');
                    }
                  }}>Request Password Reset</Btn>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
