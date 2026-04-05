import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'Comunidad Fardo',
  description: 'La comunidad exclusiva donde las marcas dejan de ser invisibles en la IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ClerkProvider requires a publishable key. When not configured (e.g. during
  // static build without env vars), render without it so the build doesn't fail.
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const content = (
    <html lang="es">
      <body>{children}</body>
    </html>
  );

  if (!publishableKey) return content;

  return <ClerkProvider publishableKey={publishableKey}>{content}</ClerkProvider>;
}
