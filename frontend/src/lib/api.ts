import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('No refresh token');
        const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh });
        localStorage.setItem('access_token', data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  register: (data: any) => api.post('/auth/register/', data),
  login: (data: any) => api.post('/auth/login/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data: any) => api.patch('/auth/profile/', data),
  getAddresses: () => api.get('/auth/addresses/'),
  createAddress: (data: any) => api.post('/auth/addresses/', data),
  updateAddress: (id: number, data: any) => api.patch(`/auth/addresses/${id}/`, data),
  deleteAddress: (id: number) => api.delete(`/auth/addresses/${id}/`),
};

// ── Products ──────────────────────────────────────────
export const productsApi = {
  list: (params?: any) => api.get('/products/', { params }),
  detail: (slug: string) => api.get(`/products/${slug}/`),
  featured: () => api.get('/products/featured/'),
  categories: () => api.get('/products/categories/'),
  createReview: (slug: string, data: any) => api.post(`/products/${slug}/reviews/`, data),
};

// ── Cart ──────────────────────────────────────────────
export const cartApi = {
  get: () => api.get('/cart/'),
  addItem: (variantId: number, quantity: number) =>
    api.post('/cart/', { variant_id: variantId, quantity }),
  updateItem: (itemId: number, quantity: number) =>
    api.patch(`/cart/items/${itemId}/`, { quantity }),
  removeItem: (itemId: number) => api.delete(`/cart/items/${itemId}/`),
  clear: () => api.delete('/cart/clear/'),
};

// ── Orders ────────────────────────────────────────────
export const ordersApi = {
  list: () => api.get('/orders/'),
  detail: (id: number) => api.get(`/orders/${id}/`),
  checkout: (data: any) => api.post('/orders/checkout/', data),
  confirmPayment: (paymentIntentId: string) =>
    api.post('/orders/confirm-payment/', { payment_intent_id: paymentIntentId }),
};

export default api;
