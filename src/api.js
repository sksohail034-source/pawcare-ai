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
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (body) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),

  // Pets
  getPets: () => request('/pets'),
  getScanInfo: () => request('/ai/info'),
  analyzeImage: (formData) => request('/ai/analyze', { method: 'POST', body: formData, headers: {} }),
  getChatHistory: () => request('/ai/chat-history'),
  sendChatMessage: (text) => request('/ai/chat', { method: 'POST', body: JSON.stringify({ text, sender: 'user' }) }),
  getPet: (id) => request(`/pets/${id}`),
  createPet: (body) => request('/pets', { method: 'POST', body: JSON.stringify(body) }),
  updatePet: (id, body) => request(`/pets/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePet: (id) => request(`/pets/${id}`, { method: 'DELETE' }),

  // AI
  getStyleSuggestions: (petId) => request(`/ai/style/${petId}`, { method: 'POST' }),
  getHealthTips: (petId) => request(`/ai/health/${petId}`, { method: 'POST' }),
  analyzePhoto: (petId) => request(`/ai/analyze/${petId}`, { method: 'POST' }),
  getAIHistory: () => request('/ai/history'),

  // Vaccinations
  getVaccinations: (petId) => request(`/vaccinations/${petId}`),
  getOverdueVaccinations: () => request('/vaccinations/overdue/me'),
  addVaccination: (body) => request('/vaccinations', { method: 'POST', body: JSON.stringify(body) }),
  updateVaccination: (id, body) => request(`/vaccinations/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteVaccination: (id) => request(`/vaccinations/${id}`, { method: 'DELETE' }),

  // Subscriptions
  getPlans: () => request('/subscriptions/plans'),
  getSubscriptionStatus: () => request('/subscriptions/status'),
  upgradePlan: (planId) => request('/subscriptions/upgrade', { method: 'POST', body: JSON.stringify({ planId }) }),

  // Ads
  startAd: () => request('/ads/start', { method: 'POST' }),
  completeAd: (adId) => request('/ads/complete', { method: 'POST', body: JSON.stringify({ adId }) }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),

  // Exercise
  getExercisePlan: (petType) => request(`/exercise/${petType}`),
  getExerciseTypes: () => request('/exercise'),

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

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminUsers: () => request('/admin/users'),
  deleteAdminUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  updateUserSubscription: (id, subscription) => request(`/admin/users/${id}/subscription`, { method: 'PUT', body: JSON.stringify({ subscription }) }),
  getAdminActivity: () => request('/admin/activity'),
  
  // Routines
  getRoutines: () => request('/routines'),
  createRoutine: (body) => request('/routines', { method: 'POST', body: JSON.stringify(body) }),
  toggleRoutine: (id, enabled) => request(`/routines/${id}/toggle`, { method: 'PUT', body: JSON.stringify({ enabled }) }),
  deleteRoutine: (id) => request(`/routines/${id}`, { method: 'DELETE' }),
};
