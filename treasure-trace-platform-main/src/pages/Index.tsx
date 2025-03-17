
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Team from "@/components/home/Team";
import Newsletter from "@/components/home/Newsletter";
import SuccessStories from "@/components/home/SuccessStories";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <Hero />
        
        {/* How it works section */}
        <HowItWorks />
        
        {/* Features section */}
        <Features />
        
        {/* Testimonials section */}
        <SuccessStories />
        
        {/* Team section */}
        <Team />
        
        {/* Newsletter section */}
        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
