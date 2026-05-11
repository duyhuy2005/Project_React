import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

type GuardProps = {
  children: ReactNode;
};

export const GuestOnlyRoute = ({ children }: GuardProps) => {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn || !user) {
    return <>{children}</>;
  }

  return <Navigate to={user.vaiTro === "admin" ? "/admin" : "/"} replace />;
};

export const CustomerOnlyRoute = ({ children }: GuardProps) => {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.vaiTro === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export const AdminOnlyRoute = ({ children }: GuardProps) => {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.vaiTro !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
