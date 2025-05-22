
import HeroSearch from "@/components/home/HeroSearch";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CtaBanner from "@/components/home/CtaBanner";
import FilterOptions from "@/components/home/FilterOptions";
import Testimonials from "@/components/home/Testimonials";

const Index = () => {
  return (
    <>
      <HeroSearch />
      <FeaturedVehicles />
      <FilterOptions />
      <WhyChooseUs />
      <Testimonials />
      <CtaBanner />
    </>
  );
};

export default Index;
