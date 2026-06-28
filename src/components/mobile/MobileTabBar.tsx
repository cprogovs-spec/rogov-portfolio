'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import { Layers, Brain, Play, Mail, House, BookOpen } from 'lucide-react'

const TABS = [
  { id: 'home',    label: 'ГЛАВНАЯ', Icon: House },
  { id: 'web',     label: 'ВЕБ',     Icon: Layers },
  { id: 'ai',      label: 'НЕЙРО',   Icon: Brain },
  { id: 'motion',  label: 'МОУШЕН',  Icon: Play },
  { id: 'useful',  label: 'СТАТЬИ',  Icon: BookOpen },
  { id: 'contact', label: 'КОНТАКТ', Icon: Mail },
]

type Ripple = { id: number; x: number; y: number }

export default function MobileTabBar({
  active,
  onChange,
}: {
  active: string
  onChange: (id: string) => void
}) {
  const [ripples, setRipples] = useState<Record<string, Ripple[]>>({})

  const handleTap = useCallback((e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const rp: Ripple = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top }
    setRipples(r => ({ ...r, [id]: [...(r[id] ?? []), rp] }))
    setTimeout(() => setRipples(r => ({ ...r, [id]: (r[id] ?? []).filter(x => x.id !== rp.id) })), 600)
    onChange(id)
  }, [onChange])

  return (
    <nav
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        display: 'flex', height: 64,
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid #1e1e1e',
        zIndex: 200, paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={(e) => handleTap(e, id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 3,
              position: 'relative', overflow: 'hidden',
              background: 'none', border: 'none', cursor: 'pointer',
              minHeight: 44, WebkitTapHighlightColor: 'transparent',
            }}
          >
            <AnimatePresence>
              {isActive && (
                <motion.span
                  layoutId="mobile-tab-bar"
                  style={{
                    position: 'absolute', top: 0, left: 6, right: 6, height: 2,
                    background: 'linear-gradient(90deg, transparent, #6B935C, transparent)',
                    borderRadius: 1,
                  }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                />
              )}
            </AnimatePresence>

            <motion.div
              animate={{ color: isActive ? '#8cd66e' : '#383838', scale: isActive ? 1.1 : 1 }}
              transition={{ duration: 0.18 }}
            >
              <Icon size={18} strokeWidth={1.5} />
            </motion.div>

            <motion.span
              animate={{ color: isActive ? '#8cd66e' : '#383838' }}
              transition={{ duration: 0.18 }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.42rem', letterSpacing: '0.08em' }}
            >
              {label}
            </motion.span>

            <AnimatePresence>
              {(ripples[id] ?? []).map(rp => (
                <motion.span
                  key={rp.id}
                  style={{
                    position: 'absolute', left: rp.x, top: rp.y,
                    borderRadius: '50%', pointerEvents: 'none',
                    background: 'rgba(107,147,92,0.3)',
                    transform: 'translate(-50%,-50%)',
                  }}
                  initial={{ width: 0, height: 0, opacity: 1 }}
                  animate={{ width: 80, height: 80, opacity: 0 }}
                  exit={{}}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              ))}
            </AnimatePresence>
          </button>
        )
      })}
    </nav>
  )
}
