'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useEscapeClose } from '@/hooks/useEscapeClose'
import { usePagination, usePaginationWheel } from '@/hooks/usePagination'
import { PaginationDots, PageTransition } from './CasesPagination'
import GridBackground from './GridBackground'
import { supabase } from '@/lib/supabase'

const DEFAULT_ACCENT = '#6B935C'
const ITEMS_PER_PAGE = 10

type Logo = {
  id: string
  image: string
  name: string
  year: string
  comment: string
  size: 'normal' | 'wide'
  accent: string
}

function LogoTile({ logo, index, onOpen }: { logo: Logo; index: number; onOpen: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)
  const isWide = logo.size === 'wide'

  return (
    <motion.div
      layoutId={`logo-tile-${logo.id}`}
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

function LogoLightbox({ logo, onClose }: { logo: Logo; onClose: () => void }) {
  useEscapeClose(onClose)
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <motion.div
          layoutId={`logo-tile-${logo.id}`}
          onClick={e => e.stopPropagation()}
          style={{
            width: 'min(480px, 88vw)',
            background: `${logo.accent}14`,
            border: `1px solid ${logo.accent}55`,
            borderRadius: 10,
            padding: '3rem 2rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
            boxShadow: `0 30px 80px -20px ${logo.accent}44`,
          }}
        >
          <img src={logo.image} alt={logo.name} style={{ maxWidth: '60%', maxHeight: 160, objectFit: 'contain' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#e8e8e8' }}>{logo.name}</span>
              {logo.year && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: logo.accent }}>{logo.year}</span>}
            </div>
            {logo.comment && (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa', lineHeight: 1.6, maxWidth: 360 }}>{logo.comment}</p>
            )}
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ color: '#f0f0f0' }}
            style={{
              position: 'absolute', top: '1rem', right: '1rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
              color: '#aaa', background: 'none', border: '1px solid #2a2a2a',
              padding: '5px 10px', cursor: 'pointer', borderRadius: 3,
            }}
          >ESC ✕</motion.button>
        </motion.div>
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
        {openLogo && <LogoLightbox key={openLogo.id} logo={openLogo} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
