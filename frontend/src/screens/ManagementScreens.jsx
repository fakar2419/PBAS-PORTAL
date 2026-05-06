import React, { useState } from 'react';
import { C } from '../data/constants.js';
import { Card, Btn } from '../components/ui/index.jsx';

// ─── REGISTRATION REQUESTS ────────────────────────────────────────
export function RegRequests({ reqs, onApprove, onReject }) {
  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 800, color: C.navy }}>
        Faculty Registration Requests
      </h2>
      {reqs.length === 0 ? (
        <Card><p style={{ textAlign: 'center', color: C.muted, padding: '30px 0' }}>✅ No pending registration requests.</p></Card>
      ) : (
        reqs.map(r => (
          <Card key={r.id} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>{r.name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                  {r.email} · {r.dept}{r.empId ? ' · Employee ID: ' + r.empId : ''}
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Requested: {r.requestedAt}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn v='danger' sz='sm' onClick={() => onReject(r.id)}>✕ Reject</Btn>
                <Btn v='success' sz='sm' onClick={() => onApprove(r.id)}>✓ Approve & Create Account</Btn>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

// ─── PASSWORD RESET REQUESTS ──────────────────────────────────────
export function PwResets({ reqs, onApprove }) {
  const [pws, setPws] = useState({});

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 800, color: C.navy }}>
        Password Reset Requests
      </h2>
      {reqs.length === 0 ? (
        <Card><p style={{ textAlign: 'center', color: C.muted, padding: '30px 0' }}>✅ No pending password reset requests.</p></Card>
      ) : (
        reqs.map(r => (
          <Card key={r.id} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.navy, marginBottom: 2 }}>{r.email}</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>Requested: {r.requestedAt}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 4 }}>
                  Set New Password <span style={{ color: C.muted, fontWeight: 400 }}>(min 6 characters)</span>
                </label>
                <input
                  type='password'
                  value={pws[r.id] || ''}
                  onChange={e => setPws(p => ({ ...p, [r.id]: e.target.value }))}
                  placeholder='Enter new password…'
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontFamily: 'inherit' }}
                />
              </div>
              <Btn v='success' sz='sm' onClick={() => {
                const p = pws[r.id];
                if (!p || p.length < 6) return alert('Password must be at least 6 characters.');
                onApprove(r.id, r.email, p);
                setPws(prev => { const n = { ...prev }; delete n[r.id]; return n; });
              }}>
                ✓ Approve Reset
              </Btn>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

// ─── CHANGE PASSWORD ──────────────────────────────────────────────
export function ChangePw({ user, onUpdate }) {
  const [cur, setCur]   = useState('');
  const [nw,  setNw]    = useState('');
  const [cf,  setCf]    = useState('');
  const [msg, setMsg]   = useState(null);

  const fieldStyle = {
    width: '100%', boxSizing: 'border-box', padding: '9px 12px',
    border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontFamily: 'inherit',
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 800, color: C.navy }}>Change Password</h2>
      <Card>
        {[['Current Password', cur, setCur], ['New Password', nw, setNw], ['Confirm New Password', cf, setCf]].map(([l, v, sv]) => (
          <div key={l} style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 4 }}>{l}</label>
            <input type='password' value={v} onChange={e => sv(e.target.value)} style={fieldStyle} />
          </div>
        ))}
        {msg && (
          <div style={{
            background: msg.ok ? '#d1fae5' : '#fee2e2',
            border: `1px solid ${msg.ok ? '#6ee7b7' : '#fca5a5'}`,
            borderRadius: 8, padding: '8px 12px', fontSize: 13,
            color: msg.ok ? '#065f46' : '#991b1b', marginBottom: 12,
          }}>
            {msg.text}
          </div>
        )}
        <Btn v='primary' onClick={() => {
          if (cur !== user.pw)   return setMsg({ ok: false, text: 'Current password is incorrect.' });
          if (nw.length < 6)    return setMsg({ ok: false, text: 'New password must be at least 6 characters.' });
          if (nw !== cf)        return setMsg({ ok: false, text: 'Passwords do not match.' });
          onUpdate(user.id, nw);
          setMsg({ ok: true, text: '✅ Password updated successfully!' });
          setCur(''); setNw(''); setCf('');
        }}>
          Update Password
        </Btn>
      </Card>
    </div>
  );
}
