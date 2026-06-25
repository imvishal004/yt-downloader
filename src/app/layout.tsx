import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "YT Down - Download YouTube Videos & MP3",
  description:
    "Download YouTube videos in MP4 and audio in MP3. Fast, responsive and easy to use.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Header />

        <main className="pt-4">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}