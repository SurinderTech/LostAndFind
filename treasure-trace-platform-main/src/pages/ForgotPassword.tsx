
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getUserByEmail } from "@/utils/localStorageDB";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if user exists
      const existingUser = getUserByEmail(email);
      
      // In a real app, we would send a password reset email here
      // For now, we'll just show a success message if the email exists
      
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        
        toast({
          title: "Recovery Email Sent",
          description: "If an account exists with this email, you'll receive password reset instructions.",
        });
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="content-container">
          <div className="max-w-md mx-auto">
            <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-all-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-slate-800">Recover Your Password</CardTitle>
                <CardDescription>
                  {!isSubmitted 
                    ? "Enter your email address and we'll send you instructions to reset your password" 
                    : "Check your email for password reset instructions"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Sending Recovery Email..." : "Send Recovery Email"}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 mb-2">Recovery Email Sent!</h3>
                    <p className="text-slate-600 mb-6">
                      We've sent instructions to <strong>{email}</strong>. Please check your inbox and follow the link to reset your password.
                    </p>
                    <Button variant="outline" onClick={() => navigate("/login")} className="mx-auto">
                      Return to Login
                    </Button>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 text-center">
                <div className="text-sm text-slate-600">
                  <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Login
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
