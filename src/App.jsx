import React, { useState, useEffect } from 'react';
import { api } from './utils/api.js';
import Login from './components/auth/Login.jsx';
import FacultyDash   from './dashboards/FacultyDash.jsx';
import HODDash       from './dashboards/HODDash.jsx';
import PrincipalDash from './dashboards/PrincipalDash.jsx';
import ExpertDash    from './dashboards/ExpertDash.jsx';
import AdminDash     from './dashboards/AdminDash.jsx';

export default function App() {
  const [subs,    setSubs]    = useState([]);
  const [regReqs, setRegReqs] = useState([]);
  const [pwReqs,  setPwReqs]  = useState([]);
  const [users,   setUsers]   = useState([]);
  const [me,      setMe]      = useState(() => api.getSavedUser());

  const fetchGlobalData = async () => {
    if (!me) return;
    try {
      if (me.role === 'faculty') {
        setSubs(await api.getSubmissions(me.id));
      } else {
        setSubs(await api.getSubmissions());
      }
      if (me.role === 'hod' || me.role === 'admin') {
        setRegReqs(await api.getRegReqs());
        setPwReqs(await api.getPwReqs());
      }
      if (me.role === 'admin') {
        setUsers(await api.getUsers());
      }
    } catch (e) {
      console.error('Failed to fetch data', e);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, [me]);

  const onSubmit = async ({ year, partA, partB, partC, scores, returnId }) => {
    try {
      if (returnId) {
        await api.updateSubmission(returnId, { year, partA, partB, partC, scores, facultyId: me.id, facultyName: me.name, dept: me.dept });
      } else {
        await api.createSubmission({ year, partA, partB, partC, scores, facultyId: me.id, facultyName: me.name, dept: me.dept });
      }
      await fetchGlobalData();
      alert("Submission successful!");
    } catch (e) {
      alert("Failed to submit form.");
    }
  };

  const onAction = async (id, action, remark, sectionRemarks = {}) => {
    try {
      await api.actionSubmission(id, action, remark, sectionRemarks);
      await fetchGlobalData();
    } catch (e) {
      alert("Action failed.");
    }
  };

  const onRegApprove = async (id) => {
    try {
      await api.approveReg(id);
      await fetchGlobalData();
      alert(`✅ Account created. Temporary password: change@123\nPlease ask them to change their password on first login.`);
    } catch (e) {
      alert("Failed to approve registration.");
    }
  };

  const onRegReject = async (id) => {
    try {
      await api.rejectReg(id);
      await fetchGlobalData();
    } catch (e) {
      alert("Failed to reject registration.");
    }
  };

  const onPwApprove = async (id, email, newPw) => {
    try {
      await api.approvePwReq(id, newPw);
      await fetchGlobalData();
      alert(`✅ Password reset approved for ${email}`);
    } catch (e) {
      alert("Failed to approve reset.");
    }
  };

  const onPwUpdate = async (uid, newPw) => {
    try {
      await api.updatePassword(uid, newPw);
      setMe(prev => ({ ...prev, pw: newPw }));
      alert("Password updated automatically.");
    } catch (e) {
      alert("Failed to update password.");
    }
  };

  const onRoleChange = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      await fetchGlobalData();
      alert(`Role successfully updated to ${newRole}`);
    } catch (e) {
      alert("Failed to update user role.");
    }
  };

  const onLogout = () => {
    api.logout();
    setMe(null);
    setSubs([]);
    setRegReqs([]);
    setPwReqs([]);
    setUsers([]);
  };

  if (!me) {
    return <Login onLogin={setMe} />;
  }

  if (me.role === 'admin') {
    return (
      <AdminDash
        user={me} subs={subs}
        regReqs={regReqs} pwReqs={pwReqs} users={users}
        onAction={onAction}
        onRegApprove={onRegApprove} onRegReject={onRegReject}
        onPwApprove={onPwApprove}
        onPwUpdate={onPwUpdate}
        onRoleChange={onRoleChange}
        onLogout={onLogout}
      />
    );
  }

  if (me.role === 'faculty') {
    return <FacultyDash user={me} subs={subs} onSubmit={onSubmit} onPwUpdate={onPwUpdate} onLogout={onLogout} />;
  }
  if (me.role === 'hod') {
    return (
      <HODDash
        user={me} subs={subs}
        regReqs={regReqs} pwReqs={pwReqs}
        onAction={onAction}
        onRegApprove={onRegApprove} onRegReject={onRegReject}
        onPwApprove={onPwApprove}
        onPwUpdate={onPwUpdate}
        onLogout={onLogout}
      />
    );
  }
  if (me.role === 'principal') {
    return <PrincipalDash user={me} subs={subs} onAction={onAction} onPwUpdate={onPwUpdate} onLogout={onLogout} />;
  }
  if (me.role === 'expert') {
    return <ExpertDash user={me} subs={subs} onAction={onAction} onPwUpdate={onPwUpdate} onLogout={onLogout} />;
  }

  return <div style={{ padding: 40, fontFamily: 'sans-serif' }}>Unknown role: {me.role}</div>;
}
