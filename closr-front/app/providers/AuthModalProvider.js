"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AuthModal } from "../components/AuthModal";

const AuthModalContext = createContext({
  open: () => {},
  close: () => {},
});

export function AuthModalProvider({ children }) {
  const [mode, setMode] = useState(null);

  const open = useCallback((nextMode = "login") => {
    setMode(nextMode);
  }, []);

  const close = useCallback(() => setMode(null), []);

  return (
    <AuthModalContext.Provider value={{ open, close }}>
      {children}
      <AuthModal
        open={mode !== null}
        mode={mode ?? "login"}
        onMode={setMode}
        onClose={close}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  return useContext(AuthModalContext);
}
