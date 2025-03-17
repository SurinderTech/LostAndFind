
import React from "react";
import { Camera, Search, MessageCircle, Award } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Camera className="text-primary" size={28} />,
      title: "Upload Details",
      description: "Take clear photos and provide detailed information about your lost or found item.",
      color: "bg-primary/10",
      textColor: "text-primary"
    },
    {
      icon: <Search className="text-teal-500" size={28} />,
      title: "AI Matching",
      description: "Our advanced AI algorithms work to match lost items with found reports.",
      color: "bg-teal-100",
      textColor: "text-teal-500"
    },
    {
      icon: <MessageCircle className="text-sand-600" size={28} />,
      title: "Connect & Communicate",
      description: "Get notified when there's a match and safely communicate with the other party.",
      color: "bg-sand-100",
      textColor: "text-sand-600"
    },
    {
      icon: <Award className="text-slate-600" size={28} />,
      title: "Collect Rewards",
      description: "Earn rewards for returning items and helping others in the community.",
      color: "bg-slate-100",
      textColor: "text-slate-600"
    }
  ];

  return (
    <section className="section-padding">
      <div className="content-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">How It Works</h2>
          <p className="text-xl text-slate-600">
            A simple, streamlined process to help reunite people with their lost items.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connection line */}
          <div className="absolute top-24 left-1/2 w-[1px] h-[calc(100%-8rem)] -translate-x-1/2 bg-slate-200 hidden md:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-24 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex items-start item-appear"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center flex-shrink-0 mr-5 shadow-sm`}>
                  {step.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${step.textColor} mb-2`}>
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
