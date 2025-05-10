
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
  
  const tabs: { value: VehicleType; label: string; icon: string }[] = [
    { value: 'cars', label: 'CARS', icon: '🚗' },
    { value: 'bikes', label: 'BIKES', icon: '🏍️' },
    { value: 'boats', label: 'BOATS', icon: '🚤' },
    { value: 'trailers', label: 'TRAILERS', icon: '🚛' },
  ];

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1535360392524-59acbfbd0aad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          backgroundPosition: "center 40%",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="container-custom relative h-full flex flex-col justify-center items-start">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-8 max-w-xl animate-fade-in">
          Search For New & Used Cars
        </h1>
        
        {/* Search Container */}
        <div className="w-full max-w-2xl bg-primary bg-opacity-95 rounded-lg shadow-xl animate-scale-in">
          {/* Tab Navigation */}
          <div className="flex bg-blue-600 rounded-t-lg">
            {tabs.map(tab => (
              <button
                key={tab.value}
                className={`flex-1 px-4 py-3 font-medium text-sm uppercase transition-colors text-center ${
                  activeTab === tab.value
                    ? 'bg-blue-700 text-white'
                    : 'text-white/90 hover:bg-blue-700/80'
                }`}
                onClick={() => setActiveTab(tab.value)}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Search Fields */}
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-5 text-lg flex items-center justify-center gap-2"
            >
              <Search size={20} />
              <span>Search</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
