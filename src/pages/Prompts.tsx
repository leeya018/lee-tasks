import { useState, useEffect, useCallback } from 'react';
import { Plus, Copy, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface PromptCard {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const STORAGE_KEY = 'prompts-data';

export default function Prompts() {
  const [prompts, setPrompts] = useState<PromptCard[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPrompts(JSON.parse(saved));
      } catch {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    }
  }, [prompts, isLoaded]);

  const handleAdd = useCallback(() => {
    if (!newContent.trim()) return;
    const newPrompt: PromptCard = {
      id: crypto.randomUUID(),
      title: newTitle.trim() || 'Untitled',
      content: newContent.trim(),
      createdAt: new Date().toISOString(),
    };
    setPrompts(prev => [...prev, newPrompt]);
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
    toast.success('Prompt added to the list!');
  }, [newTitle, newContent]);

  const handleCopy = useCallback(async (prompt: PromptCard) => {
    await navigator.clipboard.writeText(prompt.content);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Button */}
      {!isAdding ? (
        <Button onClick={() => setIsAdding(true)} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add New Prompt
        </Button>
      ) : (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Input
              placeholder="Title (optional)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Textarea
              placeholder="Enter your prompt..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => { setIsAdding(false); setNewTitle(''); setNewContent(''); }}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAdd} disabled={!newContent.trim()}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prompt Cards - oldest first (natural order) */}
      {prompts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No prompts yet. Add your first one!</p>
        </div>
      ) : (
        prompts.map((prompt) => (
          <Card key={prompt.id} className="group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-foreground mb-1">{prompt.title}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{prompt.content}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 transition-colors ${copiedId === prompt.id ? 'text-green-500' : ''}`}
                    onClick={() => handleCopy(prompt)}
                  >
                    {copiedId === prompt.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(prompt.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
