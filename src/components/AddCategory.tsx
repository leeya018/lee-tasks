import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CategoryColor, CATEGORY_COLORS, COLOR_CLASSES } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AddCategoryProps {
  onAdd: (name: string, color: CategoryColor) => void;
}

export function AddCategory({ onAdd }: AddCategoryProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState<CategoryColor>('blue');

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name.trim(), selectedColor);
      setName('');
      setSelectedColor('blue');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setSelectedColor('blue');
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <Button
        variant="outline"
        className="w-full h-12 border-dashed"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Category
      </Button>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-4 space-y-4">
        <Input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Choose a color</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  'h-8 w-8 rounded-full transition-all',
                  COLOR_CLASSES[color].bg,
                  selectedColor === color && 'ring-2 ring-offset-2 ring-foreground scale-110'
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={!name.trim()} className="flex-1">
            Add Category
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}