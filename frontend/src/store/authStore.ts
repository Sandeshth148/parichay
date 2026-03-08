// LOCAL MOCK auth store — uses localStorage instead of Firebase
// Works fully offline for local development

import { create } from "zustand";
import type { AppUser } from "../types";

const SESSION_KEY = "cd_session";
const USERS_KEY = "cd_users";

interface StoredUser {
  uid: string;
  name: string;
  email: string;
  password: string;
}

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): AppUser | null {
  try {
    // sessionStorage is tab-isolated — each tab keeps its own logged-in user
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(user: AppUser) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function generateUid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

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
    await new Promise((r) => setTimeout(r, 300)); // simulate network
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!found) {
      set({ error: "Invalid email or password.", loading: false });
      return;
    }
    const user: AppUser = {
      uid: found.uid,
      name: found.name,
      email: found.email,
    };
    saveSession(user);
    set({ user, loading: false });
  },

  signup: async (email, password, name) => {
    set({ error: null, loading: true });
    await new Promise((r) => setTimeout(r, 300));
    const users = getStoredUsers();
    if (users.find((u) => u.email === email)) {
      set({
        error: "An account with this email already exists.",
        loading: false,
      });
      return;
    }
    const newUser: StoredUser = { uid: generateUid(), name, email, password };
    saveUsers([...users, newUser]);
    const appUser: AppUser = { uid: newUser.uid, name, email };
    saveSession(appUser);
    set({ user: appUser, loading: false });
  },

  loginWithGoogle: async () => {
    set({ error: null, loading: true });
    await new Promise((r) => setTimeout(r, 300));
    // Mock Google login — creates a demo account
    const appUser: AppUser = {
      uid: generateUid(),
      name: "Google User",
      email: "google-user@demo.com",
    };
    saveSession(appUser);
    set({ user: appUser, loading: false });
  },

  logout: async () => {
    clearSession();
    set({ user: null });
  },

  clearError: () => set({ error: null }),

  initialize: () => {
    const session = getSession();
    set({ user: session, loading: false });
    // Return a no-op unsubscribe (no listener needed for localStorage)
    return () => {};
  },
}));
