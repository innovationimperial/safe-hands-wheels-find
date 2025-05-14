
import React, { useState } from "react";
import VehicleOverviewTab from "./VehicleOverviewTab";
import VehicleFeaturesTab from "./VehicleFeaturesTab";
import { Vehicle, VehicleFeature } from "@/types/vehicle-detail";

interface VehicleDetailTabsProps {
  vehicle: Vehicle;
  featuresByCategory: Record<string, VehicleFeature[]>;
}

const VehicleDetailTabs = ({ vehicle, featuresByCategory }: VehicleDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <>
      <div className="flex border-b mb-6">
        <button 
          className={`px-4 py-3 text-sm font-medium ${activeTab === "overview" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button 
          className={`px-4 py-3 text-sm font-medium ${activeTab === "features" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
          onClick={() => setActiveTab("features")}
        >
          Features
        </button>
      </div>
      
      {activeTab === "overview" && <VehicleOverviewTab vehicle={vehicle} />}
      {activeTab === "features" && <VehicleFeaturesTab featuresByCategory={featuresByCategory} />}
    </>
  );
};

export default VehicleDetailTabs;
