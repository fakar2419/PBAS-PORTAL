import React, { useState } from 'react';
import Sidebar, { PageWrap } from '../components/layout/Sidebar.jsx';
import { ReviewPanel, AllSubs } from '../components/shared/ReviewPanel.jsx';
import { ChangePw } from '../screens/ManagementScreens.jsx';

export default function ExpertDash({ user, subs, onAction, onPwUpdate, onLogout }) {
  const [nav, setNav] = useState('review');

  const pending = subs.filter(s => s.status === 'sent_to_expert');

  const navItems = [
    { id: 'review', icon: '🔬', label: 'Review Submissions', badge: pending.length },
    { id: 'done',   icon: '✅', label: 'Completed Reviews' },
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
            filterFn={s => s.status === 'sent_to_expert'}
            emptyMsg='No submissions pending expert review.'
            title='Expert Review Panel'
            subtitle='PBAS submissions forwarded by Principal for expert evaluation'
            actions={[
              { label: '↩ Return to Principal', v: 'warning', action: 'return_principal', needRemark: true },
              { label: '📝 Submit Expert Review & Close', v: 'purple', action: 'expert_review', needRemark: true },
            ]}
            onAction={onAction}
          />
        )}
        {nav === 'done' && (
          <AllSubs
            submissions={subs.filter(s => s.status === 'expert_reviewed')}
            title='Completed Expert Reviews'
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
