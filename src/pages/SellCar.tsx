
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const SellCar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated, redirect them to the admin vehicles page
    if (isAuthenticated) {
      navigate("/admin/vehicles");
    }
  }, [isAuthenticated, navigate]);

  // If the user is authenticated, this won't be seen as they'll be redirected
  return (
    <div className="container-custom py-16">
      <h1 className="text-4xl font-bold mb-6">Sell Your Car</h1>
      <p className="text-lg text-gray-600 mb-8">
        List your vehicle for sale and reach thousands of potential buyers.
      </p>
      <div className="bg-accent p-8 rounded-lg flex flex-col items-center">
        <p className="text-center text-lg mb-6">
          Please sign in to list your vehicle for sale.
        </p>
        <Button 
          onClick={() => navigate("/auth")}
          className="px-8 py-2"
        >
          Sign in or Register
        </Button>
      </div>
    </div>
  );
};

export default SellCar;
