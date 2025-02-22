import React from "react";
import Header from "./header";
import { Outlet, Navigate } from "react-router";
import { toast } from "sonner";

// Protected Route Handling
const ProtectedRoute = () => {
  const isAuthenticated = document.cookie.includes("token=");
  if (!isAuthenticated) {
    toast.error("Please log in to access this page.");
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

// Layout Component with Header and Outlet
export default function Layout() {
  return (
    <div>
      <Header />
      <main className="p-4">
        <ProtectedRoute />
      </main>
    </div>
  );
}
