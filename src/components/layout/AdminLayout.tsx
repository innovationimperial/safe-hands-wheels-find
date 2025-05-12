
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Car, 
  LayoutDashboard, 
  Users, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();
  
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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          <div className={cn(
            "border-b border-gray-200 flex items-center justify-between p-4",
            collapsed ? "justify-center" : ""
          )}>
            {!collapsed && (
              <Link to="/admin" className="font-bold text-lg text-primary">
                ZimAUTO
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCollapsed(prev => !prev)}
              className="rounded-full h-8 w-8"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
          </div>
          
          <div className="flex-1 py-4">
            <nav className="px-2 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md group",
                    location.pathname === item.path 
                      ? "bg-primary text-white" 
                      : "text-gray-700 hover:bg-gray-100",
                    collapsed ? "justify-center" : ""
                  )}
                >
                  <div className={cn(
                    "flex items-center",
                    collapsed ? "justify-center w-full" : ""
                  )}>
                    {item.icon}
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <Button 
              variant="ghost" 
              className={cn(
                "text-gray-700 w-full justify-start",
                collapsed ? "justify-center" : ""
              )}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span className="ml-2">Log Out</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Admin User</span>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
