// components/ProtectedRoute/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../components/authStore/authStore";

const AdminRole = () => {
  const { user } = useAuthStore();

  // Nếu chưa đăng nhập
  if (!user) return <Navigate to="/login" />;

  // Nếu không phải admin
  if (user.role !== "admin") return <Navigate to="/" />;

  return <Outlet />; // Hiển thị các route con
};

export default AdminRole;
