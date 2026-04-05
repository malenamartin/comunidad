import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div
      style={{ background: '#0A0A0A', minHeight: '100vh' }}
      className="flex items-center justify-center"
    >
      <SignIn />
    </div>
  );
}
