import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import DashboardStats from './admin/DashboardStats';
import UsersPage from './admin/UsersPage';
import UserView from './admin/UserView';
import UserEdit from './admin/UserEdit';
import UserAdd from './admin/UserAdd';
import AdminProduitAdd from './admin/AdminProduitAdd';
import AdminProduitEdit from './admin/AdminProduitEdit';
import AdminProduitDetail from './admin/AdminProduitDetail';
import AdminProduits from './admin/AdminProduits'
const AdminDashboard = () => (
  <AdminLayout>
    <Routes>
      <Route index element={<DashboardStats />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/add" element={<UserAdd />} />

        <Route path="/products" element={<AdminProduits />} />
     <Route path="/products/add" element={<AdminProduitAdd />} />
  <Route path="/products/:slug/edit" element={<AdminProduitEdit />} />
  <Route path="/products/:slug" element={<AdminProduitDetail />} />
      <Route path="/users/view/:id" element={<UserView />} />
      <Route path="/users/edit/:id" element={<UserEdit />} />
      <Route path="*" element={<div>Page admin non trouvée.</div>} />
    </Routes>
  </AdminLayout>
);

export default AdminDashboard;
