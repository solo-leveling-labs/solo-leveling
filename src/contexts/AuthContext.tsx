import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  register: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const value: AuthContextType = {
    isLoggedIn,
    login: () => setIsLoggedIn(true),
    logout: () => setIsLoggedIn(false),
    register: () => setIsLoggedIn(true),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
