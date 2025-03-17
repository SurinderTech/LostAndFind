import React, { useState } from "react";
import { CalendarIcon, Clock, MapPin, Tag, Star, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import ImageUploader from "@/components/ui/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { generateId, saveItem, getCurrentUser } from "@/utils/localStorageDB";
import { analyzeImage, generateImageDescription } from "@/utils/imageRecognition";

interface ItemFormProps {
  type: "lost" | "found";
}

const ItemForm: React.FC<ItemFormProps> = ({ type }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    time: "",
    location: "",
    description: "",
    identifyingFeatures: "",
    reward: "no"
  });

  const isLost = type === "lost";
  const title = isLost ? "Report a Lost Item" : "Report a Found Item";
  const buttonText = isLost ? "Submit Lost Item Report" : "Submit Found Item Report";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, reward: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Mock user authentication for demo purposes
      // In a real app, you would check if user is logged in
      const currentUser = getCurrentUser() || {
        id: "demo-user-" + Math.random().toString(36).substr(2, 9),
        name: "Demo User",
        email: "demo@example.com",
      };
      
      // Convert image to base64 for storage
      let imageUrl = "";
      let aiGeneratedDescription = "";
      
      if (selectedImage && imagePreview) {
        // Store the image preview as a base64 string
        imageUrl = imagePreview;
        
        // Use AI to generate a description
        try {
          aiGeneratedDescription = await generateImageDescription(imagePreview);
          console.log("AI Generated Description:", aiGeneratedDescription);
        } catch (error) {
          console.error("Error generating image description:", error);
        }
      }
      
      // Prepare the item data
      const newItem = {
        id: generateId(),
        type: type,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        brand: formData.brand || undefined,
        date: date ? format(date, "yyyy-MM-dd") : new Date().toISOString().split('T')[0],
        time: formData.time || new Date().toLocaleTimeString(),
        location: formData.location,
        imageUrl: imageUrl || undefined,
        identifyingFeatures: formData.identifyingFeatures || undefined,
        reward: formData.reward === "yes",
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
        status: 'pending' as 'pending' | 'matched' | 'claimed' | 'resolved',
        aiDescription: aiGeneratedDescription,
        keywords: generateKeywords(formData)
      };
      
      // Save the item to localStorage
      saveItem(newItem);
      
      // Show success toast
      toast({
        title: "Report Submitted!",
        description: isLost 
          ? "We'll notify you if we find a match for your lost item." 
          : "Thank you for your kindness! We'll help connect this item with its owner.",
      });
      
      // Redirect to the match search page if it's a lost item
      if (isLost) {
        navigate("/match-search?itemId=" + newItem.id);
      } else {
        // For found items, check for potential matches with lost items
        navigate("/dashboard");
      }
      
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate keywords from form data for better matching
  const generateKeywords = (data: typeof formData) => {
    const keywordArray = [
      data.name,
      data.category,
      data.brand,
      data.location,
      ...data.description.split(/\s+/).filter(word => word.length > 3),
      ...data.identifyingFeatures.split(/\s+/).filter(word => word.length > 3)
    ].filter(Boolean);
    
    return [...new Set(keywordArray.map(k => k.toLowerCase()))];
  };

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-600">
            Please provide as much detail as possible to help us {isLost ? "find your item" : "return this item to its owner"}.
          </p>
        </div>

        <div className="space-y-6">
          <div className="form-control">
            <Label htmlFor="name">Item Name</Label>
            <Input 
              id="name"
              placeholder="e.g. Blue Backpack, iPhone 13, Wallet"
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-control">
            <Label>Upload Image</Label>
            <ImageUploader onImageSelected={handleImageSelected} />
            {imagePreview && (
              <div className="mt-2 flex items-center space-x-2">
                <div className="h-12 w-12 rounded overflow-hidden border border-slate-200">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-xs text-slate-500">Image uploaded successfully</span>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Upload a clear image of the {isLost ? "item you lost" : "item you found"}. This helps with AI matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <Label htmlFor="category">Category</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  id="category"
                  className="pl-10"
                  placeholder="e.g. Electronics, Clothing"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <Label htmlFor="brand">Brand (if applicable)</Label>
              <div className="relative">
                <Star className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  id="brand"
                  className="pl-10"
                  placeholder="e.g. Apple, Nike"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-control">
            <Label htmlFor="when">When {isLost ? "Lost" : "Found"}</Label>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="time"
                    type="time"
                    className="pl-10"
                    placeholder="Time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-control">
            <Label htmlFor="location">Where {isLost ? "Lost" : "Found"}</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                id="location"
                className="pl-10" 
                placeholder="Be as specific as possible with the location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              placeholder={`Provide a detailed description of the ${isLost ? "lost" : "found"} item, including color, size, any unique marks or features, contents (if applicable), etc.`}
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <Label htmlFor="identifyingFeatures">Any Identifying Marks/Features?</Label>
            <div className="relative">
              <AlertCircle className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                id="identifyingFeatures"
                className="pl-10" 
                placeholder="e.g. Scratches on back, sticker on front, personalized engraving"
                value={formData.identifyingFeatures}
                onChange={handleChange}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              This helps confirm the rightful owner.
            </p>
          </div>

          {isLost && (
            <div className="form-control">
              <Label>Would you like to offer a reward?</Label>
              <RadioGroup value={formData.reward} onValueChange={handleRadioChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="reward-yes" />
                  <Label htmlFor="reward-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="reward-no" />
                  <Label htmlFor="reward-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : buttonText}
        </Button>
      </form>
    </div>
  );
};

export default ItemForm;

