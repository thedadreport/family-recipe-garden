// types/user.ts
import { UserProfile } from './recipe';

export interface User {
  id: string;
  name?: string;
  email?: string;
  preferences: UserPreferences;
  createdAt: Date;
  lastActive: Date;
}

export interface UserPreferences {
  defaultProfile: UserProfile;
  favoriteRecipes: number[];
  savedPlans: number[];
  dietaryRestrictions: string[];
  cookingLevel: string;
  preferredCuisines: string[];
}

export interface UserStats {
  recipesGenerated: number;
  plansCreated: number;
  favoriteCount: number;
  streak: number;
}

export interface UserSession {
  userId: string;
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  recipesGenerated: number;
  plansCreated: number;
}