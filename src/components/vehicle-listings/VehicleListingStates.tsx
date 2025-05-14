
import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LoadingState = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
      <span>Loading vehicles...</span>
    </div>
  );
};

export const ErrorState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-red-500">
      <p>Failed to load vehicles. Please try again later.</p>
      <Button 
        variant="outline" 
        onClick={() => window.location.reload()} 
        className="mt-4"
      >
        Refresh
      </Button>
    </div>
  );
};
