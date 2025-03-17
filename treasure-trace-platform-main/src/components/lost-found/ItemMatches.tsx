
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ItemMatch {
  id: string;
  similarity: number;
  item: {
    id: string;
    name: string;
    description: string;
    category: string;
    imageUrl: string;
    location: string;
    date: string;
    reportedBy?: string;
    userAvatar?: string;
  };
}

interface ItemMatchesProps {
  matches: ItemMatch[];
  onContactOwner?: (matchId: string) => void;
  onViewDetails?: (matchId: string) => void;
  onFeedback?: (matchId: string, isPositive: boolean) => void;
}

const ItemMatches: React.FC<ItemMatchesProps> = ({ 
  matches, 
  onContactOwner, 
  onViewDetails,
  onFeedback
}) => {
  const { toast } = useToast();
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedMatchId(expandedMatchId === id ? null : id);
  };

  const handleContactOwner = (id: string) => {
    if (onContactOwner) {
      onContactOwner(id);
    } else {
      toast({
        title: "Contact Initiated",
        description: "We've notified the item owner. They'll be in touch soon!",
        variant: "default",
      });
    }
  };

  const getSimilarityLabel = (score: number): { text: string; color: string } => {
    if (score >= 0.9) return { text: "Strong Match", color: "bg-green-500" };
    if (score >= 0.75) return { text: "Good Match", color: "bg-emerald-500" };
    if (score >= 0.65) return { text: "Possible Match", color: "bg-amber-500" };
    return { text: "Weak Match", color: "bg-orange-500" };
  };

  if (matches.length === 0) {
    return (
      <Card className="bg-slate-50 border-dashed border-slate-200">
        <CardContent className="pt-6 pb-6 text-center">
          <div className="text-slate-500 mb-2">No potential matches found yet</div>
          <p className="text-sm text-slate-400">
            We'll continue scanning for potential matches and notify you when we find something.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-3">Potential Matches ({matches.length})</h3>
      
      {matches.map((match) => {
        const isExpanded = expandedMatchId === match.id;
        const { text: similarityText, color: similarityColor } = getSimilarityLabel(match.similarity);
        
        return (
          <Card key={match.id} className="overflow-hidden hover:shadow-md transition-all-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{match.item.name}</CardTitle>
                <Badge className={`${similarityColor} hover:${similarityColor}`}>
                  {similarityText} ({Math.round(match.similarity * 100)}%)
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2 text-xs">
                <span>Found at {match.item.location}</span>
                <span>•</span>
                <span>{match.item.date}</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <div className="w-full h-40 bg-slate-100 rounded-md overflow-hidden">
                    <img 
                      src={match.item.imageUrl} 
                      alt={match.item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-slate-50">
                        {match.item.category}
                      </Badge>
                    </div>
                    
                    <p className={`text-slate-700 text-sm ${!isExpanded && 'line-clamp-2'}`}>
                      {match.item.description}
                    </p>
                    
                    {match.item.description.length > 120 && (
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs"
                        onClick={() => toggleExpand(match.id)}
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </Button>
                    )}
                    
                    {match.item.reportedBy && (
                      <div className="flex items-center mt-4 gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={match.item.userAvatar} />
                          <AvatarFallback className="text-xs">
                            {match.item.reportedBy.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-slate-500">
                          Reported by {match.item.reportedBy}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-2 pb-3 bg-slate-50 border-t border-slate-100">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8"
                  onClick={() => onViewDetails?.(match.id)}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" /> View Details
                </Button>
                <Button 
                  size="sm" 
                  className="text-xs h-8"
                  onClick={() => handleContactOwner(match.id)}
                >
                  <MessageCircle className="h-3.5 w-3.5 mr-1" /> Contact Owner
                </Button>
              </div>
              
              {onFeedback && (
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-8"
                    onClick={() => onFeedback(match.id, true)}
                    title="This is a good match"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-8"
                    onClick={() => onFeedback(match.id, false)}
                    title="This is not a match"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default ItemMatches;
