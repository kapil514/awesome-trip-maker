import { Destination, ParsedPreferences } from "@/types/travel";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Star, ArrowRight } from "lucide-react";

interface DestinationCardsProps {
  destinations: Destination[];
  preferences: ParsedPreferences;
  onGenerateItinerary: (destinations: Destination[]) => void;
  isLoading: boolean;
}

const DestinationCards = ({ destinations, preferences, onGenerateItinerary, isLoading }: DestinationCardsProps) => {
  return (
    <div className="min-h-screen px-4 py-12 max-w-5xl mx-auto">
      {/* Preferences summary */}
      <div className="text-center mb-10 animate-fade-up">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          Your Travel DNA
        </h2>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {preferences.aesthetic_keywords.map((kw) => (
            <span key={kw} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {kw}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
          <span className="glass-card px-3 py-1.5">{preferences.trip_type}</span>
          <span className="glass-card px-3 py-1.5">{preferences.environment}</span>
          <span className="glass-card px-3 py-1.5">{preferences.pace} pace</span>
        </div>
      </div>

      {/* Destination cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10">
        {destinations.map((dest, i) => (
          <div
            key={dest.city}
            className="glass-card p-6 hover:shadow-md transition-all duration-300 animate-fade-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">{dest.city}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {dest.country}
                </p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                <Star className="w-3.5 h-3.5" />
                {dest.score}/10
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{dest.why_it_matches}</p>

            <div className="flex items-center gap-1 text-sm text-foreground mb-3">
              <DollarSign className="w-4 h-4 text-primary" />
              ~${dest.avg_daily_cost}/day
            </div>

            <div className="flex flex-wrap gap-1.5">
              {dest.best_for.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Generate itinerary */}
      <div className="text-center animate-fade-up" style={{ animationDelay: "0.5s" }}>
        <Button
          variant="hero"
          size="lg"
          className="px-10 py-6 text-base"
          onClick={() => onGenerateItinerary(destinations)}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Building your itinerary...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Generate Itinerary
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DestinationCards;
