import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import StructuredData from "@/components/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://os.hacknow.uz"),
  title: "HackNow OS — O'zbek Pentesting Distributivi",
  description:
    "HackNow OS — O'zbekistonning birinchi pentesting va kiberxavfsizlik Linux distributivi. 60+ pentest tool, XFCE desktop, Debian 12 Bookworm asosida. Alpha versiya.",
  keywords: [
    "HackNow OS",
    "pentesting",
    "kiberxavfsizlik",
    "Linux distro",
    "Uzbekistan",
    "CTF",
    "ethical hacking",
    "security research",
    "cybersecurity",
    "Debian",
  ],
  authors: [{ name: "HackNow Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/hacknow-icon.png",
    shortcut: "/hacknow-icon.png",
    apple: "/hacknow-icon.png",
  },
  alternates: {
    canonical: "https://os.hacknow.uz",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  openGraph: {
    title: "HackNow OS — O'zbek Pentesting Distributivi",
    description:
      "O'zbekistonning birinchi pentesting distributivi. 60+ tool, XFCE, Debian 12 Bookworm. Alpha versiya.",
    url: "https://os.hacknow.uz",
    siteName: "HackNow OS",
    locale: "uz_UZ",
    type: "website",
    images: [
      {
        url: "/hacknow-wallpaper.png",
        width: 1200,
        height: 630,
        alt: "HackNow OS",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@hacknow_uz",
    title: "HackNow OS",
    description:
      "O'zbekistonning birinchi pentesting distributivi. 60+ tool, XFCE, Debian 12.",
    images: ["/hacknow-wallpaper.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <StructuredData />
        {children}
        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
