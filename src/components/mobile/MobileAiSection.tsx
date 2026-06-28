'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import CoverMedia from '@/components/CoverMedia'
import { supabase } from '@/lib/supabase'
import { RichContent } from '@/lib/renderContent'

const DEFAULT_ACCENT = '#7B6FE8'

type Project = {
  id: string
  num: string
  title: string
  tags: string[]
  year: string
  desc: string
  fullDesc: string
  role: string
  duration: string
  stat: { label: string; value: string }
  cover: string
  coverType: 'image' | 'video'
  accent: string
  media: { url: string; type: 'image' | 'video' }[]
}

function MobileAiCard({ p, index, onOpen }: { p: Project; index: number; onOpen: (id: string) => void }) {
  return (
    <motion.div
      layoutId={`mobile-ai-card-${p.id}`}
      onClick={() => onOpen(p.id)}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.985 }}
      style={{
        background: '#111', border: '1px solid #1e1e1e', borderRadius: 3,
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent', minHeight: 150,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {p.cover && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <CoverMedia src={p.cover} type={p.coverType} hovered={true} bgOpacity={0.2} />
          <div style={{ position: 'absolute', inset: 0, background: '#111', opacity: 0.82 }} />
        </div>
      )}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, zIndex: 1, background: `linear-gradient(to bottom, transparent, ${p.accent}, transparent)` }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {p.tags.map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: p.accent, border: `1px solid ${p.accent}44`, padding: '2px 7px', borderRadius: 2 }}>{t}</span>
            ))}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#c0c0c0' }}>{p.year}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#2a2a2a' }}>{p.num}</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 7vw, 2rem)', color: '#ccc', lineHeight: 0.95, letterSpacing: '-0.01em' }}>{p.title}</h3>
        </div>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa', lineHeight: 1.55, marginBottom: 14, flex: 1 }}>{p.desc}</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          {p.stat.value ? (
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: p.accent, lineHeight: 1 }}>{p.stat.value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', color: '#c0c0c0', letterSpacing: '0.1em', marginTop: 2 }}>{p.stat.label}</div>
            </div>
          ) : <div />}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', letterSpacing: '0.1em', color: p.accent }}>ПОДРОБНЕЕ ↗</span>
        </div>
      </div>
    </motion.div>
  )
}

function MobileAiExpanded({ p, onClose }: { p: Project; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      />
      <motion.div
        layoutId={`mobile-ai-card-${p.id}`}
        style={{
          position: 'fixed', top: '3vh', left: '3vw', right: '3vw',
          bottom: 'calc(64px + env(safe-area-inset-bottom) + 2vh)',
          background: '#0f0f0f', border: `1px solid ${p.accent}55`, borderRadius: 6,
          zIndex: 301, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      >
        {p.cover && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <CoverMedia src={p.cover} type={p.coverType} hovered bgOpacity={0.2} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.6)' }} />
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 0%, ${p.accent}14 0%, transparent 60%)` }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'flex-end', padding: '1rem 1rem 0' }}>
          <motion.button onClick={onClose} whileTap={{ scale: 0.9 }}
            style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a', borderRadius: '50%', cursor: 'pointer', color: '#c0c0c0', WebkitTapHighlightColor: 'transparent' }}
          ><X size={16} strokeWidth={1.5} /></motion.button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '0.75rem 1.25rem 1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
            {p.tags.map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.1em', color: p.accent, border: `1px solid ${p.accent}44`, padding: '3px 9px', borderRadius: 2 }}>{t}</span>
            ))}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 7vw, 2.5rem)', color: '#e8e8e8', lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: '1rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{p.title}</h2>

          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.25rem', alignItems: 'flex-end' }}>
            {[['Роль', p.role], ['Срок', p.duration]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#aaa', marginBottom: 3 }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#c0c0c0' }}>{val}</div>
              </div>
            ))}
            {p.stat.value && (
              <div style={{ marginLeft: 'auto' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: p.accent, lineHeight: 1 }}>{p.stat.value}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', color: '#aaa', letterSpacing: '0.1em', marginTop: 2 }}>{p.stat.label}</div>
              </div>
            )}
          </div>

          <div style={{ height: 1, background: `linear-gradient(90deg, ${p.accent}55, transparent)`, marginBottom: '1.25rem' }} />
          <RichContent html={p.fullDesc} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#c0c0c0', lineHeight: 1.75, marginBottom: '1.5rem' }} />

          {p.media && p.media.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#c0c0c0', marginBottom: 10 }}>МЕДИА</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.media.map((item, i) => (
                  <div key={i} style={{ borderRadius: 3, overflow: 'hidden', border: `1px solid ${p.accent}33`, aspectRatio: '16/9' }}>
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

export default function MobileAiSection({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('cases').select('*').eq('section', 'ai').eq('published', true).order('sort_order')
      .then(({ data }) => {
        if (data) setProjects(data.map((row, index) => ({
          id: String(row.id), num: String(index + 1).padStart(2, '0'),
          title: row.title ?? '', tags: row.tags ?? [], year: row.year ?? '',
          desc: row.description ?? '', fullDesc: row.full_desc ?? '',
          role: row.role_label ?? '', duration: row.duration ?? '',
          stat: { value: row.stat_value ?? '', label: row.stat_label ?? '' },
          accent: row.accent ?? DEFAULT_ACCENT,
          cover: row.cover_url ?? '', coverType: row.cover_type ?? 'image',
          media: Array.isArray(row.media) ? row.media : [],
        })))
      })
  }, [])

  const openProject = projects.find(p => p.id === openId) ?? null

  return (
    <div ref={sectionRef} id="ai" style={{ width: '100%', minHeight: '100svh', boxSizing: 'border-box', background: '#0d0d0d', padding: '2rem 1.25rem calc(80px + env(safe-area-inset-bottom))', flexShrink: 0 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 12vw, 4rem)', color: '#f0f0f0', lineHeight: 0.9, letterSpacing: '-0.02em' }}>AI-ПРОЕКТЫ</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa', marginTop: 10, lineHeight: 1.55 }}>Применение генеративных нейросетей в дизайн-процессе</p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {projects.map((p, i) => <MobileAiCard key={p.id} p={p} index={i} onOpen={setOpenId} />)}
      </div>

      <AnimatePresence>
        {openProject && <MobileAiExpanded key={openProject.id} p={openProject} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
