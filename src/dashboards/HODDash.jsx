import React, { useState } from 'react';
import Sidebar, { PageWrap } from '../components/layout/Sidebar.jsx';
import { ReviewPanel, AllSubs } from '../components/shared/ReviewPanel.jsx';
import { RegRequests, PwResets, ChangePw } from '../screens/ManagementScreens.jsx';

export default function HODDash({ user, subs, regReqs, pwReqs, onAction, onRegApprove, onRegReject, onPwApprove, onPwUpdate, onLogout }) {
  const [nav, setNav] = useState('review');

  const pending = subs.filter(s => ['pending_hod', 'returned_to_hod'].includes(s.status));

  const navItems = [
    { id: 'review', icon: '📊', label: 'Review PBAS Forms',  badge: pending.length },
    { id: 'regs',   icon: '👤', label: 'Registrations',      badge: regReqs.length },
    { id: 'pw',     icon: '🔑', label: 'Password Resets',     badge: pwReqs.length  },
    { id: 'all',    icon: '📋', label: 'All Records' },
    { id: 'mypw',   icon: '🔒', label: 'My Password' },
  ];

  return (
    <div style={{ fontFamily: 'inherit' }}>
      <Sidebar user={user} nav={navItems} active={nav} setActive={setNav} onLogout={onLogout} />
      <PageWrap>
        {nav === 'review' && (
          <ReviewPanel
            submissions={subs}
            filterFn={s => ['pending_hod', 'returned_to_hod'].includes(s.status)}
            emptyMsg='No submissions pending HOD review.'
            title='Review PBAS Submissions'
            subtitle='Faculty submissions awaiting HOD review'
            actions={[
              { label: '↩ Return to Faculty', v: 'danger',  action: 'return_faculty', needRemark: true  },
              { label: '✓ Approve & Send to Principal →', v: 'success', action: 'approve_hod', needRemark: false },
            ]}
            onAction={onAction}
          />
        )}
        {nav === 'regs' && (
          <RegRequests reqs={regReqs} onApprove={onRegApprove} onReject={onRegReject} />
        )}
        {nav === 'pw' && (
          <PwResets reqs={pwReqs} onApprove={onPwApprove} />
        )}
        {nav === 'all' && (
          <AllSubs submissions={subs} />
        )}
        {nav === 'mypw' && (
          <ChangePw user={user} onUpdate={onPwUpdate} />
        )}
      </PageWrap>
    </div>
  );
}
