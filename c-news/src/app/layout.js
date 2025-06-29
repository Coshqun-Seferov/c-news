import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "C-News | Актуальные новости и статьи",
  description: "Ваш источник актуальных новостей, интересных статей и аналитических материалов",
  keywords: "новости, статьи, аналитика, C-News",
  authors: [{ name: "C-News Team" }],
  creator: "C-News",
  publisher: "C-News",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://c-news.com",
    title: "C-News | Актуальные новости и статьи",
    description: "Ваш источник актуальных новостей, интересных статей и аналитических материалов",
    siteName: "C-News",
  },
  twitter: {
    card: "summary_large_image",
    title: "C-News | Актуальные новости и статьи",
    description: "Ваш источник актуальных новостей, интересных статей и аналитических материалов",
  },
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen`}
      >
        <div className="relative">
          {/* Background Pattern */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          </div>

          {/* Main Content */}
          <main className="relative z-10">{children}</main>

          {/* Global Loading Indicator */}
          <div id="loading-indicator" className="hidden fixed top-4 right-4 z-50">
            <div className="glass-card p-3 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Загрузка...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Google Analytics or other analytics code
              console.log('C-News loaded successfully');
            `,
          }}
        />
      </body>
    </html>
  )
}
