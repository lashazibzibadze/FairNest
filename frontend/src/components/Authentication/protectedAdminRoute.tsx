import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { isLoading, isAuthenticated, user } = useAuth0();

  if (isLoading) return null;
  const roles = user?.["https://fairnest-api.us.com/roles"] || [];
  const isAdmin = roles.includes("Admin");

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
