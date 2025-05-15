import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: [
    '/',
    '/favicon.ico',
    '/auth(.*)',
    '/portal(.*)',
    '/images(.*)',
    '/api(.*)'
  ],
  ignoredRoutes: ['/chatbot']
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}