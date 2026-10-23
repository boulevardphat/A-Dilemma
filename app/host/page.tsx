'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ClientRoomState } from '@/lib/types';
import { PixelScale } from '@/components/pixel/PixelScale';
import { PixelBreakingNews } from '@/components/pixel/PixelBreakingNews';
import { PixelPointerHand, PixelBrain, PixelHeart } from '@/components/pixel/PixelIcons';

const DEFAULT_ROOM = 'CLASS';

export default function HostPage() {
  const [roomState, setRoomState] = useState<ClientRoomState | null>(null);
  const [showBreakingModal, setShowBreakingModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Poll room state every 800ms
  useEffect(() => {
    let isMounted = true;
    const fetchRoom = async () => {
      if (typeof document !== 'undefined' && document.hidden) return;
      try {
        const res = await fetch(`/api/rooms/${DEFAULT_ROOM}`);
        if (res.ok && isMounted) {
          const data: ClientRoomState = await res.json();
          setRoomState(data);
        }
      } catch {
        // offline fallback
      }
    };

    fetchRoom();
    const interval = setInterval(fetchRoom, 1500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const performAction = async (action: string, payload: Record<string, unknown> = {}) => {
    try {
      const res = await fetch(`/api/rooms/${DEFAULT_ROOM}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.room) {
          setRoomState(data.room);
        }
      }
    } catch {
      // ignore
    }
  };

  const handleStepClick = (step: number) => {
    if (step === 1) {
      performAction('set_round', { round: 'ROUND_1' });
      performAction('toggle_timer', { start: true });
      setShowBreakingModal(false);
    } else if (step === 2) {
      performAction('set_round', { round: 'TWIST_1' });
      setShowBreakingModal(true);
    } else if (step === 3) {
      performAction('set_round', { round: 'TWIST_2' });
      setShowBreakingModal(true);
    } else if (step === 4) {
      performAction('set_round', { round: 'THANK_YOU' });
      setShowBreakingModal(false);
    }
  };

  const handleHostStartTimer = () => {
    performAction('toggle_timer', { start: true });
    setShowBreakingModal(false);
  };

  const handleResetGame = () => {
    performAction('reset');
    setShowResetConfirm(false);
    setShowBreakingModal(false);
  };

  const currentStep =
    roomState?.status === 'ROUND_1'
      ? 1
      : roomState?.status === 'TWIST_1'
      ? 2
      : roomState?.status === 'TWIST_2'
      ? 3
      : roomState?.status === 'THANK_YOU'
      ? 4
      : 0;

  const mins = Math.floor((roomState?.timerRemaining || 0) / 60);
  const secs = (roomState?.timerRemaining || 0) % 60;
  const timerStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <main className="min-h-screen relative flex flex-col justify-between p-6 select-none">
      {/* Top Left: Back link and subtle info */}
      <div className="absolute top-5 left-6 flex items-center gap-2 text-xs text-zinc-500 font-medium">
        <Link href="/" className="hover:text-black font-semibold">
          ← trang chủ
        </Link>
        <span>·</span>
        <span>a dilemma</span>
        <span>·</span>
        <span>lịch sử báo chí</span>
        <span>·</span>
        <span>{roomState?.playerCount || 0} người tham gia</span>
      </div>

      {/* Top Right: Timer & Reset action */}
      <div className="absolute top-5 right-6 flex items-center gap-4 text-xs font-mono font-bold text-zinc-700">
        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="font-sans font-medium text-xs text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
          title="Đặt lại trò chơi về trạng thái ban đầu"
        >
          ↻ đặt lại trò chơi
        </button>

        {roomState && (
          <span className={roomState.timerRunning ? 'text-red-600' : 'text-zinc-700'}>
            {timerStr}
          </span>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FBF9F5]/90 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white p-6 border-2 border-[#18181B] shadow-[4px_4px_0px_#18181B] text-center">
            <h3 className="font-bold text-base text-[#18181B] mb-2">
              Đặt lại trò chơi?
            </h3>
            <p className="text-xs text-zinc-600 mb-6 leading-relaxed">
              Toàn bộ phiếu bầu và tiến trình các vòng sẽ được đưa về ban đầu để lớp học có thể chơi lại từ đầu.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="pixel-btn px-4 py-2 bg-white text-[#18181B] hover:bg-zinc-100 text-xs font-bold cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleResetGame}
                className="pixel-btn px-4 py-2 bg-red-600 text-white hover:bg-red-700 text-xs font-bold cursor-pointer"
              >
                Xác nhận đặt lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full screen Breaking News modal for Host */}
      {showBreakingModal && roomState?.twist && (
        <PixelBreakingNews
          twist={roomState.twist}
          isHost={true}
          onHostStartTimer={handleHostStartTimer}
          timerRunning={roomState.timerRunning}
        />
      )}

      {/* CENTER HERO STAGE: The Giant Scale */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-3xl text-center"
        >
          {/* Main Giant Scale with physical physics */}
          <PixelScale
            rationalAmount={roomState?.totalRational || 0}
            emotionalAmount={roomState?.totalEmotional || 0}
            tiltAngle={roomState?.tiltAngle || 0}
            size="lg"
            showCoins
          />

          {/* Aggregated Figures - Unboxed, breathable */}
          <div className="flex items-center justify-center gap-10 mt-6 text-center">
            <div>
              <div className="flex items-center justify-center gap-1.5 text-blue-700 mb-0.5">
                <PixelBrain className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Lý trí</span>
              </div>
              <motion.div
                key={roomState?.percentRational}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-2xl sm:text-3xl font-extrabold text-[#18181B]"
              >
                {roomState?.percentRational || 50}%
              </motion.div>
              <div className="text-[11px] text-zinc-400 font-mono">
                {roomState?.totalRational || 0} Giá
              </div>
            </div>

            <div className="text-zinc-300 text-2xl font-light">|</div>

            <div>
              <div className="flex items-center justify-center gap-1.5 text-red-600 mb-0.5">
                <PixelHeart className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Tình cảm</span>
              </div>
              <motion.div
                key={roomState?.percentEmotional}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-2xl sm:text-3xl font-extrabold text-[#18181B]"
              >
                {roomState?.percentEmotional || 50}%
              </motion.div>
              <div className="text-[11px] text-zinc-400 font-mono">
                {roomState?.totalEmotional || 0} Giá
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Post-game Summary (Only appears after locking round 4) - Unboxed, secondary emphasis */}
      {currentStep === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl mx-auto my-4 text-center"
        >
          <div className="text-xs text-zinc-500 font-medium mb-2">
            cảm ơn bạn đã tham gia · dữ liệu 3 vòng
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-zinc-600">
            {roomState?.history?.map((h, i) => (
              <div key={i} className="text-center">
                <div className="text-[11px] text-zinc-400">
                  {i === 0 ? 'Vòng 1' : i === 1 ? 'Twist 1' : 'Twist 2'}
                </div>
                <div className="font-bold text-sm text-[#18181B]">
                  {h.percentRational}% / {h.percentEmotional}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* BOTTOM CONTROLLER DOCK: Minimalist buttons 1 2 3 4 with 8-bit pointer hand */}
      <div className="flex flex-col items-center justify-center pb-2">
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4].map((step) => {
            const isActive = currentStep === step;
            return (
              <div key={step} className="flex flex-col items-center">
                {isActive ? (
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                    className="mb-1"
                  >
                    <PixelPointerHand className="w-4 h-4 text-[#18181B]" />
                  </motion.div>
                ) : (
                  <div className="w-4 h-4 mb-1" />
                )}
                <button
                  type="button"
                  onClick={() => handleStepClick(step)}
                  className={`pixel-btn w-11 h-11 flex items-center justify-center font-mono text-base font-bold cursor-pointer ${
                    isActive
                      ? 'bg-[#18181B] text-white'
                      : 'bg-white text-[#18181B] hover:bg-zinc-100'
                  }`}
                  title={
                    step === 1
                      ? 'Vòng 1: Tình huống gốc (60s)'
                      : step === 2
                      ? 'Breaking News 1 (30s)'
                      : step === 3
                      ? 'Breaking News 2 (30s)'
                      : 'Khóa cân & Kết thúc'
                  }
                >
                  {step}
                </button>
              </div>
            );
          })}
        </div>

        {/* Quiet subtext for Host */}
        <div className="mt-3 text-[11px] text-zinc-400 font-normal">
          1: tình huống gốc · 2: breaking news 1 · 3: breaking news 2 · 4: kết thúc
        </div>
      </div>
    </main>
  );
}
