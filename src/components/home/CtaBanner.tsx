
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaBanner = () => {
  return (
    <section 
      className="relative py-20 bg-gray-900 overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container-custom text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Vehicle?
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Browse thousands of cars from verified dealers across the country.
            Start your search today and drive home your dream car tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-primary hover:bg-primary/90 text-lg py-6 px-8" asChild>
              <Link to="/buy-car">
                Browse Vehicles
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white/20 text-lg py-6 px-8"
              asChild
            >
              <Link to="/sell-car">
                Sell Your Car
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
