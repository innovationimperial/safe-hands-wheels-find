
import React from "react";
import { Check } from "lucide-react";
import { VehicleFeature } from "@/types/vehicle-detail";

interface VehicleFeaturesTabProps {
  featuresByCategory: Record<string, VehicleFeature[]>;
}

const VehicleFeaturesTab = ({ featuresByCategory }: VehicleFeaturesTabProps) => {
  return (
    <div>
      {Object.entries(featuresByCategory).map(([category, features]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold mb-3 capitalize">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {features.filter(f => f.value).map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>{feature.feature}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleFeaturesTab;
