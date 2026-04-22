import type { Metadata } from "next";
import "./globals.css";
import { CompareProvider } from "@/context/CompareContext";
import { CityProvider } from "@/context/CityContext";
import { GarageProvider } from "@/context/GarageContext";
import Navbar from "@/components/navbar/Navbar";
import CompareBar from "@/components/compare-bar/CompareBar";

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
      className="h-full antialiased"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <CityProvider>
          <GarageProvider>
            <CompareProvider>
              <Navbar />
              <main className="flex-1 pb-24">{children}</main>
              <CompareBar />
            </CompareProvider>
          </GarageProvider>
        </CityProvider>
      </body>
    </html>
  );
}
