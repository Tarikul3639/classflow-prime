import type { Metadata, Viewport } from "next";

// All Providers
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "ClassFlow",
  description: "Manage your classes with ease.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ClassFlow",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.svg" }, // Legacy support
      { url: "/icon.png", sizes: "192x192", type: "image/png" }, // Android
      { url: "/icon.png", sizes: "512x512", type: "image/png" }, // Android
    ],
    apple: [
      { url: "/icon.png", sizes: "180x180", type: "image/png" }, // iOS
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="ClassFlow" />
      </head>
      <body className={`antialiased font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
