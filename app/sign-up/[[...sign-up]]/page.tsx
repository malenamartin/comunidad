import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
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
      <SignUp
        afterSignUpUrl={`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/comunidad`}
        signInUrl={`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/sign-in`}
      />
    </div>
  );
}
