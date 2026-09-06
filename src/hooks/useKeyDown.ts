import { useEffect, useRef } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface StackEntry {
  id: symbol;
  getHandler: () => KeyHandler;
}

const handlerStack: StackEntry[] = [];
let globalListenerAttached = false;

function dispatchGlobalKeydown(event: KeyboardEvent) {
  // LIFO: Neueste / am tiefsten verschachtelte Handler (Modals, Pages) zuerst
  for (let i = handlerStack.length - 1; i >= 0; i--) {
    const entry = handlerStack[i];
    if (entry) {
      entry.getHandler()(event);
      if (event.defaultPrevented) {
        break;
      }
    }
  }
}

function ensureGlobalListener() {
  if (!globalListenerAttached && typeof window !== 'undefined') {
    window.addEventListener('keydown', dispatchGlobalKeydown);
    globalListenerAttached = true;
  }
}

/**
 * Registriert einen globalen Keydown-Handler im hierarchischen LIFO-Responder-Stack.
 * Immer aktuelle Callback-Ref ohne stale Closures.
 * Sobald ein Handler event.preventDefault() ausführt, stoppt die Kette für dahinterliegende Handler.
 */
export function useKeyDown(handler: KeyHandler): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    ensureGlobalListener();
    const id = Symbol('keyHandler');
    const entry: StackEntry = { id, getHandler: () => handlerRef.current };
    handlerStack.push(entry);

    return () => {
      const index = handlerStack.findIndex((e) => e.id === id);
      if (index !== -1) {
        handlerStack.splice(index, 1);
      }
      if (handlerStack.length === 0 && globalListenerAttached && typeof window !== 'undefined') {
        window.removeEventListener('keydown', dispatchGlobalKeydown);
        globalListenerAttached = false;
      }
    };
  }, []);
}

