'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import WeatherClock from '@/components/WeatherClock'
import ContactBackground from '@/components/ContactBackground'
import RogovTitle from '@/components/RogovTitle'

export default function MobileHero({ onScrollDown }: { onScrollDown: () => void }) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100svh',
      background: '#0d0d0d', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', flexShrink: 0,
    }}>
      <ContactBackground />

      {/* Top bar */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 1.25rem 0',
      }}>
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Image src="/logo.svg" alt="Рогов" width={110} height={34} priority />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ transform: 'scale(0.75)', transformOrigin: 'right center' }}
        >
          <WeatherClock />
        </motion.div>
      </div>

      {/* Title — centered */}
      <div style={{
        position: 'relative', zIndex: 10, flex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 1rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <RogovTitle fontSize="clamp(2.4rem, 13.5vw, 4rem)" />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
            color: '#444', marginTop: '1.25rem',
            letterSpacing: '0.04em', lineHeight: 1.6,
            textAlign: 'center',
          }}
        >
          Веб-дизайнер. UX/UI, нейросети, моушен.
        </motion.p>
      </div>

      {/* CTA + scroll hint */}
      <div style={{
        position: 'relative', zIndex: 10,
        padding: '0 1.25rem 5rem',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <motion.button
          onClick={() => window.dispatchEvent(new CustomEvent('open-contact-form'))}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.6 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 52,
            background: 'rgba(107,147,92,0.12)',
            border: '1px solid rgba(107,147,92,0.35)',
            borderRadius: 3,
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            letterSpacing: '0.14em', color: '#8cd66e', cursor: 'pointer',
            width: '100%',
          }}
        >
          ОФОРМИТЬ ЗАЯВКУ ↵
        </motion.button>

        <motion.button
          onClick={onScrollDown}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
            letterSpacing: '0.14em', color: '#333',
          }}
        >
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >↓</motion.span>
          КЕЙСЫ
        </motion.button>
      </div>
    </div>
  )
}
