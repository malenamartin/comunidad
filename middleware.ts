import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/comunidad(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/community/join',
  '/api/community/request-access',
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  },
  {
    isSatellite: true,
    domain: process.env.NEXT_PUBLIC_CLERK_DOMAIN ?? 'comunidad.heyfardo.com',
    signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? 'https://platform-fardo.com/sign-in',
  }
);

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
