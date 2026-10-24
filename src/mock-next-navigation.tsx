import { useState, useEffect } from 'react';

export function useRouter() {
  return {
    push: (url: string) => {
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
    replace: (url: string) => {
      window.history.replaceState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
    back: () => window.history.back(),
  };
}

export function useSearchParams() {
  const [params, setParams] = useState(
    () => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  );

  useEffect(() => {
    const handlePopState = () => {
      setParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    get: (key: string) => params.get(key),
    toString: () => params.toString(),
  };
}
