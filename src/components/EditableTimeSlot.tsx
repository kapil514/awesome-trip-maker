import { useState, useCallback } from "react";
import { TimeSlot, Activity } from "@/types/travel";
import { Button } from "@/components/ui/button";
import { Sun, Sunset, Moon, Plus } from "lucide-react";
import EditableActivityCard from "./EditableActivityCard";

const slotIcons: Record<string, typeof Sun> = { Morning: Sun, Afternoon: Sunset, Evening: Moon };
const slotColors: Record<string, string> = {
  Morning: "from-amber-100 to-orange-100",
  Afternoon: "from-orange-100 to-rose-100",
  Evening: "from-indigo-100 to-purple-100",
};

interface EditableTimeSlotProps {
  slot: TimeSlot;
  onSlotChange: (updated: TimeSlot) => void;
}

const EditableTimeSlot = ({ slot, onSlotChange }: EditableTimeSlotProps) => {
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const SlotIcon = slotIcons[slot.label] || Sun;
  const activities = slot.activities || [];

  const updateActivity = useCallback((idx: number, updated: Activity) => {
    const arr = [...activities];
    arr[idx] = updated;
    onSlotChange({ ...slot, activities: arr });
  }, [activities, slot, onSlotChange]);

  const deleteActivity = useCallback((idx: number) => {
    onSlotChange({ ...slot, activities: activities.filter((_, i) => i !== idx) });
  }, [activities, slot, onSlotChange]);

  const addActivity = () => {
    const newActivity: Activity = {
      time: slot.label === "Morning" ? "9:00 AM" : slot.label === "Afternoon" ? "2:00 PM" : "7:00 PM",
      title: "New Activity",
      duration: "1 hour",
      type: "activity",
    };
    onSlotChange({ ...slot, activities: [...activities, newActivity] });
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === targetIdx) return;
    const arr = [...activities];
    const [moved] = arr.splice(dragIdx, 1);
    arr.splice(targetIdx, 0, moved);
    onSlotChange({ ...slot, activities: arr });
    setDragIdx(targetIdx);
  };

  const handleDragEnd = () => setDragIdx(null);

  return (
    <div className="glass-card overflow-hidden">
      <div className={`bg-gradient-to-r ${slotColors[slot.label] || ""} px-4 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <SlotIcon className="w-4 h-4 text-foreground" />
          <span className="text-sm font-semibold text-foreground">{slot.label}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={addActivity} className="h-6 px-2 text-xs gap-1">
          <Plus className="w-3 h-3" /> Add
        </Button>
      </div>
      <div className="p-4 space-y-3">
        {activities.map((activity, ai) => (
          <div
            key={ai}
            draggable
            onDragStart={() => handleDragStart(ai)}
            onDragOver={(e) => handleDragOver(e, ai)}
            onDragEnd={handleDragEnd}
            className={`transition-opacity ${dragIdx === ai ? "opacity-50" : ""}`}
          >
            <EditableActivityCard
              activity={activity}
              onUpdate={(updated) => updateActivity(ai, updated)}
              onDelete={() => deleteActivity(ai)}
            />
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-sm text-muted-foreground italic">Free time — explore on your own!</p>
        )}
      </div>
    </div>
  );
};

export default EditableTimeSlot;
