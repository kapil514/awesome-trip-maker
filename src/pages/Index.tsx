import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import VibeForm from "@/components/VibeForm";
import DestinationCards from "@/components/DestinationCards";
import ItineraryView from "@/components/ItineraryView";
import LoadingScreen from "@/components/LoadingScreen";
import type { AppStep, VibeParseResult, Destination, SelectedPlan } from "@/types/travel";

const Index = () => {
  const [step, setStep] = useState<AppStep>("input");
  const [vibeResult, setVibeResult] = useState<VibeParseResult | null>(null);
  const [itineraryPlan, setItineraryPlan] = useState<SelectedPlan | null>(null);
  const [formData, setFormData] = useState<{ budget: string; departure_city: string; days: string } | null>(null);

  const handleVibeSubmit = async (data: { vibe: string; budget: string; departure_city: string; days: string }) => {
    setStep("loading-vibe");
    setFormData({ budget: data.budget, departure_city: data.departure_city, days: data.days });

    try {
      const { data: result, error } = await supabase.functions.invoke("parse-vibe", {
        body: data,
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
        },
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      const plan = result?.selected_plan || result;
      setItineraryPlan(plan as SelectedPlan);
      setStep("itinerary");
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
      {step === "input" && (
        <VibeForm onSubmit={handleVibeSubmit} isLoading={false} />
      )}

      {step === "loading-vibe" && (
        <LoadingScreen
          message="Reading your vibe..."
          submessage="Our AI travel expert is analyzing your preferences and finding the perfect destinations"
        />
      )}

      {step === "destinations" && vibeResult && (
        <DestinationCards
          destinations={vibeResult.destinations}
          preferences={vibeResult.parsed_preferences}
          onGenerateItinerary={handleGenerateItinerary}
          isLoading={false}
        />
      )}

      {step === "loading-itinerary" && (
        <LoadingScreen
          message="Crafting your itinerary..."
          submessage="Optimizing routes, budgets, and experiences for the perfect trip"
        />
      )}

      {step === "itinerary" && itineraryPlan && (
        <ItineraryView plan={itineraryPlan} onStartOver={handleStartOver} />
      )}
    </div>
  );
};

export default Index;
