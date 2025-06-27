import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AUTH_KEY = '@subjct_auth_status';
const LECTURE_PROGRESS_KEY = '@subjct_lecture_progress';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authStatus = await AsyncStorage.getItem(AUTH_KEY);
      setIsAuthenticated(authStatus === 'true');
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      await AsyncStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth status:', error);
    }
  };

  const logout = async () => {
    try {
      // Remove auth status but keep lecture progress
      await AsyncStorage.removeItem(AUTH_KEY);
      // Note: We're NOT removing LECTURE_PROGRESS_KEY so progress persists across logins
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error removing auth status:', error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};