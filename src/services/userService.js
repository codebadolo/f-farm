import api from './api'; // your axios instance with baseURL and auth setup

// Authentication

export const registerUser = async (userData) => {
  // userData: { username, email, nom, prenom, telephone, role, password, password_confirm }
  const response = await api.post('auth/register/', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  // credentials: { email, password }
  const response = await api.post('/login/', credentials);
  return response.data; // { user, token, message }
};

export const logoutUser = async () => {
  const response = await api.post('/logout/');
  return response.data;
};

// Profile related

export const fetchUserProfile = async () => {
  const response = await api.get('/profile/');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put('/profile/', profileData);
  return response.data;
};

export const fetchVendeurProfile = async () => {
  const response = await api.get('/profile/vendeur/');
  return response.data;
};

export const updateVendeurProfile = async (profileData) => {
  const response = await api.put('/profile/vendeur/', profileData);
  return response.data;
};

export const fetchAcheteurProfile = async () => {
  const response = await api.get('/profile/acheteur/');
  return response.data;
};

export const updateAcheteurProfile = async (profileData) => {
  const response = await api.put('/profile/acheteur/', profileData);
  return response.data;
};

// Password change

export const changePassword = async ({ old_password, new_password, new_password_confirm }) => {
  const response = await api.post('auth/change-password/', {
    old_password,
    new_password,
    new_password_confirm,
  });
  return response.data;
};

// Admin user management

export const fetchUsers = async (params = {}) => {
  // params = { page, role, status, search, ordering } etc.
  const response = await api.get('auth/users/', { params });
  return response.data; // paginated results
};

export const fetchUserById = async (userId) => {
  const response = await api.get(`auth/users/${userId}/`);
  return response.data;
};

export const updateUserById = async (userId, userData) => {
  const response = await api.put(`auth/users/${userId}/`, userData);
  return response.data;
};

export const deleteUserById = async (userId) => {
  const response = await api.delete(`auth/users/${userId}/`);
  return response.data;
};

export const updateUserStatus = async (userId, status) => {
  // status: one of the valid status strings ('ACTIF', 'INACTIF', 'SUSPENDU', etc.)
  const response = await api.patch(`auth/users/${userId}/status/`, { status });
  return response.data;
};

export const adminResetPassword = async (userId, new_password) => {
  const response = await api.post(`auth/users/${userId}/reset-password/`, { new_password });
  return response.data;
};

// Public seller profiles

export const fetchVendeursList = async (params = {}) => {
  const response = await api.get('auth/vendeurs/', { params });
  return response.data;
};

export const fetchVendeurDetail = async (vendeurId) => {
  const response = await api.get(`auth/vendeurs/${vendeurId}/`);
  return response.data;
};

// Admin seller profile management (requires usage of actions with ModelViewSet)

export const validateVendeurProfile = async (profileId, status_validation) => {
  // status_validation: one of 'VALIDE', 'REJETE', 'SUSPENDU', etc.
  // Using the custom action 'validate' on the viewset, POST request
  const response = await api.post(`auth/vendeur-profiles/${profileId}/validate/`, { status_validation });
  return response.data;
};

