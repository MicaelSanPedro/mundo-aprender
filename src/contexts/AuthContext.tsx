"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

// ─── Types ──────────────────────────────────────────────

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
  phone: string;
  createdAt: string;
  lastLogin: string;
}

interface PurchaseRecord {
  orderId: string;
  orderNumber: string;
  items: { id: number; name: string; price: number; emoji: string; quantity: number }[];
  total: number;
  status: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  firebaseReady: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveFavorites: (productIds: number[]) => Promise<void>;
  loadFavorites: () => Promise<number[]>;
  savePurchase: (order: PurchaseRecord) => Promise<void>;
  loadPurchases: () => Promise<PurchaseRecord[]>;
  saveCustomerData: (data: { name: string; email: string; phone: string }) => Promise<void>;
  loadCustomerData: () => Promise<{ name: string; email: string; phone: string } | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  firebaseReady: false,
  loginWithGoogle: async () => {},
  logout: async () => {},
  saveFavorites: async () => {},
  loadFavorites: async () => [],
  savePurchase: async () => {},
  loadPurchases: async () => [],
  saveCustomerData: async () => {},
  loadCustomerData: async () => null,
});

// ─── Provider ───────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Check if Firebase config is set (not placeholder)
  useEffect(() => {
    try {
      const app = auth.app;
      const options = app.options;
      const isConfigured = options.apiKey && !options.apiKey.includes("COLE_SUA");
      setFirebaseReady(isConfigured);
    } catch {
      setFirebaseReady(false);
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Create or update user profile in Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        const userProfile: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "Usuário",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL,
          phone: "",
          createdAt: userSnap.exists()
            ? userSnap.data().createdAt
            : new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        // If profile exists, merge phone number
        if (userSnap.exists()) {
          userProfile.phone = userSnap.data().phone || "";
        }

        await setDoc(userRef, userProfile, { merge: true });
        setProfile(userProfile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [firebaseReady]);

  // ─── Login with Google ──────────────────────────────

  const loginWithGoogle = useCallback(async () => {
    if (!firebaseReady) {
      console.warn("Firebase not configured yet");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      // Ignore popup closed by user
      if (error.code !== "auth/popup-closed-by-user") {
        console.error("Google login error:", error);
        throw error;
      }
    }
  }, [firebaseReady]);

  // ─── Logout ─────────────────────────────────────────

  const logout = useCallback(async () => {
    if (!firebaseReady) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [firebaseReady]);

  // ─── Favorites ──────────────────────────────────────

  const saveFavorites = useCallback(async (productIds: number[]) => {
    if (!user || !firebaseReady) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        favorites: productIds,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Save favorites error:", error);
    }
  }, [user, firebaseReady]);

  const loadFavorites = useCallback(async (): Promise<number[]> => {
    if (!user || !firebaseReady) return [];
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        return data.favorites || [];
      }
      return [];
    } catch (error) {
      console.error("Load favorites error:", error);
      return [];
    }
  }, [user, firebaseReady]);

  // ─── Purchase History ───────────────────────────────

  const savePurchase = useCallback(async (order: PurchaseRecord) => {
    if (!user || !firebaseReady) return;
    try {
      // Save to user's purchases subcollection
      const purchaseRef = doc(db, "users", user.uid, "purchases", order.orderId);
      await setDoc(purchaseRef, {
        ...order,
        userId: user.uid,
        createdAt: order.createdAt || new Date().toISOString(),
      });
    } catch (error) {
      console.error("Save purchase error:", error);
    }
  }, [user, firebaseReady]);

  const loadPurchases = useCallback(async (): Promise<PurchaseRecord[]> => {
    if (!user || !firebaseReady) return [];
    try {
      const purchasesRef = collection(db, "users", user.uid, "purchases");
      const q = query(purchasesRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data() as PurchaseRecord);
    } catch (error) {
      console.error("Load purchases error:", error);
      return [];
    }
  }, [user, firebaseReady]);

  // ─── Customer Data ──────────────────────────────────

  const saveCustomerData = useCallback(async (data: { name: string; email: string; phone: string }) => {
    if (!user || !firebaseReady) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: data.name || profile?.name,
        email: data.email || profile?.email,
        phone: data.phone || profile?.phone,
      });
      setProfile(prev => prev ? { ...prev, phone: data.phone || prev.phone } : prev);
    } catch (error) {
      console.error("Save customer data error:", error);
    }
  }, [user, firebaseReady, profile]);

  const loadCustomerData = useCallback(async (): Promise<{ name: string; email: string; phone: string } | null> => {
    if (!user || !firebaseReady) return null;
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        };
      }
      return null;
    } catch (error) {
      console.error("Load customer data error:", error);
      return null;
    }
  }, [user, firebaseReady]);

  const value: AuthContextType = {
    user,
    profile,
    loading,
    firebaseReady,
    loginWithGoogle,
    logout,
    saveFavorites,
    loadFavorites,
    savePurchase,
    loadPurchases,
    saveCustomerData,
    loadCustomerData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
