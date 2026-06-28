import type { Metadata } from "next";
import "./globals.css";
import { createClient } from '@supabase/supabase-js'
import Analytics from '@/components/Analytics'

async function getSeoSettings() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { fetch: (url, opts) => fetch(url, { ...opts, next: { revalidate: 3600 } }) } }
    )
    const { data } = await supabase.from('settings').select('*').eq('id', 1).single()
    return data ?? null
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSeoSettings()

  const title = s?.meta_title || 'Сергей Рогов — Веб-дизайнер | UX/UI, нейросети, моушен'
  const description = s?.meta_description || 'Веб-дизайнер Сергей Рогов — создание сайтов, UX/UI дизайн, креативы для соцсетей, нейросетевой дизайн и моушен-графика.'
  const ogTitle = s?.og_title || title
  const ogDescription = s?.og_description || description
  const ogImage = s?.og_image || null
  const canonical = s?.canonical_url || 'https://byrogov.ru'

  return {
    title,
    description,
    keywords: 'веб-дизайнер, UX/UI дизайн, создание сайтов, креативы для соцсетей, нейросети в дизайне, моушен дизайн, веб-мастер, дизайн интерфейсов, Сергей Рогов',
    robots: s?.robots || 'index, follow',
    verification: { yandex: '55d9c97c614b8557' },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: 'Сергей Рогов — Веб-дизайнер',
      locale: 'ru_RU',
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const s = await getSeoSettings()

  return (
    <html lang="ru" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <meta name="yandex-verification" content="55d9c97c614b8557" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics gaId={s?.ga4_id} yandexId={s?.yandex_metrika_id} />
      </body>
    </html>
  );
}
