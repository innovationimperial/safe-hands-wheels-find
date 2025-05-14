
import React from "react";
import { Loader2 } from "lucide-react";

const VehicleDetailLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4">Loading vehicle details...</p>
    </div>
  );
};

export default VehicleDetailLoading;
