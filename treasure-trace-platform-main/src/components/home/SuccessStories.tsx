
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Star component for ratings
const Star = ({ filled }: { filled: boolean }) => {
  return (
    <svg
      className={`inline-block w-5 h-5 ${filled ? "text-primary" : "text-slate-300"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
};

const SuccessStories = () => {
  const testimonials = [
    {
      initials: "JD",
      name: "John Doe",
      role: "Student",
      text: "I lost my laptop on campus and was devastated. Within 24 hours of reporting it on FindFuse, I was matched with someone who found it. The AI recognition was spot on!",
      bgColor: "bg-primary/20",
      textColor: "text-primary",
      rating: 5,
      delay: "100ms"
    },
    {
      initials: "SE",
      name: "Sarah Evans",
      role: "Professional",
      text: "I found a set of keys during my morning jog and submitted them to FindFuse. The platform connected me to the owner within hours. It feels great to help someone out!",
      bgColor: "bg-teal-100",
      textColor: "text-teal-600",
      rating: 5,
      delay: "200ms"
    },
    {
      initials: "MJ",
      name: "Mark Johnson",
      role: "Teacher",
      text: "Lost my family heirloom watch while traveling. I was sure it was gone forever, but thanks to FindFuse's detailed reporting system, it was found by another traveler.",
      bgColor: "bg-sand-100",
      textColor: "text-sand-600",
      rating: 4.5,
      delay: "300ms"
    }
  ];

  return (
    <section className="section-padding">
      <div className="content-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Success Stories</h2>
          <p className="text-xl text-slate-600">
            Real people who have successfully reunited with their lost items through our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 item-appear" 
              style={{ animationDelay: testimonial.delay }}
            >
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full ${testimonial.bgColor} flex items-center justify-center ${testimonial.textColor} font-semibold`}>
                    {testimonial.initials}
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-slate-800">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-slate-700 mb-6">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <div className="text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} filled={i < testimonial.rating} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" asChild>
            <Link to="/success-stories" className="flex items-center">
              View More Success Stories <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
