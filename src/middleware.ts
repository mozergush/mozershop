import { type Locale, locales } from 'public/locales/locales'
import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'

const nextIntlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en' satisfies Locale,
  localePrefix: 'never',
})

export function middleware(request: NextRequest) {
  request.headers.set('accept-language', 'en-US,en;q=0.9')

  // Выполняем логику из nextIntlMiddleware
  const response = nextIntlMiddleware(request)

  return response
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