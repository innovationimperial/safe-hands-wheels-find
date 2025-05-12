
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { vehicles } from "@/data/vehicles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Share2, Clock, Fuel } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const VehicleDetail = () => {
  const { id } = useParams();
  const vehicle = vehicles.find(v => v.id === parseInt(id || "0"));
  const [activeImage, setActiveImage] = useState(0);
  
  if (!vehicle) {
    return (
      <Layout>
        <div className="container-custom py-16">
          <h1 className="text-4xl font-bold mb-6">Vehicle Not Found</h1>
          <p>The vehicle you are looking for does not exist.</p>
          <Button className="mt-6" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </Layout>
    );
  }

  // Vehicle features for the table display
  const features = {
    comfort: [
      { name: "Air conditioning", value: "Yes" },
      { name: "Leather Interior", value: "Yes" },
      { name: "Electric windows", value: "Yes" },
      { name: "Cruise Control", value: "Yes" },
      { name: "Dual Zone Climate Control", value: "Yes" },
      { name: "Push to start", value: "Yes" }
    ],
    safety: [
      { name: "ABS Brakes", value: "Yes" },
      { name: "Parking Sensors", value: "Yes" },
      { name: "Park assist", value: "Yes" },
      { name: "Rear View Camera", value: "Yes" },
      { name: "Central Locking", value: "Yes" }
    ],
    tech: [
      { name: "Navigation", value: "Yes" },
      { name: "Radio", value: "Yes" },
      { name: "Automatic Boot", value: "Yes" },
      { name: "Audio Controls on Steering Wheel", value: "Yes" }
    ]
  };

  const otherDetails = [
    { name: "Body Type", value: "SUV" },
    { name: "No of Doors", value: "4" },
    { name: "Color", value: "White" },
    { name: "Transmission", value: vehicle.transmission },
    { name: "Fuel Type", value: vehicle.fuelType },
    { name: "Year", value: vehicle.year.toString() },
    { name: "Engine Capacity", value: "2.0 ltr" }
  ];

  // Include mock additional images (using the same image for demonstration)
  const galleryImages = [
    vehicle.image,
    vehicle.image,
    vehicle.image,
    vehicle.image,
    vehicle.image
  ];

  // Similar vehicles (filtering out current vehicle)
  const similarVehicles = vehicles
    .filter(v => v.id !== vehicle.id)
    .slice(0, 4);

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{vehicle.title}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin size={16} className="mr-2" />
              <span>{vehicle.location}</span>
              <span className="mx-2">•</span>
              <Clock size={16} className="mr-2" />
              <span>Last Updated: 05-05-2023</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
            <div className="text-3xl font-bold text-primary">${vehicle.price.toLocaleString()}</div>
            <Button variant="outline" size="sm" className="mt-2">
              <Share2 size={16} className="mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Image Gallery */}
        <div className="mb-8">
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {galleryImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <AspectRatio ratio={16/9} className="bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={img} 
                        alt={`${vehicle.title} - image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
              {vehicle.featured && (
                <Badge className="absolute top-4 right-4 z-10 bg-primary">
                  Featured
                </Badge>
              )}
            </Carousel>
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="mt-4">
            <div className="grid grid-cols-5 gap-2">
              {galleryImages.map((img, index) => (
                <div 
                  key={index}
                  className={`cursor-pointer rounded-md overflow-hidden border-2 ${activeImage === index ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setActiveImage(index)}
                >
                  <AspectRatio ratio={16/9} className="bg-gray-100">
                    <img 
                      src={img} 
                      alt={`${vehicle.title} - thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specs Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center text-gray-600">
              <Fuel size={20} className="mr-2" />
              <span className="text-sm">Fuel Type</span>
            </div>
            <div className="font-semibold mt-1">{vehicle.fuelType}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center text-gray-600">
              <svg width="20" height="20" className="mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2H11V22H13V2Z" fill="currentColor"/>
                <path d="M4 11C4 9.9 4.9 9 6 9H8V11H6V13H8V15H6C4.9 15 4 14.1 4 13V11ZM16 9H18C19.1 9 20 9.9 20 11V13C20 14.1 19.1 15 18 15H16V9ZM16 13H18V11H16V13Z" fill="currentColor"/>
              </svg>
              <span className="text-sm">Transmission</span>
            </div>
            <div className="font-semibold mt-1">{vehicle.transmission}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center text-gray-600">
              <svg width="20" height="20" className="mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm">Mileage</span>
            </div>
            <div className="font-semibold mt-1">{vehicle.mileage}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center text-gray-600">
              <Clock size={20} className="mr-2" />
              <span className="text-sm">Year</span>
            </div>
            <div className="font-semibold mt-1">{vehicle.year}</div>
          </div>
        </div>

        {/* Vehicle Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Vehicle Description</h2>
          <div className="mb-4">
            <p className="text-gray-700 mb-4">
              {vehicle.year} {vehicle.title.toUpperCase()}
            </p>
            <p className="text-gray-700">
              2.0 litre Petrol | {vehicle.mileage} Mileage | 6-speed {vehicle.transmission} | 
              Full Leather Interior | 7-seater | Audio And Cruise Control On Steering Wheel |
              Rear View Camera | Dual Zone Climate Control | Robust Power And Impressive Performance
            </p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Other Features</h3>
            
            <Tabs defaultValue="specs">
              <TabsList className="mb-4">
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="comfort">Comfort & Convenience</TabsTrigger>
                <TabsTrigger value="safety">Safety Features</TabsTrigger>
                <TabsTrigger value="tech">Technology</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specs">
                <Table>
                  <TableBody>
                    {otherDetails.map((detail, index) => (
                      <TableRow key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                        <TableCell className="font-medium w-1/2">{detail.name}</TableCell>
                        <TableCell>{detail.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="comfort">
                <Table>
                  <TableBody>
                    {features.comfort.map((feature, index) => (
                      <TableRow key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                        <TableCell className="font-medium w-1/2">{feature.name}</TableCell>
                        <TableCell>{feature.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="safety">
                <Table>
                  <TableBody>
                    {features.safety.map((feature, index) => (
                      <TableRow key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                        <TableCell className="font-medium w-1/2">{feature.name}</TableCell>
                        <TableCell>{feature.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="tech">
                <Table>
                  <TableBody>
                    {features.tech.map((feature, index) => (
                      <TableRow key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                        <TableCell className="font-medium w-1/2">{feature.name}</TableCell>
                        <TableCell>{feature.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Contact Seller Form */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Contact Seller</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Your email"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Your phone number"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded-md h-32"
              placeholder={`Please contact me about ${vehicle.title}`}
            ></textarea>
          </div>
          
          <Button className="w-full md:w-auto">Send Message</Button>
        </div>
        
        {/* Similar Vehicles */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Similar Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarVehicles.map(similar => (
              <Card key={similar.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <AspectRatio ratio={16/9} className="bg-gray-100">
                  <img 
                    src={similar.image}
                    alt={similar.title}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <CardContent className="p-4">
                  <h3 className="font-bold truncate">{similar.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-primary">${similar.price.toLocaleString()}</span>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/vehicle/${similar.id}`}>View</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VehicleDetail;
