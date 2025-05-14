
import React from "react";
import { Vehicle } from "@/types/vehicle-detail";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Calendar, Share2, Mail } from "lucide-react";

interface VehicleSidebarProps {
  vehicle: Vehicle;
}

const VehicleSidebar = ({ vehicle }: VehicleSidebarProps) => {
  return (
    <div className="bg-white rounded-lg border p-6 sticky top-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{vehicle.title}</h2>
        {vehicle.featured && (
          <Badge className="bg-amber-500 mt-2">Featured</Badge>
        )}
      </div>
      
      <div className="text-3xl font-bold text-primary mb-6">
        ${vehicle.price.toLocaleString()}
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Year</span>
          <span className="font-medium">{vehicle.year}</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-gray-600">Mileage</span>
          <span className="font-medium">{vehicle.mileage}</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-gray-600">Fuel Type</span>
          <span className="font-medium">{vehicle.fuel_type}</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-gray-600">Transmission</span>
          <span className="font-medium">{vehicle.transmission}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Seller
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Contact about {vehicle.title}</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Email</label>
                <input 
                  type="email" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Phone</label>
                <input 
                  type="tel" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea 
                  className="w-full p-2 border rounded-md h-32"
                  placeholder="I'm interested in this vehicle. Please contact me with more information."
                ></textarea>
              </div>
              <Button className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        
        <Button variant="outline" className="w-full">
          <Phone className="mr-2 h-4 w-4" />
          Call Seller
        </Button>
        
        <Button variant="outline" className="w-full">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Test Drive
        </Button>
        
        <Button variant="ghost" className="w-full">
          <Share2 className="mr-2 h-4 w-4" />
          Share Vehicle
        </Button>
      </div>
    </div>
  );
};

export default VehicleSidebar;
