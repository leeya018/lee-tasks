import { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface PaymentItem {
  id: string;
  name: string;
  price: number;
  currency: 'USD' | 'NIS';
}

const STORAGE_KEY = 'monthly-payments';
const USD_TO_NIS_RATE = 3.7; // Approximate exchange rate

export const MonthlyPayments = () => {
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCurrency, setNewCurrency] = useState<'USD' | 'NIS'>('USD');
  const [deleteItem, setDeleteItem] = useState<PaymentItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse monthly payments:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const handleAddItem = () => {
    if (!newName.trim() || !newPrice.trim()) return;

    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) return;

    const newItem: PaymentItem = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      price,
      currency: newCurrency,
    };

    setItems([...items, newItem]);
    setNewName('');
    setNewPrice('');
  };

  const handleDeleteConfirm = () => {
    if (deleteItem) {
      setItems(items.filter((item) => item.id !== deleteItem.id));
      setDeleteItem(null);
    }
  };

  const calculateTotals = () => {
    let totalUSD = 0;
    let totalNIS = 0;

    items.forEach((item) => {
      if (item.currency === 'USD') {
        totalUSD += item.price;
        totalNIS += item.price * USD_TO_NIS_RATE;
      } else {
        totalNIS += item.price;
        totalUSD += item.price / USD_TO_NIS_RATE;
      }
    });

    return { totalUSD, totalNIS };
  };

  const { totalUSD, totalNIS } = calculateTotals();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  if (!isLoaded) return null;

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Monthly Payments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Totals */}
          <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted/50 border border-border/30">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total USD</p>
              <p className="text-lg font-bold text-primary">${totalUSD.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total NIS</p>
              <p className="text-lg font-bold text-primary">₪{totalNIS.toFixed(2)}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No payments added yet
              </p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-md bg-background/50 border border-border/30 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">
                      {item.currency === 'USD' ? '$' : '₪'}
                      {item.price.toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteItem(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add New Item */}
          <div className="flex gap-2">
            <Input
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-9 text-sm"
            />
            <Input
              type="number"
              placeholder="Price"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-20 h-9 text-sm"
              min="0"
              step="0.01"
            />
            <Select value={newCurrency} onValueChange={(v: 'USD' | 'NIS') => setNewCurrency(v)}>
              <SelectTrigger className="w-20 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">$</SelectItem>
                <SelectItem value="NIS">₪</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="icon"
              className="h-9 w-9"
              onClick={handleAddItem}
              disabled={!newName.trim() || !newPrice.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
