import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div
      style={{ background: '#0A0A0A', minHeight: '100vh' }}
      className="flex items-center justify-center"
    >
      <SignUp />
    </div>
  );
}
