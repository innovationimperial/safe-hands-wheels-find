import React from "react";
import VehicleCard from "./VehicleCard";

export interface VehicleListProps {
  vehicles: any[]; // Using any[] as a fallback since we don't know the exact type
  isLoading?: boolean; // Add isLoading prop to fix the error
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, isLoading }) => {
  if (isLoading) {
    return <p>Loading vehicles...</p>;
  }

  if (!vehicles || vehicles.length === 0) {
    return <p>No vehicles to display.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
};

export default VehicleList;
