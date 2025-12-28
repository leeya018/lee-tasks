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

const PLAYER_ID = 'youtube-music-player';

const MusicPlayer = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    // Store callback before script loads
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube API Ready');
      setIsApiReady(true);
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    if (!isApiReady) return;
    
    // Make sure the container exists
    const container = document.getElementById(PLAYER_ID);
    if (!container) {
      console.log('Container not found');
      return;
    }

    if (playerRef.current) {
      // Player already exists, load new video
      const currentSong = PLAYLIST[currentIndex];
      playerRef.current.loadVideoById({
        videoId: currentSong.id,
        startSeconds: 0,
      });
      return;
    }

    // Create new player
    const currentSong = PLAYLIST[currentIndex];
    console.log('Creating YouTube player for:', currentSong.title);
    
    playerRef.current = new window.YT.Player(PLAYER_ID, {
      height: '1',
      width: '1',
      videoId: currentSong.id,
      playerVars: {
        autoplay: 1,
        loop: 1,
        playlist: currentSong.id,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (event: any) => {
          console.log('Player ready');
          setIsPlayerReady(true);
          event.target.playVideo();
        },
        onStateChange: (event: any) => {
          console.log('Player state:', event.data);
          // -1 = unstarted, 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = cued
          if (event.data === 1) {
            setIsPlaying(true);
          } else if (event.data === 2) {
            setIsPlaying(false);
          } else if (event.data === 0) {
            // Song ended - play next song (loop to beginning if at end)
            setIsPlaying(false);
            const nextIndex = (currentIndex + 1) % PLAYLIST.length;
            setCurrentIndex(nextIndex);
            const nextSong = PLAYLIST[nextIndex];
            playerRef.current?.loadVideoById({
              videoId: nextSong.id,
              startSeconds: 0,
            });
          }
        },
        onError: (event: any) => {
          console.error('YouTube player error:', event.data);
        },
      },
    });
  }, [isApiReady, currentIndex]);

  const handleSongClick = useCallback((index: number) => {
    if (!playerRef.current || !isPlayerReady) {
      console.log('Player not ready yet');
      return;
    }

    if (index === currentIndex) {
      // Toggle play/pause for current song
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } else {
      // Switch to new song
      setCurrentIndex(index);
      const newSong = PLAYLIST[index];
      playerRef.current.loadVideoById({
        videoId: newSong.id,
        startSeconds: 0,
      });
    }
  }, [currentIndex, isPlaying, isPlayerReady]);

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
              {isCurrentSong && !isPlaying && isPlayerReady && (
                <span className="ml-auto text-xs text-muted-foreground">Paused</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Hidden YouTube player - must use ID for YouTube API */}
      <div 
        id={PLAYER_ID} 
        className="absolute -left-[9999px] w-1 h-1 overflow-hidden"
      />
    </div>
  );
};

export { MusicPlayer };
