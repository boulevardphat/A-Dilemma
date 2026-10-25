'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TwistInfo } from '@/lib/types';
import { PixelPointerHand } from './PixelIcons';
import { sound } from '@/lib/sound';

interface PixelBreakingNewsProps {
  twist: TwistInfo | null;
  isHost?: boolean;
  onHostStartTimer?: () => void;
  timerRunning?: boolean;
}

export function PixelBreakingNews({
  twist,
  isHost = false,
  onHostStartTimer,
  timerRunning = false,
}: PixelBreakingNewsProps) {
  // Stage 1: 'slam' (0s -> 1.3s) - Giant BREAKING NEWS slams in center screen
  // Stage 2: 'reveal' (> 1.3s) - Shrinks to top banner, reveals headline and crawling ticker
  const [stage, setStage] = useState<'slam' | 'reveal'>('slam');

  useEffect(() => {
    if (!twist) return;
    setStage('slam');
    sound.playBreakingNews();

    const timer = setTimeout(() => {
      setStage('reveal');
      sound.playClick();
    }, 1300);

    return () => clearTimeout(timer);
  }, [twist?.id]);

  if (!twist) return null;
  if (isHost && timerRunning) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-2 sm:p-6 bg-[#090D1A]/95 backdrop-blur-md select-none overflow-hidden text-white">
      {/* Retro TV Scanlines & Glitch Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.05), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.05))',
          backgroundSize: '100% 3px, 4px 100%',
        }}
      />

      {/* Emergency flashing warning red border lights */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 animate-pulse z-20" />
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 animate-pulse z-20" />

      {/* Top Header / Channel Bar */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between text-[11px] sm:text-xs font-mono font-bold text-zinc-400 pt-2 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping inline-block" />
          <span className="text-red-400 font-black tracking-widest uppercase">
            LIVE BROADCAST · PHÁT SÓNG ĐẶC BIỆT
          </span>
        </div>
        <div className="text-zinc-500 font-mono">KÊNH ĐẠI LỘ #01</div>
      </div>

      {/* MAIN STAGE CONTENT */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full px-2 py-4">
        <AnimatePresence mode="wait">
          {stage === 'slam' ? (
            /* STAGE 1: Giant BREAKING NEWS Slams into screen with Screen Impact */
            <motion.div
              key="slam-banner"
              initial={{ scale: 3, opacity: 0, rotate: -4 }}
              animate={{
                scale: [2.5, 0.95, 1],
                opacity: 1,
                rotate: [-4, 2, 0],
              }}
              exit={{ scale: 0.6, y: -120, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center"
            >
              <div className="bg-[#E50914] text-white px-8 sm:px-14 py-3 sm:py-5 border-4 border-white shadow-[0_0_50px_rgba(229,9,20,0.8)] inline-block transform -skew-x-6">
                <span className="text-4xl sm:text-7xl md:text-8xl font-black italic tracking-wider block">
                  BREAKING
                </span>
              </div>
              <div className="text-5xl sm:text-8xl md:text-9xl font-black italic tracking-widest text-white mt-2 drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]">
                NEWS
              </div>
              <div className="mt-4 text-xs sm:text-sm font-mono tracking-widest text-amber-300 animate-pulse">
                ▼ TÌNH TIẾT BẤT NGỜ VỪA ĐƯỢC XÁC MINH ▼
              </div>
            </motion.div>
          ) : (
            /* STAGE 2: Compressed Top Badge + Unfolded Story Details */
            <motion.div
              key="reveal-content"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="w-full text-center"
            >
              {/* Shrunken Badge at top */}
              <div className="inline-flex items-center gap-2 mb-4 bg-[#E50914] text-white px-5 py-1.5 border-2 border-white shadow-[0_2px_12px_rgba(229,9,20,0.6)]">
                <span className="w-2 h-2 bg-amber-300 animate-pulse" />
                <span className="text-sm sm:text-lg font-black tracking-wider uppercase">
                  {twist.title}
                </span>
              </div>

              {/* Headline */}
              <h3 className="text-xl sm:text-3xl font-black text-amber-300 mb-4 px-2 leading-tight">
                {twist.headline}
              </h3>

              {/* Story Details Box */}
              <div className="bg-white/5 border-2 border-zinc-700 p-4 sm:p-6 mb-4 max-w-xl mx-auto text-left shadow-lg">
                <p className="text-xs sm:text-base text-zinc-100 leading-relaxed font-medium mb-3">
                  {twist.details}
                </p>

                <div className="bg-amber-400/15 border-l-4 border-amber-400 p-2.5 text-xs sm:text-sm text-amber-200 font-bold">
                  {twist.highlightText}
                </div>
              </div>

              {/* Actions / Instructions */}
              {isHost ? (
                <div className="flex flex-col items-center gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playRoundStart();
                      onHostStartTimer?.();
                    }}
                    className="pixel-btn px-8 sm:px-12 py-3.5 sm:py-4 bg-[#E50914] hover:bg-red-700 text-white font-black text-base sm:text-lg tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_0_0_#991B1B]"
                  >
                    <PixelPointerHand className="w-5 h-5 text-amber-300" />
                    <span>BẮT ĐẦU ĐẾM GIỜ (30S)</span>
                  </button>
                  <span className="text-[11px] sm:text-xs text-zinc-400">
                    Bấm để mở đồng hồ 30 giây cho người chơi điều chỉnh lại cán cân
                  </span>
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-zinc-300 animate-pulse font-bold mt-3">
                  {timerRunning
                    ? 'Đồng hồ đang chạy! Hãy phân bổ lại đồng tiền Đại lộ của bạn!'
                    : 'Đang chờ Quản trò bấm BẮT ĐẦU ĐẾM GIỜ...'}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER: Animated Crawling Retro News Ticker (Marquee) */}
      <div className="relative z-10 w-full bg-[#18181B] border-t-2 border-amber-400 overflow-hidden py-1.5">
        <div className="flex whitespace-nowrap animate-marquee font-mono text-[11px] sm:text-xs font-bold text-amber-300">
          <span className="mx-4">🚨 BẢN TIN KHẨN CẤP · BÁO CHÍ ĐIỀU TRA ĐỘC QUYỀN 🚨</span>
          <span className="mx-4">THÔNG TIN MỚI CÓ THỂ ĐẢO CHIỀU HOÀN TOÀN CÁN CÂN QUYẾT ĐỊNH CỦA BẠN</span>
          <span className="mx-4">● HÃY CÂN NHẮC GIỮA LÝ TRÍ VÀ TÌNH CẢM ●</span>
          <span className="mx-4">🚨 BẢN TIN KHẨN CẤP · BÁO CHÍ ĐIỀU TRA ĐỘC QUYỀN 🚨</span>
          <span className="mx-4">THÔNG TIN MỚI CÓ THỂ ĐẢO CHIỀU HOÀN TOÀN CÁN CÂN QUYẾT ĐỊNH CỦA BẠN</span>
          <span className="mx-4">● HÃY CÂN NHẮC GIỮA LÝ TRÍ VÀ TÌNH CẢM ●</span>
        </div>
      </div>
    </div>
  );
}
