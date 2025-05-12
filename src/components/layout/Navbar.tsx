
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  
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
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User size={16} />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setLoginModalOpen(true)}
            >
              <User size={16} />
              <span>Login / Register</span>
            </Button>
          )}
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
            
            {user ? (
              <>
                <div className="p-2 border-t pt-4">
                  <div className="text-sm text-muted-foreground mb-2">Logged in as {user.name}</div>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="block font-medium p-2 mb-2 hover:bg-accent rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <Button 
                className="flex items-center justify-center gap-2 w-full"
                onClick={() => {
                  setLoginModalOpen(true);
                  setIsOpen(false);
                }}
              >
                <User size={16} />
                <span>Login / Register</span>
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </nav>
  );
};

export default Navbar;
