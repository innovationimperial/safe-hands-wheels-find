
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { AuthContextType } from "@/types/auth";
import { useAuthService } from "@/hooks/use-auth-service";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
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
  } = useAuthService();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = setupAuthStateListener();

    // Then check for existing session
    initialize();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
