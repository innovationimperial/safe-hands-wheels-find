
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type TestimonialProps = {
  text: string;
  author: string;
  role: string;
  imageUrl?: string;
}

const TestimonialCard = ({ text, author, role, imageUrl }: TestimonialProps) => {
  const initials = author
    .split(' ')
    .map(name => name[0])
    .join('');

  return (
    <Card className="h-full bg-white shadow-md">
      <CardContent className="pt-6 flex flex-col h-full">
        <div className="mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="45" 
            height="36" 
            viewBox="0 0 45 36" 
            className="text-primary/30"
            fill="currentColor"
          >
            <path d="M13.415 0.279999C5.63 3.548 0.5 10.344 0.5 19.756C0.5 28.212 6.796 35.5 15.028 35.5C22.579 35.5 27.415 30.044 27.415 23.024C27.415 15.708 21.931 10.776 15.243 10.776C14.167 10.776 12.663 11.1 12.231 11.316C13.307 6.832 17.499 3.332 22.255 2.2L13.415 0.279999ZM35.964 0.279999C28.179 3.548 23.049 10.344 23.049 19.756C23.049 28.212 29.345 35.5 37.577 35.5C45.128 35.5 50 30.044 50 23.024C50 15.708 44.48 10.776 37.792 10.776C36.716 10.776 35.212 11.1 34.78 11.316C35.856 6.832 40.048 3.332 44.804 2.2L35.964 0.279999Z" />
          </svg>
        </div>
        <p className="text-gray-700 flex-grow">{text}</p>
        <div className="flex items-center mt-6">
          <Avatar className="h-10 w-10 mr-3">
            {imageUrl && <AvatarImage src={imageUrl} alt={author} />}
            <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      text: "I found my dream car through SafeHands. The vehicle was in excellent condition just as described, and the entire process was smooth and transparent.",
      author: "Michael Johnson",
      role: "Happy Customer",
    },
    {
      text: "The variety of vehicles available is impressive. I was able to find exactly what I needed within my budget. Highly recommend their services!",
      author: "Sarah Williams",
      role: "Repeat Customer",
    },
    {
      text: "Their team was professional and helped me every step of the way. I was particularly impressed with how they handled all the paperwork.",
      author: "David Chen",
      role: "First-time Buyer",
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our customers have to say about their experience with us.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              text={testimonial.text}
              author={testimonial.author}
              role={testimonial.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
