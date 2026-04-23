import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Syed Raqueed | Embedded Firmware Engineer",
  description:
    "Portfolio of Syed Raqueed Bin Alvee: embedded firmware, BSP development, device drivers, ARM Cortex-M, STM32, Silicon Labs, FreeRTOS, and IoT.",
  openGraph: {
    title: "Syed Raqueed | Embedded Firmware Engineer",
    description:
      "Embedded firmware engineer specialising in BSP development, device drivers, ARM Cortex-M, and connected tools platforms.",
    url: "https://sra.engineer",
    siteName: "Syed Raqueed",
    images: [
      {
        url: "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Chicago/DSCF1714",
        width: 1200,
        height: 630,
        alt: "Syed Raqueed — Embedded Firmware Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syed Raqueed | Embedded Firmware Engineer",
    description:
      "Embedded firmware engineer specialising in BSP development, device drivers, ARM Cortex-M, and connected tools platforms.",
    images: [
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Chicago/DSCF1714",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
