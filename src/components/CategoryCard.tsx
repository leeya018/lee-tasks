import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, ArrowRight, Copy, Link, ExternalLink } from 'lucide-react';
import { Category, Task, CategoryColor, COLOR_CLASSES, CATEGORY_COLORS } from '@/types/task';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TaskItem } from './TaskItem';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface CategoryCardProps {
  category: Category;
  tasks: Task[];
  onUpdateCategory: (id: string, name: string, color: CategoryColor) => void;
  onDeleteCategory: (id: string) => void;
  onAddTask: (categoryId: string, text: string) => void;
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, text: string) => void;
  onDeleteTask: (id: string) => void;
  onMoveTaskToDate: (id: string, date: Date) => void;
  onCopyTaskToNextDay: (id: string) => void;
  onMoveCategoryTasksToNextDay: (categoryId: string) => void;
  onCopyCategoryTasksToNextDay: (categoryId: string) => void;
  onToggleTaskStar: (id: string) => void;
  onReorderTasks: (categoryId: string, fromIndex: number, toIndex: number) => void;
  onAddCategoryLink: (categoryId: string, name: string, url: string) => void;
  onDeleteCategoryLink: (categoryId: string, linkId: string) => void;
}

export function CategoryCard({
  category,
  tasks,
  onUpdateCategory,
  onDeleteCategory,
  onAddTask,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTaskToDate,
  onCopyTaskToNextDay,
  onMoveCategoryTasksToNextDay,
  onCopyCategoryTasksToNextDay,
  onToggleTaskStar,
  onReorderTasks,
  onAddCategoryLink,
  onDeleteCategoryLink,
}: CategoryCardProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [editColor, setEditColor] = useState<CategoryColor>(category.color);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [linksOpen, setLinksOpen] = useState(false);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const colorClasses = COLOR_CLASSES[category.color];
  const links = category.links || [];

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask(category.id, newTaskText.trim());
      setNewTaskText('');
    }
  };

  const handleAddLink = () => {
    if (newLinkName.trim() && newLinkUrl.trim()) {
      let url = newLinkUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      onAddCategoryLink(category.id, newLinkName.trim(), url);
      setNewLinkName('');
      setNewLinkUrl('');
    }
  };

  const handleOpenAllLinks = () => {
    links.forEach((link) => {
      window.open(link.url, '_blank');
    });
  };

  const handleSaveCategory = () => {
    if (editName.trim()) {
      onUpdateCategory(category.id, editName.trim(), editColor);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditName(category.name);
    setEditColor(category.color);
    setIsEditing(false);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      onReorderTasks(category.id, draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <Card className="animate-fade-in overflow-hidden">
      <CardHeader className="pb-3">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Category name"
              className="font-medium"
              autoFocus
            />
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setEditColor(color)}
                  className={cn(
                    'h-6 w-6 rounded-full transition-all',
                    COLOR_CLASSES[color].bg,
                    editColor === color && 'ring-2 ring-offset-2 ring-foreground'
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveCategory}>
                <Check className="h-4 w-4 mr-1" /> Save
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn('h-3 w-3 rounded-full', colorClasses.bg)} />
              <h3 className="font-semibold text-foreground">{category.name}</h3>
              <span className="text-xs text-muted-foreground">
                ({tasks.length} {tasks.length === 1 ? 'task' : 'tasks'})
              </span>
              {links.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  • {links.length} {links.length === 1 ? 'link' : 'links'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {links.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1 text-xs"
                  onClick={handleOpenAllLinks}
                  title="Open all links"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open All
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setLinksOpen(!linksOpen)}
                title="Manage links"
              >
                <Link className={cn("h-4 w-4", linksOpen ? "text-primary" : "text-muted-foreground")} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onCopyCategoryTasksToNextDay(category.id)}
                title="Copy all tasks to next day"
              >
                <Copy className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onMoveCategoryTasksToNextDay(category.id)}
                title="Move all tasks to next day"
              >
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Category</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{category.name}"? This will also delete all tasks in this category across all dates.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDeleteCategory(category.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </CardHeader>

      {/* Links Section */}
      <Collapsible open={linksOpen} onOpenChange={setLinksOpen}>
        <CollapsibleContent>
          <div className="px-6 pb-3 border-b">
            <div className="space-y-2">
              {links.map((link) => (
                <div key={link.id} className="flex items-center gap-2 group">
                  <Link className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline truncate flex-1"
                  >
                    {link.name}
                  </a>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDeleteCategoryLink(category.id, link.id)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <Input
                  placeholder="Link name"
                  value={newLinkName}
                  onChange={(e) => setNewLinkName(e.target.value)}
                  className="h-8 text-sm flex-1"
                />
                <Input
                  placeholder="URL"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                  className="h-8 text-sm flex-1"
                />
                <Button 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={handleAddLink}
                  disabled={!newLinkName.trim() || !newLinkUrl.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <CardContent className="pt-3">
        <div className="space-y-1 mb-3">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No tasks yet</p>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "transition-all",
                  dragOverIndex === index && draggedIndex !== index && "border-t-2 border-primary"
                )}
              >
                <TaskItem
                  task={task}
                  onToggle={onToggleTask}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                  onMoveToDate={onMoveTaskToDate}
                  onCopyToNextDay={onCopyTaskToNextDay}
                  onToggleStar={onToggleTaskStar}
                />
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add a task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            className="h-9 text-sm"
          />
          <Button size="sm" onClick={handleAddTask} disabled={!newTaskText.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}