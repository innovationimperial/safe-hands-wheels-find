
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container-custom flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-primary font-bold text-2xl">Safe</span>
          <span className="text-secondary font-bold text-2xl ml-1">Hands</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/buy-car" className="font-medium hover:text-primary transition-colors">
            Buy A Car
          </Link>
          <Link to="/find-dealer" className="font-medium hover:text-primary transition-colors">
            Find a Dealer
          </Link>
          <Link to="/sell-car" className="font-medium hover:text-primary transition-colors">
            Sell Your Car
          </Link>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <User size={16} />
            <span>Login / Register</span>
          </Button>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md absolute w-full animate-fade-in">
          <div className="container py-4 flex flex-col space-y-4">
            <Link 
              to="/buy-car" 
              className="font-medium p-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Buy A Car
            </Link>
            <Link 
              to="/find-dealer" 
              className="font-medium p-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Find a Dealer
            </Link>
            <Link 
              to="/sell-car" 
              className="font-medium p-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sell Your Car
            </Link>
            <Button className="flex items-center justify-center gap-2 w-full">
              <User size={16} />
              <span>Login / Register</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
