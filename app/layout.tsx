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
        {/* Satoshi — Fardo Design System font */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,900&display=swap"
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

  // Satellite domain: authentication lives on the primary app (platform-fardo.com).
  // NEVER point signInUrl/signUpUrl to this satellite's own /sign-in.
  const signInUrl  = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL  ?? 'https://platform-fardo.com/sign-in';
  const signUpUrl  = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL  ?? 'https://platform-fardo.com/sign-up';
  const domain     = process.env.NEXT_PUBLIC_CLERK_DOMAIN        ?? 'comunidad.heyfardo.com';
  const appUrl     = process.env.NEXT_PUBLIC_APP_URL             ?? 'https://comunidad.heyfardo.com';

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      domain={domain}
      isSatellite
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      afterSignInUrl={`${appUrl}/comunidad`}
      afterSignUpUrl={`${appUrl}/comunidad`}
    >
      {content}
    </ClerkProvider>
  );
}
