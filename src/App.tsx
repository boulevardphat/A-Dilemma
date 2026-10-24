'use client';

import React, { useState, useEffect } from 'react';
import HomePage from '../app/page';
import HostPage from '../app/host/page';
import PlayerPage from '../app/play/page';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Simple client-side router
  if (currentPath.startsWith('/host')) {
    return <HostPage />;
  }

  if (currentPath.startsWith('/play')) {
    return <PlayerPage />;
  }

  return <HomePage />;
}
