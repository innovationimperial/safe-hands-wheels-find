
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fuel, Clock, MapPin } from "lucide-react";

interface Vehicle {
  id: number;
  image: string;
  title: string;
  price: number;
  year: number;
  mileage: string;
  fuelType: string;
  transmission: string;
  location: string;
  featured: boolean;
}

const vehicles: Vehicle[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Ford Mustang GT",
    price: 45000,
    year: 2022,
    mileage: "15,000 mi",
    fuelType: "Gasoline",
    transmission: "Automatic",
    location: "Los Angeles, CA",
    featured: true
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1125&q=80",
    title: "BMW 3 Series",
    price: 38500,
    year: 2021,
    mileage: "22,000 mi",
    fuelType: "Hybrid",
    transmission: "Automatic",
    location: "San Francisco, CA",
    featured: false
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Chevrolet Corvette",
    price: 62000,
    year: 2023,
    mileage: "5,000 mi",
    fuelType: "Gasoline",
    transmission: "Manual",
    location: "Miami, FL",
    featured: true
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    title: "Tesla Model 3",
    price: 41990,
    year: 2022,
    mileage: "18,000 mi",
    fuelType: "Electric",
    transmission: "Automatic",
    location: "Austin, TX",
    featured: false
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    title: "Jeep Wrangler Unlimited",
    price: 39995,
    year: 2021,
    mileage: "25,000 mi",
    fuelType: "Gasoline",
    transmission: "Automatic",
    location: "Denver, CO",
    featured: true
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Porsche 911 Carrera",
    price: 114900,
    year: 2023,
    mileage: "2,000 mi",
    fuelType: "Gasoline",
    transmission: "PDK",
    location: "New York, NY",
    featured: false
  },
];

const FeaturedVehicles = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">Featured Vehicles</h2>
          <div className="w-20 h-1 bg-primary mb-6"></div>
          <p className="text-gray-600 max-w-2xl">
            Explore our selection of premium vehicles, handpicked by our experts. Each vehicle is thoroughly inspected to ensure quality and reliability.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card 
              key={vehicle.id} 
              className="overflow-hidden border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                    <span>{vehicle.fuelType}</span>
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
                  <Button variant="outline" className="flex-1 mr-2">
                    Details
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button className="bg-secondary hover:bg-secondary/90 px-8">View All Vehicles</Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
