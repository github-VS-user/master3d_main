import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Toaster } from 'sonner'
import { IntroAnimation } from '@/components/intro-animation'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: 'Master 3D | Swiss 3D Printing',
  description: 'Premium 3D printed products made in Switzerland. Browse our catalog and order custom prints with fast delivery across Switzerland.',
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
      <body className={`${_inter.variable} ${_spaceGrotesk.variable} font-sans antialiased`}>
        <IntroAnimation />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
