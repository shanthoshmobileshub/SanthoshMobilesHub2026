import React from 'react';
import { Navigate } from 'react-router-dom';

// This component is a helper for a "magic link" style admin login.
// It navigates to the standard authentication page but passes a special
// state object that the Auth page can use to pre-fill the password.
export default function AdminMagicLogin() {
  // The passcode is hardcoded here as requested for the magic link.
  const adminPasscode = "SMH@2026";

  return <Navigate to="/auth" replace state={{ prefillPass: adminPasscode }} />;
}
