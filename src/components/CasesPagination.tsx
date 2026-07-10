'use client'

import { motion, AnimatePresence } from 'framer-motion'

function ArrowButton({
  direction, disabled, onClick, accent,
}: { direction: 'prev' | 'next'; disabled: boolean; onClick: () => void; accent: string }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Предыдущая страница' : 'Следующая страница'}
      whileHover={disabled ? {} : { borderColor: accent + 'aa', color: accent }}
      whileTap={disabled ? {} : { scale: 0.92 }}
      style={{
        width: 34, height: 34, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.14)',
        background: 'none', color: disabled ? 'rgba(255,255,255,0.15)' : '#c0c0c0',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: '0.9rem',
        transition: 'border-color 0.2s, color 0.2s',
      }}
    >
      {direction === 'prev' ? '←' : '→'}
    </motion.button>
  )
}

export function PaginationDots({
  page, totalPages, onChange, accent = '#6B935C',
}: { page: number; totalPages: number; onChange: (p: number) => void; accent?: string }) {
  if (totalPages <= 1) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: '1.5rem' }}>
      <ArrowButton direction="prev" disabled={page === 0} onClick={() => onChange(page - 1)} accent={accent} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            aria-label={`Страница ${i + 1}`}
            style={{
              width: i === page ? 22 : 8, height: 8, borderRadius: 4,
              border: 'none', cursor: 'pointer', padding: 0,
              background: i === page ? accent : 'rgba(255,255,255,0.15)',
              transition: 'all 0.25s ease',
            }}
          />
        ))}
      </div>

      <ArrowButton direction="next" disabled={page === totalPages - 1} onClick={() => onChange(page + 1)} accent={accent} />
    </div>
  )
}

export function PageTransition({ pageKey, children }: { pageKey: string | number; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
