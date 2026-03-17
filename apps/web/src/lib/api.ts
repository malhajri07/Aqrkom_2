export const API_BASE = import.meta.env.VITE_API_URL
  ? `${String(import.meta.env.VITE_API_URL).replace(/\/$/, '')}/api/v1`
  : '/api/v1';

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

interface EnvelopeSuccess<T> {
  success: true;
  data: T;
  meta?: { page?: number; limit?: number; total?: number; has_more?: boolean };
}
interface EnvelopeError {
  success: false;
  error: { code: string; message: string; message_en?: string; details?: unknown };
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
  const body = await res.json().catch(() => ({}));

  if (res.status === 401) {
    setAuthToken(null);
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = body as EnvelopeError;
    const msg = err?.error?.message || (body as { error?: string }).error || res.statusText;
    throw new Error(msg);
  }

  const env = body as EnvelopeSuccess<T> | T;
  if (env && typeof env === 'object' && 'success' in env && env.success === true) {
    return (env as EnvelopeSuccess<T>).data as T;
  }
  return body as T;
}

/** Unwrap API v1 envelope from raw fetch response */
export function unwrapEnvelope<T>(body: unknown): T {
  if (body && typeof body === 'object' && 'success' in body) {
    const b = body as { success: boolean; data?: T };
    if (b.success === true && 'data' in b) return b.data as T;
  }
  return body as T;
}

export const auth = {
  login: (email: string, password: string) =>
    api<{ user: unknown; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  nafathInit: () =>
    api<{ transactionId: string; nafathUrl: string; expiresIn: number }>('/auth/nafath/init', {
      method: 'POST',
    }),
  logout: () => api<{ message: string }>('/auth/logout', { method: 'POST' }),
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
  updateStatus: (id: string, status: string) =>
    api<{ status: string }>(`/properties/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deletePhoto: (id: string, photoId: string) =>
    api<{ photos: string[] }>(`/properties/${id}/photos/${encodeURIComponent(photoId)}`, { method: 'DELETE' }),
  map: (params?: { city?: string; status?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<{ type: string; features: unknown[] }>(`/properties/map${q ? `?${q}` : ''}`);
  },
  search: (q: string, params?: { city?: string; limit?: number }) => {
    const sp = new URLSearchParams({ q, ...(params as Record<string, string>) }).toString();
    return api<unknown[]>(`/properties/search?${sp}`);
  },
  stats: (params?: { city?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<Array<{ city: string; district: string; count: number; avg_price: number; min_price: number; max_price: number }>>(
      `/properties/stats${q ? `?${q}` : ''}`
    );
  },
  uploadPhotos: (id: string, formData: FormData) =>
    fetch(`${API_BASE}/properties/${id}/photos`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData,
    }).then(async (r) => {
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        const msg = body?.error?.message || body?.error || 'Upload failed';
        throw new Error(msg);
      }
      const body = await r.json();
      return unwrapEnvelope<{ photos: string[]; added?: number }>(body) ?? body;
    }),
  reorderPhotos: (id: string, photos: string[]) =>
    api<{ photos: string[] }>(`/properties/${id}/photos/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ photos }),
    }),
};

export const contacts = {
  list: (params?: Record<string, string | number>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<unknown[]>(`/contacts${q ? `?${q}` : ''}`);
  },
  get: (id: string) => api<unknown>(`/contacts/${id}`),
  create: (data: unknown) => api<{ id: string }>('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: unknown) => api(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  import: (contacts: Array<Record<string, string>>, fieldMapping?: Record<string, string>) =>
    api<{ imported: number; skipped: number }>('/contacts/import', {
      method: 'POST',
      body: JSON.stringify({ contacts, fieldMapping }),
    }),
  export: async () => {
    const res = await fetch(`${API_BASE}/contacts/export`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    if (!res.ok) throw new Error('Export failed');
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'contacts.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  },
};

export const requests = {
  list: (params?: Record<string, string | number>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<unknown[]>(`/requests${q ? `?${q}` : ''}`);
  },
  get: (id: string) => api<unknown>(`/requests/${id}`),
  create: (data: unknown) => api<{ id: string }>('/requests', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (requestId: string, status: string) =>
    api<{ status: string }>(`/requests/${requestId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  addOffer: (requestId: string, propertyId: string, message?: string) =>
    api(`/requests/${requestId}/offers`, {
      method: 'POST',
      body: JSON.stringify({ property_id: propertyId, message }),
    }),
  respondToOffer: (requestId: string, offerId: string, action: 'accept' | 'reject') =>
    api(`/requests/${requestId}/offers/${offerId}`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
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
  timeline: (id: string) => api<unknown[]>(`/transactions/${id}/timeline`),
  checklist: (id: string) =>
    api<Array<{ id: string; label_ar: string; label_en: string; done: boolean }>>(`/transactions/${id}/checklist`),
  commission: (id: string) =>
    api<{
      commission_amount: number;
      vat_rate: number;
      vat_amount: number;
      total_with_vat: number;
      commission_rate?: number;
      list_price?: number;
      final_price?: number;
    }>(`/transactions/${id}/commission`),
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
