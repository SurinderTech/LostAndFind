
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, Clock, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, getItemsByUserId, getMatchesByItemId } from "@/utils/localStorageDB";
import ItemMatches from "@/components/lost-found/ItemMatches";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userItems, setUserItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("lost");
  const [loading, setLoading] = useState(true);

  // Load user data and items
  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your dashboard.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    setUser(currentUser);
    
    // Get user's items
    const items = getItemsByUserId(currentUser.id);
    setUserItems(items);
    setLoading(false);
  }, [navigate, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case "matched":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Matched</Badge>;
      case "claimed":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Claimed</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Filter items by type (lost or found)
  const lostItems = userItems.filter(item => item.type === "lost");
  const foundItems = userItems.filter(item => item.type === "found");

  // Calculate match data for items
  const getItemMatches = (items: any[]) => {
    return items.map(item => {
      const matches = getMatchesByItemId(item.id);
      return {
        ...item,
        matchCount: matches.length
      };
    });
  };

  const lostItemsWithMatches = getItemMatches(lostItems);
  const foundItemsWithMatches = getItemMatches(foundItems);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-slate-100">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="content-container">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse mx-auto w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <div className="w-5 h-5 rounded-full bg-primary/40"></div>
              </div>
              <p className="text-slate-600">Loading your data...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome, {user?.name}</h1>
                <p className="text-slate-600">Manage your lost and found items</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Lost Items</CardTitle>
                    <CardDescription>Items you've reported as lost</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{lostItems.length}</div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/lost-item")}>
                      Report a Lost Item
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Found Items</CardTitle>
                    <CardDescription>Items you've reported as found</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{foundItems.length}</div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/found-item")}>
                      Report a Found Item
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Potential Matches</CardTitle>
                    <CardDescription>Matches for your items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {userItems.reduce((total, item) => total + getMatchesByItemId(item.id).length, 0)}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/match-search")}>
                      Search for Matches
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="lost">Lost Items</TabsTrigger>
                  <TabsTrigger value="found">Found Items</TabsTrigger>
                </TabsList>
                
                <TabsContent value="lost" className="space-y-4">
                  {lostItemsWithMatches.length === 0 ? (
                    <Card className="bg-slate-50 border-dashed border-slate-200">
                      <CardContent className="pt-6 pb-6 text-center">
                        <div className="text-slate-500 mb-2">No lost items reported yet</div>
                        <Button variant="outline" onClick={() => navigate("/lost-item")}>
                          Report a Lost Item
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {lostItemsWithMatches.map(item => (
                        <Card key={item.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              {getStatusBadge(item.status)}
                            </div>
                            <CardDescription className="flex items-center gap-2 text-xs">
                              <Calendar className="h-3 w-3" />
                              <span>Lost on {formatDate(item.date)}</span>
                              <span>•</span>
                              <MapPin className="h-3 w-3" />
                              <span>{item.location}</span>
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {item.imageUrl && (
                                <div className="md:col-span-1">
                                  <div className="w-full h-32 bg-slate-100 rounded-md overflow-hidden">
                                    <img 
                                      src={item.imageUrl} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                              
                              <div className={item.imageUrl ? "md:col-span-2" : "md:col-span-3"}>
                                <p className="text-sm text-slate-700 line-clamp-2 mb-2">
                                  {item.description}
                                </p>
                                
                                <div className="flex items-center gap-2 text-sm">
                                  <Badge variant="outline" className="bg-slate-50">
                                    {item.category}
                                  </Badge>
                                  
                                  {item.matchCount > 0 && (
                                    <Badge className="bg-blue-500">
                                      {item.matchCount} potential {item.matchCount === 1 ? "match" : "matches"}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          
                          <CardFooter className="flex justify-between pt-2 pb-3 bg-slate-50 border-t border-slate-100">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs h-8"
                              onClick={() => navigate(`/match-search?itemId=${item.id}`)}
                            >
                              View Matches
                            </Button>
                            
                            {item.status === "pending" && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                Mark as Found
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="found" className="space-y-4">
                  {foundItemsWithMatches.length === 0 ? (
                    <Card className="bg-slate-50 border-dashed border-slate-200">
                      <CardContent className="pt-6 pb-6 text-center">
                        <div className="text-slate-500 mb-2">No found items reported yet</div>
                        <Button variant="outline" onClick={() => navigate("/found-item")}>
                          Report a Found Item
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {foundItemsWithMatches.map(item => (
                        <Card key={item.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              {getStatusBadge(item.status)}
                            </div>
                            <CardDescription className="flex items-center gap-2 text-xs">
                              <Calendar className="h-3 w-3" />
                              <span>Found on {formatDate(item.date)}</span>
                              <span>•</span>
                              <MapPin className="h-3 w-3" />
                              <span>{item.location}</span>
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {item.imageUrl && (
                                <div className="md:col-span-1">
                                  <div className="w-full h-32 bg-slate-100 rounded-md overflow-hidden">
                                    <img 
                                      src={item.imageUrl} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                              
                              <div className={item.imageUrl ? "md:col-span-2" : "md:col-span-3"}>
                                <p className="text-sm text-slate-700 line-clamp-2 mb-2">
                                  {item.description}
                                </p>
                                
                                <div className="flex items-center gap-2 text-sm">
                                  <Badge variant="outline" className="bg-slate-50">
                                    {item.category}
                                  </Badge>
                                  
                                  {item.matchCount > 0 && (
                                    <Badge className="bg-blue-500">
                                      {item.matchCount} potential {item.matchCount === 1 ? "match" : "matches"}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          
                          <CardFooter className="flex justify-between pt-2 pb-3 bg-slate-50 border-t border-slate-100">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs h-8"
                              onClick={() => navigate(`/match-search?itemId=${item.id}`)}
                            >
                              View Potential Owners
                            </Button>
                            
                            {item.status === "pending" && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs h-8 text-green-500 hover:text-green-700 hover:bg-green-50"
                              >
                                Mark as Returned
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
