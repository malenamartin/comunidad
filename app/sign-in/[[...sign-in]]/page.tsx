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
        afterSignInUrl="/comunidad"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
