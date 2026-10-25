'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixelBrain, PixelHeart, PixelCoin } from './PixelIcons';
import { PixelMascotAvatar } from './PixelMascots';

export interface GameNotification {
  id: string;
  actorName: string;
  avatar?: string;
  isTeam?: boolean;
  deltaCoins: number; // e.g. 2 for 2 coins
  targetSide: 'rational' | 'emotional'; // The side that gained coins
  fromSide?: 'rational' | 'emotional';
  type?: 'vote_change' | 'join' | 'twist' | 'system';
  customTitle?: string;
  customMessage?: string;
  timestamp: number;
}

interface PixelNotificationCenterProps {
  notifications: GameNotification[];
  onDismiss: (id: string) => void;
}

export function PixelNotificationCenter({
  notifications,
  onDismiss,
}: PixelNotificationCenterProps) {
  return (
    <aside
      aria-label="Thông báo biến động cán cân"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-[340px] sm:max-w-[380px] w-full pointer-events-none select-none"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {notifications.map((item) => {
          const isRational = item.targetSide === 'rational';
          const sideName = isRational ? 'LÝ TRÍ' : 'TÌNH CẢM';
          const sideTextColor = isRational ? 'text-blue-700' : 'text-red-600';
          const sideBg = isRational ? 'bg-blue-50 text-blue-800' : 'bg-red-50 text-red-800';

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className="pointer-events-auto bg-[#FBF9F5] border-2 border-[#18181B] p-3 text-[#18181B] transition-transform"
            >
              <div className="flex items-center gap-3">
                {/* 8-bit Mascot Avatar */}
                <div className="w-10 h-10 p-1 bg-white border border-[#18181B] shrink-0 flex items-center justify-center">
                  <PixelMascotAvatar mascotId={item.avatar || 'cat'} className="w-8 h-8" />
                </div>

                {/* Main Content: Single unified, spacious row without cramped inner boxes */}
                <div className="flex-1 min-w-0">
                  {/* Player name & quick dismiss */}
                  <div className="flex items-center justify-between gap-1 leading-tight mb-1">
                    <span className="font-black text-xs sm:text-sm truncate uppercase tracking-tight text-[#18181B]">
                      {item.actorName}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDismiss(item.id)}
                      className="text-zinc-400 hover:text-black font-mono font-bold text-xs px-1 cursor-pointer"
                      title="Đóng"
                    >
                      ✕
                    </button>
                  </div>

                  {/* 2 Core factors: Coins changed & Target Side */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Factor 1: Coin count */}
                    <div className="inline-flex items-center gap-1 font-mono font-black text-xs sm:text-sm text-amber-900">
                      <PixelCoin className="w-4 h-4 shrink-0" value={item.deltaCoins * 10} />
                      <span>+{item.deltaCoins} XU</span>
                    </div>

                    <span className="text-zinc-400 font-bold text-xs">→</span>

                    {/* Factor 2: Which side of the balance */}
                    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-black uppercase ${sideBg}`}>
                      {isRational ? (
                        <PixelBrain className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      ) : (
                        <PixelHeart className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      )}
                      <span className={sideTextColor}>{sideName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </aside>
  );
}
