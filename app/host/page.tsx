'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { GameRoom, Player } from '@/lib/types';
import { PixelScale } from '@/components/pixel/PixelScale';
import { PixelBreakingNews } from '@/components/pixel/PixelBreakingNews';
import {
  PixelPointerHand,
  PixelBrain,
  PixelHeart,
  PixelUser,
  PixelTeam,
} from '@/components/pixel/PixelIcons';
import {
  createRoom,
  subscribeRoom,
  subscribePlayers,
  calculateTiltAngle,
  hostStartGame,
  hostContinueTwist,
  hostAdvanceRound,
  hostToggleTimer,
  hostResetRoom,
  hostSimulateClass,
} from '@/lib/firebase-game';

function HostContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlPin = searchParams.get('pin');
  const [pin, setPin] = useState<string | null>(urlPin);
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [timerRemaining, setTimerRemaining] = useState<number>(60);
  const [copied, setCopied] = useState<boolean>(false);
  const [inputPin, setInputPin] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);

  // Sync PIN from URL
  useEffect(() => {
    if (urlPin) {
      setPin(urlPin);
    }
  }, [urlPin]);

  // Subscribe to Firestore room & players
  useEffect(() => {
    if (!pin) {
      setRoom(null);
      setPlayers([]);
      return;
    }

    const unsubRoom = subscribeRoom(pin, (updatedRoom) => {
      setRoom(updatedRoom);
    });

    const unsubPlayers = subscribePlayers(pin, (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    return () => {
      unsubRoom();
      unsubPlayers();
    };
  }, [pin]);

  // Handle countdown timer & auto progression
  const lastAdvanceStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (!room || !pin) return;

    if (!room.timerRunning || !room.timerEndsAt) {
      setTimerRemaining(room.timerRemaining || 0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingMs = Math.max(0, (room.timerEndsAt || 0) - now);
      const remainingSec = Math.ceil(remainingMs / 1000);
      setTimerRemaining(remainingSec);

      // Auto advance round when countdown finishes
      if (remainingSec <= 0 && room.timerRunning) {
        clearInterval(interval);
        if (lastAdvanceStatusRef.current !== room.status) {
          lastAdvanceStatusRef.current = room.status;

          if (room.status === 'ROUND_1') {
            hostAdvanceRound(pin, 'TWIST_1');
          } else if (room.status === 'TWIST_1') {
            hostAdvanceRound(pin, 'TWIST_2');
          } else if (room.status === 'TWIST_2') {
            hostAdvanceRound(pin, 'THANK_YOU');
          }
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [room, pin]);

  // Calculate aggregated stats
  let totalRational = 0;
  let totalEmotional = 0;
  players.forEach((p) => {
    totalRational += p.rational;
    totalEmotional += p.emotional;
  });

  const totalVotes = totalRational + totalEmotional;
  const percentRational = totalVotes > 0 ? Math.round((totalRational / totalVotes) * 100) : 50;
  const percentEmotional = totalVotes > 0 ? 100 - percentRational : 50;
  const tiltAngle = calculateTiltAngle(totalRational, totalEmotional);

  const mins = Math.floor(timerRemaining / 60);
  const secs = timerRemaining % 60;
  const timerStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const handleCreateNewRoom = async () => {
    setCreating(true);
    try {
      const newPin = await createRoom();
      setPin(newPin);
      router.push(`/host?pin=${newPin}`);
    } catch (err) {
      console.error(err);
      alert('Không thể tạo phòng lúc này. Vui lòng thử lại.');
    } finally {
      setCreating(false);
    }
  };

  const handleResumePin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputPin.trim().replace(/\s+/g, '');
    if (clean) {
      setPin(clean);
      router.push(`/host?pin=${clean}`);
    }
  };

  const handleCopyLink = () => {
    if (!pin) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/play?pin=${pin}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 1. GIAO DIỆN KHỞI TẠO PHÒNG CHƠI (NẾU CHƯA CÓ PIN)
  if (!pin) {
    return (
      <main className="min-h-screen relative flex flex-col justify-between p-6 sm:p-10 select-none bg-[#FBF9F5]">
        <div className="text-xs text-zinc-500 font-medium">
          <Link href="/" className="hover:text-black">
            a dilemma
          </Link>{' '}
          · môn lịch sử báo chí · quản trò
        </div>

        <div className="w-full max-w-lg mx-auto text-center my-auto py-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18181B] mb-2">
            MÀN HÌNH QUẢN TRÒ
          </h1>
          <p className="text-sm text-zinc-600 mb-8 font-medium">
            Tạo một phòng học mới với mã PIN 6 số hoặc mở lại phòng đang diễn ra.
          </p>

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleCreateNewRoom}
              disabled={creating}
              className="pixel-btn w-full py-4 bg-[#18181B] text-white hover:bg-zinc-800 font-extrabold text-base tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <PixelPointerHand className="w-5 h-5 text-amber-400" />
              <span>{creating ? 'ĐANG KHỞI TẠO...' : 'TẠO PHÒNG CHƠI MỚI (PIN 6 SỐ)'}</span>
            </button>

            <div className="text-xs text-zinc-400 font-medium">hoặc</div>

            <form onSubmit={handleResumePin} className="flex gap-2">
              <input
                type="text"
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value.toUpperCase())}
                placeholder="Nhập mã PIN đã có..."
                maxLength={10}
                className="pixel-input flex-1 px-3 py-2.5 text-sm font-bold text-center tracking-widest"
              />
              <button
                type="submit"
                className="pixel-btn px-5 py-2.5 bg-zinc-200 text-zinc-800 hover:bg-zinc-300 text-xs font-bold cursor-pointer"
              >
                Mở phòng
              </button>
            </form>
          </div>
        </div>

        <div className="text-center text-xs text-zinc-400">
          hệ thống đồng bộ trực tiếp qua Firebase Firestore
        </div>
      </main>
    );
  }

  // 2. GIAO DIỆN PHÒNG CHỜ (LOBBY) KHI ĐÃ CÓ PIN
  if (!room || room.status === 'LOBBY') {
    return (
      <main className="min-h-screen relative flex flex-col justify-between p-6 sm:p-10 select-none bg-[#FBF9F5]">
        {/* Top subtle info */}
        <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
          <div>
            <Link href="/" className="hover:text-black">
              a dilemma
            </Link>{' '}
            · môn lịch sử báo chí · phòng chờ quản trò
          </div>

          <button
            type="button"
            onClick={() => {
              setPin(null);
              router.push('/host');
            }}
            className="text-xs text-zinc-500 hover:text-black font-semibold"
          >
            Đổi phòng khác
          </button>
        </div>

        {/* Central Waiting Lobby Content */}
        <div className="w-full max-w-2xl mx-auto text-center my-auto py-6">
          <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">
            PHÒNG CHỜ LỚP HỌC
          </div>

          {/* GIANT PIN CODE */}
          <div className="my-4">
            <div className="text-xs text-zinc-500 mb-1">MÃ PIN THAM GIA:</div>
            <div className="font-mono text-5xl sm:text-7xl font-black text-[#18181B] tracking-widest select-all">
              {pin}
            </div>
          </div>

          {/* Copy Link Button */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="pixel-btn px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{copied ? 'ĐÃ SAO CHÉP LIÊN KẾT!' : 'Sao chép link mời sinh viên'}</span>
            </button>
          </div>

          {/* Connected Count */}
          <div className="text-sm font-bold text-[#18181B] mb-3">
            Đã kết nối: {players.length} người / nhóm
          </div>

          {/* Connected Students List */}
          <div className="min-h-[120px] max-h-52 overflow-y-auto flex flex-wrap justify-center gap-2 p-4 bg-white/70 mb-6">
            {players.length > 0 ? (
              players.map((p) => (
                <div
                  key={p.id}
                  className="px-3 py-1.5 bg-zinc-100 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn"
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
                Chưa có ai vào phòng. Hướng dẫn sinh viên vào <span className="font-bold text-zinc-700">/play</span> và nhập mã PIN <span className="font-bold text-zinc-700">{pin}</span>...
              </div>
            )}
          </div>

          {/* Start Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => hostStartGame(pin)}
              className="pixel-btn w-full sm:w-auto px-8 py-4 bg-[#18181B] text-white hover:bg-zinc-800 font-extrabold text-base tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <PixelPointerHand className="w-5 h-5 text-amber-400" />
              <span>BẮT ĐẦU CHƠI (60S)</span>
            </button>

            <button
              type="button"
              onClick={() => hostSimulateClass(pin, 12)}
              className="pixel-btn w-full sm:w-auto px-4 py-3.5 bg-zinc-200 text-zinc-800 hover:bg-zinc-300 text-xs font-bold cursor-pointer"
              title="Tự động thêm 12 sinh viên ảo để kiểm thử"
            >
              Mô phỏng lớp học ảo
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-zinc-400">
          mã PIN {pin} · sẵn sàng kết nối mọi thiết bị sinh viên trong lớp
        </div>
      </main>
    );
  }

  // 3. GIAO DIỆN ĐANG CHƠI (ROUND_1, TWIST_1, TWIST_2, THANK_YOU)
  const isTwistWaitingToStart =
    (room.status === 'TWIST_1' || room.status === 'TWIST_2') &&
    !room.timerRunning &&
    room.twist !== null;

  return (
    <main className="min-h-screen relative flex flex-col justify-between p-6 select-none bg-[#FBF9F5]">
      {/* Top Left info */}
      <div className="absolute top-5 left-6 text-xs text-zinc-500 font-medium">
        <Link href="/" className="hover:text-black">
          a dilemma
        </Link>{' '}
        · PIN: <span className="font-bold text-zinc-800">{pin}</span> · {players.length} người tham gia
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-5 right-6 flex items-center gap-4">
        {room.status !== 'THANK_YOU' && (
          <button
            type="button"
            onClick={() => hostToggleTimer(pin, room.timerRunning, timerRemaining)}
            className="text-xs text-zinc-600 hover:text-black font-medium"
          >
            {room.timerRunning ? 'Tạm dừng đồng hồ' : 'Tiếp tục đếm'}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (confirm('Đặt lại phòng về phòng chờ ban đầu?')) {
              hostResetRoom(pin);
            }
          }}
          className="text-xs text-zinc-400 hover:text-red-600 font-medium"
        >
          Đặt lại phòng
        </button>
      </div>

      {/* Breaking News Modal for Host with TIẾP TỤC (30S) button */}
      {isTwistWaitingToStart && room.twist && (
        <PixelBreakingNews
          twist={room.twist}
          isHost={true}
          onHostStartTimer={() => hostContinueTwist(pin, room.status)}
          timerRunning={room.timerRunning}
        />
      )}

      {/* CENTER HERO STAGE: Giant Timer + Giant Scale */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-2">
        <div className="w-full max-w-4xl text-center">
          {/* Round status indicator */}
          <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">
            {room.status === 'ROUND_1' && 'Vòng 1: Tình huống gốc (60s)'}
            {room.status === 'TWIST_1' && 'Vòng 2: Breaking News 1 (30s)'}
            {room.status === 'TWIST_2' && 'Vòng 3: Breaking News 2 (30s)'}
            {room.status === 'THANK_YOU' && 'Kết thúc: Tổng kết kết quả'}
          </div>

          {/* BIG CENTERED TIMER */}
          <div className="mb-2">
            <div
              className={`font-mono text-5xl sm:text-6xl md:text-7xl font-black ${
                room.timerRunning && timerRemaining <= 10
                  ? 'text-red-600 animate-pulse'
                  : 'text-[#18181B]'
              }`}
            >
              {timerStr}
            </div>
            <div className="text-xs text-zinc-500 font-medium mt-1">
              {room.timerRunning
                ? 'Đang đếm ngược...'
                : room.status === 'THANK_YOU'
                ? 'Đã kết thúc'
                : 'Tạm dừng'}
            </div>
          </div>

          {/* MAIN GIANT PHYSICAL SCALE */}
          <PixelScale
            rationalAmount={totalRational}
            emotionalAmount={totalEmotional}
            tiltAngle={tiltAngle}
            size="lg"
            showCoins
          />

          {/* Aggregated Figures */}
          <div className="flex items-center justify-center gap-12 mt-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1.5 text-blue-700 mb-0.5">
                <PixelBrain className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">LÝ TRÍ</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#18181B]">
                {percentRational}%
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-0.5">
                {totalRational} Giá
              </div>
            </div>

            <div className="text-zinc-300 text-3xl font-light">/</div>

            <div>
              <div className="flex items-center justify-center gap-1.5 text-red-600 mb-0.5">
                <PixelHeart className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">TÌNH CẢM</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#18181B]">
                {percentEmotional}%
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-0.5">
                {totalEmotional} Giá
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post-game Summary */}
      {room.status === 'THANK_YOU' ? (
        <div className="w-full max-w-xl mx-auto my-3 text-center animate-fadeIn">
          <div className="text-xs text-zinc-500 font-medium mb-3">
            cảm ơn bạn đã tham gia · kết quả chung cuộc cả lớp
          </div>
          <div className="flex items-center justify-center gap-8 text-xs text-zinc-700 mb-4">
            <div className="text-center">
              <div className="text-[11px] text-zinc-400">Tỷ lệ chung cuộc</div>
              <div className="font-extrabold text-base text-[#18181B]">
                {percentRational}% Lý trí / {percentEmotional}% Tình cảm
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => hostResetRoom(pin)}
              className="pixel-btn px-6 py-2.5 bg-[#18181B] text-white hover:bg-zinc-800 text-xs font-bold cursor-pointer"
            >
              Chơi lại phòng này
            </button>
            <button
              type="button"
              onClick={() => {
                setPin(null);
                router.push('/host');
              }}
              className="pixel-btn px-5 py-2.5 bg-zinc-200 text-zinc-800 hover:bg-zinc-300 text-xs font-bold cursor-pointer"
            >
              Tạo phòng mới khác
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-xs text-zinc-400 py-2">
          {room.status === 'ROUND_1' && 'hết 60s sẽ tự động mở breaking news 1'}
          {room.status === 'TWIST_1' && 'hết 30s sẽ tự động mở breaking news 2'}
          {room.status === 'TWIST_2' && 'hết 30s sẽ tự động tổng kết kết quả'}
        </div>
      )}
    </main>
  );
}

export default function HostPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5] text-zinc-500 text-sm">
          Đang tải màn hình quản trò...
        </div>
      }
    >
      <HostContent />
    </Suspense>
  );
}
