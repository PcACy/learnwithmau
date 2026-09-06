import { useEffect, useRef } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

export interface UseKeyDownOptions {
  /** Wenn true, wird der Handler auch aufgerufen, wenn ein Eingabefeld (input, textarea, etc.) fokussiert ist. */
  allowInInputs?: boolean;
}

interface StackEntry {
  id: symbol;
  getHandler: () => KeyHandler;
  allowInInputs: boolean;
}

const handlerStack: StackEntry[] = [];
let globalListenerAttached = false;

export function isInteractiveElement(target: EventTarget | null): boolean {
  if (!target) return false;
  if (typeof HTMLElement !== 'undefined' && !(target instanceof HTMLElement)) {
    return false;
  }
  const el = target as { tagName?: string; isContentEditable?: boolean };
  const tag = el.tagName?.toUpperCase();
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    Boolean(el.isContentEditable)
  );
}

function dispatchGlobalKeydown(event: KeyboardEvent) {
  const isInput = isInteractiveElement(event.target);
  const isEscape = event.key === 'Escape';

  // LIFO: Neueste / am tiefsten verschachtelte Handler (Modals, Pages) zuerst
  for (let i = handlerStack.length - 1; i >= 0; i--) {
    const entry = handlerStack[i];
    if (entry) {
      // Wenn der Fokus in einem Text-Eingabefeld liegt und es nicht Escape ist:
      // Handler überspringen, es sei denn, er erlaubt Eingaben explizit.
      if (isInput && !isEscape && !entry.allowInInputs) {
        continue;
      }
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
 * Tastatureingaben in Eingabefeldern (Inputs/Textareas) werden standardmäßig gefiltert (außer Escape).
 * Sobald ein Handler event.preventDefault() ausführt, stoppt die Kette für dahinterliegende Handler.
 */
export function useKeyDown(handler: KeyHandler, options?: UseKeyDownOptions): void {
  const handlerRef = useRef(handler);
  const allowInInputs = options?.allowInInputs ?? false;

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    ensureGlobalListener();
    const id = Symbol('keyHandler');
    const entry: StackEntry = {
      id,
      getHandler: () => handlerRef.current,
      allowInInputs,
    };
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
  }, [allowInInputs]);
}


