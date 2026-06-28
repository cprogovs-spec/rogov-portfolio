'use client'

import { useRef } from 'react'
import { useState } from 'react'
import MobileHero from './MobileHero'
import MobileCases from './MobileCases'
import MobileTabBar from './MobileTabBar'

const PLACEHOLDER_SECTIONS: Record<string, string> = {
  ai: 'НЕЙРОСЕТИ',
  motion: 'МОУШЕН',
  contact: 'КОНТАКТЫ',
}

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState('home')
  const casesRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTabChange = (id: string) => {
    setActiveTab(id)
    if (id === 'home') {
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (id === 'web') {
      casesRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollDown = () => {
    casesRef.current?.scrollIntoView({ behavior: 'smooth' })
    setActiveTab('web')
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100svh',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#0d0d0d',
        scrollbarWidth: 'none',
      }}
    >
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>

      <MobileHero onScrollDown={handleScrollDown} />
      <MobileCases sectionRef={casesRef} />

      {/* placeholder sections */}
      {Object.entries(PLACEHOLDER_SECTIONS).map(([id, label]) => (
        <div
          key={id}
          id={id}
          style={{
            width: '100%',
            minHeight: '100svh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0d0d0d',
            borderTop: '1px solid #111',
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#1e1e1e' }}>
            {label}
          </span>
        </div>
      ))}

      <MobileTabBar active={activeTab} onChange={handleTabChange} />
    </div>
  )
}
