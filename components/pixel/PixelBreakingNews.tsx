'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TwistInfo } from '@/lib/types';
import { PixelNewspaper, PixelPointerHand } from './PixelIcons';

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
  if (!twist) return null;

  // On host, if timer has already started, dismiss overlay
  if (isHost && timerRunning) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FBF9F5]/95 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-full max-w-xl text-center"
        >
          {/* Newspaper icon */}
          <div className="flex justify-center mb-3">
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <PixelNewspaper className="w-12 h-12" />
            </motion.div>
          </div>

          {/* Big Alert Heading */}
          <div className="inline-block text-xs font-bold text-red-600 tracking-widest uppercase mb-1">
            BẢN TIN ĐỘT XUẤT
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight mb-4">
            BREAKING NEWS
          </h2>

          {/* Lead Headline */}
          <h3 className="text-base sm:text-lg font-bold text-red-600 mb-3 px-4 leading-snug">
            {twist.headline}
          </h3>

          {/* News Details */}
          <p className="text-sm sm:text-base text-zinc-700 leading-relaxed max-w-lg mx-auto mb-6 px-4 font-normal">
            {twist.details}
          </p>

          {/* Key Highlight */}
          <div className="text-xs text-zinc-600 font-semibold mb-8">
            {twist.highlightText}
          </div>

          {/* Host action button OR Player waiting note */}
          {isHost ? (
            <div className="flex flex-col items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onHostStartTimer}
                className="pixel-btn px-6 py-3 bg-[#18181B] text-white hover:bg-zinc-800 font-bold text-sm tracking-wide flex items-center gap-2 cursor-pointer"
              >
                <PixelPointerHand className="w-4 h-4 text-amber-400" />
                <span>BẮT ĐẦU ĐẾM GIỜ (30S)</span>
              </motion.button>
              <span className="text-xs text-zinc-500">
                Bấm để mở đĩa cân cho cả lớp bắt đầu phân bổ tiền
              </span>
            </div>
          ) : (
            <div className="text-xs text-zinc-500 animate-pulse">
              {timerRunning
                ? 'Đang đếm giờ... Hãy phân bổ lại nguồn tiền của bạn!'
                : 'Chờ Quản trò bấm bắt đầu để phân bổ lại tiền...'}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
