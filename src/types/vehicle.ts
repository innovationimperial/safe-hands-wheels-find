
// Database Types
export type DatabaseBodyType = "SUV" | "Sedan" | "Hatchback" | "Coupe" | "Truck" | "Van";
export type DatabaseFuelType = "Gasoline" | "Diesel" | "Hybrid" | "Electric";
export type DatabaseTransmissionType = "Automatic" | "Manual" | "PDK" | "CVT";
export type DatabaseVehicleStatus = "Available" | "Sold" | "Reserved";

// Form Types
export type FormFuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";
export type FormVehicleStatus = "Available" | "Pending" | "Sold";

// Vehicle Form Data
export interface VehicleFormData {
  title: string;
  year: number;
  price: number;
  mileage: string;
  color: string;
  body_type: DatabaseBodyType;
  transmission: "Automatic" | "Manual";
  fuel_type: FormFuelType;
  engine_capacity: string;
  doors: number;
  location: string;
  status: FormVehicleStatus;
  featured: boolean;
}

// Helper function for fuel type mapping
export const mapFuelTypeToDatabase = (formFuelType: FormFuelType): DatabaseFuelType => {
  if (formFuelType === "Petrol") {
    return "Gasoline";
  }
  return formFuelType as DatabaseFuelType;
};

export const mapFuelTypeFromDatabase = (dbFuelType: DatabaseFuelType): FormFuelType => {
  if (dbFuelType === "Gasoline") {
    return "Petrol";
  }
  return dbFuelType as FormFuelType;
};
