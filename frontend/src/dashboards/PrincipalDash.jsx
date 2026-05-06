import React, { useState } from 'react';
import Sidebar, { PageWrap } from '../components/layout/Sidebar.jsx';
import { ReviewPanel, AllSubs } from '../components/shared/ReviewPanel.jsx';
import { ChangePw } from '../screens/ManagementScreens.jsx';

export default function PrincipalDash({ user, subs, onAction, onPwUpdate, onLogout }) {
  const [nav, setNav] = useState('review');

  const pending = subs.filter(s => ['sent_to_principal', 'hod_remarked'].includes(s.status));

  const navItems = [
    { id: 'review',   icon: '📊', label: 'Review Submissions', badge: pending.length },
    { id: 'expert',   icon: '✅', label: 'Sent to Expert' },
    { id: 'all',      icon: '📋', label: 'All Records' },
    { id: 'mypw',     icon: '🔒', label: 'My Password' },
  ];

  return (
    <div style={{ fontFamily: 'inherit' }}>
      <Sidebar user={user} nav={navItems} active={nav} setActive={setNav} onLogout={onLogout} />
      <PageWrap>
        {nav === 'review' && (
          <ReviewPanel
            submissions={subs}
            filterFn={s => ['sent_to_principal', 'hod_remarked'].includes(s.status)}
            emptyMsg='No submissions pending principal review.'
            title='Final PBAS Review — Principal'
            subtitle='Submissions approved by HOD, awaiting principal review'
            actions={[
              { label: '↩ Return to HOD',        v: 'warning', action: 'return_hod',    needRemark: true  },
              { label: '✅ Send to Expert Panel →', v: 'purple',  action: 'send_expert',  needRemark: false },
            ]}
            onAction={onAction}
          />
        )}
        {nav === 'expert' && (
          <AllSubs
            submissions={subs.filter(s => ['sent_to_expert', 'expert_reviewed'].includes(s.status))}
            title='Submissions Sent to Expert'
          />
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
