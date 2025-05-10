
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const dealersData = [
  {
    id: 1,
    name: "Premium Auto Group",
    logo: "https://placehold.co/200x100/e6ecff/1a53ff?text=Premium+Auto",
    verified: true
  },
  {
    id: 2,
    name: "City Motors",
    logo: "https://placehold.co/200x100/e6ecff/1a53ff?text=City+Motors",
    verified: true
  },
  {
    id: 3,
    name: "Luxury Car Emporium",
    logo: "https://placehold.co/200x100/e6ecff/1a53ff?text=Luxury+Car+Emporium",
    verified: true
  },
  {
    id: 4,
    name: "AutoFlex Dealership",
    logo: "https://placehold.co/200x100/e6ecff/1a53ff?text=AutoFlex",
    verified: false
  },
  {
    id: 5,
    name: "Express Auto Sales",
    logo: "https://placehold.co/200x100/e6ecff/1a53ff?text=Express+Auto",
    verified: true
  },
  {
    id: 6,
    name: "CarHub Network",
    logo: "https://placehold.co/200x100/e6ecff/1a53ff?text=CarHub",
    verified: true
  }
];

const FeaturedDealers = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const scrollLeft = () => {
    const container = document.getElementById('dealers-container');
    if (container) {
      const newPosition = Math.max(scrollPosition - 300, 0);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  const scrollRight = () => {
    const container = document.getElementById('dealers-container');
    if (container) {
      const newPosition = Math.min(scrollPosition + 300, container.scrollWidth - container.clientWidth);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Dealers</h2>
            <div className="w-20 h-1 bg-primary"></div>
          </div>
          
          <div className="hidden md:flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
        
        <div 
          id="dealers-container"
          className="flex overflow-x-auto pb-4 scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="flex space-x-4">
            {dealersData.map((dealer) => (
              <Card 
                key={dealer.id}
                className="min-w-[250px] border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-300"
              >
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="mb-4 h-[100px] flex items-center justify-center">
                    <img 
                      src={dealer.logo} 
                      alt={`${dealer.name} logo`} 
                      className="max-h-full"
                    />
                  </div>
                  <div className="flex items-center space-x-1 mb-3">
                    <h3 className="font-medium">{dealer.name}</h3>
                    {dealer.verified && (
                      <span className="inline-flex items-center bg-accent text-primary text-xs px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <Button variant="outline" className="w-full">View Inventory</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDealers;
