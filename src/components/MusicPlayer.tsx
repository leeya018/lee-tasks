import { Music } from 'lucide-react';

const MusicPlayer = () => {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Music className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Background Music</p>
          <p className="text-xs text-muted-foreground">Press play to start</p>
        </div>
      </div>
      {/* Mini YouTube player */}
      <iframe
        className="w-full h-14 rounded"
        src="https://www.youtube.com/embed/w8l33K5D5CI?loop=1&playlist=w8l33K5D5CI"
        title="Background Music"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export { MusicPlayer };
