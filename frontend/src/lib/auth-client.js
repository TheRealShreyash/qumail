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

  // If backend is on a different origin (cross-domain Vercel deployment),
  // navigate directly to backend social sign-in URL.
  // This allows the browser to set OAuth state cookies in a first-party context,
  // preventing state_mismatch errors caused by third-party cookie blocking.
  const isCrossDomain = baseURL && !baseURL.includes(window.location.host);

  if (isCrossDomain) {
    window.location.href = `${baseURL}/api/auth/sign-in/social?provider=google&callbackURL=${encodeURIComponent(fullCallbackURL)}`;
    return;
  }

  return await authClient.signIn.social({
    provider: "google",
    callbackURL: fullCallbackURL,
  });
};

export const signOut = async () => {
  return await authClient.signOut();
};
