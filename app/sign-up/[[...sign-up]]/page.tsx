import { redirect } from 'next/navigation';

// This is a satellite app — authentication lives on platform-fardo.com.
// Redirect any direct access to /sign-up to the primary app.
export default function SignUpPage() {
  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? 'https://platform-fardo.com/sign-up';
  redirect(signUpUrl);
}
