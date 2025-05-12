
import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { vehicles } from "@/data/vehicles";
import { Car, Eye, DollarSign, Star } from "lucide-react";

const AdminDashboard = () => {
  const totalVehicles = vehicles.length;
  const featuredVehicles = vehicles.filter(v => v.featured).length;
  const totalValue = vehicles.reduce((sum, vehicle) => sum + vehicle.price, 0);
  
  const stats = [
    {
      title: "Total Vehicles",
      value: totalVehicles,
      icon: <Car className="h-5 w-5" />,
      description: "Vehicles in inventory"
    },
    {
      title: "Featured Listings",
      value: featuredVehicles,
      icon: <Star className="h-5 w-5" />,
      description: "Promoted vehicles"
    },
    {
      title: "Inventory Value",
      value: `$${totalValue.toLocaleString()}`,
      icon: <DollarSign className="h-5 w-5" />,
      description: "Total value"
    },
    {
      title: "Total Views",
      value: "1,245",
      icon: <Eye className="h-5 w-5" />,
      description: "Last 30 days"
    }
  ];

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
              <div className="space-y-4">
                {vehicles.slice(0, 5).map(vehicle => (
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0"></div>
                  <div>
                    <p className="text-sm">Vehicle added: Ford Mustang GT</p>
                    <p className="text-xs text-gray-500">Today, 10:30 AM</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
                  <div>
                    <p className="text-sm">Vehicle updated: Tesla Model 3</p>
                    <p className="text-xs text-gray-500">Yesterday, 4:45 PM</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 shrink-0"></div>
                  <div>
                    <p className="text-sm">Featured status changed: BMW 3 Series</p>
                    <p className="text-xs text-gray-500">Yesterday, 2:15 PM</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0"></div>
                  <div>
                    <p className="text-sm">Vehicle deleted: Honda Accord</p>
                    <p className="text-xs text-gray-500">May 10, 2023, 9:20 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
