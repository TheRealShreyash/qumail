import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080",
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

