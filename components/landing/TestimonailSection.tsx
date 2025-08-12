import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  text: string;
  author: string;
  stars: number;
}

interface TestimonialSectionProps {
  testimonials?: Testimonial[];
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({ 
  testimonials = [
    {
      text: "The 'protein + random stuff' situation is my life! This actually gave me a recipe I could make with what I had.",
      author: "Sarah M., Mom of 3",
      stars: 5
    },
    {
      text: "Weekly planning used to stress me out. Now I spend 20 minutes on Sunday and I'm set for the week.",
      author: "Mike T., Dad of 2",
      stars: 5
    }
  ]
}) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Real Families, Real Solutions</h2>
        <p className="text-xl text-gray-600 mb-12">
          Join families who've turned their dinner stress into family connection time.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "{testimonial.text}"
              </p>
              <p className="text-gray-900 font-semibold">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};