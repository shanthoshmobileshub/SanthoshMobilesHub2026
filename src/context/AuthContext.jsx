import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    // Using sessionStorage which is cleared when the tab is closed.
    // It's slightly more secure than localStorage for this purpose.
    () => sessionStorage.getItem("isAdminAuthenticated") === "true"
  );

  function login(password) {
    // Check against the environment variable
    // Hardcoded passcode as per user request to ensure deployment stability
    const adminPasscode = "SMH@2026";

    if (password === adminPasscode) {
      sessionStorage.setItem("isAdminAuthenticated", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem("isAdminAuthenticated");
    setIsAuthenticated(false);
  }

  const value = { isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
