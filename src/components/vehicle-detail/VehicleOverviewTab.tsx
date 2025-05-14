
import React from "react";
import { Vehicle } from "@/types/vehicle-detail";

interface VehicleOverviewTabProps {
  vehicle: Vehicle;
}

const VehicleOverviewTab = ({ vehicle }: VehicleOverviewTabProps) => {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Vehicle Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <span className="text-gray-500 text-sm">Make/Model</span>
            <p className="font-medium">{vehicle.title}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <span className="text-gray-500 text-sm">Year</span>
            <p className="font-medium">{vehicle.year}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <span className="text-gray-500 text-sm">Mileage</span>
            <p className="font-medium">{vehicle.mileage}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <span className="text-gray-500 text-sm">Fuel Type</span>
            <p className="font-medium">{vehicle.fuel_type}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <span className="text-gray-500 text-sm">Transmission</span>
            <p className="font-medium">{vehicle.transmission}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <span className="text-gray-500 text-sm">Body Type</span>
            <p className="font-medium">{vehicle.body_type}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <span className="text-gray-500 text-sm">Color</span>
            <p className="font-medium">{vehicle.color}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <span className="text-gray-500 text-sm">Engine</span>
            <p className="font-medium">{vehicle.engine_capacity}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <span className="text-gray-500 text-sm">Doors</span>
            <p className="font-medium">{vehicle.doors}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <span className="text-gray-500 text-sm">Location</span>
            <p className="font-medium">{vehicle.location}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Description</h3>
        <p className="text-gray-600">
          Experience the perfect blend of performance and luxury with this {vehicle.year} {vehicle.title}. 
          With only {vehicle.mileage} on the odometer, this {vehicle.color} beauty is in excellent 
          condition and ready for its new owner. The powerful {vehicle.engine_capacity} engine delivers 
          an exhilarating driving experience, while the {vehicle.transmission} transmission ensures 
          smooth and effortless gear changes.
        </p>
        <p className="text-gray-600 mt-3">
          Located in {vehicle.location}, this vehicle is available for viewing by appointment. 
          Contact us today to arrange a test drive and experience this exceptional {vehicle.title} for yourself.
        </p>
      </div>
    </div>
  );
};

export default VehicleOverviewTab;
