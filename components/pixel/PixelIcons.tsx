import React from 'react';

// Handcrafted 8-bit Retro SVGs with explicit dimensions to prevent unstyled layout blowout

export function PixelCoin({ className = 'w-6 h-6', value = 10 }: { className?: string; value?: number }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer coin border */}
      <rect x="4" y="2" width="16" height="2" fill="#78350F" />
      <rect x="4" y="20" width="16" height="2" fill="#78350F" />
      <rect x="2" y="4" width="2" height="16" fill="#78350F" />
      <rect x="20" y="4" width="2" height="16" fill="#78350F" />
      {/* Gold coin body */}
      <rect x="4" y="4" width="16" height="16" fill="#F59E0B" />
      {/* Inner highlight */}
      <rect x="6" y="6" width="12" height="2" fill="#FDE68A" />
      <rect x="6" y="8" width="2" height="8" fill="#FDE68A" />
      {/* Inner shadow */}
      <rect x="6" y="16" width="12" height="2" fill="#B45309" />
      <rect x="16" y="8" width="2" height="8" fill="#B45309" />
      {/* Coin value or Star stamp */}
      {value === 10 ? (
        <text
          x="12"
          y="15"
          textAnchor="middle"
          fill="#78350F"
          fontSize="9"
          fontFamily="monospace"
          fontWeight="900"
        >
          10
        </text>
      ) : (
        <rect x="11" y="9" width="2" height="6" fill="#78350F" />
      )}
    </svg>
  );
}

export function PixelBrain({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M7 3h4v2H7V3zm6 0h4v2h-4V3zM5 5h2v2H5V5zm12 0h2v2h-2V5zM3 7h2v4H3V7zm16 0h2v4h-2V7zM3 11h4v2H3v-2zm14 0h4v2h-4v-2zm-6-4h2v10h-2V7zm-4 4h4v2H7v-2zm6 0h4v2h-4v-2zM5 15h2v4H5v-4zm12 0h2v4h-2v-4zm2-2h2v4h-2v-4zM3 13h2v4H3v-4zm4 6h4v2H7v-2zm6 0h4v2h-4v-2z" />
    </svg>
  );
}

export function PixelHeart({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4h4v2H4V4zm8 2h-4v2H4v6h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2V8h-4V6h-4V4h-4v2h2v2h-4V6z" />
    </svg>
  );
}

export function PixelPointerHand({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M9 2h2v10H9V2zm2 4h2v6h-2V6zm2 2h2v4h-2V8zm2 2h2v2h-2v-2zm-8 4h2v6H7v-6zm2 6h8v2H9v-2zm8-2h2v2h-2v-2zm2-2h2v2h-2v-2zm0-2h-2v2h-2v-2h-2v-2h-2v-2h-2V8H7v6H5v4h2v2h2v2h8v-2h2v-2h2v-4z" />
    </svg>
  );
}

export function PixelUser({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2h8v2H8V2zm-2 2h2v2H6V4zm10 0h2v2h-2V4zm-8 2h8v6H8V6zm-2 6h2v2H6v-2zm10 0h2v2h-2v-2zm-6 2h4v2h-4v-2zM4 16h16v2H4v-2zm-2 2h2v4H2v-4zm18 0h2v4h-2v-4zm-14 4h12v2H6v-2z" />
    </svg>
  );
}

export function PixelTeam({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 3h6v2H4V3zm-2 2h2v6H2V5zm6 0h2v6H8V5zm-4 6h4v2H4v-2zm10-8h6v2h-6V3zm-2 2h2v6h-2V5zm6 0h2v6h-2V5zm-4 6h4v2h-4v-2zM1 15h10v2H1v-2zm12 0h10v2H13v-2zm-12 2h2v5H1v-5zm10 0h2v5h-2v-5zm2 0h2v5h-2v-5zm10 0h2v5h-2v-5zM3 22h6v2H3v-2zm12 0h6v2h-6v-2z" />
    </svg>
  );
}

export function PixelClock({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2h8v2H8V2zm-4 4h4V4H6v2H4v4h2V6zm14 0h2v4h2V6h-2V4h-2v2zm-14 6H2v4h2v2h2v-2H4v-4zm18 0h-2v4h2v2h2v-2h-2v-4zm-4 8h-8v2h8v-2zm-8-2H6v2h2v-2zm10 0h-2v2h2v-2zM11 6h2v6h4v2h-6V6z" />
    </svg>
  );
}
