'use client';

import React from 'react';

export type MascotId = 'cat' | 'owl' | 'fox' | 'bear' | 'pigeon' | 'bot' | 'dino' | 'bunny';

export interface MascotInfo {
  id: MascotId;
  name: string;
  role: string;
  badgeColor: string;
}

export const MASCOTS: MascotInfo[] = [
  { id: 'cat', name: 'Mèo Tốc Ký', role: 'Phóng viên nhanh nhạy', badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'owl', name: 'Cú Thông Thái', role: 'Chuyên gia lý tính', badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { id: 'fox', name: 'Cáo Điều Tra', role: 'Thám tử sự thật', badgeColor: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'bear', name: 'Gấu Kiên Định', role: 'Cân bằng đạo đức', badgeColor: 'bg-stone-100 text-stone-900 border-stone-300' },
  { id: 'pigeon', name: 'Bồ Câu Tin Tức', role: 'Sứ giả truyền thông', badgeColor: 'bg-sky-100 text-sky-900 border-sky-300' },
  { id: 'bot', name: 'Robot Phân Tích', role: 'Thuật toán dữ liệu', badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'dino', name: 'Khủng Long 8-bit', role: 'Lịch sử báo chí', badgeColor: 'bg-green-100 text-green-900 border-green-300' },
  { id: 'bunny', name: 'Thỏ Nhanh Trí', role: 'Cảm xúc nhân văn', badgeColor: 'bg-pink-100 text-pink-900 border-pink-300' },
];

export function PixelMascotAvatar({
  mascotId = 'cat',
  className = 'w-6 h-6',
}: {
  mascotId?: string;
  className?: string;
}) {
  const id = (mascotId || 'cat').toLowerCase();

  switch (id) {
    case 'owl':
      // 8-bit Wisdom Owl
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Head & Ear tufts */}
          <rect x="5" y="3" width="2" height="3" fill="#312E81" />
          <rect x="17" y="3" width="2" height="3" fill="#312E81" />
          <rect x="6" y="5" width="12" height="13" fill="#4338CA" />
          {/* Eye circles */}
          <rect x="7" y="8" width="4" height="4" fill="#FEF08A" />
          <rect x="13" y="8" width="4" height="4" fill="#FEF08A" />
          {/* Pupils */}
          <rect x="8" y="9" width="2" height="2" fill="#18181B" />
          <rect x="14" y="9" width="2" height="2" fill="#18181B" />
          {/* Glasses bridge */}
          <rect x="11" y="9" width="2" height="1" fill="#18181B" />
          {/* Beak */}
          <rect x="11" y="12" width="2" height="3" fill="#F59E0B" />
          {/* Belly feather detail */}
          <rect x="9" y="15" width="6" height="2" fill="#A5B4FC" />
          {/* Feet */}
          <rect x="7" y="18" width="3" height="2" fill="#D97706" />
          <rect x="14" y="18" width="3" height="2" fill="#D97706" />
        </svg>
      );

    case 'fox':
      // 8-bit Investigative Fox
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Ears */}
          <rect x="4" y="3" width="4" height="4" fill="#EA580C" />
          <rect x="16" y="3" width="4" height="4" fill="#EA580C" />
          <rect x="5" y="4" width="2" height="2" fill="#18181B" />
          <rect x="17" y="4" width="2" height="2" fill="#18181B" />
          {/* Head */}
          <rect x="6" y="6" width="12" height="8" fill="#EA580C" />
          {/* White cheeks */}
          <rect x="4" y="11" width="4" height="4" fill="#FFFFFF" />
          <rect x="16" y="11" width="4" height="4" fill="#FFFFFF" />
          {/* Snout */}
          <rect x="8" y="12" width="8" height="4" fill="#FFFFFF" />
          <rect x="11" y="14" width="2" height="2" fill="#18181B" />
          {/* Eyes */}
          <rect x="7" y="9" width="2" height="2" fill="#18181B" />
          <rect x="15" y="9" width="2" height="2" fill="#18181B" />
          {/* Body */}
          <rect x="7" y="16" width="10" height="4" fill="#C2410C" />
        </svg>
      );

    case 'bear':
      // 8-bit Steady Bear
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Round Ears */}
          <rect x="4" y="4" width="4" height="4" fill="#78350F" />
          <rect x="16" y="4" width="4" height="4" fill="#78350F" />
          <rect x="5" y="5" width="2" height="2" fill="#B45309" />
          <rect x="17" y="5" width="2" height="2" fill="#B45309" />
          {/* Head */}
          <rect x="5" y="7" width="14" height="11" fill="#78350F" />
          {/* Eyes */}
          <rect x="7" y="10" width="2" height="2" fill="#18181B" />
          <rect x="15" y="10" width="2" height="2" fill="#18181B" />
          {/* Muzzle */}
          <rect x="9" y="12" width="6" height="5" fill="#FDE68A" />
          <rect x="11" y="13" width="2" height="2" fill="#18181B" />
          {/* Tie or badge */}
          <rect x="11" y="18" width="2" height="3" fill="#DC2626" />
        </svg>
      );

    case 'pigeon':
      // 8-bit Messenger Pigeon
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <rect x="8" y="4" width="9" height="8" fill="#64748B" />
          {/* Beak holding letter */}
          <rect x="17" y="8" width="4" height="2" fill="#F59E0B" />
          <rect x="16" y="10" width="4" height="3" fill="#FEF08A" />
          <rect x="17" y="11" width="2" height="1" fill="#DC2626" />
          {/* Eye */}
          <rect x="14" y="6" width="2" height="2" fill="#DC2626" />
          <rect x="15" y="7" width="1" height="1" fill="#18181B" />
          {/* Body */}
          <rect x="5" y="10" width="12" height="8" fill="#475569" />
          {/* Wing feather */}
          <rect x="4" y="12" width="6" height="4" fill="#334155" />
          {/* Feet */}
          <rect x="8" y="18" width="2" height="3" fill="#DC2626" />
          <rect x="12" y="18" width="2" height="3" fill="#DC2626" />
        </svg>
      );

    case 'bot':
      // 8-bit Retro Robot
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Antenna */}
          <rect x="11" y="2" width="2" height="3" fill="#059669" />
          <rect x="10" y="1" width="4" height="2" fill="#34D399" />
          {/* Head */}
          <rect x="5" y="5" width="14" height="10" fill="#065F46" />
          <rect x="6" y="6" width="12" height="8" fill="#047857" />
          {/* Screen / Eyes */}
          <rect x="7" y="8" width="3" height="3" fill="#6EE7B7" />
          <rect x="14" y="8" width="3" height="3" fill="#6EE7B7" />
          {/* Mouth grid */}
          <rect x="9" y="12" width="6" height="1" fill="#A7F3D0" />
          {/* Neck & Body */}
          <rect x="10" y="15" width="4" height="2" fill="#064E3B" />
          <rect x="6" y="17" width="12" height="4" fill="#047857" />
          <rect x="11" y="18" width="2" height="2" fill="#F59E0B" />
        </svg>
      );

    case 'dino':
      // 8-bit Arcade Green Dino
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Head & Snout */}
          <rect x="10" y="3" width="9" height="7" fill="#16A34A" />
          <rect x="15" y="5" width="2" height="2" fill="#18181B" />
          <rect x="17" y="8" width="3" height="2" fill="#15803D" />
          {/* Teeth */}
          <rect x="16" y="9" width="1" height="1" fill="#FFFFFF" />
          <rect x="18" y="9" width="1" height="1" fill="#FFFFFF" />
          {/* Spikes */}
          <rect x="8" y="6" width="2" height="2" fill="#CA8A04" />
          <rect x="6" y="10" width="2" height="2" fill="#CA8A04" />
          {/* Body & Tail */}
          <rect x="7" y="10" width="9" height="8" fill="#16A34A" />
          <rect x="3" y="13" width="4" height="3" fill="#16A34A" />
          {/* Belly */}
          <rect x="10" y="12" width="5" height="5" fill="#86EFAC" />
          {/* Legs */}
          <rect x="8" y="18" width="3" height="3" fill="#15803D" />
          <rect x="13" y="18" width="3" height="3" fill="#15803D" />
        </svg>
      );

    case 'bunny':
      // 8-bit Swift Bunny
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Long Ears */}
          <rect x="6" y="2" width="3" height="7" fill="#F472B6" />
          <rect x="15" y="2" width="3" height="7" fill="#F472B6" />
          <rect x="7" y="3" width="1" height="5" fill="#FBCFE8" />
          <rect x="16" y="3" width="1" height="5" fill="#FBCFE8" />
          {/* Head */}
          <rect x="6" y="8" width="12" height="9" fill="#FFFFFF" />
          {/* Eyes */}
          <rect x="8" y="11" width="2" height="2" fill="#DB2777" />
          <rect x="14" y="11" width="2" height="2" fill="#DB2777" />
          {/* Nose */}
          <rect x="11" y="13" width="2" height="1" fill="#F43F5E" />
          {/* Cheeks */}
          <rect x="6" y="13" width="2" height="1" fill="#FBCFE8" />
          <rect x="16" y="13" width="2" height="1" fill="#FBCFE8" />
          {/* Body */}
          <rect x="7" y="17" width="10" height="4" fill="#FFFFFF" />
        </svg>
      );

    case 'cat':
    default:
      // 8-bit Reporter Cat (Default)
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Pointy Ears */}
          <rect x="4" y="3" width="3" height="4" fill="#D97706" />
          <rect x="17" y="3" width="3" height="4" fill="#D97706" />
          <rect x="5" y="4" width="1" height="2" fill="#FDE68A" />
          <rect x="18" y="4" width="1" height="2" fill="#FDE68A" />
          {/* Head */}
          <rect x="5" y="6" width="14" height="10" fill="#F59E0B" />
          {/* Big Eyes */}
          <rect x="7" y="9" width="3" height="3" fill="#18181B" />
          <rect x="14" y="9" width="3" height="3" fill="#18181B" />
          <rect x="8" y="9" width="1" height="1" fill="#FFFFFF" />
          <rect x="15" y="9" width="1" height="1" fill="#FFFFFF" />
          {/* Nose & Mouth */}
          <rect x="11" y="12" width="2" height="1" fill="#DC2626" />
          <rect x="10" y="13" width="4" height="1" fill="#78350F" />
          {/* Whiskers */}
          <rect x="3" y="12" width="2" height="1" fill="#78350F" />
          <rect x="19" y="12" width="2" height="1" fill="#78350F" />
          {/* Reporter Press Hat */}
          <rect x="7" y="5" width="10" height="2" fill="#18181B" />
          <rect x="8" y="4" width="6" height="1" fill="#FFFFFF" />
          {/* Body */}
          <rect x="7" y="16" width="10" height="4" fill="#D97706" />
          <rect x="10" y="17" width="4" height="3" fill="#FEF3C7" />
        </svg>
      );
  }
}
