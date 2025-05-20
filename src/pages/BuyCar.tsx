
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import VehicleFilters from "@/components/vehicle-listings/VehicleFilters";
import { LoadingState, ErrorState } from "@/components/vehicle-listings/VehicleListingStates";
import { useVehicleListings } from "@/hooks/use-vehicle-listings";
import { toast } from "@/hooks/use-toast";
import VehicleCard from "@/components/vehicle-listings/VehicleCard";

const BuyCar = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const initialBodyType = queryParams.get("bodyType") || "";
  const initialMake = queryParams.get("make") || "";
  
  const {
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
  } = useVehicleListings(initialBodyType, initialMake);

  useEffect(() => {
    if (!isLoading && !error && filteredVehicles.length > 0) {
      toast({
        title: "Vehicles loaded",
        description: `Found ${filteredVehicles.length} vehicles from the database`,
      });
    }
  }, [isLoading, error, filteredVehicles.length]);

  if (isLoading) {
    return (
      <div className="container-custom py-16">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-16">
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Filters Sidebar */}
        <VehicleFilters
          bodyType={bodyType}
          setBodyType={setBodyType}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          fuelTypes={fuelTypes}
          handleFuelTypeChange={handleFuelTypeChange}
          transmissions={transmissions}
          handleTransmissionChange={handleTransmissionChange}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          clearFilters={clearFilters}
        />
        
        {/* Vehicle Listings */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {filteredVehicles.length} Vehicles Found
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Viewing 1-{filteredVehicles.length} of {filteredVehicles.length}</span>
            </div>
          </div>
          
          {filteredVehicles.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600 mb-4">No vehicles match your search criteria.</p>
              <button 
                onClick={clearFilters}
                className="text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyCar;
