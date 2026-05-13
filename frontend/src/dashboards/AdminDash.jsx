import React, { useState } from 'react';
import Sidebar, { PageWrap } from '../components/layout/Sidebar.jsx';
import { ReviewPanel, AllSubs } from '../components/shared/ReviewPanel.jsx';
import { RegRequests, PwResets, ChangePw } from '../screens/ManagementScreens.jsx';
import { C } from '../data/constants.js';
import { Card, Btn } from '../components/ui/index.jsx';

const ROLES = ['faculty', 'hod', 'principal', 'expert', 'admin'];
const ROLE_LABEL = {
  faculty:   'Faculty',
  hod:       'HOD',
  principal: 'Principal',
  expert:    'Expert',
  admin:     'Admin',
};
const ROLE_COLOR = {
  faculty:   '#1a4fa8',
  hod:       '#0d6b6b',
  principal: '#6b21a8',
  expert:    '#b45309',
  admin:     '#dc2626',
};

// ─── USER MANAGEMENT ─────────────────────────────────────────────
function UserManagement({ users, onRoleChange, currentUserId }) {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.navy }}>
          👥 User Management
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>
          Manage roles for all registered users — {users.length} total
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search by name or email…"
          style={{
            width: '100%', boxSizing: 'border-box', padding: '9px 14px',
            border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13,
            fontFamily: 'inherit', outline: 'none',
          }}
        />
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Name', 'Email', 'Department', 'Role', 'Status', 'Change Role'].map(h => (
                  <th key={h} style={{
                    padding: '10px 14px', background: C.navy, color: '#fff',
                    fontSize: 11, fontWeight: 700, textAlign: 'left',
                    borderRight: '1px solid rgba(255,255,255,.1)', whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} style={{ background: i % 2 === 0 ? '#fff' : C.bg, borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: C.text }}>{u.name}</td>
                  <td style={{ padding: '10px 14px', color: C.muted, fontSize: 12 }}>{u.email}</td>
                  <td style={{ padding: '10px 14px', color: C.muted }}>{u.dept}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      background: `${ROLE_COLOR[u.role] || C.blue}18`,
                      color: ROLE_COLOR[u.role] || C.blue,
                      border: `1px solid ${ROLE_COLOR[u.role] || C.blue}40`,
                      borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700,
                    }}>
                      {ROLE_LABEL[u.role] || u.role}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      background: u.approved ? '#d1fae5' : '#fee2e2',
                      color: u.approved ? '#065f46' : '#991b1b',
                      borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700,
                    }}>
                      {u.approved ? '✅ Active' : '⏳ Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {u.id === currentUserId ? (
                      <span style={{ fontSize: 11, color: C.muted, fontStyle: 'italic' }}>— (you)</span>
                    ) : (
                      <select
                        defaultValue={u.role}
                        onChange={e => {
                          if (window.confirm(`Change ${u.name}'s role to "${ROLE_LABEL[e.target.value]}"?`)) {
                            onRoleChange(u.id, e.target.value);
                          }
                        }}
                        style={{
                          padding: '5px 10px', fontSize: 12, borderRadius: 6,
                          border: `1px solid ${C.border}`, fontFamily: 'inherit', cursor: 'pointer',
                        }}
                      >
                        {ROLES.map(r => (
                          <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: C.muted }}>
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── ADMIN OVERRIDE REVIEW ────────────────────────────────────────
// Shows ALL active submissions (any stage) with full action suite
function AdminOverride({ subs, onAction }) {
  const activeSubs = subs.filter(s => !['draft', 'expert_reviewed'].includes(s.status));
  return (
    <ReviewPanel
      submissions={subs}
      filterFn={s => !['draft', 'expert_reviewed'].includes(s.status)}
      emptyMsg='No active submissions in the pipeline.'
      title='🔧 Master Override Panel'
      subtitle='All in-progress submissions — Admin can act at any workflow stage'
      actions={[
        { label: '↩ Return to Faculty',      v: 'danger',   action: 'return_faculty',  needRemark: true  },
        { label: '✓ Approve as HOD →',        v: 'success',  action: 'approve_hod',     needRemark: false },
        { label: '↩ Return to HOD',           v: 'warning',  action: 'return_hod',      needRemark: true  },
        { label: '✅ Send to Expert →',        v: 'purple',   action: 'send_expert',     needRemark: false },
        { label: '↩ Return to Principal',     v: 'warning',  action: 'return_principal',needRemark: true  },
        { label: '⭐ Mark Expert Reviewed',    v: 'outline',  action: 'expert_reviewed', needRemark: false },
      ]}
      onAction={onAction}
    />
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────
export default function AdminDash({
  user, subs, regReqs, pwReqs, users,
  onAction, onRegApprove, onRegReject, onPwApprove, onPwUpdate, onRoleChange, onDelete, onLogout
}) {
  const [nav, setNav] = useState('users');

  const activeCount  = subs.filter(s => !['draft', 'expert_reviewed'].includes(s.status)).length;
  const navItems = [
    { id: 'users',    icon: '👥', label: 'User Management',    badge: 0            },
    { id: 'override', icon: '🔧', label: 'Override Panel',      badge: activeCount  },
    { id: 'regs',     icon: '👤', label: 'Registrations',       badge: regReqs.length },
    { id: 'pw',       icon: '🔑', label: 'Password Resets',      badge: pwReqs.length  },
    { id: 'all',      icon: '📋', label: 'All Records'                               },
    { id: 'mypw',     icon: '🔒', label: 'My Password'                               },
  ];

  return (
    <div style={{ fontFamily: 'inherit' }}>
      <Sidebar user={user} nav={navItems} active={nav} setActive={setNav} onLogout={onLogout} />
      <PageWrap>
        {/* Admin banner */}
        <div style={{
          marginBottom: 24, padding: '12px 18px', borderRadius: 10,
          background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
          color: '#fff', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 24 }}>🛡️</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>System Administrator Console</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Full access — manage users, change roles, and override any workflow stage
            </div>
          </div>
        </div>

        {nav === 'users' && (
          <UserManagement
            users={users}
            onRoleChange={onRoleChange}
            currentUserId={user.id}
          />
        )}
        {nav === 'override' && (
          <AdminOverride subs={subs} onAction={onAction} />
        )}
        {nav === 'regs' && (
          <RegRequests reqs={regReqs} onApprove={onRegApprove} onReject={onRegReject} />
        )}
        {nav === 'pw' && (
          <PwResets reqs={pwReqs} onApprove={onPwApprove} />
        )}
        {nav === 'all' && (
          <AllSubs submissions={subs} title='All PBAS Submissions' onDelete={onDelete} />
        )}
        {nav === 'mypw' && (
          <ChangePw user={user} onUpdate={onPwUpdate} />
        )}
      </PageWrap>
    </div>
  );
}
