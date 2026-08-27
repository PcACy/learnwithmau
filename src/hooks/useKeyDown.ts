import { useEffect, useRef } from 'react';

/**
 * Registriert einen globalen Keydown-Handler mit immer aktueller Callback-Ref
 * (kein Re-Bind des Listeners, keine stale Closures).
 */
export function useKeyDown(handler: (event: KeyboardEvent) => void): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => handlerRef.current(event);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);
}
