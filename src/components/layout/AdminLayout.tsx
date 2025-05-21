
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ArrowLeft,
  Car, 
  LayoutDashboard, 
  Users, 
  LogOut,
  PanelLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const navItems = [
    { 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      label: "Dashboard", 
      path: "/admin" 
    },
    { 
      icon: <Car className="w-5 h-5" />, 
      label: "Vehicles", 
      path: "/admin/vehicles" 
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      label: "Users", 
      path: "/admin/users" 
    },
  ];

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-gray-100 w-full">
        <Sidebar variant="sidebar">
          <SidebarHeader className="border-b border-gray-200 py-3">
            <div className="px-3 flex items-center justify-between">
              <Link to="/admin" className="font-bold text-lg text-primary">
                SafeHands
              </Link>
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {navItems.map(item => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.path)}
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  >
                    <Link to={item.path} className="flex items-center">
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-700"
              onClick={logout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span>Log Out</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4">
            {/* Add sidebar toggle button that's visible when sidebar is collapsed */}
            <ToggleSidebarButton />
            
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/"
                className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Website
              </Link>
              <span className="text-sm text-gray-600">Admin User</span>
            </div>
          </header>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

// Add a new component for the toggle button that only appears when sidebar is collapsed
const ToggleSidebarButton = () => {
  const { state, toggleSidebar } = useSidebar();
  
  if (state === "expanded") {
    // Don't show button when sidebar is already expanded
    return null;
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleSidebar}
      className="flex items-center mr-2"
    >
      <PanelLeft className="h-4 w-4" />
      <span className="ml-2">Show Sidebar</span>
    </Button>
  );
};

export default AdminLayout;
