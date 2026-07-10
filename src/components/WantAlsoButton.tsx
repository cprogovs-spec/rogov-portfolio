'use client'

import { motion } from 'framer-motion'

export default function WantAlsoButton({ accent, mobile = false }: { accent: string; mobile?: boolean }) {
  return (
    <motion.button
      onClick={() => window.dispatchEvent(new CustomEvent('open-contact-form'))}
      whileHover={mobile ? {} : { background: accent + '22', borderColor: accent + 'aa' }}
      whileTap={{ scale: 0.98 }}
      style={{
        width: '100%',
        marginTop: mobile ? '1.75rem' : '2.5rem',
        height: mobile ? 52 : 56,
        background: accent + '14',
        border: `1px solid ${accent}55`,
        borderRadius: 4,
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: mobile ? '0.8rem' : '0.85rem',
        letterSpacing: '0.12em',
        color: accent,
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      ХОЧУ ТАКЖЕ →
    </motion.button>
  )
}
