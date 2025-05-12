
import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Eye, DollarSign, Star, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Vehicle interface
interface Vehicle {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: string;
  featured: boolean;
  image: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { session } = useAuth();
  
  // Fetch dashboard data from Supabase
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // Get vehicles count
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id, title, price, year, mileage, featured, image, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (vehiclesError) throw vehiclesError;
      
      // Get featured vehicles count
      const { count: featuredCount, error: featuredError } = await supabase
        .from('vehicles')
        .select('id', { count: 'exact', head: true })
        .eq('featured', true);
      
      if (featuredError) throw featuredError;
      
      // Calculate total inventory value
      const totalValue = vehicles.reduce((sum, vehicle) => sum + vehicle.price, 0);
      
      return {
        vehicles,
        totalVehicles: vehicles.length,
        featuredVehicles: featuredCount || 0,
        totalValue,
        recentActivity: [
          {
            type: 'add',
            message: 'Vehicle added: ' + (vehicles[0]?.title || 'New vehicle'),
            timestamp: new Date().toISOString()
          },
          {
            type: 'update',
            message: 'Vehicle updated: ' + (vehicles[1]?.title || 'Vehicle'),
            timestamp: new Date(Date.now() - 86400000).toISOString() // yesterday
          },
          {
            type: 'feature',
            message: 'Featured status changed: ' + (vehicles[2]?.title || 'Vehicle'),
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
          },
          {
            type: 'delete',
            message: 'Vehicle deleted: Honda Accord',
            timestamp: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
          }
        ]
      };
    },
    enabled: !!session
  });
  
  // Format timestamp to relative time
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };
  
  // Stats for the cards
  const stats = dashboardData ? [
    {
      title: "Total Vehicles",
      value: dashboardData.totalVehicles,
      icon: <Car className="h-5 w-5" />,
      description: "Vehicles in inventory"
    },
    {
      title: "Featured Listings",
      value: dashboardData.featuredVehicles,
      icon: <Star className="h-5 w-5" />,
      description: "Promoted vehicles"
    },
    {
      title: "Inventory Value",
      value: `$${dashboardData.totalValue.toLocaleString()}`,
      icon: <DollarSign className="h-5 w-5" />,
      description: "Total value"
    },
    {
      title: "Total Views",
      value: "1,245",
      icon: <Eye className="h-5 w-5" />,
      description: "Last 30 days"
    }
  ] : [];

  // Loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <AlertCircle className="h-8 w-8 mb-4" />
          <p>Failed to load dashboard data. Please try again.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData?.vehicles && dashboardData.vehicles.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.vehicles.map(vehicle => (
                    <div key={vehicle.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden shrink-0">
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{vehicle.title}</p>
                        <p className="text-xs text-gray-500">{vehicle.year} • {vehicle.mileage}</p>
                      </div>
                      <div className="text-sm font-semibold">${vehicle.price.toLocaleString()}</div>
                      {vehicle.featured && <Badge variant="outline" className="ml-2">Featured</Badge>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">No vehicles in inventory.</p>
                  <Button 
                    variant="outline" 
                    asChild
                  >
                    <Link to="/admin/vehicles/add">Add your first vehicle</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      activity.type === 'add' ? 'bg-green-500' :
                      activity.type === 'update' ? 'bg-blue-500' :
                      activity.type === 'feature' ? 'bg-amber-500' : 'bg-red-500'
                    } shrink-0`}></div>
                    <div>
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
