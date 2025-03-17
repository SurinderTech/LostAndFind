
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Camera, Search, Bell, Award, Shield, Headphones, Zap, FileCheck, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isPremium?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, isPremium = false }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 relative">
      {isPremium && (
        <Badge className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600">Premium</Badge>
      )}
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 mb-4">{description}</p>
    </div>
  );
};

const Services = () => {
  const coreServices = [
    {
      icon: <Camera className="text-primary" size={24} />,
      title: "AI Image Recognition",
      description: "Our advanced image recognition technology helps identify lost items with high accuracy, matching them with found reports.",
      isPremium: false
    },
    {
      icon: <Search className="text-primary" size={24} />,
      title: "Smart Matching",
      description: "Our algorithm considers multiple factors like location, time, item description, and images to find the most likely matches.",
      isPremium: false
    },
    {
      icon: <Bell className="text-primary" size={24} />,
      title: "Real-time Notifications",
      description: "Receive instant alerts when potential matches are found for your lost items or when someone claims an item you reported.",
      isPremium: false
    }
  ];

  const premiumServices = [
    {
      icon: <Zap className="text-primary" size={24} />,
      title: "Priority Matching",
      description: "Premium users' lost items get priority in the matching queue, increasing chances of recovery by up to 40%.",
      isPremium: true
    },
    {
      icon: <ImagePlus className="text-primary" size={24} />,
      title: "Enhanced Image Analysis",
      description: "Premium access to our advanced neural network that can identify items even from partial images or unusual angles.",
      isPremium: true
    },
    {
      icon: <FileCheck className="text-primary" size={24} />,
      title: "Verified Ownership",
      description: "Premium users can establish verified ownership status, making the claiming process faster and more secure.",
      isPremium: true
    }
  ];

  const communityServices = [
    {
      icon: <Award className="text-primary" size={24} />,
      title: "Reward System",
      description: "Earn rewards for returning found items, including discounts on courses, job referrals, and other benefits tailored to your profile.",
      isPremium: false
    },
    {
      icon: <Shield className="text-primary" size={24} />,
      title: "Secure Communication",
      description: "Our platform enables safe communication between item finders and owners without sharing personal contact information.",
      isPremium: false
    },
    {
      icon: <Headphones className="text-primary" size={24} />,
      title: "24/7 Support",
      description: "Our customer support team is available around the clock to assist with any issues or questions you may have.",
      isPremium: false
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "0",
      period: "forever",
      description: "Basic features for occasional use",
      features: [
        "Up to 3 lost item reports per month",
        "Basic AI image matching",
        "Standard notification alerts",
        "Community rewards program"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      linkTo: "/signup",
      highlighted: false
    },
    {
      name: "Premium",
      price: "9.99",
      period: "monthly",
      description: "Enhanced features for frequent users",
      features: [
        "Unlimited lost item reports",
        "Priority matching algorithm",
        "Advanced AI image analysis",
        "Instant push notifications",
        "Dedicated support agent",
        "Verified ownership status",
        "30-day item history"
      ],
      buttonText: "Upgrade Now",
      buttonVariant: "default" as const,
      linkTo: "/pricing",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Contact us",
      period: "",
      description: "Custom solutions for organizations",
      features: [
        "All Premium features",
        "Custom branding",
        "API access",
        "Batch reporting",
        "Analytics dashboard",
        "Multiple admin accounts",
        "On-site training"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      linkTo: "/contact",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="content-container">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Our Services</h1>
            <p className="text-xl text-slate-600">
              FindFuse offers a comprehensive set of services to help you find your lost items or return items you've found.
            </p>
            <div className="flex justify-center mt-6 gap-4">
              <Button asChild>
                <Link to="/match-search">Try AI Matching Now</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/lost-item">Report a Lost Item</Link>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all-features" className="mb-16">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="all-features">All Features</TabsTrigger>
              <TabsTrigger value="free">Free</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-features">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...coreServices, ...premiumServices, ...communityServices].map((service, index) => (
                  <ServiceCard 
                    key={index}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    isPremium={service.isPremium}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="free">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...coreServices, ...communityServices].filter(s => !s.isPremium).map((service, index) => (
                  <ServiceCard 
                    key={index}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="premium">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {premiumServices.map((service, index) => (
                  <ServiceCard 
                    key={index}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    isPremium={true}
                  />
                ))}
              </div>
              
              <div className="text-center mt-8 mb-4">
                <Button asChild size="lg">
                  <Link to="/pricing">Upgrade to Premium</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Choose Your Plan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <Card key={index} className={`overflow-hidden ${plan.highlighted ? 'border-primary shadow-md' : 'border-slate-200'}`}>
                  {plan.highlighted && (
                    <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className={`${plan.highlighted ? 'bg-primary/5' : ''}`}>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline mt-2">
                      <span className="text-3xl font-bold">{typeof plan.price === 'string' ? plan.price : `$${plan.price}`}</span>
                      {plan.period && <span className="text-sm text-slate-500 ml-1">/{plan.period}</span>}
                    </div>
                    <CardDescription className="mt-1.5">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                          </div>
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.buttonVariant}
                      asChild
                    >
                      <Link to={plan.linkTo}>{plan.buttonText}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">How Our AI Matching Works</h2>
            
            <div className="bg-slate-50 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <ImagePlus className="text-primary" size={28} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Image Upload</h3>
                  <p className="text-sm text-slate-600">Upload a photo of your lost item or a similar reference image</p>
                </div>
                
                <div className="md:col-span-1 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="text-primary" size={28} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">AI Analysis</h3>
                  <p className="text-sm text-slate-600">Our AI identifies the item type, color, brand, and distinctive features</p>
                </div>
                
                <div className="md:col-span-1 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Search className="text-primary" size={28} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Smart Matching</h3>
                  <p className="text-sm text-slate-600">We compare against our database to find the most likely matches</p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Button asChild>
                  <Link to="/match-search">Try AI Matching Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
