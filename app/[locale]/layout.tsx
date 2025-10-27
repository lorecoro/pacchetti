// app/[locale]/layout.tsx

import localFont from "next/font/local";
import "./globals.css";
import Providers from '@/app/providers';
import Sidebar from '@/app/components/common/sidebar';
import Topbar from '@/app/components/common/topbar';
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from 'next-intl/server';

const font = localFont({
  // src: "./fonts/LTInternet-Regular.ttf"
  src: "./fonts/Elsa-Regular.otf"
});

interface Params {
  locale: string;
}

export async function generateMetadata({ locale }: Params) {
  const t = await getTranslations({ locale, namespace: 'metadata'});

  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
  }>
) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  // Receive messages provided in `i18n/request.ts`
  const messages = await getMessages();

  return (
    <html lang={locale} className="light">
      <body className={`${font.className} antialiased`}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <main className="light light:bg-cyan-200 light:text-black bg-black text-white grid grid-cols-1 lg:grid-cols-6 lg:gap-4 p-4">
              <div className="grid col-span-1 hidden lg:block">
                <Sidebar />
              </div>
              <div className="grid col-span-1 block lg:hidden">
                <Topbar />
              </div>
              <div className="grid col-span-1 lg:col-span-5">
                <div className="w-full max-w-10/10 border-medium px-4 py-4 rounded-small border-default-400 dark:border-default-100">
                  {children}
                </div>
              </div>
            </main>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
