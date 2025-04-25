
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    const initialize = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Authentication initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // Function to check if the user is authenticated
  const checkAuth = async (): Promise<boolean> => {
    try {
      // In a real app, this would be an API call to verify the JWT token
      // For demo purposes, we'll check localStorage
      const userData = localStorage.getItem('admin_user');
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Error verifying authentication:', error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to log in
  const login = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Hard-coded admin credentials for testing
      if (username === 'admin' && password === 'password123') {
        // Mock successful login
        const mockUser = {
          id: '1',
          username: 'admin',
          role: 'admin'
        };
        
        // Store user in localStorage (in a real app, we'd store the JWT token)
        localStorage.setItem('admin_user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${mockUser.username}!`,
        });
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to log out
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to invalidate the JWT token
      // For demo purposes, we'll just clear localStorage
      localStorage.removeItem('admin_user');

      setUser(null);
      toast({
        title: 'Logout Successful',
        description: 'You have been logged out.',
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Failed',
        description: 'Failed to logout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute: React.FC<{ 
  children: React.ReactNode,
  requiredRole?: string
}> = ({ children, requiredRole = 'admin' }) => {
  const { user, loading, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      if (!loading) {
        const isAuthenticated = await checkAuth();
        
        if (!isAuthenticated) {
          toast({
            title: 'Authentication Required',
            description: 'Please login to access this page.',
            variant: 'destructive',
          });
          navigate('/login');
          return;
        }
        
        if (requiredRole && user?.role !== requiredRole) {
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access this page.',
            variant: 'destructive',
          });
          navigate('/dashboard');
          return;
        }
      }
      setIsChecking(false);
    };

    verifyAccess();
  }, [user, loading, navigate, checkAuth, requiredRole]);

  if (loading || isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

