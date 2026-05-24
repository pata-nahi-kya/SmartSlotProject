import { Navigate, Outlet } from "react-router-dom";

type Props = {
  allowedRole: "Admin" | "Customer";
};

const ProtectedRoute = ({ allowedRole }: Props) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    const redirectPath = allowedRole === "Admin" ? "/admin/login" : "/login";
    return <Navigate to={redirectPath} replace />;
  }

  if (role !== allowedRole) {
    const fallbackPath = role === "Admin" ? "/admin/dashboard" : "/offers";
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
