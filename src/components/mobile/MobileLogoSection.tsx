'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const DEFAULT_ACCENT = '#6B935C'

type Logo = {
  id: string
  image: string
  name: string
  year: string
  comment: string
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
        background: `${logo.accent}14`,
        border: `1px solid ${logo.accent}33`,
        borderRadius: 8,
        aspectRatio: isWide ? '2.2/1' : '1/1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <img src={logo.image} alt={logo.name} style={{ maxWidth: '70%', maxHeight: '60%', objectFit: 'contain' }} />
    </motion.div>
  )
}

function MobileLogoLightbox({ logo, onClose }: { logo: Logo; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 400,
            background: `${logo.accent}14`, border: `1px solid ${logo.accent}55`, borderRadius: 10,
            padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem',
            position: 'relative',
          }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a', borderRadius: '50%', color: '#c0c0c0', WebkitTapHighlightColor: 'transparent' }}>
            <X size={14} strokeWidth={1.5} />
          </button>
          <img src={logo.image} alt={logo.name} style={{ maxWidth: '60%', maxHeight: 140, objectFit: 'contain' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#e8e8e8' }}>{logo.name}</span>
              {logo.year && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: logo.accent }}>{logo.year}</span>}
            </div>
            {logo.comment && (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#aaa', lineHeight: 1.6 }}>{logo.comment}</p>
            )}
          </div>
        </motion.div>
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
          size: row.size === 'wide' ? 'wide' : 'normal',
          accent: row.accent ?? DEFAULT_ACCENT,
        })))
      })
  }, [])

  const openLogo = logos.find(l => l.id === openId) ?? null

  return (
    <div ref={sectionRef} id="logos" style={{ width: '100%', minHeight: '100svh', boxSizing: 'border-box', background: '#0d0d0d', padding: '2rem 1.25rem calc(80px + env(safe-area-inset-bottom))', flexShrink: 0 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 8.5vw, 3rem)', color: '#f0f0f0', lineHeight: 0.9, letterSpacing: '-0.02em' }}>ЛОГОТИПЫ</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#aaa', marginTop: 10, lineHeight: 1.55 }}>Айдентика и знаки для брендов</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {logos.map((logo, i) => <MobileLogoTile key={logo.id} logo={logo} index={i} onOpen={setOpenId} />)}
      </div>

      <AnimatePresence>
        {openLogo && <MobileLogoLightbox key={openLogo.id} logo={openLogo} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
