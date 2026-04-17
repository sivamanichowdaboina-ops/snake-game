/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer, TRACKS } from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Music State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) setHighScore(newScore);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="h-screen w-screen bg-bg text-white font-sans flex flex-col border-[8px] border-neon-cyan/50 overflow-hidden relative">
      {/* Static Overlay */}
      <div className="absolute inset-0 static-bg pointer-events-none z-50"></div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-40"></div>

      {/* Header */}
      <header className="h-[120px] px-10 flex justify-between items-center border-b border-neon-pink/30 shrink-0 bg-surface">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] text-neon-pink mb-1 font-black glitch-text" data-text="DATA_HARVEST">DATA_HARVEST</span>
          <span className="font-mono text-[54px] font-black leading-none text-neon-cyan">
            {score.toString().padStart(4, '0')}
          </span>
        </div>

        <div className="text-right">
          <h1 className="text-[42px] font-black uppercase tracking-[-0.05em] leading-none mb-1 text-white glitch-text" data-text={currentTrack.title.toUpperCase()}>
            {currentTrack.title}
          </h1>
          <p className="font-mono text-neon-pink text-[14px] font-black uppercase tracking-tighter">
            {currentTrack.artist} // ERR_0XFF
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-8 gap-8 relative">
        {/* Game Viewport */}
        <section className="flex-1 bg-black flex items-center justify-center relative overflow-hidden border-2 border-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.3)]">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_#ff00ff_0%,_transparent_70%)]"></div>
          <SnakeGame onScoreChange={handleScoreChange} />
        </section>

        {/* Sidebar */}
        <aside className="w-[320px] flex flex-col shrink-0 gap-6">
          <div className="text-[10px] uppercase tracking-[0.5em] text-neon-cyan font-black border-b border-neon-cyan/20 pb-2">AUDIO_FEED_01</div>
          <MusicPlayer 
            currentTrackIndex={currentTrackIndex}
            isPlaying={isPlaying}
            onPlayPause={togglePlay}
            onSkipForward={skipForward}
            onSkipBackward={skipBackward}
            onTrackSelect={selectTrack}
            progress={progress}
            onProgressUpdate={setProgress}
            audioRef={audioRef}
          />
        </aside>
      </main>

      {/* Footer */}
      <footer className="h-[60px] px-10 flex items-center justify-between bg-black font-mono text-[11px] text-white/50 uppercase tracking-[0.2em] shrink-0 border-t border-neon-cyan/20">
        <div className="glitch-text" data-text="OS: RETRO_CORE_V4 // SECTOR_7G">OS: RETRO_CORE_V4 // SECTOR_7G // HIGH_VAL: {highScore.toString().padStart(4, '0')}</div>
        <div className="flex items-center gap-6">
          <span className="text-neon-pink font-black tracking-tighter uppercase">[INPUT: WASD]</span>
          {/* Visualizer */}
          <div className="flex items-end gap-1 h-5">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1 ${i % 2 === 0 ? 'bg-neon-cyan' : 'bg-neon-pink'}`}
                style={{ height: isPlaying ? `${10 + Math.random() * 90}%` : '10%', transition: 'height 0.1s ease' }}
              ></div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
