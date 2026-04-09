import { SelectedPlan } from "@/types/travel";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Wallet, ArrowLeft, Plane } from "lucide-react";

interface ItineraryViewProps {
  plan: SelectedPlan;
  onStartOver: () => void;
}

const ItineraryView = ({ plan, onStartOver }: ItineraryViewProps) => {
  const { cost_breakdown, itinerary, destinations, reasoning, friendly_summary } = plan;

  const costItems = [
    { label: "Flights", value: cost_breakdown.flights_cost, icon: Plane },
    { label: "Accommodation", value: cost_breakdown.accommodation_cost, icon: MapPin },
    { label: "Transport", value: cost_breakdown.local_transport_cost, icon: MapPin },
    { label: "Activities", value: cost_breakdown.activities_cost, icon: Calendar },
    { label: "Buffer", value: cost_breakdown.buffer, icon: Wallet },
  ];

  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-up">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Your Perfect Trip
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">{friendly_summary}</p>
      </div>

      {/* Destinations overview */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {destinations.map((d) => (
          <div key={d.city} className="glass-card px-6 py-4 text-center">
            <h3 className="font-display text-xl font-semibold text-foreground">{d.city}, {d.country}</h3>
            <p className="text-sm text-muted-foreground">{d.days_allocated} days</p>
          </div>
        ))}
      </div>

      {/* Cost breakdown */}
      <div className="glass-card p-6 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Cost Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {costItems.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-lg font-semibold text-foreground">
                ₹{item.value?.toLocaleString() || 0}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-3 text-center">
          <p className="text-sm text-muted-foreground">Total Estimated</p>
          <p className="text-2xl font-bold text-primary">
            ₹{cost_breakdown.total?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* Day-by-day itinerary */}
      <div className="mb-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <h3 className="font-display text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Day-by-Day Plan
        </h3>
        <div className="space-y-4">
          {itinerary.map((day, i) => (
            <div key={day.day} className="flex gap-4 animate-fade-up" style={{ animationDelay: `${0.3 + i * 0.08}s` }}>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {day.day}
                </div>
                {i < itinerary.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
              </div>
              <div className="glass-card p-4 flex-1 mb-1">
                <p className="text-xs font-medium text-primary mb-1">{day.location}</p>
                <p className="text-sm text-foreground">{day.plan}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reasoning */}
      <div className="glass-card p-6 mb-10 animate-fade-up" style={{ animationDelay: "0.5s" }}>
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">Why this plan?</h3>
        <p className="text-sm text-muted-foreground mb-2">{reasoning.selection_reason}</p>
        <p className="text-sm text-muted-foreground italic">Tradeoffs: {reasoning.tradeoffs}</p>
      </div>

      {/* Start over */}
      <div className="text-center">
        <Button variant="warm" size="lg" onClick={onStartOver} className="px-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Plan Another Trip
        </Button>
      </div>
    </div>
  );
};

export default ItineraryView;
