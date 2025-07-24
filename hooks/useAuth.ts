
import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Login validation function
  const validateCredentials = (credentials: any) => {
    if (!credentials.phone || !credentials.password) {
      return { valid: false, error: 'Phone और Password दोनों required हैं' };
    }
    
    if (credentials.phone.length !== 10) {
      return { valid: false, error: 'Phone number 10 digits का होना चाहिए' };
    }
    
    if (credentials.password.length < 6) {
      return { valid: false, error: 'Password कम से कम 6 characters का होना चाहिए' };
    }
    
    return { valid: true };
  };

  // Register validation function
  const validateRegistration = (userData: any) => {
    if (!userData.name || !userData.phone || !userData.password || !userData.confirmPassword) {
      return { valid: false, error: 'सभी required fields भरना जरूरी है' };
    }
    
    if (userData.phone.length !== 10) {
      return { valid: false, error: 'Phone number 10 digits का होना चाहिए' };
    }
    
    if (userData.password !== userData.confirmPassword) {
      return { valid: false, error: 'Password और Confirm Password match नहीं कर रहे' };
    }
    
    if (userData.password.length < 6) {
      return { valid: false, error: 'Password कम से कम 6 characters का होना चाहिए' };
    }
    
    if (userData.email && !userData.email.includes('@')) {
      return { valid: false, error: 'Valid email address डालें' };
    }
    
    return { valid: true };
  };

  const login = async (credentials: any) => {
    try {
      setIsLoading(true);
      
      // Validate credentials first
      const validation = validateCredentials(credentials);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      
      // Mock successful login for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: Date.now().toString(),
        name: 'Demo User',
        phone: credentials.phone,
        email: 'demo@example.com',
        kycStatus: 'PENDING',
        referralCode: 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        walletBalance: 1000,
        isVerified: true,
        joinedAt: new Date().toISOString()
      };
      
      // Store user data securely
      await AsyncStorage.setItem('user_data', JSON.stringify(mockUser));
      await AsyncStorage.setItem('auth_token', 'demo_token_' + Date.now());
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true, user: mockUser };
      
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      
      // Validate registration data
      const validation = validateRegistration(userData);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      
      // Mock successful registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        phone: userData.phone,
        email: userData.email || '',
        kycStatus: 'PENDING',
        referralCode: 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        walletBalance: 0,
        isVerified: false,
        joinedAt: new Date().toISOString(),
        referredBy: userData.referralCode || null
      };
      
      // Store user data securely
      await AsyncStorage.setItem('user_data', JSON.stringify(newUser));
      await AsyncStorage.setItem('auth_token', 'demo_token_' + Date.now());
      
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, user: newUser };
      
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear all stored data
      await AsyncStorage.multiRemove(['user_data', 'auth_token']);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      if (!isAuthenticated) {
        return { success: false, error: 'User not authenticated' };
      }
      
      const updatedUser = { ...user, ...profileData };
      await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: 'Profile update failed' };
    }
  };

  const checkAuthStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      const authToken = await AsyncStorage.getItem('auth_token');
      
      if (userData && authToken) {
        const user = JSON.parse(userData);
        setUser(user);
        setIsAuthenticated(true);
        return { success: true, user };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Auth check error:', error);
      return { success: false };
    }
  };

  const requireAuth = () => {
    return isAuthenticated;
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
    requireAuth
  };
};
