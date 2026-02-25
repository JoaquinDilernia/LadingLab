import { useEffect, useRef } from "react";

/**
 * Auto-guarda los bloques a Firestore con debounce de 1.5s.
 * Solo guarda si hay cambios pendientes (isDirty).
 */
export function useAutoSave({ blocks, landing, landingId, storeId, getIdToken, api, isDirty, markSaved }) {
  const timerRef = useRef(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!isDirty || !landingId || !storeId) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      if (savingRef.current) return;
      savingRef.current = true;
      try {
        const token = await getIdToken();
        await api.updateLanding(storeId, landingId, {
          blocks,
          title: landing?.title,
        }, token);
        markSaved();
      } catch (e) {
        console.error("Auto-save failed:", e.message);
      } finally {
        savingRef.current = false;
      }
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [blocks, landing?.title, isDirty]);
}
