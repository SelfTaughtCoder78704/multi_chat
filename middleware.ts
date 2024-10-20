import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
const isProtectedRoute = createRouteMatcher(['/(.*)', ]);
const isPublicRoute = createRouteMatcher(['/api/uploadthing']);


const redirectToOrgs = (activeOrganization: boolean, req: NextRequest) => {
  if (!activeOrganization) {
    console.log('Redirecting to organizations');
    return NextResponse.redirect(new URL('/waiting-room', req.url));
  }
}

export default clerkMiddleware(( auth, req ) => {
  if (isPublicRoute(req)) return;
  if (isProtectedRoute(req)) auth().protect();
  const {orgRole} = auth();
  const activeOrganization = !!orgRole;

  if (!activeOrganization) {
    console.log('No active organization');
    // Check if the current URL is not already '/organizations'
    if (!req.url.includes('/waiting-room')) {
      return redirectToOrgs(activeOrganization, req);
    }
  } else {
    console.log('Active organization:', orgRole);
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
  debug: true,
}
