import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ═══════════════════════════════════════════════════════════
// 🔥 CONFIGURAÇÃO DO FIREBASE
// ═══════════════════════════════════════════════════════════
// Cole aqui as configurações do seu projeto Firebase Console:
//   1. Acesse: console.firebase.google.com
//   2. Selecione seu projeto "mundo-aprender"
//   3. Vá em Configurações do projeto > Geral > Seus apps
//   4. Copie o objeto firebaseConfig e cole abaixo
// ═══════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey: "COLE_SUA_API_KEY_AQUI",
  authDomain: "COLE_SEU_AUTH_DOMAIN_AQUI",
  projectId: "COLE_SEU_PROJECT_ID_AQUI",
  storageBucket: "COLE_SEU_STORAGE_BUCKET_AQUI",
  messagingSenderId: "COLE_SEU_MESSAGING_SENDER_ID_AQUI",
  appId: "COLE_SEU_APP_ID_AQUI",
};

// Inicializar Firebase (evita duplicação em dev com HMR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;
