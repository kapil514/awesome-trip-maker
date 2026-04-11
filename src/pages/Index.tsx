import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import VibeForm from "@/components/VibeForm";
import DestinationCards from "@/components/DestinationCards";
import ItineraryView from "@/components/ItineraryView";
import LoadingScreen from "@/components/LoadingScreen";
import type { AppStep, VibeParseResult, Destination, SelectedPlan, TravelFilters } from "@/types/travel";

const STORAGE_KEY = "wanderlust_state";

interface PersistedState {
  step: AppStep;
  vibeResult: VibeParseResult | null;
  itineraryPlan: SelectedPlan | null;
  formData: { vibe: string; budget: string; departure_city: string; days: string; filters: TravelFilters } | null;
  selectedDestinations: Destination[] | null;
}

function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    // Don't restore loading states
    if (parsed.step === "loading-vibe" || parsed.step === "loading-itinerary") {
      parsed.step = parsed.vibeResult ? "destinations" : "input";
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

const Index = () => {
  const [initialized, setInitialized] = useState(false);
  const [step, setStep] = useState<AppStep>("input");
  const [vibeResult, setVibeResult] = useState<VibeParseResult | null>(null);
  const [itineraryPlan, setItineraryPlan] = useState<SelectedPlan | null>(null);
  const [formData, setFormData] = useState<PersistedState["formData"]>(null);
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[] | null>(null);

  // Restore state on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setStep(saved.step);
      setVibeResult(saved.vibeResult);
      setItineraryPlan(saved.itineraryPlan);
      setFormData(saved.formData);
      setSelectedDestinations(saved.selectedDestinations);
    }
    setInitialized(true);
  }, []);

  // Persist state on change
  useEffect(() => {
    if (!initialized) return;
    saveState({ step, vibeResult, itineraryPlan, formData, selectedDestinations });
  }, [step, vibeResult, itineraryPlan, formData, selectedDestinations, initialized]);

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
    setSelectedDestinations(destinations);
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
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to generate itinerary. Please try again.");
      setStep("destinations");
    }
  };

  const handleRegenerate = () => {
    if (selectedDestinations) {
      handleGenerateItinerary(selectedDestinations);
    }
  };

  const handleStartOver = () => {
    setStep("input");
    setVibeResult(null);
    setItineraryPlan(null);
    setSelectedDestinations(null);
    // Keep formData so the form is pre-filled
  };

  const handleBackToDestinations = () => {
    setStep("destinations");
    setItineraryPlan(null);
  };

  if (!initialized) return null;

  return (
    <div className="gradient-warm-subtle min-h-screen">
      {step === "input" && (
        <VibeForm onSubmit={handleVibeSubmit} isLoading={false} initialData={formData} />
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
        <ItineraryView
          plan={itineraryPlan}
          onStartOver={handleStartOver}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
};

export default Index;
