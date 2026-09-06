import { db } from './db';

/**
 * Löscht sämtliche lokalen Nutzerdaten (IndexedDB + Settings im LocalStorage)
 * und lädt die App frisch. Wird von der Einstellungs-Danger-Zone und dem
 * ErrorBoundary genutzt.
 */
export async function resetAllLocalData(): Promise<void> {
  try {
    db.close();
  } catch {
    // ignore
  }

  if (typeof indexedDB !== 'undefined') {
    const request = indexedDB.deleteDatabase('hanzi-arcade');
    await new Promise<void>((resolve) => {
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    });
  }

  try {
    localStorage.removeItem('hanzi-arcade-settings');
    localStorage.removeItem('hanzi_completed_grammar');
    localStorage.removeItem('hanzi_completed_stories');
    localStorage.removeItem('hanzi_completed_dialogues');
    sessionStorage.clear();
  } catch {
    // Private-Mode-Fälle ignorieren
  }

  if (typeof window !== 'undefined' && window.location) {
    window.location.href = '/';
  }
}
