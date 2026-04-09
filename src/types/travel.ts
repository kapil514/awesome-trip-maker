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

export interface ItineraryDay {
  day: number;
  location: string;
  plan: string;
}

export interface CostBreakdown {
  flights_cost: number;
  accommodation_cost: number;
  local_transport_cost: number;
  activities_cost: number;
  buffer: number;
  total: number;
  currency: string;
}

export interface SelectedPlan {
  destinations: { city: string; country: string; days_allocated: number }[];
  cost_breakdown: CostBreakdown;
  itinerary: ItineraryDay[];
  reasoning: { selection_reason: string; tradeoffs: string };
  friendly_summary: string;
}

export interface ItineraryResult {
  selected_plan: SelectedPlan;
}

export type AppStep = "input" | "loading-vibe" | "destinations" | "loading-itinerary" | "itinerary";
