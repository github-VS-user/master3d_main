import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Toaster } from 'sonner'
import { IntroAnimation } from '@/components/intro-animation'
import { CookieConsent } from '@/components/cookie-consent'
import { LanguageProvider } from '@/lib/language-context'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://master3d.net"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Master 3D | Swiss 3D Printing - Premium 3D Printed Products",
    template: "%s | Master 3D",
  },
  description: "Premium 3D printed products made in Switzerland. Browse our catalog of custom prints, gadgets, home decor and more. Fast delivery across Switzerland.",
  keywords: [
    "3D printing Switzerland",
    "Swiss 3D prints",
    "custom 3D printing",
    "3D printed products",
    "buy 3D prints",
    "Master 3D",
    "3D printing shop",
    "3D printed gadgets",
    "3D printed home decor",
    "Switzerland delivery",
  ],
  authors: [{ name: "Master 3D" }],
  creator: "Master 3D",
  publisher: "Master 3D",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_CH",
    alternateLocale: "fr_CH",
    url: siteUrl,
    siteName: "Master 3D",
    title: "Master 3D | Swiss 3D Printing - Premium 3D Printed Products",
    description: "Premium 3D printed products made in Switzerland. Browse our catalog of custom prints, gadgets, home decor and more. Fast delivery across Switzerland.",
    images: [
      {
        url: "/images/master3d_logo.jpg",
        width: 1200,
        height: 630,
        alt: "Master 3D - Swiss 3D Printing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Master 3D | Swiss 3D Printing",
    description: "Premium 3D printed products made in Switzerland. Fast delivery across Switzerland.",
    images: ["/images/master3d_logo.jpg"],
  },
  icons: {
    icon: "/images/master3d_logo.jpg",
    shortcut: "/images/master3d_logo.jpg",
    apple: "/images/master3d_logo.jpg",
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-google-verification-code",
  },
}

export const viewport: Viewport = {
  themeColor: '#FF6B00',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Master 3D",
              description: "Premium 3D printed products made in Switzerland",
              url: siteUrl,
              logo: `${siteUrl}/images/master3d_logo.jpg`,
              image: `${siteUrl}/images/master3d_logo.jpg`,
              telephone: "+41782514768",
              email: "contact@master3d.net",
              address: {
                "@type": "PostalAddress",
                addressCountry: "CH",
                addressRegion: "Switzerland",
              },
              geo: {
                "@type": "GeoCoordinates",
                addressCountry: "CH",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                opens: "00:00",
                closes: "23:59",
              },
              priceRange: "CHF",
              currenciesAccepted: "CHF",
              paymentAccepted: "Bank Transfer, TWINT, Cash",
              areaServed: {
                "@type": "Country",
                name: "Switzerland",
              },
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className={`${_inter.variable} ${_spaceGrotesk.variable} font-sans antialiased`}>
        <LanguageProvider>
          <IntroAnimation />
          {children}
          <CookieConsent />
          <Toaster position="top-right" richColors />
        </LanguageProvider>
      </body>
    </html>
  )
}
