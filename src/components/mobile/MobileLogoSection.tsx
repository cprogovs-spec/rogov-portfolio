'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import CoverMedia from '@/components/CoverMedia'
import GridBackground from '@/components/GridBackground'
import { supabase } from '@/lib/supabase'
import { RichContent } from '@/lib/renderContent'

const DEFAULT_ACCENT = '#6B935C'

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

function MobileLogoTile({ logo, index, onOpen }: { logo: Logo; index: number; onOpen: (id: string) => void }) {
  const isWide = logo.size === 'wide'
  return (
    <motion.div
      onClick={() => onOpen(logo.id)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileTap={{ scale: 0.97 }}
      style={{
        gridColumn: isWide ? 'span 2' : 'span 1',
        aspectRatio: isWide ? '2.2/1' : '1/1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0.75rem',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <img src={logo.image} alt={logo.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'grayscale(1)', opacity: 0.75 }} />
    </motion.div>
  )
}

function MobileLogoExpanded({ logo, onClose }: { logo: Logo; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        style={{
          position: 'fixed',
          top: '3vh', left: '3vw', right: '3vw',
          bottom: 'calc(64px + env(safe-area-inset-bottom) + 2vh)',
          background: '#0f0f0f',
          border: `1px solid ${logo.accent}55`,
          borderRadius: 6,
          zIndex: 301,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 0%, ${logo.accent}14 0%, transparent 60%)` }} />

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

        <div style={{ flex: 1, overflow: 'auto', padding: '0.5rem 1.25rem 1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 96, height: 96, borderRadius: 8,
            background: `${logo.accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', marginBottom: '1.25rem',
          }}>
            <img src={logo.image} alt={logo.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: '1rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 7vw, 2.5rem)',
              color: '#e8e8e8', lineHeight: 1.0, letterSpacing: '-0.02em',
              wordBreak: 'break-word', overflowWrap: 'break-word',
            }}>{logo.name}</h2>
            {logo.year && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: logo.accent }}>{logo.year}</span>}
          </div>

          {logo.comment && (
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#c0c0c0', lineHeight: 1.7, marginBottom: '1.25rem' }}>{logo.comment}</p>
          )}

          <div style={{ height: 1, background: `linear-gradient(90deg, ${logo.accent}55, transparent)`, marginBottom: '1.25rem' }} />

          {logo.fullDesc && (
            <RichContent html={logo.fullDesc} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#c0c0c0', lineHeight: 1.75, marginBottom: '1.5rem' }} />
          )}

          {logo.media && logo.media.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#c0c0c0', marginBottom: 10 }}>ПРОЦЕСС</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {logo.media.map((item, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ borderRadius: 3, overflow: 'hidden', border: `1px solid ${logo.accent}33`, aspectRatio: '16/9' }}>
                      <CoverMedia src={item.url} type={item.type} hovered />
                    </div>
                    {item.caption && (
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#888', lineHeight: 1.5, margin: 0 }}>{item.caption}</p>
                    )}
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

export default function MobileLogoSection({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  const [logos, setLogos] = useState<Logo[]>([])
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('logos').select('*').eq('published', true).order('sort_order')
      .then(({ data }) => {
        if (data) setLogos(data.map(row => ({
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
      })
  }, [])

  const openLogo = logos.find(l => l.id === openId) ?? null

  return (
    <div ref={sectionRef} id="logos" style={{ width: '100%', minHeight: '100svh', boxSizing: 'border-box', background: '#0d0d0d', position: 'relative', overflow: 'hidden', padding: '2rem 1.25rem calc(80px + env(safe-area-inset-bottom))', flexShrink: 0 }}>
      <GridBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '1.75rem', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 8.5vw, 3rem)', color: '#f0f0f0', lineHeight: 0.9, letterSpacing: '-0.02em' }}>ЛОГОТИПЫ</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa', marginTop: 10, lineHeight: 1.55 }}>Айдентика и знаки для брендов</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, position: 'relative', zIndex: 1 }}>
        {logos.map((logo, i) => <MobileLogoTile key={logo.id} logo={logo} index={i} onOpen={setOpenId} />)}
      </div>

      <AnimatePresence>
        {openLogo && <MobileLogoExpanded key={openLogo.id} logo={openLogo} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
