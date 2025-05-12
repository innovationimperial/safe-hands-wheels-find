
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BuyCar from "./pages/BuyCar";
import FindDealer from "./pages/FindDealer";
import SellCar from "./pages/SellCar";
import VehicleDetail from "./pages/VehicleDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminVehicles from "./pages/AdminVehicles";
import AdminVehicleForm from "./pages/AdminVehicleForm";
import AdminUsers from "./pages/AdminUsers";
import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/buy-car" element={<BuyCar />} />
      <Route path="/find-dealer" element={<FindDealer />} />
      <Route path="/sell-car" element={<SellCar />} />
      <Route path="/vehicle/:id" element={<VehicleDetail />} />
      <Route path="/auth" element={<Auth />} />
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/vehicles" element={<AdminVehicles />} />
      <Route path="/admin/vehicles/add" element={<AdminVehicleForm />} />
      <Route path="/admin/vehicles/edit/:id" element={<AdminVehicleForm />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Create QueryClient inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
