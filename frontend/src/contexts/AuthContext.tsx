"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;  // Add this property
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: User | null;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:8080';

// Debugging line to verify URL
console.log('API URL:', API_URL);

async function loginApiCall(email: string, password: string) {
  const response = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include'  // Include this to handle cookies if needed
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  // Extract token from Authorization header
  const token = response.headers.get('Authorization')?.split(' ')[1];
  console.log("Auth header:", response.headers.get('Authorization'));
  
  if (token) {
    localStorage.setItem('token', token);
  } else {
    console.warn("No token received in response");
  }
  
  // Try to get user data from response body
  const data = await response.json().catch(() => ({}));
  return { user: data.user || null, token };
}

async function signupApiCall(name: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }) // Removed userType
  });

  if (!response.ok) {
    throw new Error('Signup failed');
  }

  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing authentication (e.g., JWT in localStorage)
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token with backend
          const response = await fetch('http://localhost:8080/api/verify-token', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Don't render children until initial auth check is complete
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginApiCall(email, password);
setUser(data.user); // If your API returns user data
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Your signup logic here
      await signupApiCall(name, email, password);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      isLoading,
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};