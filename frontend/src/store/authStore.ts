import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import type { AppUser } from "../types";

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  login: async (email, password) => {
    set({ error: null, loading: true });
    try {
      const result = await signInWithEmailAndPassword(auth!, email, password);
      const { uid, displayName, email: userEmail } = result.user;
      set({
        user: { uid, name: displayName || userEmail || "User", email: userEmail || "" },
        loading: false,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed.";
      set({ error: msg.replace("Firebase: ", ""), loading: false });
    }
  },

  signup: async (email, password, name) => {
    set({ error: null, loading: true });
    try {
      const result = await createUserWithEmailAndPassword(auth!, email, password);
      await updateProfile(result.user, { displayName: name });
      const { uid } = result.user;
      set({
        user: { uid, name, email },
        loading: false,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed.";
      set({ error: msg.replace("Firebase: ", ""), loading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ error: null, loading: true });
    try {
      const result = await signInWithPopup(auth!, googleProvider!);
      const { uid, displayName, email } = result.user;
      set({
        user: { uid, name: displayName || "Google User", email: email || "" },
        loading: false,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google login failed.";
      set({ error: msg.replace("Firebase: ", ""), loading: false });
    }
  },

  logout: async () => {
    await signOut(auth!);
    set({ user: null });
  },

  clearError: () => set({ error: null }),

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth!, (firebaseUser) => {
      if (firebaseUser) {
        set({
          user: {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email || "User",
            email: firebaseUser.email || "",
          },
          loading: false,
        });
      } else {
        set({ user: null, loading: false });
      }
    });
    return unsubscribe;
  },
}));
