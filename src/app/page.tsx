'use client'

import { useRef, useState, useEffect } from 'react'
import Header from '@/components/Header'
import WebDesignSection from '@/components/WebDesignSection'
import AiSection from '@/components/AiSection'
import MotionSection from '@/components/MotionSection'
import ContactSection from '@/components/ContactSection'
import UsefulSection from '@/components/UsefulSection'
import BottomNav from '@/components/BottomNav'
import MobileLayout from '@/components/mobile/MobileLayout'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function Home() {
  const isMobile = useIsMobile()
  const containerRef = useRef<HTMLDivElement>(null)
  const [activePanel, setActivePanel] = useState(0)

  const scrollToPanel = (index: number) => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({ left: index * el.offsetWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => setActivePanel(Math.round(el.scrollLeft / el.offsetWidth))
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [isMobile])

  // null = SSR / first render — render nothing to avoid flash
  if (isMobile === null) return null

  if (isMobile) return <MobileLayout />

  // ─── Desktop ────────────────────────────────────────────────
  const panelStyle: React.CSSProperties = {
    flex: '0 0 100%',
    height: '100%',
    scrollSnapAlign: 'start',
  }

  return (
    <>
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          width: '100vw',
          height: '100vh',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
        }}
      >
        <style>{`div::-webkit-scrollbar{display:none}`}</style>

        <div style={panelStyle}><Header /></div>

        <div style={panelStyle}>
          <WebDesignSection />
        </div>

        <div style={panelStyle}><AiSection /></div>
        <div style={panelStyle}><MotionSection /></div>
        <div style={panelStyle}><UsefulSection /></div>
        <div style={panelStyle}><ContactSection /></div>
      </div>

      <BottomNav activePanel={activePanel} onNavClick={scrollToPanel} />
    </>
  )
}
