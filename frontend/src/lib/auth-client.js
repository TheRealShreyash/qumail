import { createAuthClient } from "better-auth/react";

const rawUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
const baseURL = rawUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

export const authClient = createAuthClient({
  baseURL,
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
