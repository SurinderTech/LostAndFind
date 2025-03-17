
// Simple local storage database for the lost and found items

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In a real app, passwords should never be stored like this
  createdAt: string;
}

export interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  name: string;
  description: string;
  category: string;
  brand?: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string;
  identifyingFeatures?: string;
  reward?: boolean;
  userId: string;
  createdAt: string;
  status: 'pending' | 'matched' | 'claimed' | 'resolved';
  aiDescription?: string;
  keywords?: string[];
}

// Key constants for localStorage
const USERS_KEY = 'findfuse_users';
const ITEMS_KEY = 'findfuse_items';
const MATCHES_KEY = 'findfuse_matches';
const NOTIFICATIONS_KEY = 'findfuse_notifications';
const CURRENT_USER_KEY = 'findfuse_current_user';

// Utility functions for users
export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): User => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return user;
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const loginUser = (email: string, password: string): User | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    // Save current user to localStorage
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Utility functions for items
export const getItems = (): LostFoundItem[] => {
  const items = localStorage.getItem(ITEMS_KEY);
  return items ? JSON.parse(items) : [];
};

export const saveItem = (item: LostFoundItem): LostFoundItem => {
  const items = getItems();
  
  // Add the item to the database
  items.push(item);
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  
  // If this is a new item, check for potential matches
  if (item.type === 'lost') {
    const foundItems = getFoundItems();
    checkForMatches(item, foundItems);
  } else if (item.type === 'found') {
    const lostItems = getLostItems();
    checkForMatches(lostItems, [item]);
  }
  
  return item;
};

export const getItemById = (id: string): LostFoundItem | undefined => {
  const items = getItems();
  return items.find(item => item.id === id);
};

export const updateItem = (updatedItem: LostFoundItem): LostFoundItem | undefined => {
  const items = getItems();
  const index = items.findIndex(item => item.id === updatedItem.id);
  
  if (index !== -1) {
    items[index] = updatedItem;
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    return updatedItem;
  }
  
  return undefined;
};

export const getItemsByUserId = (userId: string): LostFoundItem[] => {
  const items = getItems();
  return items.filter(item => item.userId === userId);
};

export const getLostItems = (): LostFoundItem[] => {
  const items = getItems();
  return items.filter(item => item.type === 'lost');
};

export const getFoundItems = (): LostFoundItem[] => {
  const items = getItems();
  return items.filter(item => item.type === 'found');
};

