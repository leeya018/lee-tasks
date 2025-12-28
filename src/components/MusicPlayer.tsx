import { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Play, Pause } from 'lucide-react';

const PLAYLIST = [
  { id: 'w8l33K5D5CI', title: 'Beéle, Ovy On The Drums - mi refe' },
  { id: 'niG3YMU6jFk', title: 'Adele - Oh My God' },
  { id: '4MKsmDnjuD0', title: 'Thoth – Voice of the Infinite' },
  { id: '59EUOA9SOsc', title: 'Orhan Ölmez - Yani Olmuyor' },
  { id: 'aIsXLXEazM4', title: 'אריאלה ברוך - בלי כלום' },
  { id: 'sAz2bRy8-L8', title: 'Beyoncé - Rocket' },
  { id: 'eH4F1Tdb040', title: 'Stephen - Crossfire' },
];

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const MusicPlayer = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setIsApiReady(true);
    };
  }, []);

  // Initialize or update player
  useEffect(() => {
    if (!isApiReady || !containerRef.current) return;

    const currentSong = PLAYLIST[currentIndex];
    
    if (playerRef.current) {
      // Load new video if song changed
      playerRef.current.loadVideoById(currentSong.id);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    } else {
      // Create new player
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '0',
        width: '0',
        videoId: currentSong.id,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: currentSong.id,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (event: any) => {
            // 1 = playing, 2 = paused
            setIsPlaying(event.data === 1);
          },
        },
      });
    }
  }, [isApiReady, currentIndex]);

  const handleSongClick = useCallback((index: number) => {
    if (index === currentIndex) {
      // Toggle play/pause for current song
      if (playerRef.current) {
        if (isPlaying) {
          playerRef.current.pauseVideo();
        } else {
          playerRef.current.playVideo();
        }
      }
    } else {
      // Switch to new song
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  }, [currentIndex, isPlaying]);

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2 mb-3">
        <Music className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Music Playlist</span>
      </div>
      
      {/* Song List */}
      <div className="space-y-2">
        {PLAYLIST.map((song, index) => {
          const isCurrentSong = currentIndex === index;
          const showPause = isCurrentSong && isPlaying;
          
          return (
            <button
              key={song.id}
              onClick={() => handleSongClick(index)}
              className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${
                isCurrentSong 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              {showPause ? (
                <Pause className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Play className="h-4 w-4 flex-shrink-0" />
              )}
              <span className="text-sm">{song.title}</span>
              {isCurrentSong && isPlaying && (
                <span className="ml-auto text-xs text-muted-foreground animate-pulse">Playing</span>
              )}
              {isCurrentSong && !isPlaying && (
                <span className="ml-auto text-xs text-muted-foreground">Paused</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Hidden YouTube player container */}
      <div ref={containerRef} className="hidden" />
    </div>
  );
};

export { MusicPlayer };
