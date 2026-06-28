'use client'

import { useMemo } from 'react'

type Streak = {
  id: number
  left: string
  delay: string
  duration: string
  height: string
  opacity: string
  top: string
}

export default function GridBackground() {
  const streaks = useMemo<Streak[]>(() => {
    const items: Streak[] = []
    for (let i = 0; i < 60; i++) {
      // deterministic-ish via index to avoid hydration mismatch
      const seed = (i * 137.508 + 43.7) % 100
      const seed2 = (i * 97.3 + 11.2) % 100
      const seed3 = (i * 61.8 + 29.5) % 100
      const seed4 = (i * 41.1 + 73.3) % 100
      const seed5 = (i * 23.6 + 55.1) % 100

      items.push({
        id: i,
        left: `${seed.toFixed(2)}%`,
        delay: `${((seed2 / 100) * 8).toFixed(2)}s`,
        duration: `${(4 + (seed3 / 100) * 6).toFixed(2)}s`,
        height: `${(6 + (seed4 / 100) * 20).toFixed(0)}px`,
        opacity: `${(0.2 + (seed5 / 100) * 0.5).toFixed(2)}`,
        top: `${(seed2).toFixed(0)}%`,
      })
    }
    return items
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <style>{`
        @keyframes fall-up {
          0%   { transform: translateY(0);   opacity: 0; }
          5%   { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>

      {streaks.map((s) => (
        <span
          key={s.id}
          style={{
            position: 'absolute',
            left: s.left,
            bottom: `-${s.height}`,
            width: '1px',
            height: s.height,
            background: `linear-gradient(to top, transparent, rgba(107,147,92,${s.opacity}), rgba(180,220,160,${parseFloat(s.opacity) * 0.4}))`,
            animation: `fall-up ${s.duration} ${s.delay} linear infinite`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
