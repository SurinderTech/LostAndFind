import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, AlertCircle, Info, ImagePlus, Bell, Send, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ItemMatches from "@/components/lost-found/ItemMatches";
import ImageUploader from "@/components/ui/ImageUploader";
import { analyzeImage, compareImages, generateImageDescription } from "@/utils/imageRecognition";
import { 
  getItems, getLostItems, getFoundItems, getItemById, getUserById,
  generateId, saveMatch, updateMatchStatus, createNotification, getCurrentUser,
  getUserNotifications, markNotificationAsRead
} from "@/utils/localStorageDB";
import { Textarea } from "@/components/ui/textarea";

const MatchSearch = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const itemId = searchParams.get("itemId");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("text");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [hasAutomaticMatches, setHasAutomaticMatches] = useState(false);
  
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedMatchItem, setSelectedMatchItem] = useState<any>(null);

  useEffect(() => {
    if (itemId) {
      const item = getItemById(itemId);
      if (item) {
        setSelectedItem(item);
        
        const existingMatches = findExistingMatches(item.id);
        if (existingMatches.length > 0) {
          setHasAutomaticMatches(true);
          formatAndDisplayMatches(existingMatches);
          
          toast({
            title: "Automatic Matches Found!",
            description: `We found ${existingMatches.length} potential matches for your ${item.type} item.`,
          });
        }
        
        if (item.imageUrl) {
          setImagePreview(item.imageUrl);
          setActiveTab("image");
        } else {
          setSearchQuery(
            `${item.name} ${item.category} ${item.description} ${item.brand || ''}`
          );
          setActiveTab("text");
        }
      }
    }
  }, [itemId]);

  useEffect(() => {
    if (selectedItem && !hasAutomaticMatches) {
      handleSearch();
    }
  }, [selectedItem, activeTab, hasAutomaticMatches]);

  const findExistingMatches = (itemId: string) => {
    const allItems = getItems();
    
    const item = allItems.find(i => i.id === itemId);
    if (!item) return [];
    
    const oppositeTypeItems = allItems.filter(i => 
      i.type !== item.type && i.status !== 'matched' && i.status !== 'resolved'
    );
    
    return oppositeTypeItems.map(otherItem => {
      let similarityScore = 0;
      
      if (item.name.toLowerCase().includes(otherItem.name.toLowerCase()) || 
          otherItem.name.toLowerCase().includes(item.name.toLowerCase())) {
        similarityScore += 0.3;
      }
      
      if (item.category.toLowerCase() === otherItem.category.toLowerCase()) {
        similarityScore += 0.2;
      }
      
      if (item.location.toLowerCase().includes(otherItem.location.toLowerCase()) || 
          otherItem.location.toLowerCase().includes(item.location.toLowerCase())) {
        similarityScore += 0.15;
      }
      
      if (item.brand && otherItem.brand && 
          (item.brand.toLowerCase() === otherItem.brand.toLowerCase())) {
        similarityScore += 0.2;
      }
      
      const itemWords = item.description.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      const otherItemWords = otherItem.description.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      const commonWords = itemWords.filter(word => otherItemWords.includes(word));
      
      if (commonWords.length > 0) {
        similarityScore += Math.min(0.15, commonWords.length * 0.03);
      }
      
      if (similarityScore >= 0.4) {
        return {
          id: `match-${generateId()}`,
          similarity: similarityScore,
          item: {
            id: otherItem.id,
            name: otherItem.name,
            description: otherItem.description,
            category: otherItem.category,
            imageUrl: otherItem.imageUrl || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
            location: otherItem.location,
            date: new Date(otherItem.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            reportedBy: "Anonymous User",
          }
        };
      }
      
      return null;
    }).filter(Boolean);
  };

  const formatAndDisplayMatches = (matchesData: any[]) => {
    if (matchesData.length > 0) {
      const validMatches = matchesData
        .filter(match => match && match.similarity >= 0.4)
        .sort((a, b) => b.similarity - a.similarity);
      
      if (selectedItem) {
        validMatches.forEach(match => {
          saveMatch({
            id: generateId(),
            lostItemId: selectedItem.type === 'lost' ? selectedItem.id : match.item.id,
            foundItemId: selectedItem.type === 'found' ? selectedItem.id : match.item.id,
            similarity: match.similarity,
            status: 'pending',
            createdAt: new Date().toISOString()
          });
        });
      }
      
      setMatches(validMatches);
    } else {
      setMatches([]);
    }
  };

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setMatches([]);
    
    try {
      const itemsToSearch = selectedItem 
        ? (selectedItem.type === 'lost' ? getFoundItems() : getLostItems())
        : getItems();
      
      if (activeTab === "text") {
        const searchTerms = searchQuery.toLowerCase().split(" ").filter(term => term.length > 2);
        
        if (searchTerms.length === 0) {
          toast({
            title: "Search Error",
            description: "Please enter more specific search terms.",
            variant: "destructive",
          });
          setIsSearching(false);
          return;
        }
        
        const filteredItems = itemsToSearch.filter(item => {
          const itemText = `${item.name} ${item.description} ${item.category} ${item.brand || ''}`.toLowerCase();
          return searchTerms.some(term => itemText.includes(term));
        });
        
        const scoredItems = filteredItems.map(item => {
          const itemText = `${item.name} ${item.description} ${item.category} ${item.brand || ''}`.toLowerCase();
          const matchingTerms = searchTerms.filter(term => itemText.includes(term));
          const similarity = matchingTerms.length / searchTerms.length * 0.7 + 0.3;
          
          return {
            id: `match-${generateId()}`,
            similarity: Math.min(similarity, 1.0),
            item: {
              id: item.id,
              name: item.name,
              description: item.description,
              category: item.category,
              imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
              location: item.location,
              date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              reportedBy: "Anonymous User",
            }
          };
        });
        
        await new Promise(resolve => setTimeout(resolve, 800));
        formatAndDisplayMatches(scoredItems);
        
      } else if (activeTab === "image" && imagePreview) {
        try {
          const analysisData = await analyzeImage(imagePreview);
          
          if (analysisData.topMatch) {
            const description = await generateImageDescription(imagePreview);
            setAnalysisResult(description);
            
            const imageMatches = await Promise.all(
              itemsToSearch.map(async (item) => {
                if (!item.imageUrl) return null;
                
                try {
                  const similarity = await compareImages(imagePreview, item.imageUrl);
                  
                  if (similarity >= 0.5) {
                    return {
                      id: `match-${generateId()}`,
                      similarity,
                      item: {
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        category: item.category,
                        imageUrl: item.imageUrl,
                        location: item.location,
                        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        reportedBy: "Anonymous User",
                      }
                    };
                  }
                  return null;
                } catch (error) {
                  console.error("Error comparing images:", error);
                  return null;
                }
              })
            );
            
            formatAndDisplayMatches(imageMatches.filter(Boolean));
            
          } else {
            setAnalysisResult("Could not classify the image");
            toast({
              title: "Analysis Failed",
              description: "We couldn't identify the object in this image. Please try a clearer photo.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Image analysis error:", error);
          toast({
            title: "Image Analysis Failed",
            description: "There was an error analyzing your image. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: "There was an error processing your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleFeedback = (matchId: string, isPositive: boolean) => {
    updateMatchStatus(matchId, isPositive ? 'approved' : 'rejected');
    
    toast({
      title: isPositive ? "Match Confirmed!" : "We'll improve our matching",
      description: isPositive 
        ? "Great! We've notified the other party about this match."
        : "We'll use your feedback to train our system for better matches.",
    });
    
    if (isPositive) {
      setMatches(prev => prev.filter(match => match.id !== matchId));
    }
  };

  const handleContactOwner = (matchId: string) => {
    const matchItem = matches.find(match => match.id === matchId);
    if (matchItem) {
      setSelectedMatchId(matchId);
      setSelectedMatchItem(matchItem.item);
      setContactDialogOpen(true);
    } else {
      toast({
        title: "Error",
        description: "Could not find match information.",
        variant: "destructive",
      });
    }
  };
  
  const handleSendMessage = () => {
    if (!contactMessage.trim() || !selectedMatchItem || !selectedItem || !selectedMatchId) {
      toast({
        title: "Error",
        description: "Please enter a message to send.",
        variant: "destructive",
      });
      return;
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to contact other users.",
        variant: "destructive",
      });
      return;
    }
    
    const itemToContact = getItemById(selectedMatchItem.id);
    if (!itemToContact) {
      toast({
        title: "Error",
        description: "Could not find this item's information.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      createNotification({
        id: generateId(),
        userId: itemToContact.userId,
        title: `New Message About Your ${itemToContact.type === 'lost' ? 'Lost' : 'Found'} Item`,
        message: `${currentUser.name} has sent you a message regarding your ${itemToContact.name}: "${contactMessage}"`,
        relatedItemId: itemToContact.id,
        matchId: selectedMatchId,
        isRead: false,
        createdAt: new Date().toISOString(),
        contactEmail: currentUser.email,
        contactPhone: '',
        contactName: currentUser.name
      });
      
      createNotification({
        id: generateId(),
        userId: currentUser.id,
        title: `You Contacted About ${itemToContact.type === 'lost' ? 'Lost' : 'Found'} Item`,
        message: `You sent a message to the ${itemToContact.type === 'lost' ? 'owner' : 'finder'} of ${itemToContact.name}: "${contactMessage}"`,
        relatedItemId: itemToContact.id,
        matchId: selectedMatchId,
        isRead: true,
        createdAt: new Date().toISOString(),
        contactEmail: itemToContact.userId ? getUserById(itemToContact.userId)?.email : '',
        contactName: itemToContact.userId ? getUserById(itemToContact.userId)?.name : 'Item Owner'
      });
      
      updateMatchStatus(selectedMatchId, 'approved');
      
      toast({
        title: "Message Sent!",
        description: "Your message has been sent to the item owner. They'll be able to contact you directly.",
      });
      
      setContactDialogOpen(false);
      setContactMessage("");
      
      setMatches(prev => prev.filter(match => match.id !== selectedMatchId));
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-purple-100">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="content-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-800 mb-4 hover:text-indigo-700 transition-colors">Find Your Item</h1>
              <p className="text-xl text-slate-600 hover:text-slate-800 transition-colors">
                {selectedItem 
                  ? `Looking for matches for your ${selectedItem.type} item: ${selectedItem.name}`
                  : "Search our database of found items using text description or image matching."
                }
              </p>
            </div>
            
            {hasAutomaticMatches && (
              <Alert className="mb-6 bg-green-50 border-green-200 hover:bg-green-100 transition-all-200">
                <Bell className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800">Automatic matches found!</AlertTitle>
                <AlertDescription className="text-green-700">
                  We've automatically found potential matches for your item based on description and characteristics.
                </AlertDescription>
              </Alert>
            )}
            
            <Card className="mb-8 hover:shadow-lg transition-all-200 border border-indigo-100">
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="text">Search by Text</TabsTrigger>
                    <TabsTrigger value="image">Search by Image</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="text-search">Describe your lost item</Label>
                      <div className="flex gap-2">
                        <Input
                          id="text-search"
                          placeholder="E.g. blue backpack with silver zippers"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button 
                          onClick={handleSearch} 
                          disabled={isSearching || !searchQuery.trim()}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          {isSearching ? "Searching..." : "Search"}
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500">
                        Include details like color, brand, distinctive features, and where you last had it
                      </p>
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Search tips</AlertTitle>
                      <AlertDescription className="text-sm">
                        Be specific with brand names, colors, and unique features that would help identify your item.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                  
                  <TabsContent value="image" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Upload an image of your lost item</Label>
                      <ImageUploader onImageSelected={handleImageSelected} />
                      <p className="text-xs text-slate-500">
                        Upload a clear image of your lost item or a similar item to help our AI find matches
                      </p>
                    </div>
                    
                    {imagePreview && (
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-32 h-32 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800 mb-1">Image Preview</h4>
                            
                            {analysisResult && (
                              <div className="text-sm text-slate-600 mb-2">
                                <strong>AI Analysis:</strong> {analysisResult}
                              </div>
                            )}
                            
                            <Button 
                              onClick={handleSearch} 
                              disabled={isSearching || !imagePreview}
                              className="mt-2"
                            >
                              <Search className="h-4 w-4 mr-2" />
                              {isSearching ? "Analyzing..." : "Find Matches"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Image search tips</AlertTitle>
                      <AlertDescription className="text-sm">
                        For best results, use a well-lit photo with the item clearly visible. If you don't have a photo of your exact item, a photo of an identical or very similar item can help.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {isSearching ? (
              <div className="text-center py-12">
                <div className="animate-pulse mx-auto w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <div className="w-5 h-5 rounded-full bg-primary/40"></div>
                </div>
                <p className="text-slate-600">
                  {activeTab === "text" ? "Searching for matches..." : "Analyzing your image and finding matches..."}
                </p>
              </div>
            ) : (
              <div>
                {matches.length > 0 ? (
                  <ItemMatches 
                    matches={matches} 
                    onFeedback={handleFeedback}
                    onContactOwner={handleContactOwner}
                  />
                ) : (
                  searchQuery.trim() || imagePreview ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No matches found yet</AlertTitle>
                      <AlertDescription>
                        We couldn't find any matches for your search criteria. Try adjusting your search terms or uploading a different image.
                      </AlertDescription>
                    </Alert>
                  ) : null
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-[525px] border border-indigo-100">
          <DialogHeader>
            <DialogTitle>Contact About {selectedMatchItem?.name}</DialogTitle>
            <DialogDescription>
              Send a message to the {selectedItem?.type === 'lost' ? 'finder' : 'owner'} of this item. Include details to help confirm it's yours.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="contact-message">Your Message</Label>
              <Textarea
                id="contact-message"
                placeholder="Hi, I believe this might be my lost item. I can provide more details to confirm it's mine..."
                rows={5}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                Include specific details about the item that only the true owner would know
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={!contactMessage.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default MatchSearch;
