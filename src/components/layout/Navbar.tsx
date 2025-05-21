import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, UserPlus, Store, CarFront } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user, profile, logout, isAdmin, isDealer, isDealerApproved, isLoading } = useAuth();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
          <Link to="/sell-car" className="font-medium hover:text-primary transition-colors">
            Sell Your Car
          </Link>
          
          {!isLoading && (user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback>
                      {profile?.full_name 
                        ? getInitials(profile.full_name) 
                        : user.email ? user.email[0].toUpperCase() : 'U'
                      }
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[100px] truncate">
                    {profile?.username || user.email?.split('@')[0]}
                  </span>
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
                {isDealer && isDealerApproved && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/dealer/dashboard">
                        <CarFront className="mr-2 h-4 w-4" />
                        <span>Dealer Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dealer/add-vehicle">
                        <CarFront className="mr-2 h-4 w-4" />
                        <span>Add Vehicle</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {!isDealer && !isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/become-dealer">
                        <Store className="mr-2 h-4 w-4" />
                        <span>Become a Dealer</span>
                      </Link>
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
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setLoginModalOpen(true)}
              >
                <User size={16} />
                <span>Login</span>
              </Button>
              <Button 
                size="sm" 
                className="flex items-center gap-2"
                asChild
              >
                <Link to="/auth">
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </Link>
              </Button>
            </div>
          ))}
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
              to="/sell-car" 
              className="font-medium p-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sell Your Car
            </Link>
            
            {!isLoading && (user ? (
              <div className="p-2 border-t pt-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback>
                      {profile?.full_name 
                        ? getInitials(profile.full_name) 
                        : user.email ? user.email[0].toUpperCase() : 'U'
                      }
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block font-medium p-2 mb-2 hover:bg-accent rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

                {isDealer && isDealerApproved && (
                  <>
                    <Link 
                      to="/dealer/dashboard" 
                      className="block font-medium p-2 mb-2 hover:bg-accent rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center">
                        <CarFront className="mr-2 h-4 w-4" />
                        <span>Dealer Dashboard</span>
                      </div>
                    </Link>
                    <Link 
                      to="/dealer/add-vehicle" 
                      className="block font-medium p-2 mb-2 hover:bg-accent rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center">
                        <CarFront className="mr-2 h-4 w-4" />
                        <span>Add Vehicle</span>
                      </div>
                    </Link>
                  </>
                )}

                {!isDealer && !isAdmin && (
                  <Link 
                    to="/become-dealer" 
                    className="block font-medium p-2 mb-2 hover:bg-accent rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center">
                      <Store className="mr-2 h-4 w-4" />
                      <span>Become a Dealer</span>
                    </div>
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
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Button 
                  className="flex items-center justify-center gap-2 w-full"
                  onClick={() => {
                    setLoginModalOpen(true);
                    setIsOpen(false);
                  }}
                  variant="outline"
                >
                  <User size={16} />
                  <span>Login</span>
                </Button>
                <Button
                  className="flex items-center justify-center gap-2 w-full"
                  onClick={() => setIsOpen(false)}
                  asChild
                >
                  <Link to="/auth">
                    <UserPlus size={16} />
                    <span>Sign Up</span>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </nav>
  );
};

export default Navbar;
