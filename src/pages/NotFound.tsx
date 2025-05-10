
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container-custom py-20 min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-lg">
          <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
          <p className="text-2xl font-semibold text-secondary mb-6">
            Oops! Page not found
          </p>
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <Button asChild size="lg">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
