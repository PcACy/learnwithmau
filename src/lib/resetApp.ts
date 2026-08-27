/**
 * Löscht sämtliche lokalen Nutzerdaten (IndexedDB + Settings im LocalStorage)
 * und lädt die App frisch. Wird von der Einstellungs-Danger-Zone und dem
 * ErrorBoundary genutzt.
 */
export async function resetAllLocalData(): Promise<void> {
  const request = indexedDB.deleteDatabase('hanzi-arcade');
  await new Promise<void>((resolve) => {
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
    request.onblocked = () => resolve();
  });

  try {
    localStorage.removeItem('hanzi-arcade-settings');
    sessionStorage.clear();
  } catch {
    // Private-Mode-Fälle ignorieren
  }

  window.location.href = '/';
}
