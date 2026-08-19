import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isLocalStorageAdmin = localStorage.getItem("adminLoggedIn") === "true";
  const isSessionStorageAdmin = sessionStorage.getItem("adminLoggedIn") === "true";
  
  const isAdmin = isLocalStorageAdmin || isSessionStorageAdmin;

  return isAdmin ? <Outlet /> : <Navigate to="/login/admin" replace />;
}