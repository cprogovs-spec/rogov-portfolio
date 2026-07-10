'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import CoverMedia from './CoverMedia'
import { useEscapeClose } from '@/hooks/useEscapeClose'
import { usePagination } from '@/hooks/usePagination'
import { PaginationDots, PageTransition } from './CasesPagination'
import { supabase } from '@/lib/supabase'
import { RichContent } from '@/lib/renderContent'

const DEFAULT_ACCENT = '#C4873A'
const ITEMS_PER_PAGE = 6

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
  format: 'horizontal' | 'vertical'
  media: { url: string; type: 'image' | 'video'; caption?: string }[]
}

function WorkCard({ w, index, onOpen }: { w: Work; index: number; onOpen: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)
  const isWide = w.format === 'horizontal'

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
        gridColumn: isWide ? 'span 2' : 'span 1',
        gridRow: isWide ? 'span 1' : 'span 2',
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
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: 12 }}>{w.num}</div>
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
            <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: w.accent, border: `1px solid ${w.accent}44`, padding: '2px 7px', borderRadius: 2 }}>{t}</span>
          ))}
        </div>

        <motion.p
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 5 }}
          transition={{ duration: 0.2 }}
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa', lineHeight: 1.6, marginBottom: '1rem', flex: 1 }}
        >{w.desc}</motion.p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {w.colors.map((c, i) => (
              <motion.div key={i} animate={{ scale: hovered ? 1 : 0.6, opacity: hovered ? 1 : 0.3 }} transition={{ duration: 0.2, delay: i * 0.04 }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <motion.span animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.15 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: w.accent, letterSpacing: '0.1em' }}>СМОТРЕТЬ ↗</motion.span>
        </div>
      </div>
    </motion.div>
  )
}

function WorkExpanded({ w, onClose }: { w: Work; onClose: () => void }) {
  useEscapeClose(onClose)
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

        <div style={{ position: 'relative', zIndex: 2, flex: 1, overflow: 'hidden', display: 'flex' }}>
          {/* LEFT */}
          <div style={{ flex: '0 0 42%', overflow: 'auto', padding: 'clamp(2rem, 3vw, 3rem)', borderRight: `1px solid ${w.accent}22` }}>
            <motion.button onClick={onClose} whileHover={{ color: '#f0f0f0' }}
              style={{ position: 'absolute', top: '1.5rem', right: 'calc(58% + 1rem)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: '#aaa', background: 'none', border: '1px solid #2a2a2a', padding: '6px 12px', cursor: 'pointer', borderRadius: 2 }}>ESC ✕</motion.button>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              {w.tags.map(t => (
                <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.12em', color: w.accent, border: `1px solid ${w.accent}55`, padding: '3px 10px', borderRadius: 2 }}>{t}</span>
              ))}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#aaa', marginLeft: 'auto' }}>{w.year}</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', color: '#e8e8e8', lineHeight: 0.9, letterSpacing: '-0.02em', marginBottom: '1.75rem' }}>{w.title}</h2>

            <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '2rem' }}>
              {[['Роль', w.role], ['Срок', w.duration]].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#777', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#c0c0c0' }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: `linear-gradient(90deg, ${w.accent}66, transparent)`, marginBottom: '1.75rem' }} />
            <RichContent html={w.fullDesc} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: '#c0c0c0', lineHeight: 1.8 }} />
          </div>

          {/* RIGHT — media */}
          <div style={{ flex: 1, overflow: 'auto', padding: 'clamp(1.5rem, 2.5vw, 2.5rem)', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {w.media && w.media.length > 0 ? (
              <>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', color: '#555' }}>МЕДИА — {w.media.length}</div>
                {w.media.map((item, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ borderRadius: 4, overflow: 'hidden', border: `1px solid ${w.accent}33`, aspectRatio: '16/9', background: '#0a0a0a' }}>
                      <CoverMedia src={item.url} type={item.type} hovered />
                    </div>
                    {item.caption && (
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: w.accent, marginTop: 2, flexShrink: 0 }}>↳</span>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#888', lineHeight: 1.6, margin: 0 }}>{item.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#555' }}>НЕТ МЕДИАФАЙЛОВ</div>
              </div>
            )}
          </div>
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
            format: row.format === 'vertical' ? 'vertical' : 'horizontal',
            media: Array.isArray(row.media) ? row.media : [],
          })))
        }
      })
  }, [])

  const openWork = works.find(w => w.id === openId) ?? null
  const { page, setPage, pageItems, totalPages } = usePagination(works, ITEMS_PER_PAGE)

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d', display: 'flex', flexDirection: 'column', padding: '2rem 2rem 0', overflow: 'hidden', position: 'relative' }}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#f0f0f0', lineHeight: 0.9, letterSpacing: '-0.02em' }}>АНИМАЦИЯ</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: '#aaa', marginTop: 10, maxWidth: 360 }}>Motion-дизайн для брендов, продуктов и соцсетей — от UI-микроанимаций до видеороликов</p>
      </motion.div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', paddingBottom: 16 }}>
        <PageTransition pageKey={page}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '1fr', gridAutoFlow: 'dense', gap: 10, height: 'calc(100vh - 300px)' }}>
            {pageItems.map((w, i) => <WorkCard key={w.id} w={w} index={i} onOpen={setOpenId} />)}
          </div>
        </PageTransition>
        <PaginationDots page={page} totalPages={totalPages} onChange={setPage} accent={DEFAULT_ACCENT} />
      </div>

      <AnimatePresence>
        {openWork && <WorkExpanded key={openWork.id} w={openWork} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
