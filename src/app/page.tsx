'use client'

import { useRef, useState, useEffect } from 'react'
import Header from '@/components/Header'
import WebDesignSection from '@/components/WebDesignSection'
import MotionSection from '@/components/MotionSection'
import LogoSection from '@/components/LogoSection'
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

  // Mouse wheel → switch panels (vertical scroll flips horizontally)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let locked = false

    const hasScrollableParent = (node: EventTarget | null): boolean => {
      let cur = node instanceof Element ? node : null
      while (cur && cur !== el) {
        const { overflowY, position } = getComputedStyle(cur)
        if (position === 'fixed') return true // modal is open — don't flip panels
        if ((overflowY === 'auto' || overflowY === 'scroll') && cur.scrollHeight > cur.clientHeight) return true
        cur = cur.parentElement
      }
      return false
    }

    const onWheel = (e: WheelEvent) => {
      // don't hijack scroll inside open case modals / any scrollable area
      if (hasScrollableParent(e.target)) return
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      if (Math.abs(delta) < 10 || locked) return
      e.preventDefault()
      locked = true
      const current = Math.round(el.scrollLeft / el.offsetWidth)
      const next = Math.max(0, Math.min(5, current + (delta > 0 ? 1 : -1)))
      el.scrollTo({ left: next * el.offsetWidth, behavior: 'smooth' })
      setTimeout(() => { locked = false }, 650)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
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

        <div style={panelStyle}><MotionSection /></div>
        <div style={panelStyle}><LogoSection /></div>
        <div style={panelStyle}><UsefulSection /></div>
        <div style={panelStyle}><ContactSection /></div>
      </div>

      <BottomNav activePanel={activePanel} onNavClick={scrollToPanel} />
    </>
  )
}
