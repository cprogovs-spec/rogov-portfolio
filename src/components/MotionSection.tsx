'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import CoverMedia from './CoverMedia'
import { supabase } from '@/lib/supabase'

const DEFAULT_ACCENT = '#C4873A'

type Work = {
  id: string
  num: string
  title: string
  tags: string[]
  year: string
  desc: string
  fullDesc: string
  role: string
  duration: string
  accent: string
  colors: string[]
  cover: string
  coverType: 'image' | 'video'
  media: { url: string; type: 'image' | 'video' }[]
}

function WorkCard({ w, index, onOpen }: { w: Work; index: number; onOpen: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      layoutId={`motion-card-${w.id}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(w.id)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: '#0f0f0f',
        border: `1px solid ${hovered ? w.accent + '88' : '#1a1a1a'}`,
        borderRadius: 3,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.3s',
      }}
    >
      {/* Cover fills entire card */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <CoverMedia src={w.cover} type={w.coverType} hovered={hovered} bgOpacity={hovered ? 1 : 0.2} />
        <motion.div
          animate={{ opacity: hovered ? 0.45 : 0.82 }}
          transition={{ duration: 0.4 }}
          style={{ position: 'absolute', inset: 0, background: '#0f0f0f', pointerEvents: 'none' }}
        />
      </div>

      {/* Gradient bar bottom on hover */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: w.colors.length > 0 ? `linear-gradient(90deg, ${w.colors.join(', ')})` : DEFAULT_ACCENT,
          transformOrigin: 'left', zIndex: 3,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '1.1rem 1.5rem 1.6rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: 12 }}>{w.num}</div>
        <motion.h3
          animate={{ color: hovered ? '#f5d5a0' : '#2a2a2a' }}
          transition={{ duration: 0.22 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.3rem, 2.2vw, 2rem)',
            lineHeight: 1.0, letterSpacing: '-0.01em',
            whiteSpace: 'pre-line', marginBottom: '0.9rem',
          }}
        >{w.title}</motion.h3>

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: '0.8rem' }}>
          {w.tags.map(t => (
            <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', color: w.accent, border: `1px solid ${w.accent}44`, padding: '2px 7px', borderRadius: 2 }}>{t}</span>
          ))}
        </div>

        <motion.p
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 5 }}
          transition={{ duration: 0.2 }}
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#555', lineHeight: 1.6, marginBottom: '1rem', flex: 1 }}
        >{w.desc}</motion.p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {w.colors.map((c, i) => (
              <motion.div key={i} animate={{ scale: hovered ? 1 : 0.6, opacity: hovered ? 1 : 0.3 }} transition={{ duration: 0.2, delay: i * 0.04 }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <motion.span animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.15 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: w.accent, letterSpacing: '0.1em' }}>СМОТРЕТЬ ↗</motion.span>
        </div>
      </div>
    </motion.div>
  )
}

function WorkExpanded({ w, onClose }: { w: Work; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      />
      <motion.div
        layoutId={`motion-card-${w.id}`}
        style={{
          position: 'fixed', top: '5vh', left: '5vw', right: '5vw', bottom: '10vh',
          background: '#0f0f0f', border: `1px solid ${w.accent}66`, borderRadius: 4,
          zIndex: 201, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      >
        {/* Cover as bg 20% */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <CoverMedia src={w.cover} type={w.coverType} hovered bgOpacity={0.2} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.55)' }} />
        </div>

        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: `radial-gradient(ellipse at 100% 0%, ${w.accent}12 0%, transparent 55%)` }} />

        {/* Gradient line top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: w.colors.length > 0 ? `linear-gradient(90deg, ${w.colors.join(', ')})` : DEFAULT_ACCENT, zIndex: 3 }} />

        <div style={{ position: 'relative', zIndex: 2, flex: 1, overflow: 'auto', padding: 'clamp(2rem, 4vw, 3.5rem)' }}>
          <motion.button onClick={onClose} whileHover={{ color: '#f0f0f0' }}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: '#444', background: 'none', border: '1px solid #2a2a2a', padding: '6px 12px', cursor: 'pointer', borderRadius: 2 }}>ESC ✕</motion.button>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {w.tags.map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', color: w.accent, border: `1px solid ${w.accent}55`, padding: '3px 10px', borderRadius: 2 }}>{t}</span>
            ))}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#444', marginLeft: 'auto' }}>{w.year}</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', color: '#e8e8e8', lineHeight: 0.9, letterSpacing: '-0.02em', whiteSpace: 'pre-line', marginBottom: '2rem' }}>{w.title}</h2>

          <div style={{ display: 'flex', gap: '3rem', marginBottom: '2.5rem' }}>
            {[['Роль', w.role], ['Срок', w.duration]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#444', marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa' }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: `linear-gradient(90deg, ${w.accent}66, transparent)`, marginBottom: '2rem' }} />

          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#777', lineHeight: 1.8, whiteSpace: 'pre-line', maxWidth: 680, marginBottom: '2.5rem' }}>{w.fullDesc}</div>

          {w.media && w.media.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#444', marginBottom: 12 }}>МЕДИА</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {w.media.map((item, i) => (
                  <div key={i} style={{ borderRadius: 3, overflow: 'hidden', border: `1px solid ${w.accent}33`, aspectRatio: '16/9' }}>
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

export default function MotionSection() {
  const [works, setWorks] = useState<Work[]>([])
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('cases')
      .select('*')
      .eq('section', 'motion')
      .eq('published', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) {
          console.error('MotionSection fetch error:', error)
          return
        }
        if (data) {
          setWorks(data.map((row, index) => ({
            id: String(row.id),
            num: String(index + 1).padStart(2, '0'),
            title: row.title ?? '',
            tags: row.tags ?? [],
            year: row.year ?? '',
            desc: row.description ?? '',
            fullDesc: row.full_desc ?? '',
            role: row.role_label ?? '',
            duration: row.duration ?? '',
            accent: row.accent ?? DEFAULT_ACCENT,
            colors: row.colors ?? [],
            cover: row.cover_url ?? '',
            coverType: row.cover_type ?? 'image',
            media: Array.isArray(row.media) ? row.media : [],
          })))
        }
      })
  }, [])

  const openWork = works.find(w => w.id === openId) ?? null

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d', display: 'flex', flexDirection: 'column', padding: '2rem 2rem 0', overflow: 'hidden', position: 'relative' }}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.18em', color: DEFAULT_ACCENT, marginBottom: 8 }}>03 / МОУШЕН</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#f0f0f0', lineHeight: 0.9, letterSpacing: '-0.02em' }}>АНИМАЦИИ</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#444', marginTop: 10, maxWidth: 360 }}>Motion-дизайн для брендов, продуктов и соцсетей — от UI-микроанимаций до видеороликов</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, flex: 1, overflow: 'hidden', paddingBottom: 52 }}>
        {works.map((w, i) => <WorkCard key={w.id} w={w} index={i} onOpen={setOpenId} />)}
      </div>

      <AnimatePresence>
        {openWork && <WorkExpanded key={openWork.id} w={openWork} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
