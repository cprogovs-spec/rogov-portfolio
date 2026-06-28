'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'

const SUBTITLE = 'дизайн-ниндзя и визуализатор @pacgroup73'
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'

const WORD = 'РОГОВ'
const LETTERS_RU = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
const SCRAMBLE_DURATION = 800
const SCRAMBLE_STEPS = 12
const NEON_START_DELAY = 2500
const NEON_REPEAT_INTERVAL = 6000

const BASE_COLOR = '#3a3a3a'
const NEON_COLOR = '#8cd66e'
const NEON_SHADOW = '0 0 4px rgba(140,214,110,1), 0 0 12px rgba(107,147,92,0.9), 0 0 28px rgba(107,147,92,0.6), 0 0 50px rgba(107,147,92,0.3)'

export default function RogovTitle({ fontSize }: { fontSize?: string } = {}) {
  const randomLetter = () => LETTERS_RU[Math.floor(Math.random() * LETTERS_RU.length)]

  const [display, setDisplay] = useState(WORD.split('').map(() => randomLetter()))
  const [visible, setVisible] = useState(false)

  const c0 = useAnimation()
  const c1 = useAnimation()
  const c2 = useAnimation()
  const c3 = useAnimation()
  const c4 = useAnimation()
  const ctrls = [c0, c1, c2, c3, c4]

  const mounted = useRef(false)

  const runNeon = async () => {
    const perLetter = 130
    const holdMs = 200
    const fadeS = 0.4
    for (let i = 0; i < ctrls.length; i++) {
      if (!mounted.current) return
      ctrls[i].start({ color: NEON_COLOR, textShadow: NEON_SHADOW, transition: { duration: 0.07 } })
      setTimeout(() => {
        if (!mounted.current) return
        ctrls[i].start({ color: BASE_COLOR, textShadow: '0 0 0px transparent', transition: { duration: fadeS, ease: 'easeOut' } })
      }, holdMs)
      await new Promise(r => setTimeout(r, perLetter))
    }
  }

  useEffect(() => {
    mounted.current = true
    setVisible(true)

    const letters = WORD.split('')
    const resolved = letters.map(() => false)

    // Continuously scramble unresolved letters
    const scrambleId = setInterval(() => {
      if (!mounted.current) return
      setDisplay(letters.map((ch, i) => (resolved[i] ? ch : randomLetter())))
    }, 55)

    // For each letter: flash neon as it enters, resolve when fully visible
    letters.forEach((ch, i) => {
      const enterAt = (0.5 + i * 0.07) * 1000
      const resolveAt = (0.5 + i * 0.07 + 0.7) * 1000 + 80

      // Go neon as letter starts sliding up
      setTimeout(() => {
        if (!mounted.current) return
        ctrls[i].start({ color: NEON_COLOR, textShadow: NEON_SHADOW, transition: { duration: 0.08 } })
      }, enterAt)

      // Resolve to real letter and fade to base color
      setTimeout(() => {
        if (!mounted.current) return
        resolved[i] = true
        setDisplay(prev => prev.map((c, j) => (j === i ? ch : c)))
        ctrls[i].start({ color: BASE_COLOR, textShadow: '0 0 0px transparent', transition: { duration: 0.5, ease: 'easeOut' } })
      }, resolveAt)
    })

    // Stop scramble after last letter resolves
    const lastResolve = (0.5 + (letters.length - 1) * 0.07 + 0.7) * 1000 + 200
    const stopScramble = setTimeout(() => clearInterval(scrambleId), lastResolve)

    // Periodic neon pulse
    let repeatId: ReturnType<typeof setInterval>
    const neonT = setTimeout(() => {
      runNeon()
      repeatId = setInterval(runNeon, NEON_REPEAT_INTERVAL)
    }, NEON_START_DELAY)

    return () => {
      mounted.current = false
      clearInterval(scrambleId)
      clearTimeout(stopScramble)
      clearTimeout(neonT)
      clearInterval(repeatId)
    }
  }, [])

  // Matrix subtitle state
  const [subtitle, setSubtitle] = useState<string[]>([])
  const [subtitleDone, setSubtitleDone] = useState(false)

  useEffect(() => {
    // Start matrix reveal after РОГОВ finishes appearing (~1.4s)
    const delay = 1500
    const t = setTimeout(() => {
      const chars = SUBTITLE.split('')
      const revealed = chars.map(() => false)
      let step = 0
      const totalSteps = chars.length * 3
      const id = setInterval(() => {
        const resolvedCount = Math.floor(step / 3)
        setSubtitle(chars.map((ch, i) => {
          if (i < resolvedCount) return ch
          if (ch === ' ') return ' '
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }))
        step++
        if (step >= totalSteps) {
          clearInterval(id)
          setSubtitle(chars)
          setSubtitleDone(true)
          void revealed
        }
      }, 35)
      return () => clearInterval(id)
    }, delay)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div aria-label={WORD} style={{ display: 'flex', lineHeight: 1 }}>
        {WORD.split('').map((letter, i) => (
          <div key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
            <motion.span
              animate={ctrls[i]}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: fontSize ?? 'clamp(5rem, 17vw, 17rem)',
                color: BASE_COLOR,
                display: 'inline-block',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              <motion.span
                style={{ display: 'inherit' }}
                initial={{ y: '110%' }}
                animate={visible ? { y: '0%' } : { y: '110%' }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                {display[i] || letter}
              </motion.span>
            </motion.span>
          </div>
        ))}
      </div>

      {/* Matrix subtitle */}
      <div
        aria-label={SUBTITLE}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(0.65rem, 1.1vw, 0.9rem)',
          letterSpacing: '0.08em',
          color: subtitleDone ? 'rgba(140,214,110,0.7)' : 'rgba(140,214,110,0.55)',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          minHeight: '1.4em',
          transition: 'color 0.5s ease',
          textShadow: subtitleDone ? '0 0 8px rgba(140,214,110,0.3)' : 'none',
        }}
      >
        {subtitleDone ? (
          <>
            {'дизайн-ниндзя и визуализатор '}
            <a
              href="https://t.me/pacgroup73"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'inherit',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(140,214,110,0.4)',
                paddingBottom: 1,
                transition: 'border-color 0.2s, text-shadow 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(140,214,110,0.9)'
                el.style.textShadow = '0 0 12px rgba(140,214,110,0.6)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(140,214,110,0.4)'
                el.style.textShadow = 'none'
              }}
            >
              @pacgroup73
            </a>
          </>
        ) : (
          subtitle.join('')
        )}
      </div>
    </div>
  )
}
