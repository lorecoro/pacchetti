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
          <main className="light light:bg-cyan-200 light:text-black bg-black text-white grid grid-cols-4 gap-4 p-4">
            <div className="md:basis-1/6">
              <Sidenav />
            </div>
            <div className="grid col-span-3">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
