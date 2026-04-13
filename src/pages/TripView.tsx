import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ItineraryView from "@/components/ItineraryView";
import type { SelectedPlan } from "@/types/travel";

const TripView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<SelectedPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast.error("Trip not found");
        navigate("/dashboard");
        return;
      }

      setPlan(data.itinerary_data as unknown as SelectedPlan);
      setLoading(false);
    };

    fetchTrip();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!plan) return null;

  return <ItineraryView plan={plan} onStartOver={() => navigate("/dashboard")} tripId={id} />;
};

export default TripView;
