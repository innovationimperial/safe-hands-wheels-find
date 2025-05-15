
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Car, AlertCircle, Plus, ShoppingBag, Users } from "lucide-react";
import VehicleList from "@/components/vehicle-listings/VehicleList";
import { toast } from "@/hooks/use-toast";

const DealerDashboard = () => {
  const { user, isDealer, dealerProfile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Fetch dealer's vehicles
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["dealerVehicles", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching dealer vehicles:", error);
        toast({
          title: "Error",
          description: "Failed to load your vehicles",
          variant: "destructive",
        });
        return [];
      }

      return data || [];
    },
    enabled: !!user && isDealer,
  });

  // Redirect to registration if not a dealer
  React.useEffect(() => {
    if (!authLoading && !isDealer && user) {
      navigate("/become-dealer");
    } else if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [isDealer, user, authLoading, navigate]);

  // Show pending status if dealer is not approved
  if (isDealer && dealerProfile?.status === "Pending") {
    return (
      <Layout>
        <div className="container py-12">
          <Card className="border-yellow-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="text-yellow-500" />
                <span>Application Pending</span>
              </CardTitle>
              <CardDescription>
                Your dealer application is currently under review. We'll notify you once it's approved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Thank you for your interest in becoming a dealer on our platform. Our team is reviewing your application
                and will get back to you as soon as possible. This process typically takes 1-2 business days.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Show rejected status if dealer is rejected
  if (isDealer && dealerProfile?.status === "Rejected") {
    return (
      <Layout>
        <div className="container py-12">
          <Card className="border-red-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="text-red-500" />
                <span>Application Rejected</span>
              </CardTitle>
              <CardDescription>
                Unfortunately, your dealer application was not approved at this time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                If you believe this is an error or would like to provide additional information, please contact our
                support team.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => navigate("/contact")}>
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{dealerProfile?.name || "Dealer"} Dashboard</h1>
            <p className="text-muted-foreground">Manage your vehicle listings and sales</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button onClick={() => navigate("/dealer/add-vehicle")}>
              <Plus className="mr-2 h-4 w-4" /> Add Vehicle
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {vehiclesLoading ? "..." : vehicles?.length || 0}
                </div>
                <Car className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {vehiclesLoading ? "..." : vehicles?.filter(v => v.status === "Available").length || 0}
                </div>
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {vehiclesLoading ? "..." : vehicles?.filter(v => v.status === "Sold").length || 0}
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle listings */}
        <Card>
          <CardHeader>
            <CardTitle>Your Vehicle Listings</CardTitle>
            <CardDescription>
              Manage all your vehicle listings from here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {vehicles && vehicles.length > 0 ? (
              <VehicleList vehicles={vehicles} isLoading={vehiclesLoading} />
            ) : (
              <div className="text-center py-12">
                <Car className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No vehicles listed yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Get started by adding your first vehicle listing.
                </p>
                <Button className="mt-4" onClick={() => navigate("/dealer/add-vehicle")}>
                  <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DealerDashboard;
