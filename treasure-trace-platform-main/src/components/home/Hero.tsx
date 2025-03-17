
import React from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-teal-100 rounded-full opacity-30 blur-3xl" />
      <div className="absolute top-1/2 -left-24 w-64 h-64 bg-primary rounded-full opacity-20 blur-3xl" />
      
      <div className="content-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/30 text-primary mb-6 animate-fade-in">
            <span className="text-sm font-medium">AI-Powered Lost & Found Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight mb-6 animate-slide-down">
            Reunite with Your <span className="text-primary">Lost Treasures</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 animate-slide-down" style={{ animationDelay: "100ms" }}>
            Our advanced AI matching technology helps you find your lost items and connect with people who found them, creating a community of helping hands.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-down" style={{ animationDelay: "200ms" }}>
            <Button size="lg" asChild>
              <Link to="/lost-item" className="flex items-center gap-2">
                <Search size={18} /> Report Lost Item
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/found-item" className="flex items-center gap-2">
                Report Found Item <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary mb-1">98%</span>
              <span className="text-sm text-slate-600">Match Accuracy</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary mb-1">5k+</span>
              <span className="text-sm text-slate-600">Items Found</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary mb-1">10k+</span>
              <span className="text-sm text-slate-600">Active Users</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary mb-1">24/7</span>
              <span className="text-sm text-slate-600">Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
