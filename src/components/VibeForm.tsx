import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Compass, Plane, Sparkles, Send, ChevronDown, ChevronUp, Leaf, Wifi, Dog, UtensilsCrossed, Mountain, PartyPopper, Heart, Camera, ShoppingBag, Waves } from "lucide-react";
import type { TravelFilters } from "@/types/travel";

interface VibeFormProps {
  onSubmit: (data: { vibe: string; budget: string; departure_city: string; days: string; filters: TravelFilters }) => void;
  isLoading: boolean;
}

const DIETARY_OPTIONS = [
  { id: "vegetarian", label: "Vegetarian", icon: Leaf },
  { id: "vegan", label: "Vegan", icon: Leaf },
  { id: "jain", label: "Jain", icon: Leaf },
  { id: "halal", label: "Halal", icon: UtensilsCrossed },
];

const INTEREST_OPTIONS = [
  { id: "food", label: "Food", icon: UtensilsCrossed },
  { id: "nightlife", label: "Nightlife", icon: PartyPopper },
  { id: "temples", label: "Temples", icon: Mountain },
  { id: "beaches", label: "Beaches", icon: Waves },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "adventure", label: "Adventure", icon: Mountain },
  { id: "romantic", label: "Romantic", icon: Heart },
];

const CONSTRAINT_OPTIONS = [
  { id: "pet-friendly", label: "Pet-friendly", icon: Dog },
  { id: "strong-wifi", label: "Strong WiFi", icon: Wifi },
  { id: "workation", label: "Workation", icon: Wifi },
  { id: "visa-free", label: "Visa-free only", icon: Plane },
];

const STYLE_OPTIONS = ["Backpacking", "Budget", "Mid-range", "Luxury", "Family", "Solo"];

const VibeForm = ({ onSubmit, isLoading }: VibeFormProps) => {
  const [vibe, setVibe] = useState("");
  const [budget, setBudget] = useState("");
  const [departureCity, setDepartureCity] = useState("");
  const [days, setDays] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [dietary, setDietary] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [constraints, setConstraints] = useState<string[]>([]);

  const vibeExamples = [
    "Plan me a 5-day Bali trip under ₹1.5L, vegetarian-friendly, good WiFi",
    "Beach party with friends, nightlife and good food",
    "Solo adventure in the mountains, hiking trails",
    "Romantic getaway, old towns and sunsets",
  ];

  const toggleArray = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vibe || !budget || !departureCity || !days) return;
    onSubmit({
      vibe,
      budget,
      departure_city: departureCity,
      days,
      filters: { dietary, travel_style: travelStyle, interests, constraints },
    });
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
          Tell us your dream trip and we'll craft the perfect itinerary in seconds.
        </p>
      </div>

      {/* Chat-style input */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        {/* Main vibe input - chat style */}
        <div className="glass-card p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full gradient-warm flex items-center justify-center shrink-0 mt-1">
              <Compass className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <textarea
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder='Try: "Plan me a 5-day Bali trip under ₹1.5L, vegetarian-friendly, good WiFi"'
                className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none resize-none text-sm min-h-[60px]"
                rows={2}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {vibeExamples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setVibe(ex)}
                    className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-primary/10 transition-colors"
                  >
                    {ex.slice(0, 40)}…
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick details row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-3">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Budget (INR)</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="₹80,000"
              className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
            />
          </div>
          <div className="glass-card p-3">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Duration</label>
            <input
              type="text"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="5 days"
              className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
            />
          </div>
          <div className="glass-card p-3">
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              <Plane className="w-3 h-3 inline mr-1" />From
            </label>
            <input
              type="text"
              value={departureCity}
              onChange={(e) => setDepartureCity(e.target.value)}
              placeholder="Delhi"
              className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showFilters ? "Hide" : "Show"} advanced filters
        </button>

        {/* Collapsible filters */}
        {showFilters && (
          <div className="glass-card p-5 space-y-5 animate-fade-up">
            {/* Travel Style */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Travel Style</label>
              <div className="flex flex-wrap gap-2">
                {STYLE_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTravelStyle(travelStyle === s ? "" : s)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      travelStyle === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Dietary Preferences</label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleArray(dietary, d.id, setDietary)}
                    className={`text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors ${
                      dietary.includes(d.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    <d.icon className="w-3 h-3" /> {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Interests</label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((i) => (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => toggleArray(interests, i.id, setInterests)}
                    className={`text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors ${
                      interests.includes(i.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    <i.icon className="w-3 h-3" /> {i.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Constraints</label>
              <div className="flex flex-wrap gap-2">
                {CONSTRAINT_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleArray(constraints, c.id, setConstraints)}
                    className={`text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors ${
                      constraints.includes(c.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    <c.icon className="w-3 h-3" /> {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <Button type="submit" variant="hero" size="lg" className="w-full text-base py-6" disabled={isLoading || !vibe || !budget || !departureCity || !days}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Reading your vibe...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Plan My Trip
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default VibeForm;
