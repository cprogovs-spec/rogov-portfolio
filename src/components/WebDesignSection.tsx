'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import CoverMedia from './CoverMedia'
import { supabase } from '@/lib/supabase'

type Case = {
  id: string
  title: string
  year: string
  tags: string[]
  desc: string
  fullDesc: string
  accent: string
  size: 'small' | 'large'
  role: string
  duration: string
  cover: string
  coverType: 'image' | 'video'
  media: { url: string; type: 'image' | 'video' }[]
}

function CaseCard({ c, index, onOpen }: { c: Case; index: number; onOpen: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)
  const isLarge = c.size === 'large'

  return (
    <motion.div
      layoutId={`card-${c.id}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(c.id)}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      style={{
        gridColumn: isLarge ? 'span 2' : 'span 1',
        background: '#111',
        border: `1px solid ${hovered ? c.accent : '#1e1e1e'}`,
        borderRadius: 3,
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'border-color 0.3s',
      }}
    >
      {/* Cover fills entire card */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <CoverMedia src={c.cover} type={c.coverType} hovered={hovered} bgOpacity={hovered ? 1 : 0.2} />
        {/* Dark overlay — fades on hover */}
        <motion.div
          animate={{ opacity: hovered ? 0.45 : 0.82 }}
          transition={{ duration: 0.4 }}
          style={{ position: 'absolute', inset: 0, background: '#111', pointerEvents: 'none' }}
        />
        {/* Accent glow on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at 30% 60%, ${c.accent}2a 0%, transparent 65%)`,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Content on top */}
      <div style={{ position: 'relative', zIndex: 1, padding: '1.25rem 1.75rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {c.tags.map(t => (
              <span key={t} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em',
                color: c.accent, border: `1px solid ${c.accent}44`, padding: '2px 7px', borderRadius: 2,
              }}>{t}</span>
            ))}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#383838' }}>{c.year}</span>
        </div>

        <div>
          <motion.h3
            animate={{ color: hovered ? '#e8e8e8' : '#303030' }}
            transition={{ duration: 0.22 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: isLarge ? 'clamp(1.5rem, 2.8vw, 2.4rem)' : 'clamp(1.1rem, 1.8vw, 1.7rem)',
              lineHeight: 0.95, margin: '1rem 0 0.6rem', letterSpacing: '-0.01em',
            }}
          >{c.title}</motion.h3>

          <motion.p
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ duration: 0.25 }}
            style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#666', lineHeight: 1.6, maxWidth: 420 }}
          >{c.desc}</motion.p>
        </div>

        <motion.div
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.2 }}
          transition={{ duration: 0.18 }}
          style={{
            alignSelf: 'flex-end', fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: c.accent, letterSpacing: '0.1em', marginTop: '1rem',
          }}
        >СМОТРЕТЬ КЕЙС ↗</motion.div>
      </div>
    </motion.div>
  )
}

function CaseExpanded({ c, onClose }: { c: Case; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      />

      <motion.div
        layoutId={`card-${c.id}`}
        style={{
          position: 'fixed',
          top: '5vh', left: '5vw', right: '5vw', bottom: '10vh',
          background: '#0e0e0e',
          border: `1px solid ${c.accent}66`,
          borderRadius: 4,
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      >
        {/* Cover as semi-transparent background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <CoverMedia src={c.cover} type={c.coverType} hovered bgOpacity={0.2} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.55)' }} />
        </div>

        {/* Accent glow */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 20% 20%, ${c.accent}18 0%, transparent 60%)`,
        }} />

        {/* Scrollable content */}
        <div style={{ position: 'relative', zIndex: 2, flex: 1, overflow: 'auto', padding: 'clamp(2rem, 4vw, 3.5rem)' }}>
          {/* Close */}
          <motion.button
            onClick={onClose}
            whileHover={{ color: '#f0f0f0', scale: 1.1 }}
            style={{
              position: 'absolute', top: '1.5rem', right: '1.5rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
              color: '#444', background: 'none', border: '1px solid #2a2a2a',
              padding: '6px 12px', cursor: 'pointer', borderRadius: 2,
            }}
          >ESC ✕</motion.button>

          {/* Tags + year */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {c.tags.map(t => (
              <span key={t} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em',
                color: c.accent, border: `1px solid ${c.accent}55`, padding: '3px 10px', borderRadius: 2,
              }}>{t}</span>
            ))}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#444', marginLeft: 'auto' }}>{c.year}</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 7rem)',
            color: '#e8e8e8', lineHeight: 0.9, letterSpacing: '-0.02em', marginBottom: '2rem',
          }}>{c.title}</h2>

          <div style={{ display: 'flex', gap: '3rem', marginBottom: '2.5rem' }}>
            {[['Роль', c.role], ['Срок', c.duration]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#444', marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa' }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: `linear-gradient(90deg, ${c.accent}66, transparent)`, marginBottom: '2rem' }} />

          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#777', lineHeight: 1.8, whiteSpace: 'pre-line', maxWidth: 680, marginBottom: '2.5rem' }}>
            {c.fullDesc}
          </div>

          {/* Media gallery */}
          {c.media && c.media.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#444', marginBottom: 8 }}>МЕДИА</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {c.media.map((item, i) => (
                  <div key={i} style={{ borderRadius: 3, overflow: 'hidden', border: `1px solid ${c.accent}33`, aspectRatio: '16/9' }}>
                    <CoverMedia src={item.url} type={item.type} hovered />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}

export default function WebDesignSection() {
  const [cases, setCases] = useState<Case[]>([])
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('cases')
      .select('*')
      .eq('section', 'webdesign')
      .eq('published', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) {
          console.error('WebDesignSection fetch error:', error)
          return
        }
        if (data) {
          setCases(data.map(row => ({
            id: String(row.id),
            title: row.title ?? '',
            year: row.year ?? '',
            tags: row.tags ?? [],
            desc: row.description ?? '',
            fullDesc: row.full_desc ?? '',
            accent: row.accent ?? '#6B935C',
            size: row.size ?? 'small',
            role: row.role_label ?? '',
            duration: row.duration ?? '',
            cover: row.cover_url ?? '',
            coverType: row.cover_type ?? 'image',
            media: Array.isArray(row.media) ? row.media : [],
          })))
        }
      })
  }, [])

  const openCase = cases.find(c => c.id === openId) ?? null

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
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.18em', color: '#6B935C', marginBottom: 8 }}>
          01 / ВЕБ-ДИЗАЙН
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#f0f0f0', lineHeight: 0.9, letterSpacing: '-0.02em' }}>КЕЙСЫ</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#444', marginTop: 10, maxWidth: 360 }}>
          Проекты в сфере веб-дизайна — от b2b-платформ до продуктовых интерфейсов
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, flex: 1, overflow: 'hidden', paddingBottom: 52 }}>
        {cases.map((c, i) => (
          <CaseCard key={c.id} c={c} index={i} onOpen={setOpenId} />
        ))}
      </div>

      <AnimatePresence>
        {openCase && <CaseExpanded key={openCase.id} c={openCase} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
