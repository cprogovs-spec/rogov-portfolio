import type { Metadata } from "next";
import "./globals.css";
import { createClient } from '@supabase/supabase-js'
import Analytics from '@/components/Analytics'

export const metadata: Metadata = {
  title: 'Рогов — Дизайнер',
  description: 'Портфолио веб-дизайнера Рогова',
  verification: { yandex: '55d9c97c614b8557' },
}

async function getSeoSettings() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase.from('settings').select('*').eq('id', 1).single()
    return data ?? null
  } catch {
    return null
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
