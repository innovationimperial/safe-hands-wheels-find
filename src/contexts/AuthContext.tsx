
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type UserProfile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
};

type DealerProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  dealerProfile: DealerProfile | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDealer: boolean;
  isDealerApproved: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dealerProfile, setDealerProfile] = useState<DealerProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          // Fetch user profile data
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setDealerProfile(null);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          await fetchUserProfile(initialSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to initialize authentication.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (profileData) {
        // Ensure the role field exists on the profile
        const userProfile: UserProfile = {
          id: profileData.id,
          username: profileData.username || '',
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          role: profileData.role || 'user' // Default to 'user' if role is missing
        };
        
        setProfile(userProfile);
        
        // If user has dealer role, check if they're a dealer
        if (userProfile.role === 'dealer') {
          const { data: dealerData, error: dealerError } = await supabase
            .from('dealers')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
            
          if (dealerError) {
            console.error('Error fetching dealer profile:', dealerError);
          } else if (dealerData) {
            const dealer: DealerProfile = {
              id: dealerData.id,
              name: dealerData.name,
              email: dealerData.email,
              phone: dealerData.phone,
              status: dealerData.status as 'Pending' | 'Approved' | 'Rejected' || 'Pending'
            };
            setDealerProfile(dealer);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account.",
      });
      
      // In development, we can assume the user is verified
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setSession(data.session);
      setUser(data.user);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setDealerProfile(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && profile?.role === 'admin';
  const isDealer = isAuthenticated && profile?.role === 'dealer';
  const isDealerApproved = isDealer && dealerProfile?.status === 'Approved';

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        profile, 
        dealerProfile,
        session, 
        isLoading, 
        signUp, 
        login, 
        logout, 
        isAuthenticated, 
        isAdmin,
        isDealer,
        isDealerApproved
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
