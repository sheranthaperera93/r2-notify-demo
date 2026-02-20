import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../context/AuthContext";

export const GoogleSignInButton = () => {
  const { signIn } = useAuth();

  return (
    <GoogleLogin
      onSuccess={async (response) => {
        if (response.credential) {
          await signIn(response.credential);
        }
      }}
      onError={() => console.error("Google Sign In failed")}
      useOneTap
    />
  );
};
