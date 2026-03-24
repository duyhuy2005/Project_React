import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "customer" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("chronos_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem("chronos_user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("chronos_user");
    localStorage.removeItem("admin_logged_in");
  }, []);

  const register = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem("chronos_user", JSON.stringify(userData));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
