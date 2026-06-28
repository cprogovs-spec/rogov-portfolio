'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import WeatherClock from './WeatherClock'
import ContactBackground from './ContactBackground'
import LogoMarkBg from './LogoMarkBg'
import RogovTitle from './RogovTitle'

export default function Header() {
  return (
    <header className="relative w-full overflow-hidden flex flex-col" style={{ height: '100vh', background: 'var(--background)' }}>

      <ContactBackground />
      <LogoMarkBg />

      {/* top bar */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-6">
        {/* logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Image src="/logo.svg" alt="Рогов" width={160} height={50} priority />
        </motion.div>

        {/* cta */}
        <motion.button
          onClick={() => window.dispatchEvent(new CustomEvent('open-contact-form'))}
          className="flex items-center gap-2 cursor-pointer"
          style={{
            background: 'none', border: 'none', padding: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            color: 'var(--foreground)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ color: 'var(--accent)' }}
        >
          ОФОРМИТЬ ЗАЯВКУ
          <span style={{ fontSize: '1rem' }}>↵</span>
        </motion.button>

        {/* clock */}
        <WeatherClock />
      </div>

      {/* hero name — centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <RogovTitle baseColor="#e8e8e8" />
      </div>

      {/* scroll hint above nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.8 }}
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          paddingRight: '1.5rem', paddingBottom: '0.5rem',
          gap: '0.4rem',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.45)',
          userSelect: 'none',
        }}>
          листай вправо
        </span>
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', lineHeight: 1 }}
        >
          →
        </motion.span>
      </motion.div>

      {/* bottom padding for fixed nav */}
      <div style={{ height: 52 }} />
    </header>
  )
}
