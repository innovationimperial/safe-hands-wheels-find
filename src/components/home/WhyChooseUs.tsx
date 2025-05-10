
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Headset } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Trusted Dealers",
    description: "All our dealers are thoroughly vetted and maintain high standards of service and vehicle quality."
  },
  {
    icon: Award,
    title: "Quality Vehicles",
    description: "Each vehicle undergoes a comprehensive inspection process to ensure reliability and safety."
  },
  {
    icon: Headset,
    title: "24/7 Support",
    description: "Our customer service team is available around the clock to assist with any questions or concerns."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Why Choose Safe Hands</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            At Safe Hands Car Sale, we prioritize trust, quality, and customer satisfaction. 
            Here's why thousands of customers choose us for their vehicle purchases.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-accent rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <feature.icon size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 bg-primary/5 rounded-xl p-8 border border-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Commitment to You</h3>
              <p className="text-gray-600 mb-4">
                At Safe Hands Car Sale, we understand that purchasing a vehicle is a significant decision. 
                That's why we're committed to providing you with a seamless, transparent, and trustworthy experience.
              </p>
              <p className="text-gray-600">
                With our extensive network of verified dealers, secure platform, and dedicated customer support, 
                you can find your next vehicle with complete confidence.
              </p>
            </div>
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1565043666747-69f6646db940?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                alt="Handshake with car keys" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
