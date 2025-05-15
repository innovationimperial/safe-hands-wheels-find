
import React from "react";
import { Button } from "@/components/ui/button";
import VehicleCard from "./VehicleCard";
import { Vehicle } from "@/hooks/use-vehicle-listings";

interface VehicleListProps {
  vehicles: Vehicle[];
  bodyType?: string;
  make?: string;
  clearFilters?: () => void;
  isLoading?: boolean;
}

const VehicleList: React.FC<VehicleListProps> = ({ 
  vehicles, 
  bodyType,
  make,
  clearFilters,
  isLoading = false
}) => {
  return (
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
          {vehicles.length} vehicles found
        </p>
      </div>
      
      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-500">No vehicles match your search criteria</h3>
          <p className="mt-2 text-gray-400">Try adjusting your filters</p>
          {clearFilters && (
            <Button 
              variant="outline" 
              onClick={clearFilters} 
              className="mt-4"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleList;
