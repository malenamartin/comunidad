import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/comunidad(.*)',  // public landing is handled by route group logic
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/community/join',
  '/api/community/request-access',
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;

  // The app routes under /(app)/comunidad are protected by their own layout.
  // Here we only block unauthenticated access to API routes that require auth.
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
