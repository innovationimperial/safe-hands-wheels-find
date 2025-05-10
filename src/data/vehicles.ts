
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

export const vehicles: Vehicle[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Ford Mustang GT",
    price: 45000,
    year: 2022,
    mileage: "15,000 mi",
    fuelType: "Gasoline",
    transmission: "Automatic",
    location: "Los Angeles, CA",
    featured: true
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1125&q=80",
    title: "BMW 3 Series",
    price: 38500,
    year: 2021,
    mileage: "22,000 mi",
    fuelType: "Hybrid",
    transmission: "Automatic",
    location: "San Francisco, CA",
    featured: false
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Chevrolet Corvette",
    price: 62000,
    year: 2023,
    mileage: "5,000 mi",
    fuelType: "Gasoline",
    transmission: "Manual",
    location: "Miami, FL",
    featured: true
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    title: "Tesla Model 3",
    price: 41990,
    year: 2022,
    mileage: "18,000 mi",
    fuelType: "Electric",
    transmission: "Automatic",
    location: "Austin, TX",
    featured: false
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    title: "Jeep Wrangler Unlimited",
    price: 39995,
    year: 2021,
    mileage: "25,000 mi",
    fuelType: "Gasoline",
    transmission: "Automatic",
    location: "Denver, CO",
    featured: true
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Porsche 911 Carrera",
    price: 114900,
    year: 2023,
    mileage: "2,000 mi",
    fuelType: "Gasoline",
    transmission: "PDK",
    location: "New York, NY",
    featured: false
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1520608760-eff2c38b06d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "2015 Kia Sorento",
    price: 16500,
    year: 2015,
    mileage: "111,000 km",
    fuelType: "Petrol",
    transmission: "Automatic",
    location: "Harare",
    featured: false
  }
];
