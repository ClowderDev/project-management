import React from "react";
import { Navigate, Outlet } from "react-router";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useAuth } from "~/provider/auth-context";

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/workspaces" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
