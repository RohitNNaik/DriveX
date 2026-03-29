import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CompareProvider } from "@/context/CompareContext";
import Navbar from "@/components/navbar/Navbar";
import CompareBar from "@/components/compare-bar/CompareBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DriveX – Car Decision Platform",
  description: "Find, compare and decide your next car with AI-powered recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <CompareProvider>
          <Navbar />
          <main className="flex-1 pb-24">{children}</main>
          <CompareBar />
        </CompareProvider>
      </body>
    </html>
  );
}
