import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "landinglab_users", firebaseUser.uid));
        const storeIdFromDb = snap.exists() ? snap.data().store_id : null;

        // Si el token no tiene el claim storeId, re-ejecutar set-store-claim y forzar refresh
        const tokenResult = await firebaseUser.getIdTokenResult();
        if (!tokenResult.claims.storeId && storeIdFromDb) {
          try {
            const rawToken = await firebaseUser.getIdToken();
            await api.setStoreClaim(rawToken);
            await firebaseUser.getIdToken(true);
          } catch (e) {
            console.warn("set-store-claim auto-retry failed:", e.message);
          }
        }

        setUser(firebaseUser);
        setStoreId(storeIdFromDb ? String(storeIdFromDb) : null);
      } else {
        setUser(null);
        setStoreId(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function loginWithEmail(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  async function loginWithCustomToken(token) {
    const cred = await signInWithCustomToken(auth, token);
    return cred.user;
  }

  async function register(email, password, displayName, storeIdParam) {
    // 1. Crear usuario en Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // 2. Crear doc de usuario en Firestore
    //    (las reglas permiten esto: request.auth.uid == uid)
    await setDoc(doc(db, "landinglab_users", uid), {
      store_id: String(storeIdParam),
      email,
      display_name: displayName,
      created_at: serverTimestamp(),
    });

    // 3. Llamar al servidor para setear el custom claim storeId
    //    El servidor también vincula firebase_uid en landinglab_stores
    const rawToken = await cred.user.getIdToken();
    await api.setStoreClaim(rawToken);

    // 4. Forzar refresh del token para que incluya el claim storeId
    await cred.user.getIdToken(true);

    setStoreId(String(storeIdParam));
    return cred.user;
  }

  async function logout() {
    await signOut(auth);
  }

  // Por defecto no fuerza refresh; pasar true para obtener claims frescos
  async function getIdToken(forceRefresh = false) {
    if (!user) return null;
    return user.getIdToken(forceRefresh);
  }

  return (
    <AuthContext.Provider
      value={{ user, storeId, loading, loginWithEmail, loginWithCustomToken, register, logout, getIdToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
