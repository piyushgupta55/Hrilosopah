import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Quiz Knowledge Widget',
  description: 'Test your knowledge about AI and Cryptocurrency.',
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Validate locale against supported locales and fallback if needed
  const supportedLocales = [
    'en',
    'ru',
    'hi',
    'pl',
    'lt',
    'es',
    'fr',
    'it',
    'ro',
    'he',
    'zh',
    'ar',
    'ur',
  ];
  if (!supportedLocales.includes(locale)) {
    locale = 'en';
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('hrilosopah_theme') || 'light';
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased font-sans bg-gray-50 dark:bg-black text-slate-900 dark:text-[#FFFFFF]`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-5xl min-h-[100dvh] md:min-h-0 md:my-8 bg-white dark:bg-[#0B0D12] shadow-xl md:rounded-3xl md:border md:border-gray-100 md:dark:border-gray-800 relative overflow-hidden flex flex-col">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
