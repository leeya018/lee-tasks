import { format, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DateNavigationProps {
  selectedDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export function DateNavigation({
  selectedDate,
  onPreviousDay,
  onNextDay,
  onToday,
}: DateNavigationProps) {
  const isCurrentDay = isToday(selectedDate);
  const dateDisplay = isCurrentDay
    ? `Today, ${format(selectedDate, 'MMM d')}`
    : format(selectedDate, 'EEEE, MMM d, yyyy');

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPreviousDay}
        className="h-10 w-10 shrink-0"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="flex flex-col items-center gap-1 min-w-0">
        <h2 className="text-lg font-semibold text-foreground truncate">
          {dateDisplay}
        </h2>
        {!isCurrentDay && (
          <Button
            variant="link"
            size="sm"
            onClick={onToday}
            className="h-auto p-0 text-primary"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Jump to Today
          </Button>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNextDay}
        className="h-10 w-10 shrink-0"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}