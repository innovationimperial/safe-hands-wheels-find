
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fuel, Clock, MapPin } from "lucide-react";
import { Vehicle } from "@/types/vehicle-detail";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <Card className="overflow-hidden border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-52 overflow-hidden">
        <img 
          src={vehicle.image || '/placeholder.svg'} 
          alt={vehicle.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            console.error(`Failed to load vehicle image: ${vehicle.image}`);
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        {vehicle.featured && (
          <Badge className="absolute top-3 right-3 bg-primary">
            Featured
          </Badge>
        )}
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg">{vehicle.title}</h3>
          <p className="font-bold text-primary text-lg">
            ${vehicle.price.toLocaleString()}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Fuel size={16} className="mr-2" />
            <span>{vehicle.fuel_type}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg width="16" height="16" className="mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{vehicle.mileage}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg width="16" height="16" className="mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2H11V22H13V2Z" fill="currentColor"/>
              <path d="M4 11C4 9.9 4.9 9 6 9H8V11H6V13H8V15H6C4.9 15 4 14.1 4 13V11ZM16 9H18C19.1 9 20 9.9 20 11V13C20 14.1 19.1 15 18 15H16V9ZM16 13H18V11H16V13Z" fill="currentColor"/>
            </svg>
            <span>{vehicle.transmission}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <MapPin size={16} className="mr-2" />
          <span>{vehicle.location}</span>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" className="flex-1 mr-2" asChild>
            <Link to={`/vehicle/${vehicle.id}`}>Details</Link>
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary/90">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
