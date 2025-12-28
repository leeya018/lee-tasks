import { useState } from 'react';
import { Music, Play } from 'lucide-react';

const PLAYLIST = [
  { id: 'w8l33K5D5CI', title: 'Song 1' },
  { id: 'niG3YMU6jFk', title: 'Song 2' },
  { id: '4MKsmDnjuD0', title: 'Song 3' },
];

const MusicPlayer = () => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handlePlay = (index: number) => {
    setCurrentIndex(index);
  };

  const currentSong = currentIndex !== null ? PLAYLIST[currentIndex] : null;

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2 mb-3">
        <Music className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Music Playlist</span>
      </div>
      
      {/* Song List */}
      <div className="space-y-2">
        {PLAYLIST.map((song, index) => (
          <button
            key={song.id}
            onClick={() => handlePlay(index)}
            className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${
              currentIndex === index 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted text-foreground'
            }`}
          >
            <Play className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{song.title}</span>
            {currentIndex === index && (
              <span className="ml-auto text-xs text-muted-foreground animate-pulse">Playing</span>
            )}
          </button>
        ))}
      </div>

      {/* Hidden player - only loads when a song is selected */}
      {currentSong && (
        <iframe
          className="w-full h-14 rounded mt-3"
          src={`https://www.youtube.com/embed/${currentSong.id}?autoplay=1&loop=1&playlist=${currentSong.id}`}
          title="Music Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      )}
    </div>
  );
};

export { MusicPlayer };
