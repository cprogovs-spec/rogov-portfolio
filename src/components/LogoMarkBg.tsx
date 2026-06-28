'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export default function LogoMarkBg() {
  const [hovered, setHovered] = useState(false)
  const highlightRef = useRef<HTMLDivElement>(null)

  const springConfig = { stiffness: 55, damping: 18, mass: 1 }
  const tiltX = useSpring(0, springConfig)
  const tiltY = useSpring(0, springConfig)

  // Raw light pos stored as springs but applied via DOM ref (avoids Framer bg animation warning)
  const lightX = useSpring(50, { stiffness: 55, damping: 18 })
  const lightY = useSpring(50, { stiffness: 55, damping: 18 })

  const transform = useTransform(
    [tiltX, tiltY],
    ([rx, ry]) => `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`
  )

  useEffect(() => {
    // Subscribe to spring values and write to DOM directly — no React re-renders, no warnings
    const unsub = lightX.on('change', () => {
      if (!highlightRef.current) return
      const lx = lightX.get()
      const ly = lightY.get()
      highlightRef.current.style.background = `radial-gradient(ellipse at ${lx}% ${ly}%, rgba(140,214,110,0.22) 0%, rgba(107,147,92,0.08) 35%, rgba(0,0,0,0) 65%)`
    })
    const unsub2 = lightY.on('change', () => {
      if (!highlightRef.current) return
      const lx = lightX.get()
      const ly = lightY.get()
      highlightRef.current.style.background = `radial-gradient(ellipse at ${lx}% ${ly}%, rgba(140,214,110,0.22) 0%, rgba(107,147,92,0.08) 35%, rgba(0,0,0,0) 65%)`
    })
    return () => { unsub(); unsub2() }
  }, [lightX, lightY])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      tiltY.set(nx * 22)
      tiltX.set(-ny * 16)
      lightX.set(50 + nx * 40)
      lightY.set(50 + ny * 40)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [tiltX, tiltY, lightX, lightY])

  const onLeave = () => {
    setHovered(false)
    tiltX.set(0); tiltY.set(0)
    lightX.set(50); lightY.set(50)
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
    }}>
      <motion.div
        animate={{ scale: [1, 1.012, 0.997, 1.006, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative', width: '38vw', maxWidth: 480, marginTop: '-8vh', pointerEvents: 'auto' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
      >
        {/* 3D tilt wrapper */}
        <motion.div style={{ transform, transformStyle: 'preserve-3d', willChange: 'transform' }}>

          {/* Dynamic light highlight — updated via DOM ref */}
          <div
            ref={highlightRef}
            style={{
              position: 'absolute', inset: '-20%',
              borderRadius: '50%',
              filter: 'blur(32px)',
              opacity: hovered ? 0.9 : 0.35,
              transition: 'opacity 0.5s ease',
              pointerEvents: 'none',
              background: 'radial-gradient(ellipse at 50% 50%, rgba(140,214,110,0.1) 0%, rgba(0,0,0,0) 65%)',
            }}
          />

          {/* SVG glow filters */}
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <filter id="lm-glow-w" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b2" />
                <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="lm-glow-g" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="11" result="b2" />
                <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
          </svg>

          <svg
            viewBox="0 0 54 82"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
          >
            {/* Rectangle — white */}
            <motion.path
              d="M39.1799 73.2992C40.3822 73.2992 41.2943 72.9882 41.9162 72.3663C42.5796 71.703 42.9113 70.7701 42.9113 69.5678L42.9113 50.9107C42.9113 49.7084 42.5796 48.7962 41.9162 48.1743C41.2943 47.511 40.3822 47.1793 39.1799 47.1793L13.0599 47.1793C11.8576 47.1793 10.9248 47.511 10.2614 48.1743C9.63949 48.7962 9.32854 49.7084 9.32854 50.9107L9.32854 69.5678C9.32854 70.7701 9.63949 71.703 10.2614 72.3663C10.9248 72.9882 11.8576 73.2992 13.0599 73.2992H39.1799ZM0 50.9107C0 42.6187 4.14602 38.4727 12.4381 38.4727L39.8017 38.4727C48.0938 38.4727 52.2398 42.6187 52.2398 50.9107L52.2398 69.5678C52.2398 77.8598 48.0938 82.0058 39.8017 82.0058H12.4381C4.14602 82.0058 0 77.8598 0 69.5678L0 50.9107Z"
              fill="white"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth={0}
              animate={{ opacity: hovered ? [0.22, 0.30, 0.22] : [0.04, 0.09, 0.04] }}
              transition={{ duration: hovered ? 2 : 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              style={{
                strokeWidth: hovered ? 0.5 : 0,
                filter: hovered ? 'url(#lm-glow-w)' : 'none',
                transition: 'filter 0.4s ease, stroke-width 0.3s ease',
              }}
            />

            {/* V-shape — green */}
            <motion.path
              d="M0.174072 0L12.3595 0L27.101 27.9527L41.6894 0L53.5358 0L34.9177 35.706L19.0472 35.706L0.174072 0Z"
              fill="#6B935C"
              stroke="#8cd66e"
              strokeWidth={0}
              animate={{ opacity: hovered ? [0.28, 0.42, 0.28] : [0.07, 0.14, 0.07] }}
              transition={{ duration: hovered ? 2 : 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                strokeWidth: hovered ? 0.7 : 0,
                filter: hovered ? 'url(#lm-glow-g)' : 'none',
                transition: 'filter 0.4s ease, stroke-width 0.3s ease',
              }}
            />
          </svg>

          {/* Rim highlight — fake depth edge */}
          <motion.div
            animate={{ opacity: hovered ? 0.2 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute', inset: 0,
              borderRadius: 4,
              boxShadow: 'inset 0 1px 0 rgba(140,214,110,0.35), inset 0 -1px 0 rgba(0,0,0,0.5)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
