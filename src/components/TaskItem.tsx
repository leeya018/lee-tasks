import { useState } from 'react';
import { Check, Pencil, Trash2, ArrowRight, Copy, X, Star, GripVertical } from 'lucide-react';
import { Task } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onMoveToNextDay: (id: string) => void;
  onCopyToNextDay: (id: string) => void;
  onToggleStar: (id: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function TaskItem({
  task,
  onToggle,
  onUpdate,
  onDelete,
  onMoveToNextDay,
  onCopyToNextDay,
  onToggleStar,
  dragHandleProps,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(task.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 py-2 animate-fade-in">
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 h-8 text-sm"
          autoFocus
        />
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancel}>
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2 py-2 animate-fade-in">
      <div 
        {...dragHandleProps} 
        className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Checkbox
        checked={task.done}
        onCheckedChange={() => onToggle(task.id)}
        className="shrink-0"
      />
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 shrink-0"
        onClick={() => onToggleStar(task.id)}
        title={task.starred ? "Remove star" : "Add star"}
      >
        <Star 
          className={cn(
            "h-3.5 w-3.5 transition-colors",
            task.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
          )} 
        />
      </Button>
      <span
        className={cn(
          'flex-1 text-sm transition-all duration-200 flex items-center gap-2',
          task.done && 'line-through text-muted-foreground'
        )}
      >
        {task.text}
        {task.done && <Check className="h-4 w-4 text-green-500 shrink-0" />}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => setIsEditing(true)}
          title="Edit task"
        >
          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => onCopyToNextDay(task.id)}
          title="Copy to next day"
        >
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => onMoveToNextDay(task.id)}
          title="Move to next day"
        >
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => onDelete(task.id)}
          title="Delete task"
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </div>
    </div>
  );
}