import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/contracts';
import { MOCK_USERS } from '../services/mockData';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('vigilia_role') as UserRole) || 'analyst';
  });
  const [currentUser, setCurrentUser] = useState<User>(() => MOCK_USERS[currentRole] || MOCK_USERS.analyst);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    setCurrentUser(MOCK_USERS[currentRole] || MOCK_USERS.analyst);
    localStorage.setItem('vigilia_role', currentRole);
  }, [currentRole]);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
  };

  const login = (role: UserRole) => {
    switchRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, currentRole, switchRole, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

