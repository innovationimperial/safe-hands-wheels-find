
import React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

interface VehicleFiltersProps {
  bodyType: string;
  setBodyType: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  fuelTypes: string[];
  handleFuelTypeChange: (value: string[]) => void;
  transmissions: string[];
  handleTransmissionChange: (value: string[]) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  clearFilters: () => void;
}

const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  bodyType,
  setBodyType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  fuelTypes,
  handleFuelTypeChange,
  transmissions,
  handleTransmissionChange,
  isFilterOpen,
  setIsFilterOpen,
  clearFilters
}) => {
  const hasActiveFilters = bodyType || minPrice || maxPrice || fuelTypes.length > 0 || transmissions.length > 0;

  return (
    <div className="w-full md:w-1/4 bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Filter size={18} className="mr-2" />
          Filters
        </h2>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters} 
            className="text-gray-500 hover:text-primary text-xs"
          >
            <X size={14} className="mr-1" /> Clear all
          </Button>
        )}
      </div>
      
      <Separator className="my-3" />
      
      <Collapsible
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        className="w-full"
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
          <span>Vehicle Type</span>
          <span>{isFilterOpen ? "−" : "+"}</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-2 mt-2">
            {["SUV", "Truck", "Sedan", "Hatchback", "Coupe", "Van"].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={`type-${type}`} 
                  checked={bodyType === type}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setBodyType(type);
                    } else {
                      setBodyType("");
                    }
                  }}
                />
                <label
                  htmlFor={`type-${type}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator className="my-3" />
      
      <Collapsible className="w-full">
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
          <span>Price Range</span>
          <span>+</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-4 mt-2">
            <div>
              <Label htmlFor="minPrice" className="text-xs text-gray-500">Min Price ($)</Label>
              <Input 
                id="minPrice" 
                type="number"
                placeholder="Min Price" 
                value={minPrice} 
                onChange={(e) => setMinPrice(e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-xs text-gray-500">Max Price ($)</Label>
              <Input 
                id="maxPrice" 
                type="number"
                placeholder="Max Price" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)} 
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator className="my-3" />
      
      <Collapsible className="w-full">
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
          <span>Fuel Type</span>
          <span>+</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2">
            <ToggleGroup 
              type="multiple" 
              variant="outline" 
              className="flex flex-wrap gap-2"
              value={fuelTypes}
              onValueChange={handleFuelTypeChange}
            >
              {["Gasoline", "Diesel", "Electric", "Hybrid"].map((type) => (
                <ToggleGroupItem key={type} value={type} className="text-xs">
                  {type}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator className="my-3" />
      
      <Collapsible className="w-full">
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium">
          <span>Transmission</span>
          <span>+</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2">
            <ToggleGroup 
              type="multiple" 
              variant="outline" 
              className="flex flex-wrap gap-2"
              value={transmissions}
              onValueChange={handleTransmissionChange}
            >
              {["Automatic", "Manual", "PDK", "CVT"].map((type) => (
                <ToggleGroupItem key={type} value={type} className="text-xs">
                  {type}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default VehicleFilters;
