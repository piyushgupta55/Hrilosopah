import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'ru', 'hi', 'pl', 'lt', 'es', 'fr', 'it', 'ro', 'he', 'zh', 'ar', 'ur'];

export default getRequestConfig(async ({ requestLocale }) => {
  let resolvedLocale = await requestLocale;
  if (!resolvedLocale || !locales.includes(resolvedLocale)) {
    // Fallback to default locale 'en' if invalid
    resolvedLocale = 'en';
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default,
  };
});
