import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div
      style={{
        background: '#0A0A0A',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <SignIn
        afterSignInUrl={`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/comunidad`}
        signUpUrl={`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/sign-up`}
      />
    </div>
  );
}
