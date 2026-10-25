'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { GameNotification } from '@/components/pixel/PixelNotificationCenter';
import { Player } from './types';

const MAX_NOTIFICATIONS = 4;
const AUTO_DISMISS_MS = 4500;

export function useGameNotifications() {
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const prevPlayersRef = useRef<Map<string, { rational: number; name: string; type: string }>>(new Map());
  const isInitializedRef = useRef<boolean>(false);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const dismiss = useCallback((id: string) => {
    if (timersRef.current.has(id)) {
      clearTimeout(timersRef.current.get(id));
      timersRef.current.delete(id);
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((item: Omit<GameNotification, 'id' | 'timestamp'>) => {
    const id = 'notif_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    const newNotif: GameNotification = {
      ...item,
      id,
      timestamp: Date.now(),
    };

    setNotifications((prev) => {
      // Keep only recent, append new one so it enters at bottom while older shift upward
      const sliced = prev.length >= MAX_NOTIFICATIONS ? prev.slice(prev.length - MAX_NOTIFICATIONS + 1) : prev;
      return [...sliced, newNotif];
    });

    const timer = setTimeout(() => {
      dismiss(id);
    }, AUTO_DISMISS_MS);

    timersRef.current.set(id, timer);
  }, [dismiss]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, []);

  // Monitor players list changes and trigger coin/side notifications automatically
  const syncPlayers = useCallback((players: Player[]) => {
    if (!players || players.length === 0) return;

    if (!isInitializedRef.current) {
      // First snapshot: just store without notification burst
      const initialMap = new Map<string, { rational: number; name: string; type: string }>();
      players.forEach((p) => {
        initialMap.set(p.id, { rational: p.rational, name: p.name, type: p.type });
      });
      prevPlayersRef.current = initialMap;
      isInitializedRef.current = true;
      return;
    }

    const currentMap = new Map<string, { rational: number; name: string; type: string }>();
    const prevMap = prevPlayersRef.current;

    players.forEach((p) => {
      currentMap.set(p.id, { rational: p.rational, name: p.name, type: p.type });
      const prev = prevMap.get(p.id);

      if (prev) {
        if (prev.rational !== p.rational) {
          const diff = p.rational - prev.rational;
          const deltaCoins = Math.round(Math.abs(diff) / 10);
          if (deltaCoins > 0) {
            const targetSide = diff > 0 ? 'rational' : 'emotional';
            addNotification({
              actorName: p.teamName ? `${p.teamName} (${p.name})` : p.name,
              isTeam: p.type === 'team',
              deltaCoins,
              targetSide,
              type: 'vote_change',
            });
          }
        }
      } else {
        // Brand new player joined room
        const rationalCoins = Math.round(p.rational / 10);
        addNotification({
          actorName: p.teamName ? `${p.teamName} (${p.name})` : p.name,
          isTeam: p.type === 'team',
          deltaCoins: rationalCoins,
          targetSide: 'rational',
          customTitle: 'THÀNH VIÊN VỪA VÀO PHÒNG',
          type: 'join',
        });
      }
    });

    prevPlayersRef.current = currentMap;
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    dismiss,
    syncPlayers,
  };
}
