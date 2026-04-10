import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { budget, departure_city, days, destinations, filters } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const filtersBlock = filters ? `
User Filters:
- Dietary: ${(filters.dietary || []).join(", ") || "none"}
- Travel Style: ${filters.travel_style || "any"}
- Interests: ${(filters.interests || []).join(", ") || "any"}
- Constraints: ${(filters.constraints || []).join(", ") || "none"}` : "";

    const systemPrompt = `You are a travel planning optimizer that creates detailed, structured itineraries.

You must:
- Stay within budget
- Prefer realistic travel routes
- Balance cost vs experience
- Avoid overly complex plans
- Provide time-slotted activities (morning/afternoon/evening)
- Include food recommendations with dietary tags
- Suggest accommodation areas with tags
- Respect user dietary and constraint preferences

Return ONLY valid JSON.`;

    const userPrompt = `Inputs:
- Total Budget: ${budget}
- Departure City: ${departure_city}
- Trip Duration: ${days} days
- Selected Destinations: ${JSON.stringify(destinations)}
${filtersBlock}

Tasks:

1. Select the BEST 1 or 2 destinations based on affordability, feasibility, and experience quality.

2. Create a cost breakdown:
   - flights_cost, accommodation_cost, local_transport_cost, activities_cost, food_cost, buffer, total, currency (INR)

3. For EACH day, provide:
   - day number, location
   - plan (brief summary)
   - time_slots: array of 3 slots (Morning, Afternoon, Evening), each with activities:
     - time (e.g. "9:00 AM"), title, duration, type (activity/food/transport/rest), notes, dietary_tags (if food), lat, lng
   - food_spots: 2-3 restaurant recommendations per day with name, cuisine, dietary_tags, price_range, must_try_dish
   - travel_tip: one practical tip for that day

4. Provide 3-6 stay_recommendations:
   - area, why (1 sentence), budget_tier (budget/mid-range/luxury), tags (e.g. "near nightlife", "strong WiFi", "good for couples"), price_per_night_estimate

5. For each destination include approximate lat/lng coordinates.

6. Provide reasoning and a friendly summary (max 120 words).

Output format:
{
  "selected_plan": {
    "destinations": [{ "city": "", "country": "", "days_allocated": 0, "lat": 0, "lng": 0 }],
    "cost_breakdown": {
      "flights_cost": 0, "accommodation_cost": 0, "local_transport_cost": 0,
      "activities_cost": 0, "food_cost": 0, "buffer": 0, "total": 0, "currency": "INR"
    },
    "itinerary": [{
      "day": 1, "location": "", "plan": "",
      "time_slots": [
        { "label": "Morning", "activities": [{ "time": "9:00 AM", "title": "", "duration": "2 hours", "type": "activity", "notes": "", "lat": 0, "lng": 0 }] },
        { "label": "Afternoon", "activities": [] },
        { "label": "Evening", "activities": [] }
      ],
      "food_spots": [{ "name": "", "cuisine": "", "dietary_tags": [], "price_range": "", "must_try_dish": "" }],
      "travel_tip": ""
    }],
    "stay_recommendations": [{ "area": "", "why": "", "budget_tier": "mid-range", "tags": [], "price_per_night_estimate": 0 }],
    "reasoning": { "selection_reason": "", "tradeoffs": "" },
    "friendly_summary": ""
  }
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    } catch {
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: content }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
