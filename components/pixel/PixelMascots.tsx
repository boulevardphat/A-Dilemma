'use client';

import React from 'react';

export type MascotId =
  | 'lecturer'
  | 'journalist'
  | 'reporter'
  | 'editor'
  | 'cameraman'
  | 'pr'
  | 'designer'
  | 'photographer'
  | 'radio_host'
  | 'chief_editor'
  | 'cat'
  | 'owl'
  | 'fox'
  | 'bear'
  | 'pigeon'
  | 'bot'
  | 'dino'
  | 'bunny';

export interface MascotInfo {
  id: MascotId;
  name: string;
  role: string;
  badgeColor: string;
}

// 1. Giảng viên placed at index 0 (at the front of the selector, but NOT default)
// Followed by 9 journalism & media roles, and retro companions
export const MASCOTS: MascotInfo[] = [
  { id: 'lecturer', name: 'Giảng Viên', role: 'Chủ tọa môn Lịch sử Báo chí', badgeColor: 'bg-purple-100 text-purple-900 border-purple-300' },
  { id: 'journalist', name: 'Nhà Báo', role: 'Điều tra & phân tích', badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'reporter', name: 'Phóng Viên', role: 'Đưa tin hiện trường', badgeColor: 'bg-blue-100 text-blue-900 border-blue-300' },
  { id: 'editor', name: 'Biên Tập Viên', role: 'Kiểm duyệt & phát sóng', badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
  { id: 'cameraman', name: 'Quay Phim', role: 'Hình ảnh truyền hình', badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'pr', name: 'Chuyên Viên PR', role: 'Quan hệ công chúng', badgeColor: 'bg-rose-100 text-rose-900 border-rose-300' },
  { id: 'designer', name: 'Designer', role: 'Thiết kế dàn trang', badgeColor: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300' },
  { id: 'photographer', name: 'Nhiếp Ảnh', role: 'Ống kính báo chí', badgeColor: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'radio_host', name: 'Phát Thanh Viên', role: 'Tiếng nói Radio', badgeColor: 'bg-teal-100 text-teal-900 border-teal-300' },
  { id: 'chief_editor', name: 'Tổng Biên Tập', role: 'Chỉ đạo tòa soạn', badgeColor: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'cat', name: 'Mèo Tốc Ký', role: 'Linh vật tốc ký', badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'owl', name: 'Cú Thông Thái', role: 'Chuyên gia lý tính', badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { id: 'fox', name: 'Cáo Điều Tra', role: 'Thám tử sự thật', badgeColor: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'bear', name: 'Gấu Kiên Định', role: 'Cân bằng đạo đức', badgeColor: 'bg-stone-100 text-stone-900 border-stone-300' },
  { id: 'pigeon', name: 'Bồ Câu Tin', role: 'Sứ giả truyền thông', badgeColor: 'bg-sky-100 text-sky-900 border-sky-300' },
  { id: 'bot', name: 'Robot Data', role: 'Thuật toán dữ liệu', badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'dino', name: 'Khủng Long', role: 'Lịch sử báo chí', badgeColor: 'bg-green-100 text-green-900 border-green-300' },
  { id: 'bunny', name: 'Thỏ Nhanh Trí', role: 'Cảm xúc nhân văn', badgeColor: 'bg-pink-100 text-pink-900 border-pink-300' },
];

export function PixelMascotAvatar({
  mascotId = 'journalist',
  className = 'w-6 h-6',
}: {
  mascotId?: string;
  className?: string;
}) {
  const id = (mascotId || 'journalist').toLowerCase();

  switch (id) {
    case 'lecturer':
      // 8-bit Giảng Viên: Thầy giáo đeo kính, vest xanh navy, cà vạt đỏ, tóc xám/nâu tri thức
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Hair */}
          <rect x="7" y="2" width="10" height="3" fill="#475569" />
          <rect x="5" y="4" width="3" height="4" fill="#475569" />
          <rect x="16" y="4" width="3" height="4" fill="#475569" />
          {/* Face */}
          <rect x="7" y="5" width="10" height="8" fill="#FED7AA" />
          {/* Eyeglasses */}
          <rect x="7" y="7" width="4" height="3" fill="#18181B" />
          <rect x="13" y="7" width="4" height="3" fill="#18181B" />
          <rect x="8" y="8" width="2" height="1" fill="#E0F2FE" />
          <rect x="14" y="8" width="2" height="1" fill="#E0F2FE" />
          <rect x="11" y="8" width="2" height="1" fill="#18181B" />
          {/* Mouth & Beard touch */}
          <rect x="10" y="11" width="4" height="1" fill="#9A3412" />
          {/* Suit Collar & Red Tie */}
          <rect x="6" y="13" width="12" height="8" fill="#1E1B4B" />
          <rect x="10" y="13" width="4" height="2" fill="#FFFFFF" />
          <rect x="11" y="14" width="2" height="5" fill="#DC2626" />
          {/* Pointer / Pen in pocket */}
          <rect x="7" y="15" width="1" height="3" fill="#F59E0B" />
        </svg>
      );

    case 'journalist':
      // 8-bit Nhà Báo: Mũ phớt fedora gắn thẻ PRESS đỏ, áo ký giả
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Fedora Hat */}
          <rect x="4" y="4" width="16" height="2" fill="#78350F" />
          <rect x="6" y="2" width="12" height="3" fill="#92400E" />
          {/* Red PRESS card in hat */}
          <rect x="14" y="3" width="4" height="2" fill="#DC2626" />
          <rect x="15" y="3" width="2" height="1" fill="#FFFFFF" />
          {/* Face */}
          <rect x="7" y="6" width="10" height="7" fill="#FDE68A" />
          {/* Eyes */}
          <rect x="8" y="8" width="2" height="2" fill="#18181B" />
          <rect x="14" y="8" width="2" height="2" fill="#18181B" />
          <rect x="10" y="11" width="4" height="1" fill="#B45309" />
          {/* Trench Coat & Notepad */}
          <rect x="5" y="13" width="14" height="8" fill="#B45309" />
          <rect x="10" y="13" width="4" height="4" fill="#FEF3C7" />
          {/* Notebook */}
          <rect x="14" y="15" width="4" height="5" fill="#FFFFFF" />
          <rect x="15" y="16" width="2" height="3" fill="#2563EB" />
        </svg>
      );

    case 'reporter':
      // 8-bit Phóng Viên Hiện Trường: Cầm micro đài truyền hình có khối logo đỏ
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Hair */}
          <rect x="7" y="3" width="10" height="3" fill="#18181B" />
          <rect x="6" y="4" width="2" height="4" fill="#18181B" />
          {/* Face */}
          <rect x="8" y="5" width="9" height="7" fill="#FED7AA" />
          {/* Eyes */}
          <rect x="10" y="7" width="2" height="2" fill="#18181B" />
          <rect x="15" y="7" width="2" height="2" fill="#18181B" />
          {/* Smile */}
          <rect x="12" y="10" width="3" height="1" fill="#EA580C" />
          {/* Field Jacket */}
          <rect x="7" y="12" width="11" height="9" fill="#0284C7" />
          <rect x="10" y="12" width="5" height="3" fill="#FFFFFF" />
          {/* Microphone in hand */}
          <rect x="3" y="10" width="3" height="3" fill="#18181B" />
          <rect x="3" y="13" width="3" height="3" fill="#DC2626" />
          <rect x="4" y="16" width="1" height="5" fill="#475569" />
        </svg>
      );

    case 'editor':
      // 8-bit Biên Tập Viên Thời Sự: Tai nghe headphone lớn, áo sơ mi & cà vạt
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Headphone Band */}
          <rect x="6" y="2" width="12" height="2" fill="#3B82F6" />
          <rect x="5" y="3" width="2" height="7" fill="#3B82F6" />
          <rect x="17" y="3" width="2" height="7" fill="#3B82F6" />
          {/* Ear pads */}
          <rect x="4" y="7" width="3" height="5" fill="#1E3A8A" />
          <rect x="17" y="7" width="3" height="5" fill="#1E3A8A" />
          {/* Face */}
          <rect x="7" y="4" width="10" height="8" fill="#FDE68A" />
          <rect x="9" y="7" width="2" height="2" fill="#18181B" />
          <rect x="13" y="7" width="2" height="2" fill="#18181B" />
          {/* Mic boom */}
          <rect x="5" y="11" width="5" height="1" fill="#18181B" />
          <rect x="9" y="10" width="2" height="2" fill="#DC2626" />
          {/* Studio Suit */}
          <rect x="6" y="13" width="12" height="8" fill="#0F172A" />
          <rect x="10" y="13" width="4" height="2" fill="#FFFFFF" />
          <rect x="11" y="14" width="2" height="4" fill="#06B6D4" />
        </svg>
      );

    case 'cameraman':
      // 8-bit Quay Phim: Vác máy quay video to trên vai với đèn đỏ
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Backwards Cap */}
          <rect x="10" y="3" width="8" height="3" fill="#DC2626" />
          <rect x="7" y="4" width="3" height="2" fill="#B91C1C" />
          {/* Face */}
          <rect x="11" y="6" width="7" height="6" fill="#FED7AA" />
          <rect x="13" y="7" width="2" height="2" fill="#18181B" />
          {/* Heavy Video Camera on shoulder */}
          <rect x="2" y="5" width="8" height="6" fill="#18181B" />
          <rect x="1" y="6" width="2" height="4" fill="#0284C7" />
          {/* Lens */}
          <rect x="8" y="7" width="3" height="3" fill="#64748B" />
          {/* Tally Light */}
          <rect x="3" y="4" width="2" height="1" fill="#EF4444" />
          {/* Body */}
          <rect x="9" y="12" width="10" height="9" fill="#047857" />
        </svg>
      );

    case 'pr':
      // 8-bit Chuyên Viên PR: Cầm loa megaphone phóng thanh truyền thông
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Stylish Hair */}
          <rect x="8" y="2" width="9" height="4" fill="#7C2D12" />
          <rect x="16" y="3" width="2" height="5" fill="#7C2D12" />
          {/* Face */}
          <rect x="9" y="5" width="8" height="7" fill="#FDE68A" />
          <rect x="11" y="7" width="2" height="2" fill="#18181B" />
          <rect x="15" y="7" width="2" height="2" fill="#18181B" />
          <rect x="12" y="10" width="3" height="1" fill="#E11D48" />
          {/* Megaphone / Loa cầm tay */}
          <polygon points="2,10 6,7 6,13" fill="#F43F5E" />
          <rect x="6" y="8" width="3" height="4" fill="#FFFFFF" />
          <rect x="7" y="12" width="2" height="3" fill="#18181B" />
          {/* Professional Blazer */}
          <rect x="9" y="12" width="10" height="9" fill="#E11D48" />
          <rect x="12" y="12" width="4" height="4" fill="#FFFFFF" />
        </svg>
      );

    case 'designer':
      // 8-bit Designer Dàn Trang: Mũ beret nghệ sĩ, kính gọng to, bút vẽ stylus
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Beret */}
          <rect x="6" y="2" width="12" height="3" fill="#4C1D95" />
          <rect x="5" y="3" width="14" height="2" fill="#6D28D9" />
          <rect x="11" y="1" width="2" height="1" fill="#A78BFA" />
          {/* Face */}
          <rect x="7" y="5" width="10" height="8" fill="#FED7AA" />
          {/* Designer Round Glasses */}
          <rect x="7" y="7" width="4" height="3" fill="#18181B" />
          <rect x="13" y="7" width="4" height="3" fill="#18181B" />
          <rect x="8" y="8" width="2" height="1" fill="#EC4899" />
          <rect x="14" y="8" width="2" height="1" fill="#06B6D4" />
          {/* Stylus / Pen */}
          <rect x="3" y="12" width="2" height="6" fill="#F59E0B" />
          <rect x="3" y="18" width="2" height="2" fill="#18181B" />
          {/* Modern Turtleneck */}
          <rect x="6" y="13" width="12" height="8" fill="#18181B" />
        </svg>
      );

    case 'photographer':
      // 8-bit Nhiếp Ảnh Báo Chí: Đeo máy ảnh cơ có ống kính tròn và đèn flash
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Hair */}
          <rect x="7" y="3" width="10" height="3" fill="#57534E" />
          {/* Face */}
          <rect x="7" y="5" width="10" height="7" fill="#FED7AA" />
          <rect x="9" y="7" width="2" height="2" fill="#18181B" />
          <rect x="14" y="7" width="2" height="2" fill="#18181B" />
          {/* DSLR Camera Body on chest */}
          <rect x="5" y="13" width="14" height="7" fill="#292524" />
          {/* Lens */}
          <rect x="9" y="14" width="6" height="5" fill="#0284C7" />
          <rect x="11" y="15" width="2" height="2" fill="#FFFFFF" />
          {/* Flash */}
          <rect x="6" y="11" width="3" height="2" fill="#F59E0B" />
          <rect x="7" y="12" width="1" height="1" fill="#FEF08A" />
        </svg>
      );

    case 'radio_host':
      // 8-bit Phát Thanh Viên: Ngồi trước micro tròn đài phát thanh vintage
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Studio Headphones */}
          <rect x="6" y="2" width="12" height="2" fill="#0D9488" />
          <rect x="5" y="3" width="2" height="7" fill="#0D9488" />
          <rect x="17" y="3" width="2" height="7" fill="#0D9488" />
          {/* Face */}
          <rect x="7" y="4" width="10" height="8" fill="#FDE68A" />
          <rect x="9" y="6" width="2" height="2" fill="#18181B" />
          <rect x="13" y="6" width="2" height="2" fill="#18181B" />
          {/* Radio Vintage Mic */}
          <rect x="10" y="10" width="4" height="5" fill="#71717A" />
          <rect x="11" y="11" width="2" height="3" fill="#EF4444" />
          <rect x="11" y="15" width="2" height="5" fill="#27272A" />
          {/* Shirt */}
          <rect x="6" y="15" width="5" height="6" fill="#0F766E" />
          <rect x="13" y="15" width="5" height="6" fill="#0F766E" />
        </svg>
      );

    case 'chief_editor':
      // 8-bit Tổng Biên Tập: Đeo kính lão, ria mép uy quyền, cầm tờ báo in
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Gray Hair */}
          <rect x="6" y="2" width="12" height="3" fill="#94A3B8" />
          <rect x="5" y="4" width="2" height="4" fill="#94A3B8" />
          <rect x="17" y="4" width="2" height="4" fill="#94A3B8" />
          {/* Face */}
          <rect x="7" y="5" width="10" height="8" fill="#FED7AA" />
          {/* Glasses */}
          <rect x="8" y="7" width="3" height="2" fill="#18181B" />
          <rect x="13" y="7" width="3" height="2" fill="#18181B" />
          <rect x="11" y="7" width="2" height="1" fill="#18181B" />
          {/* Mustache */}
          <rect x="9" y="10" width="6" height="2" fill="#475569" />
          {/* Newspaper BroadSheet */}
          <rect x="4" y="13" width="16" height="8" fill="#F8FAFC" />
          <rect x="5" y="14" width="6" height="1" fill="#18181B" />
          <rect x="5" y="16" width="14" height="1" fill="#64748B" />
          <rect x="5" y="18" width="14" height="1" fill="#64748B" />
        </svg>
      );

    case 'owl':
      // 8-bit Wisdom Owl
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="3" width="2" height="3" fill="#312E81" />
          <rect x="17" y="3" width="2" height="3" fill="#312E81" />
          <rect x="6" y="5" width="12" height="13" fill="#4338CA" />
          <rect x="7" y="8" width="4" height="4" fill="#FEF08A" />
          <rect x="13" y="8" width="4" height="4" fill="#FEF08A" />
          <rect x="8" y="9" width="2" height="2" fill="#18181B" />
          <rect x="14" y="9" width="2" height="2" fill="#18181B" />
          <rect x="11" y="9" width="2" height="1" fill="#18181B" />
          <rect x="11" y="12" width="2" height="3" fill="#F59E0B" />
          <rect x="9" y="15" width="6" height="2" fill="#A5B4FC" />
          <rect x="7" y="18" width="3" height="2" fill="#D97706" />
          <rect x="14" y="18" width="3" height="2" fill="#D97706" />
        </svg>
      );

    case 'fox':
      // 8-bit Investigative Fox
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="3" width="4" height="4" fill="#EA580C" />
          <rect x="16" y="3" width="4" height="4" fill="#EA580C" />
          <rect x="5" y="4" width="2" height="2" fill="#18181B" />
          <rect x="17" y="4" width="2" height="2" fill="#18181B" />
          <rect x="6" y="6" width="12" height="8" fill="#EA580C" />
          <rect x="4" y="11" width="4" height="4" fill="#FFFFFF" />
          <rect x="16" y="11" width="4" height="4" fill="#FFFFFF" />
          <rect x="8" y="12" width="8" height="4" fill="#FFFFFF" />
          <rect x="11" y="14" width="2" height="2" fill="#18181B" />
          <rect x="7" y="9" width="2" height="2" fill="#18181B" />
          <rect x="15" y="9" width="2" height="2" fill="#18181B" />
          <rect x="7" y="16" width="10" height="4" fill="#C2410C" />
        </svg>
      );

    case 'bear':
      // 8-bit Steady Bear
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="4" height="4" fill="#78350F" />
          <rect x="16" y="4" width="4" height="4" fill="#78350F" />
          <rect x="5" y="5" width="2" height="2" fill="#B45309" />
          <rect x="17" y="5" width="2" height="2" fill="#B45309" />
          <rect x="5" y="7" width="14" height="11" fill="#78350F" />
          <rect x="7" y="10" width="2" height="2" fill="#18181B" />
          <rect x="15" y="10" width="2" height="2" fill="#18181B" />
          <rect x="9" y="12" width="6" height="5" fill="#FDE68A" />
          <rect x="11" y="13" width="2" height="2" fill="#18181B" />
          <rect x="11" y="18" width="2" height="3" fill="#DC2626" />
        </svg>
      );

    case 'pigeon':
      // 8-bit Messenger Pigeon
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="4" width="9" height="8" fill="#64748B" />
          <rect x="17" y="8" width="4" height="2" fill="#F59E0B" />
          <rect x="16" y="10" width="4" height="3" fill="#FEF08A" />
          <rect x="17" y="11" width="2" height="1" fill="#DC2626" />
          <rect x="14" y="6" width="2" height="2" fill="#DC2626" />
          <rect x="15" y="7" width="1" height="1" fill="#18181B" />
          <rect x="5" y="10" width="12" height="8" fill="#475569" />
          <rect x="4" y="12" width="6" height="4" fill="#334155" />
          <rect x="8" y="18" width="2" height="3" fill="#DC2626" />
          <rect x="12" y="18" width="2" height="3" fill="#DC2626" />
        </svg>
      );

    case 'bot':
      // 8-bit Retro Robot
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="11" y="2" width="2" height="3" fill="#059669" />
          <rect x="10" y="1" width="4" height="2" fill="#34D399" />
          <rect x="5" y="5" width="14" height="10" fill="#065F46" />
          <rect x="6" y="6" width="12" height="8" fill="#047857" />
          <rect x="7" y="8" width="3" height="3" fill="#6EE7B7" />
          <rect x="14" y="8" width="3" height="3" fill="#6EE7B7" />
          <rect x="9" y="12" width="6" height="1" fill="#A7F3D0" />
          <rect x="10" y="15" width="4" height="2" fill="#064E3B" />
          <rect x="6" y="17" width="12" height="4" fill="#047857" />
          <rect x="11" y="18" width="2" height="2" fill="#F59E0B" />
        </svg>
      );

    case 'dino':
      // 8-bit Arcade Green Dino
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="3" width="9" height="7" fill="#16A34A" />
          <rect x="15" y="5" width="2" height="2" fill="#18181B" />
          <rect x="17" y="8" width="3" height="2" fill="#15803D" />
          <rect x="16" y="9" width="1" height="1" fill="#FFFFFF" />
          <rect x="18" y="9" width="1" height="1" fill="#FFFFFF" />
          <rect x="8" y="6" width="2" height="2" fill="#CA8A04" />
          <rect x="6" y="10" width="2" height="2" fill="#CA8A04" />
          <rect x="7" y="10" width="9" height="8" fill="#16A34A" />
          <rect x="3" y="13" width="4" height="3" fill="#16A34A" />
          <rect x="10" y="12" width="5" height="5" fill="#86EFAC" />
          <rect x="8" y="18" width="3" height="3" fill="#15803D" />
          <rect x="13" y="18" width="3" height="3" fill="#15803D" />
        </svg>
      );

    case 'bunny':
      // 8-bit Swift Bunny
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="2" width="3" height="7" fill="#F472B6" />
          <rect x="15" y="2" width="3" height="7" fill="#F472B6" />
          <rect x="7" y="3" width="1" height="5" fill="#FBCFE8" />
          <rect x="16" y="3" width="1" height="5" fill="#FBCFE8" />
          <rect x="6" y="8" width="12" height="9" fill="#FFFFFF" />
          <rect x="8" y="11" width="2" height="2" fill="#DB2777" />
          <rect x="14" y="11" width="2" height="2" fill="#DB2777" />
          <rect x="11" y="13" width="2" height="1" fill="#F43F5E" />
          <rect x="6" y="13" width="2" height="1" fill="#FBCFE8" />
          <rect x="16" y="13" width="2" height="1" fill="#FBCFE8" />
          <rect x="7" y="17" width="10" height="4" fill="#FFFFFF" />
        </svg>
      );

    case 'cat':
    default:
      // 8-bit Reporter Cat
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="3" width="3" height="4" fill="#D97706" />
          <rect x="17" y="3" width="3" height="4" fill="#D97706" />
          <rect x="5" y="4" width="1" height="2" fill="#FDE68A" />
          <rect x="18" y="4" width="1" height="2" fill="#FDE68A" />
          <rect x="5" y="6" width="14" height="10" fill="#F59E0B" />
          <rect x="7" y="9" width="3" height="3" fill="#18181B" />
          <rect x="14" y="9" width="3" height="3" fill="#18181B" />
          <rect x="8" y="9" width="1" height="1" fill="#FFFFFF" />
          <rect x="15" y="9" width="1" height="1" fill="#FFFFFF" />
          <rect x="11" y="12" width="2" height="1" fill="#DC2626" />
          <rect x="10" y="13" width="4" height="1" fill="#78350F" />
          <rect x="3" y="12" width="2" height="1" fill="#78350F" />
          <rect x="19" y="12" width="2" height="1" fill="#78350F" />
          <rect x="7" y="5" width="10" height="2" fill="#18181B" />
          <rect x="8" y="4" width="6" height="1" fill="#FFFFFF" />
          <rect x="7" y="16" width="10" height="4" fill="#D97706" />
          <rect x="10" y="17" width="4" height="3" fill="#FEF3C7" />
        </svg>
      );
  }
}
