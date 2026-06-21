import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Which Emome character are you?",
  description: "Discover how you naturally show up in relationships with the WMF 2026 Emome character quiz.",
  openGraph: {
    title: "Which Emome character are you?",
    description: "Take the one-minute Emome WMF quiz and meet your relationship character.",
    images: ["/emome-icon.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fff7ef",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
