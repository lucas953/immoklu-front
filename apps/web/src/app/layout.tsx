import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Immoklu",
  description: "Financial operating system for landlords and property managers"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
