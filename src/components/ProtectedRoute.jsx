import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
  Usage: <Route element={<ProtectedRoute role="admin" />}> ... </Route>
*/
export default function ProtectedRoute({ role }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (role && user?.role !== role) {
    if (user?.role === "admin") return <Outlet />; // admin can access everything
    return <div style={{ padding: 20 }}>Access denied — insufficient permissions.</div>;
  }
  return <Outlet />;
}
