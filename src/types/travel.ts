export interface ParsedPreferences {
  trip_type: string;
  environment: string;
  pace: string;
  budget_level: string;
  crowd_preference: string;
  aesthetic_keywords: string[];
}

export interface Destination {
  city: string;
  country: string;
  why_it_matches: string;
  avg_daily_cost: number;
  best_for: string[];
  score: number;
}

export interface VibeParseResult {
  parsed_preferences: ParsedPreferences;
  destinations: Destination[];
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  duration: string;
  type: "activity" | "food" | "transport" | "rest";
  notes?: string;
  dietary_tags?: string[];
  lat?: number;
  lng?: number;
  selected: boolean;
}

export interface TimeSlot {
  label: "Morning" | "Afternoon" | "Evening";
  activities: Activity[];
}

export interface FoodSpot {
  name: string;
  cuisine: string;
  dietary_tags: string[];
  price_range: string;
  must_try_dish?: string;
  meal_time?: "morning" | "afternoon" | "dinner";
}

export interface StayRecommendation {
  area: string;
  why: string;
  budget_tier: "budget" | "mid-range" | "luxury";
  tags: string[];
  price_per_night_estimate: number;
}

export interface ItineraryDay {
  day: number;
  location: string;
  plan: string;
  time_slots: TimeSlot[];
  food_spots: FoodSpot[];
  travel_tip?: string;
}

export interface CostBreakdown {
  flights_cost: number;
  accommodation_cost: number;
  local_transport_cost: number;
  activities_cost: number;
  food_cost: number;
  buffer: number;
  total: number;
  currency: string;
}

export interface SelectedPlan {
  destinations: { city: string; country: string; days_allocated: number; lat?: number; lng?: number }[];
  cost_breakdown: CostBreakdown;
  itinerary: ItineraryDay[];
  stay_recommendations: StayRecommendation[];
  reasoning: { selection_reason: string; tradeoffs: string };
  friendly_summary: string;
}

export interface ItineraryResult {
  selected_plan: SelectedPlan;
}

export interface TravelFilters {
  dietary: string[];
  travel_style: string;
  interests: string[];
  constraints: string[];
}

export type AppStep = "input" | "loading-vibe" | "destinations" | "loading-itinerary" | "itinerary";
