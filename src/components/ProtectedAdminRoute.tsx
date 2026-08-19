import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedAdminRoute() {
  const isLoggedIn =
    localStorage.getItem("adminLoggedIn") === "true" ||
    sessionStorage.getItem("adminLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login-admin" replace />;
  }

  return <Outlet />;
}