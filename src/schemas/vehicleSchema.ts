
import * as z from 'zod';
import { FormFuelType, FormVehicleStatus, DatabaseBodyType } from '@/types/vehicle';

export const vehicleFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.coerce.number().min(1900, "Year must be 1900 or later").max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  mileage: z.string().min(1, "Mileage is required"),
  color: z.string().min(1, "Color is required"),
  body_type: z.enum(["SUV", "Sedan", "Truck", "Coupe", "Van", "Hatchback"] as const),
  transmission: z.enum(["Automatic", "Manual"] as const),
  fuel_type: z.enum(["Petrol", "Diesel", "Electric", "Hybrid"] as const),
  engine_capacity: z.string().min(1, "Engine capacity is required"),
  doors: z.coerce.number().min(1, "Doors must be at least 1"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["Available", "Pending", "Sold"] as const),
  featured: z.boolean().default(false),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
