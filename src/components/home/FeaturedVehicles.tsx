
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fuel, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

// Define the Vehicle interface based on your database schema
interface Vehicle {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: string;
  fuel_type: string;
  transmission: string;
  location: string;
  featured: boolean;
  image: string;
}

const fetchFeaturedVehicles = async (): Promise<Vehicle[]> => {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("status", "Available")
    .order("featured", { ascending: false })
    .limit(6);
  
  if (error) {
    console.error("Error fetching featured vehicles:", error);
    throw error;
  }
  
  return data || [];
};

const FeaturedVehicles = () => {
  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ["featuredVehicles"],
    queryFn: fetchFeaturedVehicles,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">Featured Vehicles</h2>
            <div className="w-20 h-1 bg-primary mb-6"></div>
            <p className="text-gray-600 max-w-2xl">
              Loading featured vehicles...
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden border-gray-100">
                <div className="h-52">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Handle error state
  if (error) {
    console.error("Failed to fetch featured vehicles:", error);
    return (
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">Featured Vehicles</h2>
            <div className="w-20 h-1 bg-primary mb-6"></div>
            <p className="text-gray-600 max-w-2xl text-red-500">
              Failed to load vehicles. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">Featured Vehicles</h2>
          <div className="w-20 h-1 bg-primary mb-6"></div>
          <p className="text-gray-600 max-w-2xl">
            Explore our selection of premium vehicles, handpicked by our experts. Each vehicle is thoroughly inspected to ensure quality and reliability.
          </p>
        </div>
        
        {vehicles && vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Card 
                key={vehicle.id} 
                className="overflow-hidden border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={vehicle.image || '/placeholder.svg'} 
                    alt={vehicle.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {vehicle.featured && (
                    <Badge className="absolute top-3 right-3 bg-primary">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">{vehicle.title}</h3>
                    <p className="font-bold text-primary text-lg">
                      ${vehicle.price.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2" />
                      <span>{vehicle.year}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Fuel size={16} className="mr-2" />
                      <span>{vehicle.fuel_type}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg width="16" height="16" className="mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{vehicle.mileage}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg width="16" height="16" className="mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2H11V22H13V2Z" fill="currentColor"/>
                        <path d="M4 11C4 9.9 4.9 9 6 9H8V11H6V13H8V15H6C4.9 15 4 14.1 4 13V11ZM16 9H18C19.1 9 20 9.9 20 11V13C20 14.1 19.1 15 18 15H16V9ZM16 13H18V11H16V13Z" fill="currentColor"/>
                      </svg>
                      <span>{vehicle.transmission}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin size={16} className="mr-2" />
                    <span>{vehicle.location}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" className="flex-1 mr-2" asChild>
                      <Link to={`/vehicle/${vehicle.id}`}>Details</Link>
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90">
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No vehicles available at the moment.</p>
            <Button className="mt-4" asChild>
              <Link to="/sell-car">Sell Your Car</Link>
            </Button>
          </div>
        )}
        
        <div className="mt-10 text-center">
          <Button className="bg-secondary hover:bg-secondary/90 px-8" asChild>
            <Link to="/buy-car">View All Vehicles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
