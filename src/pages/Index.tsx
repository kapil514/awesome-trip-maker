import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import VibeForm from "@/components/VibeForm";
import DestinationCards from "@/components/DestinationCards";
import ItineraryView from "@/components/ItineraryView";
import LoadingScreen from "@/components/LoadingScreen";
import type { AppStep, VibeParseResult, Destination, SelectedPlan, TravelFilters } from "@/types/travel";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<AppStep>("input");
  const [vibeResult, setVibeResult] = useState<VibeParseResult | null>(null);
  const [itineraryPlan, setItineraryPlan] = useState<SelectedPlan | null>(null);
  const [savedTripId, setSavedTripId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ vibe: string; budget: string; departure_city: string; days: string; filters: TravelFilters } | null>(null);

  const handleVibeSubmit = async (data: { vibe: string; budget: string; departure_city: string; days: string; filters: TravelFilters }) => {
    setStep("loading-vibe");
    setFormData(data);

    try {
      const { data: result, error } = await supabase.functions.invoke("parse-vibe", {
        body: { ...data },
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      setVibeResult(result as VibeParseResult);
      setStep("destinations");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to parse your vibe. Please try again.");
      setStep("input");
    }
  };

  const handleGenerateItinerary = async (destinations: Destination[]) => {
    if (!formData) return;
    setStep("loading-itinerary");

    try {
      const { data: result, error } = await supabase.functions.invoke("generate-itinerary", {
        body: {
          budget: formData.budget,
          departure_city: formData.departure_city,
          days: formData.days,
          destinations: destinations.slice(0, 3),
          filters: formData.filters,
        },
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      const plan = result?.selected_plan || result;
      setItineraryPlan(plan as SelectedPlan);
      setStep("itinerary");

      // Save trip to database
      if (user) {
        const destNames = (plan as SelectedPlan).destinations?.map((d: any) => `${d.city}, ${d.country}`).join(" → ") || destinations[0]?.city || "Trip";
        const { data: savedTrip, error: saveError } = await supabase.from("trips").insert({
          user_id: user.id,
          destination: destNames,
          days: parseInt(formData.days) || 1,
          budget: formData.budget,
          departure_city: formData.departure_city,
          vibe_text: formData.vibe,
          itinerary_data: plan as any,
          filters: formData.filters as any,
        }).select("id").single();
        if (saveError) console.error("Failed to save trip:", saveError);
        else {
          setSavedTripId(savedTrip.id);
          toast.success("Trip saved to your dashboard!");
        }
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to generate itinerary. Please try again.");
      setStep("destinations");
    }
  };

  const handleStartOver = () => {
    setStep("input");
    setVibeResult(null);
    setItineraryPlan(null);
    setFormData(null);
  };

  return (
    <div className="gradient-warm-subtle min-h-screen">
      {step === "input" && <VibeForm onSubmit={handleVibeSubmit} isLoading={false} />}

      {step === "loading-vibe" && (
        <LoadingScreen message="Reading your vibe..." submessage="Our AI travel expert is analyzing your preferences and finding the perfect destinations" />
      )}

      {step === "destinations" && vibeResult && (
        <DestinationCards destinations={vibeResult.destinations} preferences={vibeResult.parsed_preferences} onGenerateItinerary={handleGenerateItinerary} isLoading={false} />
      )}

      {step === "loading-itinerary" && (
        <LoadingScreen message="Crafting your itinerary..." submessage="Optimizing routes, budgets, and experiences for the perfect trip" />
      )}

      {step === "itinerary" && itineraryPlan && (
        <ItineraryView plan={itineraryPlan} onStartOver={handleStartOver} />
      )}
    </div>
  );
};

export default Index;
