
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { DealerProfile, UserProfile } from "@/types/auth";
import { fetchUserProfile } from "./use-fetch-user-profile";

export function useAuthService() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dealerProfile, setDealerProfile] = useState<DealerProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialize = async () => {
    setIsLoading(true);
    try {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        const { profile, dealerProfile } = await fetchUserProfile(initialSession.user.id);
        setProfile(profile);
        setDealerProfile(dealerProfile);
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

  const setupAuthStateListener = () => {
    return supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          // Fetch user profile data
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id).then(({ profile, dealerProfile }) => {
              setProfile(profile);
              setDealerProfile(dealerProfile);
            });
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setDealerProfile(null);
        }
      }
    );
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

  // Computed properties
  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && profile?.role === 'admin';
  const isDealer = isAuthenticated && profile?.role === 'dealer';
  const isDealerApproved = isDealer && dealerProfile?.status === 'Approved';

  return {
    user,
    profile,
    dealerProfile,
    session,
    isLoading,
    initialize,
    setupAuthStateListener,
    signUp,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isDealer,
    isDealerApproved
  };
}
