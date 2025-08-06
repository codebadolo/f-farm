import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login/', { email, password });
  return response.data;  // expects { user, token, message }
};

export const register = async (userData) => {
  // userData = { email, password, password_confirm, prenom, nom, username, etc. }
  const response = await api.post('/authentication/register/', userData);
  return response.data;
};

export const logout = async () => {
  await api.post('/authentication/logout/');
  localStorage.removeItem('token');
};

// Optionally extend with changePassword, profile update, etc.
