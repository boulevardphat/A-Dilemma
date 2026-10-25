'use client';

import React, { useState, useEffect } from 'react';
import { sound } from '@/lib/sound';

export function PixelSoundToggle({ className = '' }: { className?: string }) {
  const [muted, setMuted] = useState<boolean>(false);

  useEffect(() => {
    setMuted(sound.isMuted());
  }, []);

  const handleToggle = () => {
    const nextMuted = sound.toggleMute();
    setMuted(nextMuted);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`pixel-btn px-2.5 py-1 text-xs font-black border border-zinc-300 bg-white/90 hover:bg-zinc-100 text-[#18181B] flex items-center gap-1.5 cursor-pointer shadow-[1px_1px_0_0_#18181B] ${className}`}
      title={muted ? 'Bật âm thanh (Sound ON)' : 'Tắt âm thanh (Mute SFX)'}
      aria-label={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
    >
      <span className="text-sm">{muted ? '🔇' : '🔊'}</span>
      <span className="hidden sm:inline text-[11px] font-mono">
        {muted ? 'TẮT ÂM' : 'BẬT ÂM'}
      </span>
    </button>
  );
}
