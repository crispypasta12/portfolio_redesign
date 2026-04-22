import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Syed Raqueed | Platform & Systems Engineer",
  description:
    "Portfolio of Syed Raqueed Bin Alvee: platform engineering, embedded systems, IoT, validation, and research.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
