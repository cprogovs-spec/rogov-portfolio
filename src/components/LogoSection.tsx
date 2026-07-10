'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import CoverMedia from './CoverMedia'
import { useEscapeClose } from '@/hooks/useEscapeClose'
import { usePagination, usePaginationWheel } from '@/hooks/usePagination'
import { PaginationDots, PageTransition } from './CasesPagination'
import GridBackground from './GridBackground'
import WantAlsoButton from './WantAlsoButton'
import { supabase } from '@/lib/supabase'
import { RichContent } from '@/lib/renderContent'

const DEFAULT_ACCENT = '#6B935C'
const ITEMS_PER_PAGE = 10

type Logo = {
  id: string
  image: string
  name: string
  year: string
  comment: string
  fullDesc: string
  media: { url: string; type: 'image' | 'video'; caption?: string }[]
  size: 'normal' | 'wide'
  accent: string
}

function LogoTile({ logo, index, onOpen }: { logo: Logo; index: number; onOpen: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)
  const isWide = logo.size === 'wide'

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(logo.id)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: hovered ? -4 : 0 }}
      transition={{ opacity: { duration: 0.4, delay: 0.05 + index * 0.04 }, y: { duration: 0.25, ease: 'easeOut' } }}
      style={{
        gridColumn: isWide ? 'span 2' : 'span 1',
        aspectRatio: isWide ? '2.15/1' : '1/1',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem',
      }}
    >
      <img
        src={logo.image}
        alt={logo.name}
        style={{
          width: '100%', height: '100%', objectFit: 'contain',
          filter: hovered ? 'grayscale(0)' : 'grayscale(1)',
          opacity: hovered ? 1 : 0.75,
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'filter 0.3s ease, opacity 0.3s ease, transform 0.3s ease',
        }}
      />

      <motion.div
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          padding: '0.4rem 0.2rem 0',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em', color: '#e8e8e8' }}>{logo.name}</span>
        {logo.year && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: logo.accent }}>{logo.year}</span>}
      </motion.div>
    </motion.div>
  )
}

function LogoExpanded({ logo, onClose }: { logo: Logo; onClose: () => void }) {
  useEscapeClose(onClose)
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        style={{
          position: 'fixed', top: '5vh', left: '5vw', right: '5vw', bottom: '10vh',
          background: '#0e0e0e', border: `1px solid ${logo.accent}66`, borderRadius: 4,
          zIndex: 201, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: `radial-gradient(ellipse at 20% 20%, ${logo.accent}18 0%, transparent 60%)` }} />

        <div style={{ position: 'relative', zIndex: 2, flex: 1, overflow: 'hidden', display: 'flex' }}>
          {/* LEFT — logo + text */}
          <div style={{ flex: '0 0 42%', overflow: 'auto', padding: 'clamp(2rem, 3vw, 3rem)', borderRight: `1px solid ${logo.accent}22` }}>
            <motion.button
              onClick={onClose}
              whileHover={{ color: '#f0f0f0', scale: 1.1 }}
              style={{
                position: 'absolute', top: '1.5rem', right: 'calc(58% + 1rem)',
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
                color: '#aaa', background: 'none', border: '1px solid #2a2a2a',
                padding: '6px 12px', cursor: 'pointer', borderRadius: 2,
              }}
            >ESC ✕</motion.button>

            <div style={{
              width: 140, height: 140, borderRadius: 8,
              background: `${logo.accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1.25rem', marginBottom: '1.75rem',
            }}>
              <img src={logo.image} alt={logo.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: '1.75rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#e8e8e8', lineHeight: 0.95, letterSpacing: '-0.02em' }}>{logo.name}</h2>
              {logo.year && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: logo.accent }}>{logo.year}</span>}
            </div>

            {logo.comment && (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#c0c0c0', lineHeight: 1.7, marginBottom: '1.5rem' }}>{logo.comment}</p>
            )}

            <div style={{ height: 1, background: `linear-gradient(90deg, ${logo.accent}66, transparent)`, marginBottom: '1.75rem' }} />

            {logo.fullDesc ? (
              <RichContent html={logo.fullDesc} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: '#c0c0c0', lineHeight: 1.8 }} />
            ) : (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#555', letterSpacing: '0.05em' }}>История создания скоро появится</p>
            )}

            <WantAlsoButton accent={logo.accent} />
          </div>

          {/* RIGHT — process media */}
          <div style={{ flex: 1, overflow: 'auto', padding: 'clamp(1.5rem, 2.5vw, 2.5rem)', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {logo.media && logo.media.length > 0 ? (
              <>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', color: '#555' }}>ПРОЦЕСС — {logo.media.length}</div>
                {logo.media.map((item, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ borderRadius: 4, overflow: 'hidden', border: `1px solid ${logo.accent}33`, aspectRatio: '16/9', background: '#0a0a0a' }}>
                      <CoverMedia src={item.url} type={item.type} hovered />
                    </div>
                    {item.caption && (
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: logo.accent, marginTop: 2, flexShrink: 0 }}>↳</span>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#888', lineHeight: 1.6, margin: 0 }}>{item.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#555' }}>НЕТ ФОТО ПРОЦЕССА</div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default function LogoSection() {
  const [logos, setLogos] = useState<Logo[]>([])
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('logos')
      .select('*')
      .eq('published', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) {
          console.error('LogoSection fetch error:', error)
          return
        }
        if (data) {
          setLogos(data.map(row => ({
            id: String(row.id),
            image: row.image_url ?? '',
            name: row.name ?? '',
            year: row.year ?? '',
            comment: row.comment ?? '',
            fullDesc: row.full_desc ?? '',
            media: Array.isArray(row.media) ? row.media : [],
            size: row.size === 'wide' ? 'wide' : 'normal',
            accent: row.accent ?? DEFAULT_ACCENT,
          })))
        }
      })
  }, [])

  const openLogo = logos.find(l => l.id === openId) ?? null
  const { page, setPage, pageItems, totalPages } = usePagination(logos, ITEMS_PER_PAGE)
  const onWheel = usePaginationWheel(page, totalPages, setPage)

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d', display: 'flex', flexDirection: 'column', padding: '2rem 2rem 0', overflow: 'hidden', position: 'relative' }}>
      <GridBackground />
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#f0f0f0', lineHeight: 0.9, letterSpacing: '-0.02em' }}>ЛОГОТИПЫ</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: '#aaa', marginTop: 10, maxWidth: 360 }}>Айдентика и знаки для брендов — от стартапов до устоявшихся компаний</p>
      </motion.div>

      <div onWheel={onWheel} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 16, position: 'relative', zIndex: 1 }}>
        <PageTransition pageKey={page}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridAutoRows: 'min-content', gridAutoFlow: 'dense', gap: 12, alignContent: 'center', maxHeight: 'calc(100vh - 320px)' }}>
            {pageItems.map((logo, i) => <LogoTile key={logo.id} logo={logo} index={i} onOpen={setOpenId} />)}
          </div>
        </PageTransition>
        <PaginationDots page={page} totalPages={totalPages} onChange={setPage} accent={DEFAULT_ACCENT} />
      </div>

      <AnimatePresence>
        {openLogo && <LogoExpanded key={openLogo.id} logo={openLogo} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
