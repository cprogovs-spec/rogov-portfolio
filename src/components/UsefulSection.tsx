'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ACCENT = '#9E8A6E'

type Article = {
  id: string
  title: string
  date: string
  tags: string[]
  preview: string
  body: string
}

function ArticleCard({ a, index, onOpen }: { a: Article; index: number; onOpen: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(a.id)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: '#0f0f0f',
        border: `1px solid ${hovered ? ACCENT + '88' : '#1e1e1e'}`,
        borderRadius: 3,
        padding: '1.5rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        transition: 'border-color 0.3s',
      }}
    >
      {/* Subtle glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 20% 80%, ${ACCENT}18 0%, transparent 65%)`,
        }}
      />

      {/* Tags + date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {a.tags.map(t => (
            <span key={t} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em',
              color: ACCENT, border: `1px solid ${ACCENT}44`, padding: '2px 7px', borderRadius: 2,
            }}>{t}</span>
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#333', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {new Date(a.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* Title */}
      <motion.h3
        animate={{ color: hovered ? '#e8e8e8' : '#2e2e2e' }}
        transition={{ duration: 0.22 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1rem, 1.6vw, 1.4rem)',
          lineHeight: 1.1, letterSpacing: '-0.01em',
        }}
      >{a.title}</motion.h3>

      {/* Preview */}
      <p style={{
        fontFamily: 'var(--font-sans)', fontSize: '0.73rem',
        color: '#4a4a4a', lineHeight: 1.65, flex: 1,
      }}>{a.preview}</p>

      {/* Read more */}
      <motion.div
        animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.2 }}
        transition={{ duration: 0.18 }}
        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: ACCENT, letterSpacing: '0.1em', alignSelf: 'flex-end' }}
      >ЧИТАТЬ ↗</motion.div>
    </motion.div>
  )
}

function ArticleExpanded({ a, onClose }: { a: Article; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        style={{
          position: 'fixed', top: '5vh', left: '10vw', right: '10vw', bottom: '10vh',
          background: '#0e0e0e', border: `1px solid ${ACCENT}55`, borderRadius: 4,
          zIndex: 201, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 80% 10%, ${ACCENT}10 0%, transparent 55%)` }} />

        <div style={{ position: 'relative', zIndex: 1, flex: 1, overflow: 'auto', padding: 'clamp(2rem, 5vw, 4rem)' }}>
          <motion.button
            onClick={onClose}
            whileHover={{ color: '#f0f0f0' }}
            style={{
              position: 'absolute', top: '1.5rem', right: '1.5rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
              color: '#444', background: 'none', border: '1px solid #2a2a2a',
              padding: '6px 12px', cursor: 'pointer', borderRadius: 2,
            }}
          >ESC ✕</motion.button>

          {/* Tags + date */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.8rem' }}>
            {a.tags.map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em', color: ACCENT, border: `1px solid ${ACCENT}55`, padding: '3px 10px', borderRadius: 2 }}>{t}</span>
            ))}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#444', marginLeft: 'auto' }}>
              {new Date(a.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)',
            color: '#e8e8e8', lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: '2.5rem',
          }}>{a.title}</h1>

          <div style={{ height: 1, background: `linear-gradient(90deg, ${ACCENT}66, transparent)`, marginBottom: '2rem' }} />

          {/* Body */}
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.92rem',
            color: '#888', lineHeight: 1.85, whiteSpace: 'pre-line',
            maxWidth: 680,
          }}>{a.body}</div>
        </div>
      </motion.div>
    </>
  )
}

export default function UsefulSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) {
          console.error('UsefulSection fetch error:', error)
          return
        }
        if (data) {
          setArticles(data.map(row => ({
            id: String(row.id),
            title: row.title ?? '',
            date: row.date ?? '',
            tags: row.tags ?? [],
            preview: row.preview ?? '',
            body: row.body ?? '',
          })))
        }
      })
  }, [])

  const openArticle = articles.find(a => a.id === openId) ?? null

  return (
    <div style={{
      width: '100%', height: '100%', background: '#0d0d0d',
      display: 'flex', flexDirection: 'column',
      padding: '2rem 2rem 0', overflow: 'hidden', position: 'relative',
    }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.18em', color: ACCENT, marginBottom: 8 }}>
          05 / ПОЛЕЗНОЕ
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#f0f0f0', lineHeight: 0.9, letterSpacing: '-0.02em' }}>СТАТЬИ</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#444', marginTop: 10, maxWidth: 420 }}>
          Материалы о дизайне, инструментах и процессах — для клиентов, коллег и поисковиков
        </p>
      </motion.div>

      {/* Articles grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: 'max-content',
        gap: 10,
        flex: 1,
        overflowY: 'auto',
        paddingBottom: 64,
        scrollbarWidth: 'none',
      }}>
        {articles.map((a, i) => (
          <ArticleCard key={a.id} a={a} index={i} onOpen={setOpenId} />
        ))}
      </div>

      <AnimatePresence>
        {openArticle && <ArticleExpanded key={openArticle.id} a={openArticle} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
