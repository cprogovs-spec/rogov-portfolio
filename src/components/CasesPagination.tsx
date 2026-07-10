'use client'

import { motion, AnimatePresence } from 'framer-motion'

export function PaginationDots({
  page, totalPages, onChange, accent = '#6B935C',
}: { page: number; totalPages: number; onChange: (p: number) => void; accent?: string }) {
  if (totalPages <= 1) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: '1.5rem' }}>
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
