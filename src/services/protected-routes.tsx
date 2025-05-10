import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth-provider";

export const ProtectedRoute = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return session ? <Outlet /> : <Navigate to="/login" />;
};

export const PublicRoute = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return !session ? <Outlet /> : <Navigate to="/" />;
};
