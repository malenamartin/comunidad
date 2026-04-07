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
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const content = (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );

  if (!publishableKey) {
    console.warn('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set');
    return content;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl={`${appUrl}/sign-in`}
      signUpUrl={`${appUrl}/sign-up`}
      afterSignInUrl={`${appUrl}/comunidad`}
      afterSignUpUrl={`${appUrl}/comunidad`}
    >
      {content}
    </ClerkProvider>
  );
}
