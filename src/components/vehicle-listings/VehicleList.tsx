
import React from "react";
import { Vehicle } from "@/types/vehicle-detail";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Edit, Eye, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface VehicleListProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, isLoading }) => {
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting vehicle:", error);
        toast({
          title: "Error",
          description: "Failed to delete vehicle",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      });
      // Refresh the page or update the vehicle list
      window.location.reload();
    } catch (error) {
      console.error("Unexpected error deleting vehicle:", error);
      toast({
        title: "Error",
        description: "Unexpected error occurred while deleting vehicle",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableCaption>A list of your vehicles.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">No vehicles found.</TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <img
                    src={vehicle.image}
                    alt={vehicle.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell>{vehicle.title}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>${vehicle.price}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{vehicle.status || "Available"}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link to={`/vehicle/${vehicle.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link to={`/dealer/edit-vehicle/${vehicle.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(vehicle.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
              {vehicles.length} Vehicles
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default VehicleList;
