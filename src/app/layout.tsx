import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from '@/app/providers';
import Sidenav from '@/components/common/sidebar';

const folks = localFont({
  src: "./fonts/Folks-Light.ttf.woff"
});

export const metadata: Metadata = {
  title: "Pacchetti",
  description: "App per gestire i pacchetti di assistenza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${folks.className} antialiased`}
      >
        <Providers>
          <main className="light light:bg-cyan-200 light:text-black bg-black text-white grid grid-cols-6 gap-4 p-4">
            <div className="grid col-span-1">
              <Sidenav />
            </div>
            <div className="grid col-span-5">
              <div className="w-full border-medium px-4 py-4 rounded-small border-default-400 dark:border-default-100">
                {children}
              </div>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
