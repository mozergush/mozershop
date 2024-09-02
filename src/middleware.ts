import { type Locale, locales } from 'public/locales/locales'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const nextIntlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en' satisfies Locale,
  localePrefix: 'never',
})

export function middleware(req: NextRequest) {
  const locale = req.cookies.get('NEXT_LOCALE')?.value
  const acceptLanguage = req.headers.get('accept-language')?.split(',')[0]

  if (!locale && acceptLanguage === 'ru-RU') {
    // Get the remaining part of the URL after the domain
    const path = req.nextUrl.pathname + req.nextUrl.search

    // Construct a new URL with /en before the remaining path
    const redirectUrl = new URL(`/en${path}`, req.url)

    const response = NextResponse.redirect(redirectUrl)
    response.cookies.set('NEXT_LOCALE', 'en', { path: '/' })
    return response
  }

  return nextIntlMiddleware(req)
}

export const config = {
  // match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}