
import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Pencil, 
  Trash, 
  Plus, 
  Eye, 
  MoreVertical, 
  Star,
  Download,
  Upload,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define our vehicle type based on Supabase structure
interface Vehicle {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: string;
  fuel_type: string;
  transmission: string;
  location: string;
  featured: boolean;
  image: string;
  status: 'Available' | 'Sold' | 'Reserved';
}

const AdminVehicles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [deleteVehicleId, setDeleteVehicleId] = useState<string | null>(null);
  
  // Fetch vehicles from Supabase
  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as Vehicle[];
    },
    enabled: !!session
  });
  
  // Filtered vehicles based on search term
  const filteredVehicles = vehicles?.filter(vehicle => 
    vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.fuel_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Feature/unfeature vehicle mutation
  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string, featured: boolean }) => {
      const { error } = await supabase
        .from('vehicles')
        .update({ featured })
        .eq('id', id);
      
      if (error) throw error;
      return { id, featured };
    },
    onSuccess: (data) => {
      toast({
        title: `Vehicle ${data.featured ? 'featured' : 'unfeatured'}`,
        description: `The vehicle has been ${data.featured ? 'featured' : 'removed from featured listings'}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update featured status: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete vehicle mutation
  const deleteVehicleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Vehicle deleted",
        description: "The vehicle has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setDeleteVehicleId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete vehicle: ${error.message}`,
        variant: "destructive"
      });
      setDeleteVehicleId(null);
    }
  });

  // Toggle featured status
  const handleToggleFeatured = (id: string, currentFeatured: boolean) => {
    toggleFeatureMutation.mutate({ id, featured: !currentFeatured });
  };

  // Delete vehicle
  const handleDeleteVehicle = (id: string) => {
    setDeleteVehicleId(id);
  };

  const confirmDelete = () => {
    if (deleteVehicleId) {
      deleteVehicleMutation.mutate(deleteVehicleId);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold">Vehicle Management</h1>
          <div className="flex gap-4">
            <Link to="/admin/vehicles/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-md border shadow-sm">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="w-full sm:max-w-xs">
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-8 text-center flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Loading vehicles...</p>
              </div>
            ) : error ? (
              <div className="py-8 text-center flex flex-col items-center gap-2 text-red-500">
                <AlertCircle className="h-8 w-8" />
                <p>Failed to load vehicles. Please try again.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['vehicles'] })}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">No vehicles found.</p>
                <Button 
                  variant="link" 
                  onClick={() => navigate("/admin/vehicles/add")}
                  className="mt-2"
                >
                  Add your first vehicle
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Mileage</TableHead>
                    <TableHead>Fuel</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div className="w-12 h-10 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={vehicle.image} 
                            alt={vehicle.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{vehicle.title}</div>
                          <div className="text-xs text-gray-500">{vehicle.transmission}</div>
                        </div>
                      </TableCell>
                      <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>{vehicle.mileage}</TableCell>
                      <TableCell>{vehicle.fuel_type}</TableCell>
                      <TableCell>{vehicle.location}</TableCell>
                      <TableCell>
                        {vehicle.featured ? (
                          <Badge className="bg-amber-500">Featured</Badge>
                        ) : (
                          <Badge variant="outline">Standard</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/vehicle/${vehicle.id}`} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/vehicles/edit/${vehicle.id}`} className="cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleFeatured(vehicle.id, vehicle.featured)}
                              disabled={toggleFeatureMutation.isPending}
                            >
                              <Star className="mr-2 h-4 w-4" />
                              <span>{vehicle.featured ? "Remove Featured" : "Set Featured"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              disabled={deleteVehicleMutation.isPending}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredVehicles.length} of {vehicles?.length || 0} vehicles
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation dialog for delete */}
      <AlertDialog 
        open={!!deleteVehicleId} 
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteVehicleId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vehicle? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={deleteVehicleMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteVehicleMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminVehicles;
