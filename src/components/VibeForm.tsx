import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Compass, Plane, Sparkles } from "lucide-react";

interface VibeFormProps {
  onSubmit: (data: { vibe: string; budget: string; departure_city: string; days: string }) => void;
  isLoading: boolean;
}

const VibeForm = ({ onSubmit, isLoading }: VibeFormProps) => {
  const [vibe, setVibe] = useState("");
  const [budget, setBudget] = useState("");
  const [departureCity, setDepartureCity] = useState("");
  const [days, setDays] = useState("");

  const vibeExamples = [
    "Wes Anderson vibes — colorful, calm, aesthetic cafes",
    "Beach party with friends, nightlife and good food",
    "Solo adventure in the mountains, hiking trails",
    "Romantic getaway, old towns and sunsets",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vibe || !budget || !departureCity || !days) return;
    onSubmit({ vibe, budget, departure_city: departureCity, days });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-10 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          AI-Powered Travel Planning
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
          Where does your <br />
          <span className="text-primary">wanderlust</span> lead?
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Describe your dream trip vibe and we'll craft the perfect itinerary, tailored to your budget.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-5 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Compass className="w-4 h-4 inline mr-1.5 text-primary" />
            Describe your travel vibe
          </label>
          <textarea
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            placeholder="e.g., Something like a Wes Anderson movie — colorful, calm, aesthetic cafes..."
            className="w-full h-28 px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none text-sm"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {vibeExamples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setVibe(ex)}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-primary/10 transition-colors"
              >
                {ex.slice(0, 35)}…
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Budget (INR)</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g., 80000"
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Trip Duration</label>
            <input
              type="text"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="e.g., 5 days"
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Plane className="w-4 h-4 inline mr-1.5 text-primary" />
            Departure City
          </label>
          <input
            type="text"
            value={departureCity}
            onChange={(e) => setDepartureCity(e.target.value)}
            placeholder="e.g., Delhi, Mumbai, Bangalore"
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full text-base py-6" disabled={isLoading || !vibe || !budget || !departureCity || !days}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Reading your vibe...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Find My Dream Destinations
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default VibeForm;
