import { useState } from "react";
import { Activity } from "@/types/travel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Pencil, Trash2, Check, X, GripVertical } from "lucide-react";

interface EditableActivityCardProps {
  activity: Activity;
  onUpdate: (updated: Activity) => void;
  onDelete: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const EditableActivityCard = ({ activity, onUpdate, onDelete, dragHandleProps }: EditableActivityCardProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Activity>(activity);

  const startEdit = () => {
    setDraft({ ...activity });
    setEditing(true);
  };

  const save = () => {
    onUpdate(draft);
    setEditing(false);
  };

  const cancel = () => setEditing(false);

  if (editing) {
    return (
      <div className="glass-card p-3 space-y-2 border border-primary/20">
        <div className="grid grid-cols-2 gap-2">
          <Input
            value={draft.time}
            onChange={(e) => setDraft({ ...draft, time: e.target.value })}
            placeholder="Time (e.g. 9:00 AM)"
            className="text-xs h-8"
          />
          <Input
            value={draft.duration}
            onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
            placeholder="Duration"
            className="text-xs h-8"
          />
        </div>
        <Input
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="Activity title"
          className="text-sm h-8"
        />
        <Input
          value={draft.notes || ""}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          placeholder="Notes (optional)"
          className="text-xs h-8"
        />
        <div className="flex gap-1 justify-end">
          <Button variant="ghost" size="sm" onClick={cancel} className="h-7 px-2">
            <X className="w-3 h-3 mr-1" /> Cancel
          </Button>
          <Button variant="default" size="sm" onClick={save} className="h-7 px-2">
            <Check className="w-3 h-3 mr-1" /> Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 group">
      <div {...dragHandleProps} className="cursor-grab opacity-0 group-hover:opacity-50 transition-opacity pt-1">
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="text-xs text-muted-foreground w-16 shrink-0 pt-0.5 flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {activity.time}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{activity.title}</p>
        <p className="text-xs text-muted-foreground">{activity.duration}</p>
        {activity.notes && <p className="text-xs text-muted-foreground mt-0.5">{activity.notes}</p>}
        {activity.dietary_tags?.length ? (
          <div className="flex gap-1 mt-1">
            {activity.dietary_tags.map((t) => (
              <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700">{t}</span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={startEdit}>
          <Pencil className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={onDelete}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default EditableActivityCard;
