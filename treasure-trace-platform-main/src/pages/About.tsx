
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="content-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-slate-800 mb-4">About FindFuse</h1>
              <p className="text-xl text-slate-600">
                We're on a mission to reunite people with their lost belongings using advanced AI technology.
              </p>
            </div>
            
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Story</h2>
              <div className="prose prose-lg max-w-none text-slate-600">
                <p>
                  FindFuse was born from a simple yet powerful idea: what if we could leverage the latest AI technology to help people find their lost items?
                </p>
                <p>
                  In 2023, our founder experienced the frustration of losing a valuable item and noticed how inefficient traditional lost and found systems were. This sparked the idea for a smarter solution that could connect people with their belongings through advanced image recognition and matching.
                </p>
                <p>
                  Today, we're proud to have helped thousands of people recover their precious items, from everyday essentials to irreplaceable sentimental treasures.
                </p>
              </div>
            </section>
            
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">What Drives Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="text-xl font-semibold text-primary mb-3">Innovation</h3>
                  <p className="text-slate-600">
                    We continuously push the boundaries of what's possible with AI to create more accurate matching systems.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="text-xl font-semibold text-primary mb-3">Community</h3>
                  <p className="text-slate-600">
                    We believe in fostering a community of helpers and creating positive connections between people.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="text-xl font-semibold text-primary mb-3">Sustainability</h3>
                  <p className="text-slate-600">
                    By helping people find their lost items, we reduce unnecessary waste and promote a more sustainable lifestyle.
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Values</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">01</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Trust & Security</h3>
                    <p className="text-slate-600">
                      We prioritize user privacy and secure communication, ensuring that your personal information is always protected.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">02</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Accessibility</h3>
                    <p className="text-slate-600">
                      We're committed to making our platform accessible to everyone, regardless of technical ability.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">03</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Recognition & Rewards</h3>
                    <p className="text-slate-600">
                      We believe in recognizing and rewarding those who take the time to help return lost items to their owners.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
