const API_URL = 'http://localhost:8000/api';

const getHeaders = () => {
    const token = localStorage.getItem('pbas_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const api = {
    async login(email, pw) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pw })
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.detail || 'Login failed');
        }
        const data = await res.json();
        if (data.token) {
            localStorage.setItem('pbas_token', data.token);
            localStorage.setItem('pbas_user', JSON.stringify(data));
        }
        return data;
    },

    logout() {
        localStorage.removeItem('pbas_token');
        localStorage.removeItem('pbas_user');
    },

    getSavedUser() {
        try {
            const u = localStorage.getItem('pbas_user');
            return u ? JSON.parse(u) : null;
        } catch { return null; }
    },

    async requestRegistration(data) {
        const res = await fetch(`${API_URL}/auth/reg_req`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async requestPasswordReset(email) {
        const res = await fetch(`${API_URL}/auth/pw_req?email=${encodeURIComponent(email)}`, {
            method: 'POST',
            headers: getHeaders()
        });
        return res.json();
    },

    async getSubmissions(facultyId = '') {
        const res = await fetch(`${API_URL}/submissions?facultyId=${facultyId}`, {
            headers: getHeaders()
        });
        return res.json();
    },

    async createSubmission(data) {
        const res = await fetch(`${API_URL}/submissions/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async updateSubmission(id, data) {
        const res = await fetch(`${API_URL}/submissions/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async actionSubmission(id, action, remark = '', sectionRemarks = {}) {
        const res = await fetch(`${API_URL}/submissions/${id}/action`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ action, remark, sectionRemarks })
        });
        return res.json();
    },

    async getRegReqs() {
        const res = await fetch(`${API_URL}/admin/reg_reqs`, { headers: getHeaders() });
        return res.json();
    },

    async approveReg(id) {
        const res = await fetch(`${API_URL}/admin/reg_reqs/${id}/approve`, { 
            method: 'POST',
            headers: getHeaders()
        });
        return res.json();
    },

    async rejectReg(id) {
        const res = await fetch(`${API_URL}/admin/reg_reqs/${id}/reject`, { 
            method: 'POST',
            headers: getHeaders()
        });
        return res.json();
    },

    async getPwReqs() {
        const res = await fetch(`${API_URL}/admin/pw_reqs`, { headers: getHeaders() });
        return res.json();
    },

    async approvePwReq(id, newPw) {
        const res = await fetch(`${API_URL}/admin/pw_reqs/${id}/approve_with_pw`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ new_pw: newPw })
        });
        return res.json();
    },

    async updatePassword(userId, newPw) {
        const res = await fetch(`${API_URL}/auth/users/${userId}/password`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ new_pw: newPw })
        });
        return res.json();
    },

    async getUsers() {
        const res = await fetch(`${API_URL}/admin/users`, { headers: getHeaders() });
        return res.json();
    },

    async updateUserRole(userId, role) {
        const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ role })
        });
        return res.json();
    }
};
