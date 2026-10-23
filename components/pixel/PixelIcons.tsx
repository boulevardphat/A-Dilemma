import React from 'react';

// Hand-crafted 8-bit vector graphics (NO EMOJIS!)

export function PixelPointerHand({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="2" width="4" height="12" fill="#18181B" />
      <rect x="8" y="3" width="2" height="10" fill="#FFFFFF" />
      <rect x="11" y="6" width="3" height="8" fill="#18181B" />
      <rect x="14" y="8" width="3" height="6" fill="#18181B" />
      <rect x="17" y="10" width="3" height="5" fill="#18181B" />
      <rect x="4" y="9" width="4" height="6" fill="#18181B" />
      <rect x="4" y="14" width="15" height="6" fill="#18181B" />
      <rect x="5" y="15" width="13" height="4" fill="#FFFFFF" />
      <rect x="6" y="20" width="11" height="2" fill="#18181B" />
    </svg>
  );
}

export function PixelClock({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="3" width="14" height="18" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
      <rect x="11" y="6" width="2" height="6" fill="#18181B" />
      <rect x="11" y="10" width="5" height="2" fill="#18181B" />
    </svg>
  );
}

export function PixelCoin({ className = 'w-6 h-6', value }: { className?: string; value?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer black pixel border */}
      <rect x="7" y="2" width="10" height="2" fill="#18181B" />
      <rect x="7" y="20" width="10" height="2" fill="#18181B" />
      <rect x="4" y="4" width="3" height="2" fill="#18181B" />
      <rect x="17" y="4" width="3" height="2" fill="#18181B" />
      <rect x="4" y="18" width="3" height="2" fill="#18181B" />
      <rect x="17" y="18" width="3" height="2" fill="#18181B" />
      <rect x="2" y="6" width="2" height="12" fill="#18181B" />
      <rect x="20" y="6" width="2" height="12" fill="#18181B" />

      {/* Gold coin body */}
      <rect x="7" y="4" width="10" height="16" fill="#FBBF24" />
      <rect x="4" y="6" width="3" height="12" fill="#FBBF24" />
      <rect x="17" y="6" width="3" height="12" fill="#FBBF24" />

      {/* Top/Left Highlight */}
      <rect x="7" y="4" width="8" height="2" fill="#FEF08A" />
      <rect x="4" y="6" width="2" height="8" fill="#FEF08A" />

      {/* Bottom/Right Shadow */}
      <rect x="7" y="18" width="10" height="2" fill="#B45309" />
      <rect x="17" y="8" width="2" height="10" fill="#B45309" />

      {/* Inner symbol */}
      {value !== undefined ? (
        <text
          x="12"
          y="15"
          textAnchor="middle"
          fill="#78350F"
          fontSize="8"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
        >
          {value}
        </text>
      ) : (
        <>
          <rect x="9" y="8" width="6" height="2" fill="#78350F" />
          <rect x="11" y="10" width="2" height="6" fill="#78350F" />
          <rect x="9" y="14" width="6" height="2" fill="#78350F" />
        </>
      )}
    </svg>
  );
}

export function PixelBrain({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="3" width="6" height="2" fill="#18181B" />
      <rect x="13" y="3" width="6" height="2" fill="#18181B" />
      <rect x="3" y="5" width="2" height="6" fill="#18181B" />
      <rect x="19" y="5" width="2" height="6" fill="#18181B" />
      <rect x="2" y="11" width="2" height="6" fill="#18181B" />
      <rect x="20" y="11" width="2" height="6" fill="#18181B" />
      <rect x="4" y="17" width="4" height="2" fill="#18181B" />
      <rect x="16" y="17" width="4" height="2" fill="#18181B" />
      <rect x="8" y="19" width="8" height="2" fill="#18181B" />

      <rect x="5" y="5" width="14" height="12" fill="#2563EB" />
      <rect x="3" y="11" width="18" height="6" fill="#1D4ED8" />
      <rect x="6" y="6" width="3" height="2" fill="#93C5FD" />
      <rect x="15" y="6" width="3" height="2" fill="#93C5FD" />
      <rect x="11" y="4" width="2" height="15" fill="#1E3A8A" />
      <rect x="6" y="11" width="4" height="2" fill="#1E3A8A" />
      <rect x="14" y="11" width="4" height="2" fill="#1E3A8A" />
    </svg>
  );
}

export function PixelHeart({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="3" width="6" height="2" fill="#18181B" />
      <rect x="14" y="3" width="6" height="2" fill="#18181B" />
      <rect x="2" y="5" width="2" height="6" fill="#18181B" />
      <rect x="10" y="5" width="4" height="2" fill="#18181B" />
      <rect x="20" y="5" width="2" height="6" fill="#18181B" />
      <rect x="2" y="11" width="2" height="4" fill="#18181B" />
      <rect x="20" y="11" width="2" height="4" fill="#18181B" />
      <rect x="4" y="15" width="2" height="2" fill="#18181B" />
      <rect x="18" y="15" width="2" height="2" fill="#18181B" />
      <rect x="6" y="17" width="2" height="2" fill="#18181B" />
      <rect x="16" y="17" width="2" height="2" fill="#18181B" />
      <rect x="8" y="19" width="2" height="2" fill="#18181B" />
      <rect x="14" y="19" width="2" height="2" fill="#18181B" />
      <rect x="10" y="21" width="4" height="2" fill="#18181B" />

      <rect x="4" y="5" width="6" height="10" fill="#DC2626" />
      <rect x="14" y="5" width="6" height="10" fill="#DC2626" />
      <rect x="6" y="15" width="12" height="2" fill="#DC2626" />
      <rect x="8" y="17" width="8" height="2" fill="#B91C1C" />
      <rect x="10" y="19" width="4" height="2" fill="#7F1D1D" />

      <rect x="4" y="5" width="2" height="4" fill="#FCA5A5" />
    </svg>
  );
}

export function PixelNewspaper({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
      <rect x="5" y="5" width="14" height="3" fill="#18181B" />
      <rect x="5" y="10" width="6" height="5" fill="#D4D4D8" stroke="#18181B" strokeWidth="1" />
      <rect x="13" y="10" width="6" height="1" fill="#71717A" />
      <rect x="13" y="12" width="6" height="1" fill="#71717A" />
      <rect x="13" y="14" width="4" height="1" fill="#71717A" />
      <rect x="5" y="17" width="14" height="1" fill="#71717A" />
    </svg>
  );
}

export function PixelUser({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="3" width="8" height="8" fill="#FBBF24" stroke="#18181B" strokeWidth="2" />
      <rect x="4" y="13" width="16" height="8" fill="#3B82F6" stroke="#18181B" strokeWidth="2" />
      <rect x="9" y="6" width="2" height="2" fill="#18181B" />
      <rect x="13" y="6" width="2" height="2" fill="#18181B" />
    </svg>
  );
}

export function PixelTeam({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="6" height="6" fill="#FBBF24" stroke="#18181B" strokeWidth="1.5" />
      <rect x="2" y="12" width="8" height="8" fill="#10B981" stroke="#18181B" strokeWidth="1.5" />
      <rect x="15" y="5" width="6" height="6" fill="#FBBF24" stroke="#18181B" strokeWidth="1.5" />
      <rect x="14" y="12" width="8" height="8" fill="#EC4899" stroke="#18181B" strokeWidth="1.5" />
      <rect x="9" y="2" width="6" height="6" fill="#FDE047" stroke="#18181B" strokeWidth="1.5" />
      <rect x="7" y="9" width="10" height="11" fill="#3B82F6" stroke="#18181B" strokeWidth="1.5" />
    </svg>
  );
}
