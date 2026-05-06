import React, { useState } from 'react';
import Sidebar, { PageWrap } from '../components/layout/Sidebar.jsx';
import PBASForm from '../components/forms/PBASForm.jsx';
import { AllSubs } from '../components/shared/ReviewPanel.jsx';
import { ChangePw } from '../screens/ManagementScreens.jsx';

export default function FacultyDash({ user, subs, onSubmit, onPwUpdate, onLogout }) {
  const [nav, setNav] = useState('submit');

  const mySubs   = subs.filter(s => s.facultyId === user.id);
  const returned = mySubs.find(s => s.status === 'returned_to_faculty');

  const navItems = [
    { id: 'submit', icon: '📝', label: 'Submit PBAS Form' },
    { id: 'my',     icon: '📋', label: 'My Submissions',   badge: returned ? 1 : 0 },
    { id: 'pw',     icon: '🔑', label: 'Change Password' },
  ];

  return (
    <div style={{ fontFamily: 'inherit' }}>
      <Sidebar user={user} nav={navItems} active={nav} setActive={setNav} onLogout={onLogout} />
      <PageWrap>
        {nav === 'submit' && (
          <PBASForm user={user} existing={returned} onSubmit={onSubmit} />
        )}
        {nav === 'my' && (
          <AllSubs submissions={mySubs} title='My PBAS Submissions' />
        )}
        {nav === 'pw' && (
          <ChangePw user={user} onUpdate={onPwUpdate} />
        )}
      </PageWrap>
    </div>
  );
}
