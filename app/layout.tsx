import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteTitle = "Emome WMF 2026 Character Quiz";
const siteDescription = "Discover how you naturally show up in relationships with the official Emome WMF 2026 character quiz.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  applicationName: "Emome WMF Quiz",
  icons: {
    icon: [
      { url: "/emome-icon.png", type: "image/png" },
      { url: "/emome-heart.png", type: "image/png" },
    ],
    apple: [{ url: "/emome-icon.png", type: "image/png" }],
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    images: [{ url: "/emome-icon.png", width: 512, height: 512, alt: "Emome icon" }],
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    images: ["/emome-icon.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fff7ef",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
