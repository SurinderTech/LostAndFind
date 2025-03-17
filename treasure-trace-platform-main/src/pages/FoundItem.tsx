
import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ItemForm from "@/components/lost-found/ItemForm";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell } from "lucide-react";
import { getCurrentUser, getUserNotifications } from "@/utils/localStorageDB";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FoundItem = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const userNotifications = getUserNotifications(currentUser.id);
      const unreadNotifications = userNotifications.filter(notification => !notification.isRead);
      setNotifications(unreadNotifications);
    }
  }, []);
  
  const handleViewNotifications = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="content-container">
          <div className="max-w-3xl mx-auto">
            {notifications.length > 0 && (
              <Alert className="mb-8 bg-blue-50 border-blue-200 hover:bg-blue-100 transition-all-200">
                <Bell className="h-5 w-5 text-blue-600" />
                <div className="flex justify-between items-center w-full">
                  <div>
                    <AlertTitle className="text-blue-800">You have {notifications.length} new notification{notifications.length > 1 ? 's' : ''}!</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      Someone might be looking for the item you found or contacted you about an item.
                    </AlertDescription>
                  </div>
                  <Button 
                    onClick={handleViewNotifications} 
                    variant="outline" 
                    className="bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-all"
                  >
                    View Notifications
                  </Button>
                </div>
              </Alert>
            )}
            
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-800 mb-4 hover:text-blue-700 transition-colors">Report a Found Item</h1>
              <p className="text-xl text-slate-600 hover:text-slate-800 transition-colors">
                Thank you for your kindness! Fill out the form below with information about the item you found, and we'll help reunite it with its owner.
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all-200 border border-blue-100">
              <ItemForm type="found" />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default FoundItem;
