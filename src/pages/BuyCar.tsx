
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { vehicles } from "@/data/vehicles";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fuel, Clock, MapPin, Filter, Search, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Vehicle } from "@/data/vehicles";

const BuyCar = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Filter states
  const [bodyType, setBodyType] = useState<string>(queryParams.get("bodyType") || "");
  const [make, setMake] = useState<string>(queryParams.get("make") || "");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [transmissions, setTransmissions] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicles);

  // Apply filters
  useEffect(() => {
    let results = vehicles;
    
    // Filter by body type
    if (bodyType) {
      // Map displayed names to data property names
      const bodyTypeMap: Record<string, string> = {
        "SUV": "SUV",
        "Pickup Truck": "Pickup",
        "Hatchback": "Hatchback", 
        "Sedan": "Sedan",
        "Trucks/Buses": "Bus",
        "Minibus/Van": "Minibus"
      };
      
      results = results.filter(vehicle => {
        // This is a mock implementation. In a real app, vehicles would have a bodyType property
        const vehicleTitle = vehicle.title.toLowerCase();
        const mappedType = bodyTypeMap[bodyType]?.toLowerCase() || bodyType.toLowerCase();
        
        return (
          vehicleTitle.includes(mappedType) || 
          (mappedType === "suv" && vehicleTitle.includes("crossover")) ||
          (mappedType === "pickup" && vehicleTitle.includes("truck"))
        );
      });
    }
    
    // Filter by make
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
        fuelTypes.some(type => vehicle.fuelType.toLowerCase().includes(type.toLowerCase()))
      );
    }
    
    // Filter by transmission
    if (transmissions.length > 0) {
      results = results.filter(vehicle => 
        transmissions.some(trans => vehicle.transmission.toLowerCase().includes(trans.toLowerCase()))
      );
    }
    
    setFilteredVehicles(results);
  }, [bodyType, make, minPrice, maxPrice, fuelTypes, transmissions]);

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

  return (
    <Layout>
      <div className="container-custom py-16">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-1/4 bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Filter size={18} className="mr-2" />
                Filters
              </h2>
              {(bodyType || make || minPrice || maxPrice || fuelTypes.length > 0 || transmissions.length > 0) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters} 
                  className="text-gray-500 hover:text-primary text-xs"
                >
                  <X size={14} className="mr-1" /> Clear all
                </Button>
              )}
            </div>
            
            <Separator className="my-3" />
            
            <Collapsible
              open={isFilterOpen}
              onOpenChange={setIsFilterOpen}
              className="w-full"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
                <span>Vehicle Type</span>
                <span>{isFilterOpen ? "−" : "+"}</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-2 mt-2">
                  {["SUV", "Pickup Truck", "Sedan", "Hatchback", "Trucks/Buses", "Minibus/Van"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`type-${type}`} 
                        checked={bodyType === type}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBodyType(type);
                          } else {
                            setBodyType("");
                          }
                        }}
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <Separator className="my-3" />
            
            <Collapsible className="w-full">
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
                <span>Price Range</span>
                <span>+</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4 mt-2">
                  <div>
                    <Label htmlFor="minPrice" className="text-xs text-gray-500">Min Price ($)</Label>
                    <Input 
                      id="minPrice" 
                      type="number"
                      placeholder="Min Price" 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrice" className="text-xs text-gray-500">Max Price ($)</Label>
                    <Input 
                      id="maxPrice" 
                      type="number"
                      placeholder="Max Price" 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value)} 
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <Separator className="my-3" />
            
            <Collapsible className="w-full">
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
                <span>Fuel Type</span>
                <span>+</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2">
                  <ToggleGroup 
                    type="multiple" 
                    variant="outline" 
                    className="flex flex-wrap gap-2"
                    value={fuelTypes}
                    onValueChange={handleFuelTypeChange}
                  >
                    {["Gasoline", "Diesel", "Electric", "Hybrid"].map((type) => (
                      <ToggleGroupItem key={type} value={type} className="text-xs">
                        {type}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <Separator className="my-3" />
            
            <Collapsible className="w-full">
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
                <span>Transmission</span>
                <span>+</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2">
                  <ToggleGroup 
                    type="multiple" 
                    variant="outline" 
                    className="flex flex-wrap gap-2"
                    value={transmissions}
                    onValueChange={handleTransmissionChange}
                  >
                    {["Automatic", "Manual", "PDK"].map((type) => (
                      <ToggleGroupItem key={type} value={type} className="text-xs">
                        {type}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          {/* Car Listings */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {bodyType || make ? (
                  <>
                    {bodyType && <span>{bodyType} </span>}
                    {make && <span>{make} </span>}
                    <span>Vehicles</span>
                  </>
                ) : (
                  "All Vehicles"
                )}
              </h1>
              <p className="text-gray-500 text-sm">
                {filteredVehicles.length} vehicles found
              </p>
            </div>
            
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-500">No vehicles match your search criteria</h3>
                <p className="mt-2 text-gray-400">Try adjusting your filters</p>
                <Button 
                  variant="outline" 
                  onClick={clearFilters} 
                  className="mt-4"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <Card 
                    key={vehicle.id} 
                    className="overflow-hidden border-gray-100 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img 
                        src={vehicle.image} 
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
                          <span>{vehicle.fuelType}</span>
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
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuyCar;
