
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="section-padding bg-primary text-white">
      <div className="content-container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white mb-6">
            <span className="text-sm font-medium">Stay Connected</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          
          <p className="text-lg text-white/80 mb-8">
            Get the latest updates, news, and special offers sent directly to your inbox.
          </p>
          
          <div className="max-w-md mx-auto">
            <form className="flex gap-3">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white"
              />
              <Button variant="secondary" className="flex items-center gap-2">
                Subscribe <Send size={16} />
              </Button>
            </form>
            <p className="text-sm text-white/60 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
