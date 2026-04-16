import { useState, useEffect, useCallback, useRef } from 'react';
import { Copy, Check, MoreVertical, Pencil, Trash2, X, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface PromptCard {
  id: string;
  content: string;
  createdAt: string;
  copied?: boolean;
}

const STORAGE_KEY = 'prompts-data';

export default function Prompts() {
  const [prompts, setPrompts] = useState<PromptCard[]>([]);
  const [newContent, setNewContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [clearAllOpen, setClearAllOpen] = useState(false);

  const addTextareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPrompts(parsed.map((p: PromptCard & { title?: string }) => ({
          id: p.id,
          content: p.content,
          createdAt: p.createdAt,
          copied: p.copied ?? false,
        })));
      } catch {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    }
  }, [prompts, isLoaded]);

  useEffect(() => {
    if (isLoaded && addTextareaRef.current) {
      addTextareaRef.current.focus();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (editingId && editTextareaRef.current) {
      editTextareaRef.current.focus();
      const len = editTextareaRef.current.value.length;
      editTextareaRef.current.setSelectionRange(len, len);
    }
  }, [editingId]);

  const handleAdd = useCallback(() => {
    if (!newContent.trim()) return;
    const newPrompt: PromptCard = {
      id: crypto.randomUUID(),
      content: newContent.trim(),
      createdAt: new Date().toISOString(),
      copied: false,
    };
    setPrompts(prev => [...prev, newPrompt]);
    setNewContent('');
    toast.success('Prompt added!');
    setTimeout(() => addTextareaRef.current?.focus(), 0);
  }, [newContent]);

  const handleAddKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  }, [handleAdd]);

  const handleCopy = useCallback(async (prompt: PromptCard) => {
    if (prompt.copied) {
      await navigator.clipboard.writeText('');
      toast.error('You already used it', {
        style: { color: 'red' },
      });
      return;
    }
    await navigator.clipboard.writeText(prompt.content);
    setPrompts(prev => prev.map(p =>
      p.id === prompt.id ? { ...p, copied: true } : p
    ));
  }, []);

  const confirmClearAll = useCallback(() => {
    setPrompts([]);
    setEditingId(null);
    setClearAllOpen(false);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deleteTargetId) return;
    setPrompts(prev => prev.filter(p => p.id !== deleteTargetId));
    if (editingId === deleteTargetId) setEditingId(null);
    setDeleteTargetId(null);
  }, [deleteTargetId, editingId]);

  const startEdit = useCallback((prompt: PromptCard) => {
    setEditingId(prompt.id);
    setEditContent(prompt.content);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editContent.trim() || !editingId) return;
    setPrompts(prev => prev.map(p =>
      p.id === editingId ? { ...p, content: editContent.trim(), copied: false } : p
    ));
    setEditingId(null);
    setEditContent('');
  }, [editingId, editContent]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditContent('');
  }, []);

  const handleEditKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    }
    if (e.key === 'Escape') {
      cancelEdit();
    }
  }, [saveEdit, cancelEdit]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add textarea — always visible */}
      <Card>
        <CardContent className="p-4">
          <Textarea
            ref={addTextareaRef}
            placeholder="Type a prompt… Enter to add, Shift+Enter for new line"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            onKeyDown={handleAddKeyDown}
            rows={3}
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* Clear all button */}
      {prompts.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive gap-2"
            onClick={() => setClearAllOpen(true)}
          >
            <Eraser className="h-4 w-4" />
            Clear all
          </Button>
        </div>
      )}

      {/* Prompt Cards */}
      {prompts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No prompts yet. Type above and press Enter!</p>
        </div>
      ) : (
        prompts.map((prompt) => (
          <Card key={prompt.id} className="group">
            <CardContent className="p-4">
              {editingId === prompt.id ? (
                <div className="space-y-2">
                  <Textarea
                    ref={editTextareaRef}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={cancelEdit}>
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveEdit} disabled={!editContent.trim()}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <p className="flex-1 min-w-0 text-sm text-foreground whitespace-pre-wrap break-words">
                    {prompt.content}
                  </p>
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Copy button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 transition-colors ${prompt.copied ? 'text-green-500' : ''}`}
                      onClick={() => handleCopy(prompt)}
                    >
                      {prompt.copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>

                    {/* 3-dot menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startEdit(prompt)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTargetId(prompt.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}

      {/* Clear all confirmation modal */}
      <AlertDialog open={clearAllOpen} onOpenChange={setClearAllOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all prompts?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {prompts.length} prompt{prompts.length !== 1 ? 's' : ''}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmClearAll}
            >
              Clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation modal */}
      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => { if (!open) setDeleteTargetId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete prompt?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The prompt will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
