import { createContext, useContext } from "react";
import { authClient, signInWithGoogle as googleSignIn, signOut as userSignOut } from "../lib/auth-client";

const AuthContext = createContext({
  session: null,
  user: null,
  isPending: true,
  error: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  refetchSession: () => {},
});

export function AuthProvider({ children }) {
  const { data, isPending, error, refetch } = authClient.useSession();

  const handleSignInWithGoogle = async (callbackURL = "/inbox") => {
    try {
      await googleSignIn(callbackURL);
    } catch (err) {
      console.error("Google sign in failed:", err);
      throw err;
    }
  };

  const handleSignOut = async () => {
    try {
      await userSignOut();
    } catch (err) {
      console.error("Sign out failed:", err);
      throw err;
    }
  };

  const value = {
    session: data?.session || null,
    user: data?.user || null,
    isPending,
    error,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
    refetchSession: refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
