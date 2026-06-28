'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { RichContent } from '@/lib/renderContent'

const ACCENT = '#9E8A6E'

type Article = {
  id: string
  title: string
  date: string
  tags: string[]
  preview: string
  body: string
}

function MobileArticleCard({ a, index, onOpen }: { a: Article; index: number; onOpen: (id: string) => void }) {
  return (
    <motion.div
      onClick={() => onOpen(a.id)}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.985 }}
      style={{
        background: '#111', border: '1px solid #1e1e1e', borderRadius: 3,
        padding: '1.25rem', cursor: 'pointer', position: 'relative', overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent', display: 'flex', flexDirection: 'column', gap: '0.75rem',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, transparent, ${ACCENT}, transparent)` }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {a.tags.map(t => (
            <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: ACCENT, border: `1px solid ${ACCENT}44`, padding: '2px 7px', borderRadius: 2 }}>{t}</span>
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#c0c0c0', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {new Date(a.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 5.5vw, 1.5rem)', color: '#ccc', lineHeight: 1.05, letterSpacing: '-0.01em' }}>{a.title}</h3>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa', lineHeight: 1.6 }}>{a.preview}</p>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', letterSpacing: '0.1em', color: ACCENT }}>ЧИТАТЬ ↗</span>
      </div>
    </motion.div>
  )
}

function MobileArticleExpanded({ a, onClose }: { a: Article; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        style={{
          position: 'fixed', top: '3vh', left: '3vw', right: '3vw',
          bottom: 'calc(64px + env(safe-area-inset-bottom) + 2vh)',
          background: '#0e0e0e', border: `1px solid ${ACCENT}55`, borderRadius: 6,
          zIndex: 301, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 80% 10%, ${ACCENT}10 0%, transparent 55%)` }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'flex-end', padding: '1rem 1rem 0' }}>
          <motion.button onClick={onClose} whileTap={{ scale: 0.9 }}
            style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a', borderRadius: '50%', cursor: 'pointer', color: '#c0c0c0', WebkitTapHighlightColor: 'transparent' }}
          ><X size={16} strokeWidth={1.5} /></motion.button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '0.75rem 1.25rem 1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
            {a.tags.map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.12em', color: ACCENT, border: `1px solid ${ACCENT}55`, padding: '3px 10px', borderRadius: 2 }}>{t}</span>
            ))}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#aaa', marginLeft: 'auto' }}>
              {new Date(a.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 8vw, 3rem)', color: '#e8e8e8', lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>{a.title}</h1>
          <div style={{ height: 1, background: `linear-gradient(90deg, ${ACCENT}66, transparent)`, marginBottom: '1.25rem' }} />
          <RichContent html={a.body} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#c0c0c0', lineHeight: 1.85 }} />
        </div>
      </motion.div>
    </>
  )
}

export default function MobileUsefulSection({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('articles').select('*').eq('published', true).order('sort_order')
      .then(({ data }) => {
        if (data) setArticles(data.map(row => ({
          id: String(row.id), title: row.title ?? '', date: row.date ?? '',
          tags: row.tags ?? [], preview: row.preview ?? '', body: row.body ?? '',
        })))
      })
  }, [])

  const openArticle = articles.find(a => a.id === openId) ?? null

  return (
    <div ref={sectionRef} id="useful" style={{ width: '100%', minHeight: '100svh', background: '#0d0d0d', padding: '2rem 1.25rem calc(80px + env(safe-area-inset-bottom))', flexShrink: 0 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 12vw, 4rem)', color: '#f0f0f0', lineHeight: 0.9, letterSpacing: '-0.02em' }}>СТАТЬИ</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa', marginTop: 10, lineHeight: 1.55 }}>Материалы о дизайне, инструментах и процессах</p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {articles.map((a, i) => <MobileArticleCard key={a.id} a={a} index={i} onOpen={setOpenId} />)}
      </div>

      <AnimatePresence>
        {openArticle && <MobileArticleExpanded key={openArticle.id} a={openArticle} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
