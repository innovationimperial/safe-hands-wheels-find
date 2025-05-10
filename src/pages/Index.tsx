
import Layout from "@/components/layout/Layout";
import HeroSearch from "@/components/home/HeroSearch";
import FeaturedDealers from "@/components/home/FeaturedDealers";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CtaBanner from "@/components/home/CtaBanner";

const Index = () => {
  return (
    <Layout>
      <HeroSearch />
      <FeaturedDealers />
      <FeaturedVehicles />
      <WhyChooseUs />
      <CtaBanner />
    </Layout>
  );
};

export default Index;
