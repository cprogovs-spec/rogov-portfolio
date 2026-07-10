'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import CoverMedia from '@/components/CoverMedia'
import WantAlsoButton from '@/components/WantAlsoButton'
import { supabase } from '@/lib/supabase'
import { RichContent } from '@/lib/renderContent'

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

function MobileMotionCard({ w, index, onOpen }: { w: Work; index: number; onOpen: (id: string) => void }) {
  return (
    <motion.div
      layoutId={`mobile-motion-card-${w.id}`}
      onClick={() => onOpen(w.id)}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.985 }}
      style={{
        border: `1px solid ${w.accent}33`, borderRadius: 6,
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent', height: 180, background: '#0d0d0d',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <CoverMedia src={w.cover} type={w.coverType} hovered={true} />
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1,
        background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
        padding: '2rem 1rem 0.85rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 5 }}>
              {w.tags.slice(0, 2).map(t => (
                <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', color: w.accent, border: `1px solid ${w.accent}55`, padding: '1px 6px', borderRadius: 2 }}>{t}</span>
              ))}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.95rem, 4.5vw, 1.2rem)', color: '#f0f0f0', lineHeight: 1.1, letterSpacing: '-0.01em', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{w.title}</h3>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{w.year}</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: w.accent }}>↗</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function MobileMotionExpanded({ w, onClose }: { w: Work; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      />
      <motion.div
        layoutId={`mobile-motion-card-${w.id}`}
        style={{
          position: 'fixed', top: '3vh', left: '3vw', right: '3vw',
          bottom: 'calc(64px + env(safe-area-inset-bottom) + 2vh)',
          background: '#0f0f0f', border: `1px solid ${w.accent}55`, borderRadius: 6,
          zIndex: 301, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      >
        {w.cover && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <CoverMedia src={w.cover} type={w.coverType} hovered bgOpacity={0.2} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.6)' }} />
          </div>
        )}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 3, background: w.colors.length > 0 ? `linear-gradient(90deg, ${w.colors.join(', ')})` : w.accent }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'flex-end', padding: '1rem 1rem 0' }}>
          <motion.button onClick={onClose} whileTap={{ scale: 0.9 }}
            style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a', borderRadius: '50%', cursor: 'pointer', color: '#c0c0c0', WebkitTapHighlightColor: 'transparent' }}
          ><X size={16} strokeWidth={1.5} /></motion.button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '0.75rem 1.25rem 1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
            {w.tags.map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.1em', color: w.accent, border: `1px solid ${w.accent}44`, padding: '3px 9px', borderRadius: 2 }}>{t}</span>
            ))}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 7vw, 2.5rem)', color: '#e8e8e8', lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: '1rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{w.title}</h2>

          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.25rem' }}>
            {[['Роль', w.role], ['Срок', w.duration]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#aaa', marginBottom: 3 }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#c0c0c0' }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: `linear-gradient(90deg, ${w.accent}55, transparent)`, marginBottom: '1.25rem' }} />
          <RichContent html={w.fullDesc} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#c0c0c0', lineHeight: 1.75, marginBottom: '1.5rem' }} />

          {w.media && w.media.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#c0c0c0', marginBottom: 10 }}>МЕДИА</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {w.media.map((item, i) => (
                  <div key={i} style={{ borderRadius: 3, overflow: 'hidden', border: `1px solid ${w.accent}33`, aspectRatio: '16/9' }}>
                    <CoverMedia src={item.url} type={item.type} hovered />
                  </div>
                ))}
              </div>
            </div>
          )}

          <WantAlsoButton accent={w.accent} mobile />
        </div>
      </motion.div>
    </>
  )
}

export default function MobileMotionSection({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  const [works, setWorks] = useState<Work[]>([])
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('cases').select('*').eq('section', 'motion').eq('published', true).order('sort_order')
      .then(({ data }) => {
        if (data) setWorks(data.map((row, index) => ({
          id: String(row.id), num: String(index + 1).padStart(2, '0'),
          title: row.title ?? '', tags: row.tags ?? [], year: row.year ?? '',
          desc: row.description ?? '', fullDesc: row.full_desc ?? '',
          role: row.role_label ?? '', duration: row.duration ?? '',
          accent: row.accent ?? DEFAULT_ACCENT, colors: row.colors ?? [],
          cover: row.cover_url ?? '', coverType: row.cover_type ?? 'image',
          media: Array.isArray(row.media) ? row.media : [],
        })))
      })
  }, [])

  const openWork = works.find(w => w.id === openId) ?? null

  return (
    <div ref={sectionRef} id="motion" style={{ width: '100%', minHeight: '100svh', boxSizing: 'border-box', background: '#0d0d0d', padding: '2rem 1.25rem calc(80px + env(safe-area-inset-bottom))', flexShrink: 0 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 8.5vw, 3rem)', color: '#f0f0f0', lineHeight: 0.9, letterSpacing: '-0.02em' }}>АНИМАЦИИ</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa', marginTop: 10, lineHeight: 1.55 }}>Motion-дизайн для брендов, продуктов и соцсетей</p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {works.map((w, i) => <MobileMotionCard key={w.id} w={w} index={i} onOpen={setOpenId} />)}
      </div>

      <AnimatePresence>
        {openWork && <MobileMotionExpanded key={openWork.id} w={openWork} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
