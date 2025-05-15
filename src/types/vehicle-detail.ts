
export interface Vehicle {
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
  body_type: string;
  doors: number;
  color: string;
  engine_capacity: string;
  status?: string;
}

export interface VehicleImage {
  image_url: string;
}

export interface VehicleFeature {
  category: string;
  feature: string;
  value: boolean;
}
