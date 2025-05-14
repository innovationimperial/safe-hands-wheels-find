
// This file is kept for backward compatibility but no longer contains vehicle data
// All vehicle data is now retrieved from the Supabase database

export interface Vehicle {
  id: number;
  image: string;
  title: string;
  price: number;
  year: number;
  mileage: string;
  fuelType: string;
  transmission: string;
  location: string;
  featured: boolean;
}

// Empty array for type compatibility with any code that might still reference this
export const vehicles: Vehicle[] = [];
