const API_BASE = '/api';

let authToken: string | null = localStorage.getItem('aqarkom_token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('aqarkom_token', token);
  } else {
    localStorage.removeItem('aqarkom_token');
  }
}

export function getAuthToken() {
  return authToken;
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (authToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    setAuthToken(null);
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.message || 'Request failed');
  }

  return res.json();
}

export const auth = {
  login: (email: string, password: string) =>
    api<{ user: unknown; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (data: {
    email: string;
    password: string;
    phone: string;
    first_name_ar: string;
    last_name_ar: string;
    role?: string;
    rega_license_number?: string;
  }) =>
    api<{ user: unknown; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const properties = {
  list: (params?: Record<string, string | number>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<unknown[]>(`/properties${q ? `?${q}` : ''}`);
  },
  get: (id: string) => api<unknown>(`/properties/${id}`),
  create: (data: unknown) => api<{ id: string }>('/properties', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: unknown) => api(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const contacts = {
  list: (params?: Record<string, string | number>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<unknown[]>(`/contacts${q ? `?${q}` : ''}`);
  },
  get: (id: string) => api<unknown>(`/contacts/${id}`),
  create: (data: unknown) => api<{ id: string }>('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: unknown) => api(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const requests = {
  list: (params?: Record<string, string | number>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<unknown[]>(`/requests${q ? `?${q}` : ''}`);
  },
  get: (id: string) => api<unknown>(`/requests/${id}`),
  create: (data: unknown) => api<{ id: string }>('/requests', { method: 'POST', body: JSON.stringify(data) }),
  addOffer: (requestId: string, propertyId: string, message?: string) =>
    api(`/requests/${requestId}/offers`, {
      method: 'POST',
      body: JSON.stringify({ property_id: propertyId, message }),
    }),
};

export const transactions = {
  list: (params?: Record<string, string | number>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<unknown[]>(`/transactions${q ? `?${q}` : ''}`);
  },
  get: (id: string) => api<unknown>(`/transactions/${id}`),
  create: (data: unknown) => api<{ id: string }>('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: unknown) => api(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const dashboard = {
  kpis: () => api<unknown>('/dashboard/kpis'),
  pipelineStages: () => api<unknown[]>('/dashboard/pipeline-stages'),
  pipelineSummary: () => api<unknown[]>('/dashboard/pipeline-summary'),
  recentActivities: () => api<unknown[]>('/dashboard/recent-activities'),
  recentProperties: () => api<unknown[]>('/dashboard/recent-properties'),
  reportsSummary: () => api<unknown>('/dashboard/reports-summary'),
};

export const activities = {
  listByContact: (contactId: string) => api<unknown[]>(`/activities/contact/${contactId}`),
  create: (data: { contact_id: string; activity_type: string; subject?: string; description?: string }) =>
    api('/activities', { method: 'POST', body: JSON.stringify(data) }),
};

export const tasks = {
  list: (params?: Record<string, string | number>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<unknown[]>(`/tasks${q ? `?${q}` : ''}`);
  },
  create: (data: unknown) => api<{ id: string }>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: unknown) => api(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};
