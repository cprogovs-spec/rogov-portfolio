import type { Metadata } from "next";
import "./globals.css";
import { createClient } from '@supabase/supabase-js'
import Analytics from '@/components/Analytics'

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

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSeoSettings()

  const title = s?.meta_title || 'Рогов — Дизайнер'
  const description = s?.meta_description || 'Портфолио веб-дизайнера Рогова'
  const ogTitle = s?.og_title || title
  const ogDescription = s?.og_description || description
  const ogImage = s?.og_image || null
  const canonical = s?.canonical_url || null

  return {
    title,
    description,
    robots: s?.robots || 'index, follow',
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
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
