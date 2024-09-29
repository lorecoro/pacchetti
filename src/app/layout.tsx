import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from '@/app/providers';
import Sidenav from '@/components/sidebar';

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
          <main className="light light:bg-cyan-200 light:text-black bg-black text-white container mx-auto max-w-6xl flex flex-row md:overflow-hidden">
            <div className="md:basis-1/6">
              <Sidenav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
