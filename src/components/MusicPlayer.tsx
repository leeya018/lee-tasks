import { Music } from 'lucide-react';

const MusicPlayer = () => {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Music className="h-4 w-4 text-primary animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">לב טהור - יצחק מאיר</p>
          <p className="text-xs text-muted-foreground">Now playing</p>
        </div>
      </div>
      {/* Hidden YouTube player for audio */}
      <iframe
        className="h-0 w-0 absolute opacity-0 pointer-events-none"
        src="https://www.youtube.com/embed/w8l33K5D5CI?autoplay=1&loop=1&playlist=w8l33K5D5CI"
        title="Background Music"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export { MusicPlayer };
