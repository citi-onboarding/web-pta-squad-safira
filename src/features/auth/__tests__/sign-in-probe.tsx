import { useLocation } from "react-router-dom";

// Stands in for the sign-in screen and shows the page the guard remembered.
export function SignInProbe() {
  const location = useLocation();
  const state = location.state as { from?: string } | null;

  return (
    <>
      <h1>Sign-in screen</h1>
      <p>Requested: {state?.from ?? "none"}</p>
    </>
  );
}
