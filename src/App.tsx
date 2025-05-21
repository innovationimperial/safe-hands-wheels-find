
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BuyCar from "./pages/BuyCar";
import SellCar from "./pages/SellCar";
import VehicleDetail from "./pages/VehicleDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminVehicles from "./pages/AdminVehicles";
import AdminVehicleForm from "./pages/AdminVehicleForm";
import AdminUsers from "./pages/AdminUsers";
import DealerRegistration from "./pages/DealerRegistration";
import DealerDashboard from "./pages/DealerDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { useState } from "react";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";

function App() {
  // Create QueryClient inside the function component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Main website routes with Layout */}
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/buy-car" element={<Layout><BuyCar /></Layout>} />
              <Route path="/sell-car" element={<Layout><SellCar /></Layout>} />
              <Route path="/vehicle/:id" element={<Layout><VehicleDetail /></Layout>} />
              <Route path="/auth" element={<Layout><Auth /></Layout>} />
              <Route path="/become-dealer" element={<DealerRegistration />} />
              <Route path="/dealer/dashboard" element={<DealerDashboard />} />
              <Route path="/dealer/add-vehicle" element={<AdminVehicleForm />} />
              <Route path="/dealer/edit-vehicle/:id" element={<AdminVehicleForm />} />
              
              {/* Admin routes with AdminLayout */}
              <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/vehicles" element={<AdminLayout><AdminVehicles /></AdminLayout>} />
              <Route path="/admin/vehicles/add" element={<AdminLayout><AdminVehicleForm /></AdminLayout>} />
              <Route path="/admin/vehicles/edit/:id" element={<AdminLayout><AdminVehicleForm /></AdminLayout>} />
              <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
              
              {/* 404 route */}
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
