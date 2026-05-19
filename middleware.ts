import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    // Protected admin pages only
    '/product/:path*',
    '/site-config/:path*',
  ],
};
