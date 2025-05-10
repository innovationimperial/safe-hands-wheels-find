
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";

type VehicleType = 'cars' | 'bikes' | 'boats' | 'trailers';

const HeroSearch = () => {
  const [activeTab, setActiveTab] = useState<VehicleType>('cars');
  
  const tabs: { value: VehicleType; label: string }[] = [
    { value: 'cars', label: 'Cars' },
    { value: 'bikes', label: 'Bikes' },
    { value: 'boats', label: 'Boats' },
    { value: 'trailers', label: 'Trailers' },
  ];

  return (
    <section className="relative h-[600px] md:h-[700px] bg-gray-900 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1535360392524-59acbfbd0aad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          backgroundPosition: "center 40%",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      {/* Content */}
      <div className="container-custom relative h-full flex flex-col justify-center items-center">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-center animate-fade-in">
          Search For New & Used Cars
        </h1>
        
        {/* Search Container */}
        <div className="w-full max-w-4xl bg-primary bg-opacity-90 rounded-lg p-6 shadow-xl animate-scale-in">
          {/* Tab Navigation */}
          <div className="flex mb-6 border-b border-white border-opacity-20">
            {tabs.map(tab => (
              <button
                key={tab.value}
                className={`px-4 py-2 mr-2 font-medium text-sm transition-colors ${
                  activeTab === tab.value
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/70 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Search Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toyota">Toyota</SelectItem>
                  <SelectItem value="honda">Honda</SelectItem>
                  <SelectItem value="ford">Ford</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="camry">Camry</SelectItem>
                  <SelectItem value="corolla">Corolla</SelectItem>
                  <SelectItem value="civic">Civic</SelectItem>
                  <SelectItem value="accord">Accord</SelectItem>
                  <SelectItem value="f150">F-150</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Min Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5000">$5,000</SelectItem>
                  <SelectItem value="10000">$10,000</SelectItem>
                  <SelectItem value="20000">$20,000</SelectItem>
                  <SelectItem value="30000">$30,000</SelectItem>
                  <SelectItem value="40000">$40,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Max Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10000">$10,000</SelectItem>
                  <SelectItem value="20000">$20,000</SelectItem>
                  <SelectItem value="30000">$30,000</SelectItem>
                  <SelectItem value="40000">$40,000</SelectItem>
                  <SelectItem value="50000">$50,000</SelectItem>
                  <SelectItem value="100000">$100,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Search Button */}
          <Button 
            className="w-full mt-6 bg-secondary hover:bg-secondary/90 text-white py-6 text-lg flex items-center justify-center gap-2"
          >
            <Search size={20} />
            <span>Search</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
