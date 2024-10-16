import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from '@/app/providers';
import Sidenav from '@/components/common/sidebar';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
