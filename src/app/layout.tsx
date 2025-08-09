import type {Metadata} from 'next';
import './globals.css';
import 'react-phone-number-input/style.css'
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Analytics } from "@vercel/analytics/react"
import { SettingsProvider } from '@/context/SettingsContext';
import ThemeUpdater from '@/components/ThemeUpdater';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import NewsletterPopup from '@/components/NewsletterPopup';

export const metadata: Metadata = {
  title: 'Sira Pharmacy Online',
  description: 'Your trusted online pharmacy for all your medical needs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
            <SettingsProvider>
                <CartProvider>
                    <ThemeUpdater />
                    {children}
                    <Toaster />
                    <CookieConsentBanner />
                    <NewsletterPopup />
                </CartProvider>
            </SettingsProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
