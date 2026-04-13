import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Compass, Calendar, MapPin, Trash2, Eye, Plus } from "lucide-react";

interface Trip {
  id: string;
  destination: string;
  days: number;
  budget: string | null;
  departure_city: string | null;
  created_at: string;
  itinerary_data: any;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchTrips();
  }, [user]);

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load trips");
      console.error(error);
    } else {
      setTrips(data || []);
    }
    setLoading(false);
  };

  const deleteTrip = async (id: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete trip");
    } else {
      setTrips((prev) => prev.filter((t) => t.id !== id));
      toast.success("Trip deleted");
    }
  };

  const viewTrip = (trip: Trip) => {
    navigate("/trip/" + trip.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 max-w-5xl mx-auto pt-16">
      <div className="text-center mb-10 animate-fade-up">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">My Trips</h1>
        <p className="text-muted-foreground">Your saved travel plans</p>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-20 animate-fade-up">
          <Compass className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No trips yet</h3>
          <p className="text-muted-foreground mb-6">Plan your first adventure!</p>
          <Button variant="hero" onClick={() => navigate("/")} className="gap-2">
            <Plus className="w-4 h-4" /> Plan a Trip
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, i) => (
            <div
              key={trip.id}
              className="glass-card p-5 hover:shadow-md transition-all animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    {trip.destination}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(trip.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {trip.days} days
                </span>
              </div>

              {trip.budget && (
                <p className="text-sm text-muted-foreground mb-3">Budget: {trip.budget}</p>
              )}

              <div className="flex gap-2">
                <Button variant="warm" size="sm" onClick={() => viewTrip(trip)} className="flex-1 gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTrip(trip.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Button variant="hero" onClick={() => navigate("/")} className="gap-2">
          <Plus className="w-4 h-4" /> Plan New Trip
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
