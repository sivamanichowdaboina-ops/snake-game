import React, { useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

export interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  duration: string;
  genre: string;
}

export const TRACKS: Track[] = [
  {
    id: 1,
    title: "NEON HORIZON",
    artist: "SYNTHAI // PROTOCOL 1",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "03:45",
    genre: "SYNTHWAVE"
  },
  {
    id: 2,
    title: "CYBER DRIFT",
    artist: "GLITCHBOT // VOID",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "04:12",
    genre: "CYBERPUNK"
  },
  {
    id: 3,
    title: "DIGITAL RAIN",
    artist: "BYTEBEATS // CORE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "02:58",
    genre: "GLITCH-HOP"
  }
];

interface MusicPlayerProps {
  currentTrackIndex: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onTrackSelect: (index: number) => void;
  progress: number;
  onProgressUpdate: (progress: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrackIndex,
  isPlaying,
  onPlayPause,
  onSkipForward,
  onSkipBackward,
  onTrackSelect,
  progress,
  onProgressUpdate,
  audioRef
}) => {
  const currentTrack = TRACKS[currentTrackIndex];

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        onProgressUpdate((current / duration) * 100);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = (parseFloat(e.target.value) / 100) * (audioRef.current?.duration || 0);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTo;
    }
    onProgressUpdate(parseFloat(e.target.value));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onSkipForward}
      />
      
      {/* Sidebar Controls */}
      <div className="bg-surface p-6 border border-neon-cyan/20 relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-pink opacity-0 group-hover:opacity-10 transition-opacity blur"></div>
        <div className="h-1 bg-white/10 mb-6 relative">
          <div 
            className="absolute left-0 top-0 h-full bg-neon-cyan shadow-[0_0_8px_var(--color-neon-cyan)] transition-all"
            style={{ width: `${progress}%` }}
          ></div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-center gap-6">
          <button onClick={onSkipBackward} className="text-white hover:text-neon-pink transition-colors">
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button
            onClick={onPlayPause}
            className="w-12 h-12 bg-neon-cyan text-black rounded-sm flex items-center justify-center hover:bg-neon-pink transition-all shadow-[4px_4px_0_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="translate-x-0.5" />}
          </button>
          
          <button onClick={onSkipForward} className="text-white hover:text-neon-pink transition-colors">
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Playlist */}
      <div className="flex flex-col gap-2">
        <div className="text-[9px] font-black text-white/30 tracking-[0.4em] mb-2 uppercase">// SIGNAL_QUEUE</div>
        {TRACKS.map((track, index) => (
          <button
            key={track.id}
            onClick={() => onTrackSelect(index)}
            className={`flex items-center justify-between p-4 transition-all border-l-3 group relative ${
              currentTrackIndex === index 
                ? 'bg-neon-pink/10 border-neon-pink text-neon-cyan' 
                : 'bg-white/[0.02] border-transparent hover:bg-neon-cyan/5 text-white/60'
            }`}
          >
            <div className="flex flex-col items-start text-left z-10">
              <span className={`text-[12px] font-black tracking-tight uppercase ${currentTrackIndex === index ? 'glitch-text' : ''}`} data-text={track.title}>{track.title}</span>
              <span className="text-[9px] font-mono uppercase tracking-widest mt-0.5 opacity-50">
                {track.duration} // STRE_ID_{track.id.toString().padStart(2, '0')}
              </span>
            </div>
            
            {currentTrackIndex === index && isPlaying && (
              <div className="flex items-end gap-1 h-4 z-10">
                <div className="w-1 bg-neon-pink animate-[music-bar_0.4s_ease-in-out_infinite]"></div>
                <div className="w-1 bg-neon-cyan animate-[music-bar_0.6s_ease-in-out_infinite]"></div>
                <div className="w-1 bg-neon-pink animate-[music-bar_0.5s_ease-in-out_infinite]"></div>
              </div>
            )}
            
            {/* Visual glitch on hover */}
            <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
      `}</style>
    </div>
  );
};
