
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const VehicleDetailError = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-red-500">
      <AlertCircle className="h-8 w-8" />
      <p className="mt-4">Error loading vehicle details. Please try again.</p>
      <Link to="/buy-car" className="mt-4">
        <Button variant="outline">Back to listings</Button>
      </Link>
    </div>
  );
};

export default VehicleDetailError;
