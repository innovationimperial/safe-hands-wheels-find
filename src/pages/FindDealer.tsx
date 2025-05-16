
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Search,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample dealer data
const dealersData = [
  {
    id: 1,
    name: "Premium Auto Group",
    address: "123 Main Street",
    city: "San Francisco",
    state: "California",
    zip: "94105",
    phone: "(415) 555-1234",
    email: "info@premiumauto.com",
    website: "https://premiumauto.example.com",
    status: "Verified",
    description: "Luxury and premium vehicle specialists with over 20 years of experience.",
    logo: "https://placehold.co/200x100/e6ecff/1a53ff?text=Premium+Auto",
  },
  {
    id: 2,
    name: "City Motors",
    address: "456 Market Street",
    city: "Los Angeles",
    state: "California",
    zip: "90007",
    phone: "(213) 555-6789",
    email: "sales@citymotors.com",
    website: "https://citymotors.example.com",
    status: "Verified",
    description: "Family-owned dealership offering a wide range of new and used vehicles.",
    logo: "https://placehold.co/200x100/e6ecff/1a53ff?text=City+Motors",
  },
  {
    id: 3,
    name: "Luxury Car Emporium",
    address: "789 Oak Avenue",
    city: "San Diego",
    state: "California",
    zip: "92101",
    phone: "(619) 555-4321",
    email: "contact@luxurycars.com",
    website: "https://luxurycars.example.com",
    status: "Verified",
    description: "Exclusive luxury and exotic car dealership with personalized service.",
    logo: "https://placehold.co/200x100/e6ecff/1a53ff?text=Luxury+Car+Emporium",
  },
  {
    id: 4,
    name: "AutoFlex Dealership",
    address: "321 Pine Street",
    city: "Sacramento",
    state: "California",
    zip: "95814",
    phone: "(916) 555-8765",
    email: "info@autoflex.com",
    website: "https://autoflex.example.com",
    status: "Pending",
    description: "Offering flexible financing options and a diverse inventory of vehicles.",
    logo: "https://placehold.co/200x100/e6ecff/1a53ff?text=AutoFlex",
  },
  {
    id: 5,
    name: "Express Auto Sales",
    address: "987 Cedar Boulevard",
    city: "San Jose",
    state: "California",
    zip: "95112",
    phone: "(408) 555-2345",
    email: "sales@expressauto.com",
    website: "https://expressauto.example.com",
    status: "Verified",
    description: "Quick and hassle-free car buying experience with competitive prices.",
    logo: "https://placehold.co/200x100/e6ecff/1a53ff?text=Express+Auto",
  },
  {
    id: 6,
    name: "CarHub Network",
    address: "654 Willow Lane",
    city: "Oakland",
    state: "California",
    zip: "94607",
    phone: "(510) 555-7890",
    email: "support@carhub.com",
    website: "https://carhub.example.com",
    status: "Verified",
    description: "Largest network of pre-owned vehicles with nationwide shipping options.",
    logo: "https://placehold.co/200x100/e6ecff/1a53ff?text=CarHub",
  },
];

const FindDealer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  
  // Filter dealers based on search term and filters
  const filteredDealers = dealersData.filter((dealer) => {
    const matchesSearch = dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dealer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dealer.address.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesState = selectedState === "all" || dealer.state === selectedState;
    const matchesCity = selectedCity === "all" || dealer.city === selectedCity;
    
    return matchesSearch && matchesState && matchesCity;
  });
  
  // Get unique states for filter
  const states = Array.from(new Set(dealersData.map(dealer => dealer.state)));
  
  // Get unique cities based on selected state
  const cities = Array.from(new Set(
    dealersData
      .filter(dealer => selectedState === "all" || dealer.state === selectedState)
      .map(dealer => dealer.city)
  ));

  return (
    <Layout>
      <div className="container-custom py-16">
        <h1 className="text-4xl font-bold mb-2">Find a Dealer</h1>
        <p className="text-lg text-gray-600 mb-8">
          Locate trusted car dealers in your area.
        </p>
        
        {/* Search and filter section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search dealers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Dealer map section - placeholder */}
        <div className="relative bg-accent h-[300px] md:h-[400px] rounded-lg mb-8 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?auto=format&fit=crop&q=80&ixlib=rb-4.0.3" 
              alt="Map background"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="relative z-10 text-center p-8">
            <h3 className="text-2xl font-bold mb-4">Interactive Map Coming Soon</h3>
            <p className="max-w-md text-gray-700 mx-auto">
              We're working on an interactive map to make finding dealers even easier.
              For now, you can browse our list of dealers below.
            </p>
          </div>
        </div>
        
        {/* Dealers list */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">
            {filteredDealers.length} Dealers Found
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDealers.length > 0 ? (
              filteredDealers.map((dealer) => (
                <Card key={dealer.id} className="overflow-hidden border-gray-100 hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      <div className="w-24 h-16 mr-4 flex-shrink-0 flex items-center justify-center bg-gray-50 border rounded">
                        <img 
                          src={dealer.logo} 
                          alt={`${dealer.name} logo`} 
                          className="max-h-full max-w-full p-1"
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-bold text-lg">{dealer.name}</h3>
                          {dealer.status === "Verified" && (
                            <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" /> Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {dealer.city}, {dealer.state}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {dealer.description}
                    </p>
                    
                    <div className="grid grid-cols-1 gap-2 text-sm mb-4">
                      <p className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        {dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}
                      </p>
                      <p className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        {dealer.phone}
                      </p>
                      <p className="flex items-center text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        {dealer.email}
                      </p>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" className="flex-1 mr-2">
                        View Inventory
                      </Button>
                      <Button className="flex-1 bg-primary hover:bg-primary/90" asChild>
                        <a href={dealer.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                          Website <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No dealers found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchTerm("");
                  setSelectedState("all");
                  setSelectedCity("all");
                }}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FindDealer;
