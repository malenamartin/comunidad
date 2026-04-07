import { redirect } from 'next/navigation';

// This is a satellite app — authentication lives on platform-fardo.com.
// Redirect any direct access to /sign-in to the primary app.
export default function SignInPage() {
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? 'https://platform-fardo.com/sign-in';
  redirect(signInUrl);
}
