import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { vibe, budget, departure_city, days } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert travel intelligence engine.

Your job is to convert vague travel "vibe" descriptions into:
1. Structured travel preferences
2. Candidate destinations (cities) that match the vibe

You must:
- Think like a travel expert, not a generic assistant
- Prefer realistic, budget-aware suggestions
- Avoid luxury-only destinations unless explicitly requested
- Focus on places that are actually travelable and popular

Return ONLY valid JSON. No explanations outside JSON.`;

    const userPrompt = `User Input:
- Vibe: ${vibe}
- Budget: ${budget}
- Departure City: ${departure_city}
- Trip Duration: ${days} days

Tasks:

1. Extract structured attributes:
   - trip_type (e.g., relaxing, adventure, cultural, party, romantic)
   - environment (beach, mountains, city, countryside, mixed)
   - pace (slow, moderate, fast)
   - budget_level (low, medium, high)
   - crowd_preference (low, medium, high)
   - aesthetic_keywords (list of descriptive keywords)

2. Suggest 5 best-fit destinations (cities, not countries):
   Each destination must include:
   - city
   - country
   - why_it_matches (1 short sentence)
   - avg_daily_cost (in USD, rough estimate)
   - best_for (2–3 tags)

3. Rank destinations based on:
   - vibe match
   - affordability from departure city

Output format:
{
  "parsed_preferences": {
    "trip_type": "",
    "environment": "",
    "pace": "",
    "budget_level": "",
    "crowd_preference": "",
    "aesthetic_keywords": []
  },
  "destinations": [
    {
      "city": "",
      "country": "",
      "why_it_matches": "",
      "avg_daily_cost": 0,
      "best_for": [],
      "score": 0
    }
  ]
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
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
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
    
    // Extract JSON from response
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
