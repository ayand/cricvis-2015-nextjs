import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Navigation from "../components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CricVis-2015",
  description: "A Deeper Look into the 2015 Cricket World Cup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Header */}
        <header className="bg-gray-900 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center space-y-4">
              <Link href="/">
                <h1 className="text-3xl font-bold">CricVis-2015</h1>
              </Link>
              <Navigation />
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
