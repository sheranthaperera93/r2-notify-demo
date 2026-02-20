import { GoogleSignInButton } from "./GoogleSignInButton";

export const LoginPage = () => (
  <div className="flex flex-col items-center justify-center h-screen gap-6">
    <h1 className="text-3xl font-bold">R2-Notify Playground</h1>
    <p className="text-gray-500">Sign in to access the playground</p>
    <GoogleSignInButton />
  </div>
);
