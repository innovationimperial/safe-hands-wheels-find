
import React from "react";
import { Link } from "react-router-dom";
import { 
  Car, 
  Truck, 
  Bike,
  Bus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Car brand logos
const carBrands = [
  { name: "Ford", logo: "https://www.carlogos.org/car-logos/ford-logo.png" },
  { name: "Toyota", logo: "https://www.carlogos.org/car-logos/toyota-logo.png" },
  { name: "BMW", logo: "https://www.carlogos.org/car-logos/bmw-logo.png" },
  { name: "Mercedes", logo: "https://www.carlogos.org/car-logos/mercedes-logo.png" },
  { name: "Honda", logo: "https://www.carlogos.org/car-logos/honda-logo.png" },
  { name: "Chevrolet", logo: "https://www.carlogos.org/car-logos/chevrolet-logo.png" },
  { name: "Tesla", logo: "https://www.carlogos.org/car-logos/tesla-logo.png" },
  { name: "Jeep", logo: "https://www.carlogos.org/car-logos/jeep-logo.png" }
];

const bodyTypes = [
  { name: "SUV", icon: Car, count: 780 },
  { name: "Pickup Truck", icon: Truck, count: 564 },
  { name: "Hatchback", icon: Car, count: 421 },
  { name: "Sedan", icon: Car, count: 428 },
  { name: "Trucks/Buses", icon: Bus, count: 105 },
  { name: "Minibus/Van", icon: Bus, count: 166 }
];

const FilterOptions = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container-custom">
        <Tabs defaultValue="bodyTypes" className="w-full">
          <TabsList className="mb-8 bg-white">
            <TabsTrigger value="bodyTypes">Popular Body Types</TabsTrigger>
            <TabsTrigger value="makes">Search By Make</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bodyTypes" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {bodyTypes.map((type) => (
                <Link 
                  key={type.name} 
                  to={`/buy-car?bodyType=${type.name}`}
                  className="group"
                >
                  <Card className="border-none hover:shadow-md transition-shadow duration-300">
                    <CardContent className="flex flex-col items-center p-4">
                      <div className="w-20 h-20 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                        <type.icon size={48} />
                      </div>
                      <p className="mt-3 text-sm font-medium text-center">
                        {type.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ({type.count})
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="makes" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6">
              {carBrands.map((brand) => (
                <Link 
                  key={brand.name} 
                  to={`/buy-car?make=${brand.name}`}
                  className="group"
                >
                  <Card className="border-none hover:shadow-md transition-shadow duration-300">
                    <CardContent className="flex items-center justify-center p-4 h-24">
                      <div className="w-16 h-16 relative">
                        <img 
                          src={brand.logo} 
                          alt={`${brand.name} logo`} 
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link 
                to="/buy-car" 
                className="text-primary text-sm hover:underline font-medium"
              >
                View All Makes →
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FilterOptions;
