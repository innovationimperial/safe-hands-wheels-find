
import Layout from "@/components/layout/Layout";
import HeroSearch from "@/components/home/HeroSearch";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CtaBanner from "@/components/home/CtaBanner";
import FilterOptions from "@/components/home/FilterOptions";

const Index = () => {
  return (
    <Layout>
      <HeroSearch />
      <FeaturedVehicles />
      <FilterOptions />
      <WhyChooseUs />
      <CtaBanner />
    </Layout>
  );
};

export default Index;
