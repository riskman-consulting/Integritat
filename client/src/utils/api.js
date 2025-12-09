const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let accessToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');

export const setTokens = (access, refresh) => {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (response.ok) {
      const data = await response.json();
      setTokens(data.data.accessToken, refreshToken);
      return data.data.accessToken;
    } else {
      clearTokens();
      window.location.href = '/';
      return null;
    }
  } catch {
    clearTokens();
    window.location.href = '/';
    return null;
  }
};

const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  // If 401, try to refresh token
  if (response.status === 401 && refreshToken) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });
    }
  }

  return response;
};

// Auth APIs
export const authAPI = {
  register: async (userData) => {
    const res = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  login: async (email, password) => {
    const res = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      setTokens(data.data.accessToken, data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  },

  getCurrentUser: async () => {
    const res = await apiCall('/auth/me');
    return res.json();
  },

  updateProfile: async (profileData) => {
    const res = await apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    return res.json();
  },

  changePassword: async (passwordData) => {
    const res = await apiCall('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });
    return res.json();
  },

  logout: () => {
    clearTokens();
  }
};

// Client APIs
export const clientAPI = {
  getAll: async () => {
    const res = await apiCall('/clients');
    return res.json();
  },

  getById: async (id) => {
    const res = await apiCall(`/clients/${id}`);
    return res.json();
  },

  create: async (clientData) => {
    const res = await apiCall('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData)
    });
    return res.json();
  },

  update: async (id, clientData) => {
    const res = await apiCall(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData)
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await apiCall(`/clients/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};

// Project APIs
export const projectAPI = {
  getAll: async () => {
    const res = await apiCall('/projects');
    return res.json();
  },

  getById: async (id) => {
    const res = await apiCall(`/projects/${id}`);
    return res.json();
  },

  create: async (projectData) => {
    const res = await apiCall('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
    return res.json();
  },

  updateStatus: async (id, status) => {
    const res = await apiCall(`/projects/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  getTeam: async (projectId) => {
    const res = await apiCall(`/projects/${projectId}/team`);
    return res.json();
  },

  addTeamMember: async (projectId, memberData) => {
    const res = await apiCall(`/projects/team`, {
      method: 'POST',
      body: JSON.stringify({ projectId, ...memberData })
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await apiCall(`/projects/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};

// Checklist APIs
export const checklistAPI = {
  getByProject: async (projectId) => {
    const res = await apiCall(`/checklists/project/${projectId}`);
    return res.json();
  },

  create: async (checklistData) => {
    const res = await apiCall('/checklists', {
      method: 'POST',
      body: JSON.stringify(checklistData)
    });
    return res.json();
  },

  bulkCreate: async (projectId, checklists) => {
    const res = await apiCall('/checklists/bulk', {
      method: 'POST',
      body: JSON.stringify({ projectId, checklists })
    });
    return res.json();
  },

  updateStatus: async (id, status) => {
    const res = await apiCall(`/checklists/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  signOff: async (id, signedOffBy) => {
    const res = await apiCall(`/checklists/${id}/signoff`, {
      method: 'PATCH',
      body: JSON.stringify({ signedOffBy })
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await apiCall(`/checklists/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};

// Document APIs
export const documentAPI = {
  upload: async (file, projectId, checklistId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    if (checklistId) formData.append('checklistId', checklistId);

    const headers = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const res = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    return res.json();
  },

  getByProject: async (projectId) => {
    const res = await apiCall(`/documents/project/${projectId}`);
    return res.json();
  },

  getByChecklist: async (checklistId) => {
    const res = await apiCall(`/documents/checklist/${checklistId}`);
    return res.json();
  },

  delete: async (id) => {
    const res = await apiCall(`/documents/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};

// Dashboard APIs
export const dashboardAPI = {
  getSummary: async () => {
    const res = await apiCall('/dashboard/summary');
    return res.json();
  },

  getTeamWorkload: async () => {
    const res = await apiCall('/dashboard/team-workload');
    return res.json();
  },

  getPendingTasks: async () => {
    const res = await apiCall('/dashboard/pending-tasks');
    return res.json();
  },

  getActivity: async () => {
    const res = await apiCall('/dashboard/activity');
    return res.json();
  }
};

export default {
  authAPI,
  clientAPI,
  projectAPI,
  checklistAPI,
  documentAPI,
  dashboardAPI
};
