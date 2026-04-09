import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { budget, departure_city, days, destinations } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a travel planning optimizer.

Your job is to create the most cost-efficient and enjoyable itinerary given:
- Budget constraints
- Selected destinations
- Travel duration

You must:
- Stay within budget
- Prefer realistic travel routes
- Balance cost vs experience
- Avoid overly complex plans

Return ONLY valid JSON.`;

    const userPrompt = `Inputs:
- Total Budget: ${budget}
- Departure City: ${departure_city}
- Trip Duration: ${days} days
- Selected Destinations: ${JSON.stringify(destinations)}

Tasks:

1. Select the BEST 1 or 2 destinations (not all) based on:
   - total affordability
   - travel feasibility
   - experience quality

2. Create a cost breakdown:
   - flights_cost
   - accommodation_cost
   - local_transport_cost
   - activities_cost
   - buffer

3. Allocate number of days per destination

4. Generate a simple day-by-day itinerary (high-level activities)

5. Provide reasoning: why these destinations were selected and what tradeoffs were made

6. Also provide a short friendly summary (max 120 words) explaining why this trip is a good fit.

Constraints:
- Must not exceed total budget
- Prefer fewer cities if budget is tight
- Keep travel time reasonable

Output format:
{
  "selected_plan": {
    "destinations": [{ "city": "", "country": "", "days_allocated": 0 }],
    "cost_breakdown": {
      "flights_cost": 0,
      "accommodation_cost": 0,
      "local_transport_cost": 0,
      "activities_cost": 0,
      "buffer": 0,
      "total": 0,
      "currency": "INR"
    },
    "itinerary": [{ "day": 1, "location": "", "plan": "" }],
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
