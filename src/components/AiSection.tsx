'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import CoverMedia from './CoverMedia'
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

function ProjectCard({ p, index, onOpen }: { p: Project; index: number; onOpen: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      layoutId={`ai-card-${p.id}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(p.id)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: '#0f0f0f',
        border: `1px solid ${hovered ? p.accent + '88' : '#1a1a1a'}`,
        borderRadius: 3,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Cover fills entire card */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <CoverMedia src={p.cover} type={p.coverType} hovered={hovered} bgOpacity={hovered ? 1 : 0.2} />
        <motion.div
          animate={{ opacity: hovered ? 0.45 : 0.82 }}
          transition={{ duration: 0.4 }}
          style={{ position: 'absolute', inset: 0, background: '#0f0f0f', pointerEvents: 'none' }}
        />
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at top right, ${p.accent}22, transparent 70%)`, pointerEvents: 'none' }}
        />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '1.1rem 1.5rem 1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: 12 }}>{p.num}</div>
        <motion.h3
          animate={{ color: hovered ? '#d0ccff' : '#2a2a2a' }}
          transition={{ duration: 0.22 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.3rem, 2.2vw, 2rem)',
            lineHeight: 1.0, letterSpacing: '-0.01em',
            whiteSpace: 'pre-line', marginBottom: '0.9rem',
          }}
        >{p.title}</motion.h3>

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: '0.8rem' }}>
          {p.tags.map(t => (
            <span key={t} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
              color: p.accent, border: `1px solid ${p.accent}44`, padding: '2px 7px', borderRadius: 2,
            }}>{t}</span>
          ))}
        </div>

        <motion.p
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 5 }}
          transition={{ duration: 0.2 }}
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa', lineHeight: 1.6, marginBottom: '1rem', flex: 1 }}
        >{p.desc}</motion.p>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: p.accent, lineHeight: 1 }}>{p.stat.value}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#c0c0c0', letterSpacing: '0.1em', marginTop: 2 }}>{p.stat.label}</div>
          </div>
          <motion.span
            animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.15 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: p.accent, letterSpacing: '0.1em' }}
          >ПОДРОБНЕЕ ↗</motion.span>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectExpanded({ p, onClose }: { p: Project; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      />
      <motion.div
        layoutId={`ai-card-${p.id}`}
        style={{
          position: 'fixed', top: '5vh', left: '5vw', right: '5vw', bottom: '10vh',
          background: '#0f0f0f', border: `1px solid ${p.accent}66`, borderRadius: 4,
          zIndex: 201, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      >
        {/* Cover background 20% */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <CoverMedia src={p.cover} type={p.coverType} hovered bgOpacity={0.2} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,15,0.55)' }} />
        </div>

        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: `radial-gradient(ellipse at 80% 10%, ${p.accent}14 0%, transparent 55%)` }} />

        <div style={{ position: 'relative', zIndex: 2, flex: 1, overflow: 'auto', padding: 'clamp(2rem, 4vw, 3.5rem)' }}>
          <motion.button
            onClick={onClose}
            whileHover={{ color: '#f0f0f0' }}
            style={{
              position: 'absolute', top: '1.5rem', right: '1.5rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
              color: '#aaa', background: 'none', border: '1px solid #2a2a2a',
              padding: '6px 12px', cursor: 'pointer', borderRadius: 2,
            }}
          >ESC ✕</motion.button>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {p.tags.map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', letterSpacing: '0.12em', color: p.accent, border: `1px solid ${p.accent}55`, padding: '3px 10px', borderRadius: 2 }}>{t}</span>
            ))}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: '#aaa', marginLeft: 'auto' }}>{p.year}</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', color: '#e8e8e8', lineHeight: 0.9, letterSpacing: '-0.02em', whiteSpace: 'pre-line', marginBottom: '2rem' }}>{p.title}</h2>

          <div style={{ display: 'flex', gap: '3rem', marginBottom: '2.5rem', alignItems: 'flex-end' }}>
            {[['Роль', p.role], ['Срок', p.duration]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', color: '#aaa', marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa' }}>{val}</div>
              </div>
            ))}
            <div style={{ marginLeft: 'auto' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: p.accent, lineHeight: 1 }}>{p.stat.value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#aaa', letterSpacing: '0.1em', marginTop: 2 }}>{p.stat.label}</div>
            </div>
          </div>

          <div style={{ height: 1, background: `linear-gradient(90deg, ${p.accent}66, transparent)`, marginBottom: '2rem' }} />

          <RichContent html={p.fullDesc} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#c0c0c0', lineHeight: 1.8, maxWidth: 680, marginBottom: '2.5rem' }} />

          {p.media && p.media.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', color: '#aaa', marginBottom: 12 }}>МЕДИА</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
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

export default function AiSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('cases')
      .select('*')
      .eq('section', 'ai')
      .eq('published', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) {
          console.error('AiSection fetch error:', error)
          return
        }
        if (data) {
          setProjects(data.map((row, index) => ({
            id: String(row.id),
            num: String(index + 1).padStart(2, '0'),
            title: row.title ?? '',
            tags: row.tags ?? [],
            year: row.year ?? '',
            desc: row.description ?? '',
            fullDesc: row.full_desc ?? '',
            role: row.role_label ?? '',
            duration: row.duration ?? '',
            stat: { value: row.stat_value ?? '', label: row.stat_label ?? '' },
            accent: row.accent ?? DEFAULT_ACCENT,
            cover: row.cover_url ?? '',
            coverType: row.cover_type ?? 'image',
            media: Array.isArray(row.media) ? row.media : [],
          })))
        }
      })
  }, [])

  const openProject = projects.find(p => p.id === openId) ?? null

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d', display: 'flex', flexDirection: 'column', padding: '2rem 2rem 0', overflow: 'hidden', position: 'relative' }}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#f0f0f0', lineHeight: 0.9, letterSpacing: '-0.02em' }}>AI-ПРОЕКТЫ</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: '#aaa', marginTop: 10, maxWidth: 360 }}>Применение генеративных нейросетей и языковых моделей в дизайн-процессе</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, flex: 1, overflow: 'hidden', paddingBottom: 52 }}>
        {projects.map((p, i) => <ProjectCard key={p.id} p={p} index={i} onOpen={setOpenId} />)}
      </div>

      <AnimatePresence>
        {openProject && <ProjectExpanded key={openProject.id} p={openProject} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
