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
        afterSignUpUrl="/comunidad"
        signInUrl="/sign-in"
      />
    </div>
  );
}
