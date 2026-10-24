'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GameRoom, Player, RoundType } from '@/lib/types';
import { PixelScale } from '@/components/pixel/PixelScale';
import { PixelBreakingNews } from '@/components/pixel/PixelBreakingNews';
import {
  PixelBrain,
  PixelHeart,
  PixelPointerHand,
  PixelTeam,
  PixelUser,
} from '@/components/pixel/PixelIcons';
import {
  createRoom,
  subscribeRoom,
  subscribePlayers,
  hostStartGame,
  hostContinueTwist,
  hostResetRoom,
  hostAdvanceRound,
  hostToggleTimer,
  calculateTiltAngle,
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
      <main className="min-h-screen relative flex flex-col justify-between p-6 sm:p-12 select-none bg-[#FBF9F5]">
        <div className="text-sm text-zinc-500 font-bold">
          <Link href="/" className="hover:text-black">
            A DILEMMA
          </Link>{' '}
          · QUẢN TRÒ
        </div>

        <div className="w-full max-w-xl mx-auto text-center my-auto py-10">
          <h1 className="text-4xl sm:text-5xl font-black text-[#18181B] mb-4">
            MÀN HÌNH QUẢN TRÒ
          </h1>
          <p className="text-base text-zinc-600 mb-8 font-medium">
            Tạo một phòng học mới với mã PIN 6 số hoặc mở lại phòng đang diễn ra.
          </p>

          <div className="space-y-5">
            <button
              type="button"
              onClick={handleCreateNewRoom}
              disabled={creating}
              className="pixel-btn w-full py-5 bg-[#18181B] text-white hover:bg-zinc-800 font-black text-lg tracking-wider flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 shadow-[0_3px_0_0_#000]"
            >
              <PixelPointerHand className="w-6 h-6 text-amber-400" />
              <span>{creating ? 'ĐANG KHỞI TẠO...' : 'TẠO PHÒNG CHƠI MỚI (PIN 6 SỐ)'}</span>
            </button>

            <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest">hoặc</div>

            <form onSubmit={handleResumePin} className="flex gap-2">
              <input
                type="text"
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value.toUpperCase())}
                placeholder="Nhập mã PIN đã có..."
                maxLength={10}
                className="pixel-input flex-1 px-4 py-3 text-base font-bold text-center tracking-widest"
              />
              <button
                type="submit"
                className="pixel-btn px-6 py-3 bg-zinc-200 text-zinc-800 hover:bg-zinc-300 text-sm font-bold cursor-pointer"
              >
                Mở phòng
              </button>
            </form>
          </div>
        </div>

        <div />
      </main>
    );
  }

  // 2. GIAO DIỆN PHÒNG CHỜ (LOBBY) KHI ĐÃ CÓ PIN
  if (!room || room.status === 'LOBBY') {
    return (
      <main className="min-h-screen relative flex flex-col justify-between p-6 sm:p-12 select-none bg-[#FBF9F5]">
        {/* Top bar */}
        <div className="flex items-center justify-between text-sm text-zinc-500 font-bold">
          <div>
            <Link href="/" className="hover:text-black">
              A DILEMMA
            </Link>{' '}
            · PHÒNG CHỜ
          </div>

          <button
            type="button"
            onClick={() => {
              setPin(null);
              router.push('/host');
            }}
            className="text-sm text-zinc-500 hover:text-black font-bold cursor-pointer"
          >
            Đổi phòng khác
          </button>
        </div>

        {/* Central Waiting Lobby Content - Scaled up */}
        <div className="w-full max-w-4xl mx-auto text-center my-auto py-8">
          <div className="text-sm uppercase tracking-widest text-zinc-500 font-black mb-2">
            MÃ PIN THAM GIA PHÒNG CHƠI
          </div>

          {/* GIANT PIN CODE */}
          <div className="my-6">
            <div className="font-mono text-6xl sm:text-8xl md:text-9xl font-black text-[#18181B] tracking-widest select-all">
              {pin}
            </div>
          </div>

          {/* Direct link & Copy Button */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={handleCopyLink}
              className="pixel-btn px-6 py-2.5 bg-zinc-200 hover:bg-zinc-300 text-xs font-bold text-zinc-800 flex items-center gap-2 cursor-pointer"
            >
              <span>{copied ? 'ĐÃ SAO CHÉP LIÊN KẾT!' : 'SAO CHÉP LINK GỬI LỚP'}</span>
            </button>
          </div>

          {/* Players Counter & Grid */}
          <div className="bg-white p-6 border-2 border-zinc-200 shadow-[0_3px_0_0_#18181B] mb-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
              <span className="text-sm font-black uppercase text-zinc-700">
                Sinh viên / Đội nhóm đã vào phòng
              </span>
              <span className="text-sm font-mono font-black text-blue-700 bg-blue-50 px-3 py-1 border border-blue-200">
                {players.length} THÀNH VIÊN
              </span>
            </div>

            {players.length === 0 ? (
              <div className="py-12 text-zinc-400 text-base font-medium">
                Đang chờ sinh viên quét mã PIN để vào phòng...
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-2.5 max-h-72 overflow-y-auto p-1">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="px-3.5 py-2 bg-zinc-50 border border-zinc-300 text-xs font-bold flex items-center gap-2 shadow-xs"
                  >
                    {p.type === 'team' ? (
                      <PixelTeam className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <PixelUser className="w-4 h-4 text-blue-600" />
                    )}
                    <span>{p.teamName ? `${p.teamName} (${p.name})` : p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GIANT START BUTTON */}
          <button
            type="button"
            onClick={() => hostStartGame(pin)}
            className="pixel-btn w-full max-w-xl py-5 px-10 bg-[#18181B] text-white hover:bg-zinc-800 font-black text-lg sm:text-xl tracking-wider flex items-center justify-center gap-3 cursor-pointer shadow-[0_4px_0_0_#000]"
          >
            <PixelPointerHand className="w-6 h-6 text-amber-400" />
            <span>BẮT ĐẦU CHƠI (VÒNG 1 - 60S)</span>
          </button>
        </div>

        <div />
      </main>
    );
  }

  // 3. GIAO DIỆN ĐANG CHƠI (ROUND_1, TWIST_1, TWIST_2, THANK_YOU)
  const isTwistWaitingToStart =
    (room.status === 'TWIST_1' || room.status === 'TWIST_2') &&
    !room.timerRunning &&
    room.twist !== null;

  return (
    <main className="min-h-screen relative flex flex-col justify-between p-6 sm:p-10 select-none bg-[#FBF9F5]">
      {/* Top Left info */}
      <div className="absolute top-6 left-6 sm:left-10 text-sm text-zinc-600 font-bold">
        <Link href="/" className="hover:text-black">
          A DILEMMA
        </Link>{' '}
        · PIN: <span className="font-black text-black">{pin}</span> · {players.length} người tham gia
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-6 right-6 sm:right-10 flex items-center gap-4">
        {room.status !== 'THANK_YOU' && (
          <button
            type="button"
            onClick={() => hostToggleTimer(pin, room.timerRunning, timerRemaining)}
            className="text-xs sm:text-sm text-zinc-700 hover:text-black font-bold cursor-pointer"
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
          className="text-xs sm:text-sm text-zinc-400 hover:text-red-600 font-bold cursor-pointer"
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

      {/* CENTER HERO STAGE: Giant Timer + Giant Scale - Scaled up to fill the viewport */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-4">
        <div className="w-full max-w-5xl text-center">
          {/* Round status indicator */}
          <div className="text-sm sm:text-base uppercase tracking-wider text-zinc-500 font-black mb-2">
            {room.status === 'ROUND_1' && 'Vòng 1: Tình huống gốc (60s)'}
            {room.status === 'TWIST_1' && 'Vòng 2: Breaking News 1 (30s)'}
            {room.status === 'TWIST_2' && 'Vòng 3: Breaking News 2 (30s)'}
            {room.status === 'THANK_YOU' && 'Kết thúc: Tổng kết kết quả'}
          </div>

          {/* GIANT CENTERED ARCADE TIMER */}
          <div className="mb-2">
            <div
              className={`font-mono text-7xl sm:text-8xl md:text-9xl font-black ${
                room.timerRunning && timerRemaining <= 10
                  ? 'text-red-600 animate-pulse'
                  : 'text-[#18181B]'
              }`}
            >
              {timerStr}
            </div>
          </div>

          {/* MAIN GIANT PHYSICAL SCALE - Scaled up with 10 coins tilting in sync */}
          <PixelScale
            rationalAmount={totalRational}
            emotionalAmount={totalEmotional}
            tiltAngle={tiltAngle}
            size="lg"
            showCoins
          />

          {/* Aggregated Figures - Scaled up */}
          <div className="flex items-center justify-center gap-12 sm:gap-20 mt-6 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 text-blue-700 mb-1">
                <PixelBrain className="w-6 h-6 sm:w-8 sm:h-8" />
                <span className="text-base sm:text-lg font-black uppercase tracking-wider">
                  LÝ TRÍ
                </span>
              </div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-[#18181B]">
                {percentRational}%
              </div>
              <div className="text-xs sm:text-sm text-zinc-500 font-mono font-bold mt-1">
                {totalRational} Giá
              </div>
            </div>

            <div className="text-zinc-300 text-4xl sm:text-5xl font-light">/</div>

            <div>
              <div className="flex items-center justify-center gap-2 text-red-600 mb-1">
                <PixelHeart className="w-6 h-6 sm:w-8 sm:h-8" />
                <span className="text-base sm:text-lg font-black uppercase tracking-wider">
                  TÌNH CẢM
                </span>
              </div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-[#18181B]">
                {percentEmotional}%
              </div>
              <div className="text-xs sm:text-sm text-zinc-500 font-mono font-bold mt-1">
                {totalEmotional} Giá
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post-game Summary */}
      {room.status === 'THANK_YOU' && (
        <div className="w-full max-w-xl mx-auto my-4 text-center animate-fadeIn">
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => hostResetRoom(pin)}
              className="pixel-btn px-8 py-3 bg-[#18181B] text-white hover:bg-zinc-800 text-sm font-black cursor-pointer shadow-[0_3px_0_0_#000]"
            >
              Chơi lại phòng này
            </button>
            <button
              type="button"
              onClick={() => {
                setPin(null);
                router.push('/host');
              }}
              className="pixel-btn px-7 py-3 bg-zinc-200 text-zinc-800 hover:bg-zinc-300 text-sm font-bold cursor-pointer"
            >
              Tạo phòng mới khác
            </button>
          </div>
        </div>
      )}

      <div />
    </main>
  );
}

export default function HostPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5] text-zinc-500 text-sm font-bold">
          Đang khởi tạo quản trò...
        </div>
      }
    >
      <HostContent />
    </Suspense>
  );
}
