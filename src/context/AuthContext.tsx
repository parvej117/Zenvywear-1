import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Order } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  customerToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    address?: string;
    district?: string;
    division?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; verificationCode?: string; error?: string }>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  customerOrders: Order[];
  refreshCustomerOrders: () => Promise<void>;
  
  // Checkout redirect intent & auth modal states
  redirectIntent: string | null;
  setRedirectIntent: (intent: string | null) => void;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  authModalReason: string | null;
  openAuthModal: (tab?: 'login' | 'register', reason?: string) => void;
  closeAuthModal: () => void;
  
  // Profile modal states
  isProfileModalOpen: boolean;
  profileModalTab: 'profile' | 'orders';
  openProfileModal: (tab?: 'profile' | 'orders') => void;
  closeProfileModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'zenvy_customer_token';
const USER_KEY = 'zenvy_customer_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [customerToken, setCustomerToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

  // Modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [authModalReason, setAuthModalReason] = useState<string | null>(null);
  const [redirectIntent, setRedirectIntent] = useState<string | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<'profile' | 'orders'>('profile');

  // Verify and refresh session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const user = await api.getCurrentUser(token);
          if (user) {
            setCurrentUser(user);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            // Load orders
            const orders = await api.getCustomerOrders(token);
            setCustomerOrders(orders);
          } else {
            // Token expired or invalid
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setCurrentUser(null);
            setCustomerToken(null);
          }
        } catch (err) {
          console.warn('Auth check error:', err);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const refreshCustomerOrders = async () => {
    if (!customerToken) return;
    try {
      const orders = await api.getCustomerOrders(customerToken);
      setCustomerOrders(orders);
    } catch (err) {
      console.warn('Failed to refresh customer orders:', err);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.loginCustomer({ email, password });
    if (res.success && res.token && res.user) {
      setCustomerToken(res.token);
      setCurrentUser(res.user);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      // Refresh customer orders
      const orders = await api.getCustomerOrders(res.token);
      setCustomerOrders(orders);
      return { success: true };
    }
    return { success: false, error: res.error || 'Login failed' };
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    address?: string;
    district?: string;
    division?: string;
  }) => {
    const res = await api.registerCustomer(data);
    if (res.success && res.token && res.user) {
      setCustomerToken(res.token);
      setCurrentUser(res.user);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setCustomerOrders([]);
      return { success: true };
    }
    return { success: false, error: res.error || 'Registration failed' };
  };

  const logout = async () => {
    if (customerToken) {
      await api.logoutCustomer(customerToken);
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setCustomerToken(null);
    setCurrentUser(null);
    setCustomerOrders([]);
    setIsProfileModalOpen(false);
  };

  const forgotPassword = async (email: string) => {
    return await api.forgotPassword(email);
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    return await api.resetPassword({ email, code, newPassword });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!customerToken) return { success: false, error: 'Not authenticated' };
    const res = await api.updateCustomerProfile(updates, customerToken);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to update profile' };
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login', reason?: string) => {
    setAuthModalTab(tab);
    setAuthModalReason(reason || null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalReason(null);
  };

  const openProfileModal = (tab: 'profile' | 'orders' = 'profile') => {
    setProfileModalTab(tab);
    setIsProfileModalOpen(true);
    if (customerToken) {
      refreshCustomerOrders();
    }
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        customerToken,
        isAuthenticated: !!currentUser && !!customerToken,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        customerOrders,
        refreshCustomerOrders,
        redirectIntent,
        setRedirectIntent,
        isAuthModalOpen,
        authModalTab,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        isProfileModalOpen,
        profileModalTab,
        openProfileModal,
        closeProfileModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
