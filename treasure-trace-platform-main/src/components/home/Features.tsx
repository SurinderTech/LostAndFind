
import React from "react";
import { Camera, Map, Gift, Bell, Lock, Award } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all-300 item-appear"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Camera size={28} />,
      title: "AI Image Recognition",
      description: "Advanced image matching technology to identify and connect lost items with their owners.",
      delay: 100
    },
    {
      icon: <Map size={28} />,
      title: "Location Tracking",
      description: "Precise location details to help narrow down where items were lost or found.",
      delay: 200
    },
    {
      icon: <Gift size={28} />,
      title: "Reward System",
      description: "Incentives for returning found items, including discounts and free courses.",
      delay: 300
    },
    {
      icon: <Bell size={28} />,
      title: "Real-time Notifications",
      description: "Instant alerts when a potential match is found for your lost item.",
      delay: 400
    },
    {
      icon: <Lock size={28} />,
      title: "Secure Communication",
      description: "Private and secure messaging between item finders and owners.",
      delay: 500
    },
    {
      icon: <Award size={28} />,
      title: "Personalized Rewards",
      description: "Customized rewards based on user profiles and preferences.",
      delay: 600
    }
  ];

  return (
    <section className="section-padding bg-slate-50">
      <div className="content-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Powerful Features to Help You</h2>
          <p className="text-xl text-slate-600">
            Our platform combines cutting-edge technology with community support to create the most effective lost and found solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
