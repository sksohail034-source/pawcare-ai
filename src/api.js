const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('pawcare_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),

  // Pets
  getPets: () => request('/pets'),
  getPet: (id) => request(`/pets/${id}`),
  createPet: (body) => request('/pets', { method: 'POST', body: JSON.stringify(body) }),
  updatePet: (id, body) => request(`/pets/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePet: (id) => request(`/pets/${id}`, { method: 'DELETE' }),

  // AI
  getStyleSuggestions: (petId) => request(`/ai/style/${petId}`, { method: 'POST' }),
  getHealthTips: (petId) => request(`/ai/health/${petId}`, { method: 'POST' }),
  getAIHistory: () => request('/ai/history'),

  // Vaccinations
  getVaccinations: (petId) => request(`/vaccinations/${petId}`),
  addVaccination: (body) => request('/vaccinations', { method: 'POST', body: JSON.stringify(body) }),
  updateVaccination: (id, body) => request(`/vaccinations/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteVaccination: (id) => request(`/vaccinations/${id}`, { method: 'DELETE' }),

  // Subscriptions
  getPlans: () => request('/subscriptions/plans'),
  getSubscriptionStatus: () => request('/subscriptions/status'),
  upgradePlan: (planId) => request('/subscriptions/upgrade', { method: 'POST', body: JSON.stringify({ planId }) }),

  // Donations
  getOrganizations: () => request('/donations/organizations'),
  donate: (body) => request('/donations', { method: 'POST', body: JSON.stringify(body) }),
  getDonationHistory: () => request('/donations/history'),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getProductCategories: () => request('/products/categories'),
};
