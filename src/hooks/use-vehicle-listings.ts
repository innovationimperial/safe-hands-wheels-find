
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";

// Define the Vehicle interface
export interface Vehicle {
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
  body_type: string;
}

export const useVehicleListings = (initialBodyType: string = "", initialMake: string = "") => {
  // Filter states
  const [bodyType, setBodyType] = useState<string>(initialBodyType);
  const [make, setMake] = useState<string>(initialMake);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [transmissions, setTransmissions] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);

  // Fetch all available vehicles
  const { data: allVehicles, isLoading, error } = useQuery({
    queryKey: ["allVehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("status", "Available");
      
      if (error) {
        console.error("Error fetching vehicles:", error);
        throw error;
      }
      
      return data as Vehicle[] || [];
    },
  });

  // Apply filters
  const filteredVehicles = useMemo(() => {
    if (!allVehicles) return [];
    
    let results = [...allVehicles];
    
    // Filter by body type
    if (bodyType) {
      results = results.filter(vehicle => 
        vehicle.body_type.toLowerCase() === bodyType.toLowerCase()
      );
    }
    
    // Filter by make (search in title)
    if (make) {
      results = results.filter(vehicle => 
        vehicle.title.toLowerCase().includes(make.toLowerCase())
      );
    }
    
    // Filter by price range
    if (minPrice) {
      results = results.filter(vehicle => vehicle.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      results = results.filter(vehicle => vehicle.price <= parseInt(maxPrice));
    }
    
    // Filter by fuel type
    if (fuelTypes.length > 0) {
      results = results.filter(vehicle => 
        fuelTypes.some(type => vehicle.fuel_type.toLowerCase() === type.toLowerCase())
      );
    }
    
    // Filter by transmission
    if (transmissions.length > 0) {
      results = results.filter(vehicle => 
        transmissions.some(trans => vehicle.transmission.toLowerCase() === trans.toLowerCase())
      );
    }
    
    return results;
  }, [allVehicles, bodyType, make, minPrice, maxPrice, fuelTypes, transmissions]);

  // Handle fuel type toggle
  const handleFuelTypeChange = (value: string[]) => {
    setFuelTypes(value);
  };
  
  // Handle transmission toggle
  const handleTransmissionChange = (value: string[]) => {
    setTransmissions(value);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setBodyType("");
    setMake("");
    setMinPrice("");
    setMaxPrice("");
    setFuelTypes([]);
    setTransmissions([]);
  };

  return {
    bodyType,
    setBodyType,
    make, 
    setMake,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    fuelTypes,
    transmissions,
    isFilterOpen,
    setIsFilterOpen,
    filteredVehicles,
    isLoading,
    error,
    handleFuelTypeChange,
    handleTransmissionChange,
    clearFilters
  };
};
