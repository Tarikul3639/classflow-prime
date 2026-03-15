export const AUTH_ROUTES = ['/sign-in', '/sign-up', '/forgot-password'] as const;

export function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((p) => pathname.startsWith(p));
}