// Check for matches between lost and found items
const checkForMatches = (lostItems: LostFoundItem | LostFoundItem[], foundItems: LostFoundItem[]) => {
  // Normalize lostItems to array if single item passed
  const lostItemsArray = Array.isArray(lostItems) ? lostItems : [lostItems];
  
  for (const lostItem of lostItemsArray) {
    for (const foundItem of foundItems) {
      const similarity = calculateSimilarity(lostItem, foundItem);
      
      // If similarity score is above threshold (0.4 or 40%)
      if (similarity >= 0.4) {
        // Create a match
        const match = {
          id: generateId(),
          lostItemId: lostItem.id,
          foundItemId: foundItem.id,
          similarity: similarity,
          status: 'pending' as 'pending' | 'approved' | 'rejected',
          createdAt: new Date().toISOString()
        };
        
        saveMatch(match);
        
        // Create notifications for both users
        createNotification({
          id: generateId(),
          userId: lostItem.userId,
          title: "Potential Match Found!",
          message: `We found a potential match for your lost ${lostItem.name}.`,
          relatedItemId: lostItem.id,
          matchId: match.id,
          isRead: false,
          createdAt: new Date().toISOString()
        });
        
        createNotification({
          id: generateId(),
          userId: foundItem.userId,
          title: "Potential Match Found!",
          message: `We found a potential owner for the ${foundItem.name} you found.`,
          relatedItemId: foundItem.id,
          matchId: match.id,
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    }
  }
};

// Calculate similarity between a lost and found item
const calculateSimilarity = (lostItem: LostFoundItem, foundItem: LostFoundItem): number => {
  let score = 0;
  let totalFactors = 0;
  
  // Compare item names (most important)
  if (lostItem.name && foundItem.name) {
    const nameScore = compareStrings(lostItem.name, foundItem.name);
    score += nameScore * 3;  // Weight: 3
    totalFactors += 3;
  }
  
  // Compare categories
  if (lostItem.category && foundItem.category) {
    const categoryScore = compareStrings(lostItem.category, foundItem.category);
    score += categoryScore * 2;  // Weight: 2
    totalFactors += 2;
  }
  
  // Compare brands
  if (lostItem.brand && foundItem.brand) {
    const brandScore = compareStrings(lostItem.brand, foundItem.brand);
    score += brandScore * 2.5;  // Weight: 2.5
    totalFactors += 2.5;
  }
  
  // Compare locations
  if (lostItem.location && foundItem.location) {
    const locationScore = compareStrings(lostItem.location, foundItem.location);
    score += locationScore * 1.5;  // Weight: 1.5
    totalFactors += 1.5;
  }
  
  // Compare descriptions
  if (lostItem.description && foundItem.description) {
    const descriptionScore = compareStrings(lostItem.description, foundItem.description);
    score += descriptionScore * 1;  // Weight: 1
    totalFactors += 1;
  }
  
  // Compare AI descriptions if available
  if (lostItem.aiDescription && foundItem.aiDescription) {
    const aiDescriptionScore = compareStrings(lostItem.aiDescription, foundItem.aiDescription);
    score += aiDescriptionScore * 1.5;  // Weight: 1.5
    totalFactors += 1.5;
  }
  
  // Compare keywords if available
  if (lostItem.keywords && foundItem.keywords) {
    const keywordScore = compareKeywords(lostItem.keywords, foundItem.keywords);
    score += keywordScore * 2;  // Weight: 2
    totalFactors += 2;
  }
  
  // Calculate final normalized score
  return totalFactors > 0 ? score / totalFactors : 0;
};

// Compare two strings and return similarity score between 0 and 1
const compareStrings = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Split into words
  const words1 = s1.split(/\W+/).filter(w => w.length > 2);
  const words2 = s2.split(/\W+/).filter(w => w.length > 2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  // Count matching words
  let matches = 0;
  for (const word of words1) {
    if (words2.includes(word)) matches++;
  }
  
  // Calculate Jaccard similarity coefficient
  const union = new Set([...words1, ...words2]).size;
  return union > 0 ? matches / union : 0;
};

// Compare keywords and return similarity score
const compareKeywords = (keywords1: string[], keywords2: string[]): number => {
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  let matches = 0;
  for (const keyword of keywords1) {
    if (keywords2.includes(keyword)) matches++;
  }
  
  const union = new Set([...keywords1, ...keywords2]).size;
  return union > 0 ? matches / union : 0;
};

// Utility functions for matches
export interface ItemMatch {
  id: string;
  lostItemId: string;
  foundItemId: string;
  similarity: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const getMatches = (): ItemMatch[] => {
  const matches = localStorage.getItem(MATCHES_KEY);
  return matches ? JSON.parse(matches) : [];
};

export const saveMatch = (match: ItemMatch): ItemMatch => {
  const matches = getMatches();
  
  // Check if a similar match already exists
  const existingMatch = matches.find(m => 
    m.lostItemId === match.lostItemId && 
    m.foundItemId === match.foundItemId
  );
  
  if (existingMatch) {
    // If existing match has lower similarity, update it
    if (existingMatch.similarity < match.similarity) {
      existingMatch.similarity = match.similarity;
      localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
      return existingMatch;
    }
    return existingMatch;
  }
  
  // Otherwise add the new match
  matches.push(match);
  localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  return match;
};

export const getMatchesByItemId = (itemId: string): ItemMatch[] => {
  const matches = getMatches();
  return matches.filter(match => match.lostItemId === itemId || match.foundItemId === itemId);
};

export const updateMatchStatus = (matchId: string, status: 'pending' | 'approved' | 'rejected'): ItemMatch | undefined => {
  const matches = getMatches();
  const match = matches.find(m => m.id === matchId);
  
  if (match) {
    match.status = status;
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
    
    // If approved, update the item statuses
    if (status === 'approved') {
      const lostItem = getItemById(match.lostItemId);
      const foundItem = getItemById(match.foundItemId);
      
      if (lostItem) {
        lostItem.status = 'matched';
        updateItem(lostItem);
      }
      
      if (foundItem) {
        foundItem.status = 'matched';
        updateItem(foundItem);
      }
    }
    
    return match;
  }
  
  return undefined;
};

// Notification system
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  relatedItemId?: string;
  matchId?: string;
  isRead: boolean;
  createdAt: string;
  contactEmail?: string; // Added contact information
  contactPhone?: string; // Added contact information
  contactName?: string;  // Added contact information
}

export const getNotifications = (): Notification[] => {
  const notifications = localStorage.getItem(NOTIFICATIONS_KEY);
  return notifications ? JSON.parse(notifications) : [];
};

export const createNotification = (notification: Notification): Notification => {
  const notifications = getNotifications();
  notifications.push(notification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  return notification;
};

export const getUserNotifications = (userId: string): Notification[] => {
  const notifications = getNotifications();
  return notifications
    .filter(notification => notification.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getNotifications();
  const notification = notifications.find(n => n.id === notificationId);
  
  if (notification) {
    notification.isRead = true;
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }
};

// Generate a simple UUID for IDs
export const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
