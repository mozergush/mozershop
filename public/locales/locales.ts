export const locales = ['en', 'es', 'ru'] as const
export type Locale = (typeof locales)[number];