'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import MobileHero from './MobileHero'
import MobileCases from './MobileCases'
import MobileAiSection from './MobileAiSection'
import MobileMotionSection from './MobileMotionSection'
import MobileUsefulSection from './MobileUsefulSection'
import MobileContactSection from './MobileContactSection'
import MobileTabBar from './MobileTabBar'

const SECTION_IDS = ['home', 'web', 'ai', 'motion', 'useful', 'contact']

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState('home')
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const webRef = useRef<HTMLDivElement>(null)
  const aiRef = useRef<HTMLDivElement>(null)
  const motionRef = useRef<HTMLDivElement>(null)
  const usefulRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  const refsMap = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({
    home: heroRef, web: webRef, ai: aiRef,
    motion: motionRef, useful: usefulRef, contact: contactRef,
  })

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTION_IDS.forEach(id => {
      const el = refsMap.current[id]?.current
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveTab(id) },
        { root: containerRef.current, threshold: 0.35 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const handleTabChange = useCallback((id: string) => {
    setActiveTab(id)
    refsMap.current[id]?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ width: '100vw', height: '100svh', overflowY: 'auto', overflowX: 'hidden', background: '#0d0d0d', scrollbarWidth: 'none' }}
    >
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>

      <div ref={heroRef} id="home">
        <MobileHero onScrollDown={() => handleTabChange('web')} />
      </div>

      <MobileCases sectionRef={webRef} />
      <MobileAiSection sectionRef={aiRef} />
      <MobileMotionSection sectionRef={motionRef} />
      <MobileUsefulSection sectionRef={usefulRef} />
      <MobileContactSection sectionRef={contactRef} />

      <MobileTabBar active={activeTab} onChange={handleTabChange} />
    </div>
  )
}
