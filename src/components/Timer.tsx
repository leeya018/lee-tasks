import { useState, useEffect, useRef } from 'react';
import { Timer as TimerIcon, RotateCcw, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import timerSound from '@/assets/melech_sound.ogg';

const TIMER_OPTIONS = [
  { label: '5 min', seconds: 300 },
  { label: '15 min', seconds: 900 },
  { label: '30 min', seconds: 1800 },
];

interface TimerProps {
  onTimerStart?: () => void;
}

export function Timer({ onTimerStart }: TimerProps) {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(timerSound);
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            // Play sound when timer finishes
            if (audioRef.current) {
              audioRef.current.play();
            }
            // Show alert
            alert('Timer finished!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleSelectDuration = (seconds: number) => {
    // Stop any playing sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setSelectedDuration(seconds);
    setTimeLeft(seconds);
    setIsRunning(true);
    setIsFinished(false);
    onTimerStart?.();
  };

  const handleReset = () => {
    // Stop the sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    if (selectedDuration) {
      setTimeLeft(selectedDuration);
      setIsRunning(true);
      setIsFinished(false);
      onTimerStart?.();
    }
  };

  const handlePauseResume = () => {
    if (isFinished) return;
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card border rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <TimerIcon className="h-5 w-5 text-primary" />
        <span className="font-medium text-foreground">Timer</span>
      </div>

      {/* Timer Options */}
      <div className="flex gap-2 mb-3">
        {TIMER_OPTIONS.map((option) => (
          <Button
            key={option.seconds}
            variant={selectedDuration === option.seconds ? "default" : "outline"}
            size="sm"
            onClick={() => handleSelectDuration(option.seconds)}
            className="flex-1"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Countdown Display */}
      {selectedDuration !== null && (
        <div className="text-center">
          <div
            className={cn(
              'text-4xl font-mono font-bold mb-3 transition-colors',
              isFinished ? 'text-destructive animate-pulse' : 'text-foreground'
            )}
          >
            {formatTime(timeLeft)}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePauseResume}
              disabled={isFinished}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
