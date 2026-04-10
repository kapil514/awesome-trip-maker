import { useEffect, useRef } from "react";
import type { ItineraryDay } from "@/types/travel";
import "leaflet/dist/leaflet.css";

interface TripMapProps {
  itinerary: ItineraryDay[];
  destinations: { city: string; country: string; lat?: number; lng?: number }[];
}

const TripMap = ({ itinerary, destinations }: TripMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import("leaflet");

      // Fix default icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      // Collect all coordinates
      const points: [number, number][] = [];

      destinations.forEach((d) => {
        if (d.lat && d.lng) points.push([d.lat, d.lng]);
      });

      // Collect activity coordinates
      itinerary.forEach((day) => {
        day.time_slots?.forEach((slot) => {
          slot.activities?.forEach((a) => {
            if (a.lat && a.lng) points.push([a.lat, a.lng]);
          });
        });
      });

      if (points.length === 0) {
        // Default to center of the world
        points.push([20, 78]);
      }

      const map = L.map(mapRef.current!, {
        scrollWheelZoom: false,
      }).setView(points[0], 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Add destination markers
      destinations.forEach((d) => {
        if (d.lat && d.lng) {
          L.marker([d.lat, d.lng])
            .addTo(map)
            .bindPopup(`<strong>${d.city}</strong><br/>${d.country}`);
        }
      });

      // Add activity markers per day with different colors
      const dayColors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c", "#e67e22"];

      itinerary.forEach((day, dayIdx) => {
        const dayPoints: [number, number][] = [];

        day.time_slots?.forEach((slot) => {
          slot.activities?.forEach((a) => {
            if (a.lat && a.lng) {
              dayPoints.push([a.lat, a.lng]);

              const color = dayColors[dayIdx % dayColors.length];
              const icon = L.divIcon({
                html: `<div style="background:${color};width:10px;height:10px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
                className: "",
                iconSize: [14, 14],
                iconAnchor: [7, 7],
              });

              L.marker([a.lat, a.lng], { icon })
                .addTo(map)
                .bindPopup(`<strong>Day ${day.day}: ${a.title}</strong><br/>${a.time} · ${a.duration}`);
            }
          });
        });

        // Draw route lines per day
        if (dayPoints.length > 1) {
          L.polyline(dayPoints, {
            color: dayColors[dayIdx % dayColors.length],
            weight: 3,
            opacity: 0.7,
            dashArray: "8, 4",
          }).addTo(map);
        }
      });

      // Fit bounds
      if (points.length > 1) {
        map.fitBounds(L.latLngBounds(points), { padding: [30, 30] });
      }

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [itinerary, destinations]);

  return (
    <div className="glass-card overflow-hidden">
      <div ref={mapRef} style={{ height: "400px", width: "100%" }} />
      <div className="p-3 flex flex-wrap gap-2">
        {itinerary.map((day, i) => (
          <div key={day.day} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c", "#e67e22"][i % 7] }}
            />
            Day {day.day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripMap;
