import { createAuthClient } from "better-auth/react";

const rawUrl = import.meta.env.VITE_BACKEND_URL;
const baseURL = import.meta.env.DEV && rawUrl && rawUrl.trim() !== ""
  ? rawUrl.replace(/\/api\/?$/, "").replace(/\/$/, "")
  : (typeof window !== "undefined" ? window.location.origin : "");

export const authClient = createAuthClient({
  baseURL,
  basePath: "/api/auth",
});

export const signInWithGoogle = async (callbackURL = "/inbox") => {
  const fullCallbackURL = callbackURL.startsWith("http")
    ? callbackURL
    : `${window.location.origin}${callbackURL.startsWith("/") ? "" : "/"}${callbackURL}`;

  return await authClient.signIn.social({
    provider: "google",
    callbackURL: fullCallbackURL,
  });
};

export const signOut = async () => {
  return await authClient.signOut();
};
