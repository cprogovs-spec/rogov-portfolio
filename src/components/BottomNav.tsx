'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'

const NAV_ITEMS = ['ВЕБ-ДИЗАЙН', 'НЕЙРОСЕТИ', 'МОУШЕН', 'ПОЛЕЗНОЕ', 'КОНТАКТЫ']

type Ripple = { id: number; x: number; y: number }

function NavItem({
  label, index, isLast, active, onClick,
}: {
  label: string; index: number; isLast: boolean; active: boolean; onClick: () => void
}) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 800)
    onClick()
  }, [onClick])

  return (
    <motion.button
      onClick={handleClick}
      className="flex-1 flex items-center justify-between px-4 cursor-pointer"
      style={{
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        letterSpacing: '0.08em',
        color: active ? '#a8d890' : 'var(--foreground)',
        background: active ? 'rgba(107,147,92,0.14)' : 'transparent',
        border: '1px solid var(--border)',
        borderRight: !isLast ? 'none' : '1px solid var(--border)',
        height: 52,
      }}
      whileHover={{
        background: 'rgba(107,147,92,0.18)',
        color: '#a8d890',
        boxShadow: 'inset 0 0 20px rgba(107,147,92,0.15), 0 0 12px rgba(107,147,92,0.2)',
        borderColor: 'rgba(107,147,92,0.5)',
      }}
      transition={{ duration: 0.18 }}
    >
      {/* active indicator */}
      {active && (
        <motion.span
          layoutId="nav-active-bar"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #6B935C, transparent)',
          }}
        />
      )}

      {label}
      <motion.span style={{ opacity: active ? 1 : 0.5 }} whileHover={{ opacity: 1, color: '#8cd66e' }}>↗</motion.span>

      <AnimatePresence>
        {ripples.map(rp => (
          <motion.span
            key={rp.id}
            style={{
              position: 'absolute',
              left: rp.x, top: rp.y,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(140,214,110,0.55) 0%, rgba(107,147,92,0.2) 40%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  )
}

export default function BottomNav({
  activePanel,
  onNavClick,
}: {
  activePanel: number
  onNavClick: (index: number) => void
}) {
  return (
    <motion.nav
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        display: 'flex',
        zIndex: 100,
        background: 'rgba(13,13,13,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.1 }}
    >
      {NAV_ITEMS.map((label, i) => (
        <NavItem
          key={label}
          label={label}
          index={i}
          isLast={i === NAV_ITEMS.length - 1}
          active={activePanel === i + 1}
          onClick={() => onNavClick(i + 1)}
        />
      ))}
    </motion.nav>
  )
}
