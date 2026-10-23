'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClientRoomState } from '@/lib/types';
import { PixelScale } from '@/components/pixel/PixelScale';
import { PixelBreakingNews } from '@/components/pixel/PixelBreakingNews';
import {
  PixelPointerHand,
  PixelBrain,
  PixelHeart,
  PixelUser,
  PixelTeam,
} from '@/components/pixel/PixelIcons';

const DEFAULT_ROOM = 'CLASS';

export default function HostPage() {
  const [roomState, setRoomState] = useState<ClientRoomState | null>(null);
  const [showBreakingModal, setShowBreakingModal] = useState(false);

  // Poll room state every 1500ms
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

  // 1. GIAO DIỆN PHÒNG CHỜ CỦA QUẢN TRÒ (HOST WAITING LOBBY)
  if (roomState?.status === 'LOBBY') {
    return (
      <main className="min-h-screen relative flex flex-col justify-between p-6 sm:p-10 select-none bg-[#FBF9F5]">
        {/* Top subtle info */}
        <div className="text-xs text-zinc-500 font-medium">
          <Link href="/" className="hover:text-black">
            a dilemma
          </Link>{' '}
          · môn lịch sử báo chí · phòng chờ quản trò
        </div>

        {/* Central Waiting Lobby Content */}
        <div className="w-full max-w-2xl mx-auto text-center my-auto py-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18181B] tracking-tight mb-2">
            PHÒNG CHỜ LỚP HỌC
          </h1>
          <p className="text-sm text-zinc-600 mb-8 font-medium">
            Hướng dẫn sinh viên mở đường link <span className="font-bold underline text-[#18181B]">/play</span> để tham gia.
          </p>

          {/* Connected Count */}
          <div className="text-base font-bold text-[#18181B] mb-4">
            Đã kết nối: {roomState.playerCount} người / nhóm
          </div>

          {/* Connected Students List */}
          <div className="min-h-[140px] max-h-60 overflow-y-auto flex flex-wrap justify-center gap-2 p-4 bg-white border-2 border-[#18181B] mb-8 shadow-[3px_3px_0px_#18181B]">
            {roomState.playersList && roomState.playersList.length > 0 ? (
              roomState.playersList.map((p) => (
                <div
                  key={p.id}
                  className="px-3 py-1.5 bg-[#FBF9F5] border border-[#18181B] text-xs font-semibold flex items-center gap-1.5"
                >
                  {p.type === 'team' ? (
                    <PixelTeam className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <PixelUser className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span>{p.teamName ? `${p.teamName} (${p.name})` : p.name}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-zinc-400 self-center">
                Chưa có ai vào phòng. Danh sách sẽ xuất hiện ngay khi sinh viên bấm vào phòng...
              </div>
            )}
          </div>

          {/* Big Start Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleStepClick(1)}
              className="pixel-btn w-full sm:w-auto px-8 py-4 bg-[#18181B] text-white hover:bg-zinc-800 font-extrabold text-base tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#18181B]"
            >
              <PixelPointerHand className="w-5 h-5 text-amber-400" />
              <span>BẮT ĐẦU CHƠI (VÒNG 1 - 60S)</span>
            </button>

            <button
              type="button"
              onClick={() => performAction('simulate', { count: 12 })}
              className="pixel-btn w-full sm:w-auto px-4 py-3.5 bg-white text-zinc-700 hover:text-black text-xs font-bold cursor-pointer"
              title="Tự động thêm 12 sinh viên ảo để kiểm thử"
            >
              Mô phỏng lớp học ảo
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-zinc-400">
          chờ đủ thành viên và bấm bắt đầu để đồng bộ toàn lớp
        </div>
      </main>
    );
  }

  // 2. GIAO DIỆN QUẢN TRÒ ĐANG CHƠI (ACTIVE PLAY VIEW)
  return (
    <main className="min-h-screen relative flex flex-col justify-between p-6 select-none bg-[#FBF9F5]">
      {/* Top Left info: unboxed, subtle, lowercase */}
      <div className="absolute top-5 left-6 text-xs text-zinc-500 font-medium">
        <Link href="/" className="hover:text-black">
          a dilemma
        </Link>{' '}
        · môn lịch sử báo chí · {roomState?.playerCount || 0} người tham gia
      </div>

      {/* Top Right Reset button */}
      <div className="absolute top-5 right-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (confirm('Đặt lại phòng về phòng chờ ban đầu?')) {
              performAction('reset');
            }
          }}
          className="text-xs text-zinc-400 hover:text-red-600 font-medium"
        >
          Đặt lại phòng
        </button>
      </div>

      {/* Full screen Breaking News modal for Host */}
      {showBreakingModal && roomState?.twist && (
        <PixelBreakingNews
          twist={roomState.twist}
          isHost={true}
          onHostStartTimer={handleHostStartTimer}
          timerRunning={roomState.timerRunning}
        />
      )}

      {/* CENTER HERO STAGE: Giant Timer + Giant Scale */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-2">
        <div className="w-full max-w-4xl text-center">
          {/* BIG CENTERED TIMER - Placed directly above the scale */}
          <div className="mb-2">
            <div
              className={`font-mono text-5xl sm:text-6xl md:text-7xl font-black tracking-tight ${
                roomState?.timerRunning && (roomState?.timerRemaining || 0) <= 10
                  ? 'text-red-600 animate-pulse'
                  : 'text-[#18181B]'
              }`}
            >
              {timerStr}
            </div>
            <div className="text-xs text-zinc-500 font-medium mt-1">
              {roomState?.timerRunning
                ? 'Đang đếm ngược...'
                : roomState?.status === 'THANK_YOU'
                ? 'Đã kết thúc'
                : 'Tạm dừng'}
            </div>
          </div>

          {/* MAIN GIANT PHYSICAL SCALE */}
          <PixelScale
            rationalAmount={roomState?.totalRational || 0}
            emotionalAmount={roomState?.totalEmotional || 0}
            tiltAngle={roomState?.tiltAngle || 0}
            size="lg"
            showCoins
          />

          {/* Aggregated Figures - Unboxed, breathable */}
          <div className="flex items-center justify-center gap-12 mt-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1.5 text-blue-700 mb-0.5">
                <PixelBrain className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">LÝ TRÍ</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#18181B]">
                {roomState?.percentRational || 50}%
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-0.5">
                {roomState?.totalRational || 0} Giá
              </div>
            </div>

            <div className="text-zinc-300 text-3xl font-light">/</div>

            <div>
              <div className="flex items-center justify-center gap-1.5 text-red-600 mb-0.5">
                <PixelHeart className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">TÌNH CẢM</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#18181B]">
                {roomState?.percentEmotional || 50}%
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-0.5">
                {roomState?.totalEmotional || 0} Giá
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post-game Summary (Appears after locking round 4) - Unboxed, secondary emphasis */}
      {currentStep === 4 && (
        <div className="w-full max-w-xl mx-auto my-3 text-center animate-fadeIn">
          <div className="text-xs text-zinc-500 font-medium mb-2">
            cảm ơn bạn đã tham gia · số liệu biến động 3 vòng
          </div>
          <div className="flex items-center justify-center gap-8 text-xs text-zinc-700">
            {roomState?.history?.map((h, i) => (
              <div key={i} className="text-center">
                <div className="text-[11px] text-zinc-400">
                  {i === 0 ? 'Vòng 1' : i === 1 ? 'Twist 1' : 'Twist 2'}
                </div>
                <div className="font-extrabold text-base text-[#18181B]">
                  {h.percentRational}% / {h.percentEmotional}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM CONTROLLER DOCK: Minimalist buttons 1 2 3 4 with 8-bit pointer hand */}
      <div className="flex flex-col items-center justify-center pb-2">
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4].map((step) => {
            const isActive = currentStep === step;
            return (
              <div key={step} className="flex flex-col items-center">
                {isActive ? (
                  <div className="mb-1 animate-bounce">
                    <PixelPointerHand className="w-4 h-4 text-[#18181B]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 mb-1" />
                )}
                <button
                  type="button"
                  onClick={() => handleStepClick(step)}
                  className={`pixel-btn w-12 h-12 flex items-center justify-center font-mono text-lg font-bold cursor-pointer ${
                    isActive
                      ? 'bg-[#18181B] text-white shadow-[3px_3px_0px_#18181B]'
                      : 'bg-white text-[#18181B] hover:bg-zinc-100 shadow-[2px_2px_0px_#18181B]'
                  }`}
                  title={
                    step === 1
                      ? '1: Bắt đầu Vòng 1 (60s)'
                      : step === 2
                      ? '2: Breaking News 1 (30s)'
                      : step === 3
                      ? '3: Breaking News 2 (30s)'
                      : '4: Khóa cân & Kết thúc'
                  }
                >
                  {step}
                </button>
              </div>
            );
          })}
        </div>

        {/* Quiet subtext for Host */}
        <div className="mt-3 text-[11px] text-zinc-400 font-medium">
          1: tình huống gốc · 2: breaking news 1 · 3: breaking news 2 · 4: kết thúc
        </div>
      </div>
    </main>
  );
}
