import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE KETAMINES — BURNED OUT! — Electronic Press Kit",
  description:
    "The first new Ketamines LP in over a decade. Genre-agnostic Canadian DIY punk at its finest.",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="noise scanlines">{children}</body>
    </html>
  );
}
