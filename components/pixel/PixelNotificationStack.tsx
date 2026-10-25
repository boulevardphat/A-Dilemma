'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixelBrain, PixelHeart, PixelTeam, PixelUser } from './PixelIcons';

export interface VoteNotificationItem {
  id: string;
  playerName: string;
  playerType?: 'individual' | 'team';
  teamName?: string;
  deltaCoins: number; // e.g. 1, 2, 3
  targetSide: 'rational' | 'emotional'; // Side receiving coins
  fromSide: 'rational' | 'emotional'; // Side losing coins
  currentRationalCoins: number;
  currentEmotionalCoins: number;
  timestamp: number;
}

interface Props {
  notifications: VoteNotificationItem[];
  onDismiss: (id: string) => void;
}

export function PixelNotificationStack({ notifications, onDismiss }: Props) {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-3 pointer-events-none max-w-[340px] sm:max-w-[380px] w-full"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((item) => {
          const isRational = item.targetSide === 'rational';
          const coinsDeltaText = `+${item.deltaCoins} XU`;
          const amountText = `${item.deltaCoins * 10} Giá`;

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 35, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              className="pointer-events-auto bg-white border-2 border-[#18181B] shadow-[4px_4px_0_0_#18181B] p-3 sm:p-3.5 select-none relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  isRational ? 'bg-blue-600' : 'bg-red-600'
                }`}
              />

              {/* Header row */}
              <div className="flex items-center justify-between text-[11px] font-black uppercase text-zinc-500 pb-1.5 mb-1.5 border-b border-zinc-200">
                <div className="flex items-center gap-1.5">
                  {/* Blinking 8-bit gold coin badge */}
                  <span className="w-2.5 h-2.5 bg-amber-400 border border-[#18181B] shrink-0 animate-pulse" />
                  <span className="tracking-wider text-[#18181B]">CÁN CÂN ĐẠI LỘ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-400 font-mono">VỪA XONG</span>
                  <button
                    type="button"
                    onClick={() => onDismiss(item.id)}
                    className="text-zinc-400 hover:text-black font-black text-sm leading-none cursor-pointer p-0.5"
                    title="Đóng thông báo"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Main Content: Focused heavily on AMOUNT OF COINS & SCALE SIDE */}
              <div
                className={`p-2.5 border-2 ${
                  isRational
                    ? 'bg-blue-50/90 border-blue-400 text-blue-950'
                    : 'bg-red-50/90 border-red-400 text-red-950'
                } mb-2`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    {isRational ? (
                      <PixelBrain className="w-4 h-4 text-blue-700 shrink-0" />
                    ) : (
                      <PixelHeart className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-black tracking-wide">
                      {isRational ? 'CÁN CÂN LÝ TRÍ' : 'CÁN CÂN TÌNH CẢM'}
                    </span>
                  </div>

                  {/* High visibility coin delta badge */}
                  <span
                    className={`px-2 py-0.5 text-xs font-mono font-black border ${
                      isRational
                        ? 'bg-blue-600 text-white border-blue-800'
                        : 'bg-red-600 text-white border-red-800'
                    } shadow-[1px_1px_0_0_#18181B]`}
                  >
                    {coinsDeltaText}
                  </span>
                </div>

                {/* Subtext highlighting subtraction and coin conversion */}
                <div className="text-[11px] font-bold text-zinc-600 flex items-center justify-between">
                  <span>
                    Chuyển {item.deltaCoins} xu ({amountText}) sang {isRational ? 'Lý trí' : 'Tình cảm'}
                  </span>
                  <span className="text-zinc-400 font-mono text-[10px]">
                    -{item.deltaCoins} xu {isRational ? 'Tình cảm' : 'Lý trí'}
                  </span>
                </div>
              </div>

              {/* Footer: Player or Team Name + Current Balance */}
              <div className="flex items-center justify-between text-[11px] text-zinc-700 font-bold px-0.5">
                <div className="flex items-center gap-1.5 truncate max-w-[190px]">
                  {item.playerType === 'team' ? (
                    <PixelTeam className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <PixelUser className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  )}
                  <span className="truncate">
                    {item.teamName ? `${item.teamName} (${item.playerName})` : item.playerName}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-zinc-500 shrink-0">
                  <span className="text-blue-700 font-black">{item.currentRationalCoins}</span>
                  <span className="mx-0.5">/</span>
                  <span className="text-red-600 font-black">{item.currentEmotionalCoins}</span> xu
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
