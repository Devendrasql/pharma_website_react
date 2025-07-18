import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminOverview } from '../../components/admin/AdminOverview';
import { ProductManagement } from '../../components/admin/ProductManagement';
import { OrderManagement } from '../../components/admin/OrderManagement';
import { UserManagement } from '../../components/admin/UserManagement';
import { AnalyticsDashboard } from '../../components/admin/AnalyticsDashboard';

export const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};