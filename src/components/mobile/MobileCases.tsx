'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import CoverMedia from '@/components/CoverMedia'
import WantAlsoButton from '@/components/WantAlsoButton'
import { supabase } from '@/lib/supabase'
import { RichContent } from '@/lib/renderContent'

type Case = {
  id: string
  num: string
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

function MobileCaseCard({ c, index, onOpen }: { c: Case; index: number; onOpen: (id: string) => void }) {
  return (
    <motion.div
      layoutId={`mobile-card-${c.id}`}
      onClick={() => onOpen(c.id)}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.985 }}
      style={{
        border: `1px solid ${c.accent}33`,
        borderRadius: 6,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent',
        height: 180,
        background: '#0d0d0d',
      }}
    >
      {/* Cover — full bleed, no dark overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <CoverMedia src={c.cover} type={c.coverType} hovered={true} />
      </div>

      {/* Bottom gradient for text legibility */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1,
        background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
        padding: '2rem 1rem 0.85rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 5 }}>
              {c.tags.slice(0, 2).map(t => (
                <span key={t} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em',
                  color: c.accent, border: `1px solid ${c.accent}55`,
                  padding: '1px 6px', borderRadius: 2,
                }}>{t}</span>
              ))}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.95rem, 4.5vw, 1.2rem)',
              color: '#f0f0f0', lineHeight: 1.1, letterSpacing: '-0.01em',
              margin: 0,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{c.title}</h3>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{c.year}</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em', color: c.accent }}>↗</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function MobileCaseExpanded({ c, onClose }: { c: Case; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      />
      <motion.div
        layoutId={`mobile-card-${c.id}`}
        style={{
          position: 'fixed',
          top: '3vh', left: '3vw', right: '3vw',
          bottom: 'calc(64px + env(safe-area-inset-bottom) + 2vh)',
          background: '#0f0f0f',
          border: `1px solid ${c.accent}55`,
          borderRadius: 6,
          zIndex: 301,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      >
        {c.cover && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <CoverMedia src={c.cover} type={c.coverType} hovered bgOpacity={0.2} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.6)' }} />
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 0%, ${c.accent}14 0%, transparent 60%)` }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'flex-end', padding: '1rem 1rem 0' }}>
          <motion.button
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a', borderRadius: '50%',
              cursor: 'pointer', color: '#c0c0c0', WebkitTapHighlightColor: 'transparent',
            }}
          ><X size={16} strokeWidth={1.5} /></motion.button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '0.75rem 1.25rem 1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
            {c.tags.map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.1em', color: c.accent, border: `1px solid ${c.accent}44`, padding: '3px 9px', borderRadius: 2 }}>{t}</span>
            ))}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 7vw, 2.5rem)',
            color: '#e8e8e8', lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: '1rem',
            wordBreak: 'break-word', overflowWrap: 'break-word',
          }}>{c.title}</h2>

          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.25rem' }}>
            {[['Роль', c.role], ['Срок', c.duration]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#aaa', marginBottom: 3 }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#c0c0c0' }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: `linear-gradient(90deg, ${c.accent}55, transparent)`, marginBottom: '1.25rem' }} />

          <RichContent html={c.fullDesc} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#c0c0c0', lineHeight: 1.75, marginBottom: '1.5rem' }} />

          {c.media && c.media.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#c0c0c0', marginBottom: 10 }}>МЕДИА</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {c.media.map((item, i) => (
                  <div key={i} style={{ borderRadius: 3, overflow: 'hidden', border: `1px solid ${c.accent}33`, aspectRatio: '16/9' }}>
                    <CoverMedia src={item.url} type={item.type} hovered />
                  </div>
                ))}
              </div>
            </div>
          )}

          <WantAlsoButton accent={c.accent} mobile />
        </div>
      </motion.div>
    </>
  )
}

export default function MobileCases({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  const [cases, setCases] = useState<Case[]>([])
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('cases')
      .select('*')
      .eq('section', 'webdesign')
      .eq('published', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data) {
          setCases(data.map((row, index) => ({
            id: String(row.id),
            num: String(index + 1).padStart(2, '0'),
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
    <div
      ref={sectionRef}
      id="web"
      style={{
        width: '100%', minHeight: '100svh', boxSizing: 'border-box', background: '#0d0d0d',
        padding: '2rem 1.25rem calc(80px + env(safe-area-inset-bottom))',
        flexShrink: 0,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        style={{ marginBottom: '1.75rem' }}
      >
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 12vw, 4rem)', color: '#f0f0f0', lineHeight: 0.9, letterSpacing: '-0.02em' }}>КЕЙСЫ</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa', marginTop: 10, lineHeight: 1.55 }}>
          Проекты в сфере веб-дизайна — от b2b-платформ до продуктовых интерфейсов
        </p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {cases.map((c, i) => (
          <MobileCaseCard key={c.id} c={c} index={i} onOpen={setOpenId} />
        ))}
      </div>

      <AnimatePresence>
        {openCase && <MobileCaseExpanded key={openCase.id} c={openCase} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
