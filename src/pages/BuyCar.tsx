
import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import VehicleFilters from "@/components/vehicle-listings/VehicleFilters";
import VehicleList from "@/components/vehicle-listings/VehicleList";
import { LoadingState, ErrorState } from "@/components/vehicle-listings/VehicleListingStates";
import { useVehicleListings } from "@/hooks/use-vehicle-listings";

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

  if (isLoading) {
    return (
      <Layout>
        <div className="container-custom py-16">
          <LoadingState />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container-custom py-16">
          <ErrorState />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
          <VehicleList
            vehicles={filteredVehicles}
            bodyType={bodyType}
            make={make}
            clearFilters={clearFilters}
          />
        </div>
      </div>
    </Layout>
  );
};

export default BuyCar;
