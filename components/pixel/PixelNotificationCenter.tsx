'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixelBrain, PixelHeart, PixelCoin, PixelUser, PixelTeam } from './PixelIcons';

export interface GameNotification {
  id: string;
  actorName: string;
  isTeam?: boolean;
  deltaCoins: number; // e.g. 2 for 2 coins
  targetSide: 'rational' | 'emotional'; // The side that gained coins
  fromSide?: 'rational' | 'emotional'; // The side that lost coins
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
      aria-label="Thông báo cán cân trò chơi"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-[340px] sm:max-w-[380px] w-full pointer-events-none select-none"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {notifications.map((item) => {
          const isRational = item.targetSide === 'rational';
          const sideName = isRational ? 'LÝ TRÍ' : 'TÌNH CẢM';
          const oppositeSideName = isRational ? 'TÌNH CẢM' : 'LÝ TRÍ';
          const sideBg = isRational ? 'bg-blue-600' : 'bg-red-600';
          const sideBorder = isRational ? 'border-blue-700' : 'border-red-700';

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 35, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 70, scale: 0.85, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 480, damping: 32 }}
              className="pointer-events-auto bg-[#FBF9F5] border-2 border-[#18181B] shadow-[4px_4px_0px_0px_#18181B] overflow-hidden text-[#18181B]"
            >
              {/* 8-bit Retro Title Bar */}
              <div className="bg-[#18181B] text-white px-2.5 py-1 flex items-center justify-between text-[11px] font-black tracking-wider">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 bg-amber-400 shrink-0 inline-block animate-pulse" />
                  <span className="truncate uppercase font-mono">
                    {item.customTitle || 'CÁN CÂN BIẾN ĐỘNG'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDismiss(item.id)}
                  aria-label="Đóng"
                  className="text-zinc-400 hover:text-white font-mono font-bold text-xs px-1 cursor-pointer ml-1"
                >
                  ✕
                </button>
              </div>

              {/* Card Body - Focused strictly on: 1) Thêm bớt bao nhiêu xu, 2) Phía cân nào */}
              <div className="p-3 bg-white space-y-2.5">
                {/* Visual Highlight: Coins & Side Banner */}
                <div className="flex items-stretch justify-between gap-2">
                  {/* Factor 1: SỐ XU THAY ĐỔI (+/- X XU) */}
                  <div className="flex-1 bg-amber-50 border-2 border-amber-400 p-2 flex flex-col justify-center shadow-xs">
                    <span className="text-[9px] uppercase tracking-wider font-black text-amber-800">
                      THAY ĐỔI XU
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex -space-x-2 shrink-0">
                        {Array.from({ length: Math.min(3, item.deltaCoins) }).map((_, i) => (
                          <PixelCoin key={i} className="w-5 h-5 drop-shadow-xs" value={10} />
                        ))}
                      </div>
                      <div className="leading-none">
                        <span className="text-base sm:text-lg font-black font-mono text-[#78350F]">
                          +{item.deltaCoins} XU
                        </span>
                        <div className="text-[10px] font-mono font-bold text-amber-700">
                          (+{item.deltaCoins * 10} Giá)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Factor 2: PHÍA CÂN NÀO (LÝ TRÍ / TÌNH CẢM) */}
                  <div className={`flex-1 border-2 ${sideBorder} p-2 flex flex-col justify-center text-white ${sideBg} shadow-xs`}>
                    <span className="text-[9px] uppercase tracking-wider font-black opacity-90">
                      PHÍA CÂN
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {isRational ? (
                        <PixelBrain className="w-5 h-5 text-white shrink-0" />
                      ) : (
                        <PixelHeart className="w-5 h-5 text-white shrink-0" />
                      )}
                      <div className="leading-tight">
                        <span className="text-sm sm:text-base font-black tracking-wider block">
                          {sideName}
                        </span>
                        <span className="text-[9px] font-mono font-bold opacity-80 block">
                          (-{item.deltaCoins} {oppositeSideName.slice(0, 4)})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actor info line */}
                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-zinc-200">
                  <div className="flex items-center gap-1.5 text-zinc-700 font-bold truncate max-w-[220px]">
                    {item.isTeam ? (
                      <PixelTeam className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <PixelUser className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    )}
                    <span className="truncate">{item.actorName}</span>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-400 font-bold shrink-0">
                    Vừa xong
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </aside>
  );
}
