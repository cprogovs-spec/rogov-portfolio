'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import GridBackground from './GridBackground'
import { supabase } from '@/lib/supabase'

const ACCENT = '#6B935C'
const ACCENT_BRIGHT = '#8cd66e'

type Service = { title: string; desc: string; price: string }
type Link = { label: string; value: string; href: string }

const DEFAULT_SERVICES: Service[] = [
  { title: 'UX/UI Дизайн', desc: 'Продуктовые интерфейсы, мобильные приложения, веб-платформы', price: 'от 80 000 ₽' },
  { title: 'Брендинг', desc: 'Фирменный стиль, логотип, гайдлайн', price: 'от 60 000 ₽' },
  { title: 'Motion Design', desc: 'Анимации для UI, видеоролики, шаблоны для соцсетей', price: 'от 40 000 ₽' },
  { title: 'AI-интеграция', desc: 'Автоматизация дизайн-процессов, промпт-системы, AI Art Direction', price: 'по запросу' },
]

const DEFAULT_LINKS: Link[] = [
  { label: 'Telegram', value: '@rogovdesign', href: 'https://t.me/rogovdesign' },
  { label: 'Email', value: 'hello@rogov.design', href: 'mailto:hello@rogov.design' },
  { label: 'Behance', value: 'behance.net/rogov', href: 'https://behance.net' },
]

function useContactSettings() {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES)
  const [links, setLinks] = useState<Link[]>(DEFAULT_LINKS)
  const [subheading, setSubheading] = useState('Проектирую интерфейсы, которые работают — визуально и стратегически. Открыт для новых проектов.')

  useEffect(() => {
    supabase.from('settings').select('*').eq('id', 1).single()
      .then(({ data }) => {
        if (!data) return
        if (Array.isArray(data.services) && data.services.length > 0) setServices(data.services)
        if (Array.isArray(data.links) && data.links.length > 0) setLinks(data.links)
        if (data.subheading) setSubheading(data.subheading)
      })
  }, [])

  return { services, links, subheading }
}

// Sections that drive left-panel content
const SCROLL_SECTIONS = [
  { id: 'intro', label: 'ДАВАЙТЕ\nРАБОТАТЬ' },
  { id: 'services', label: 'УСЛУГИ\nИ ЦЕНЫ' },
  { id: 'contact', label: 'КАК\nСВЯЗАТЬСЯ' },
]

function ContactForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
    } finally {
      setSending(false)
      setSent(true)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 4,
    padding: '1rem 1.1rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    color: '#e0e0e0',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  return (
    <>
      {/* Backdrop + centering wrapper */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          zIndex: 300, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Form panel — stopPropagation prevents backdrop click from closing */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: 'min(560px, 90vw)',
            background: '#111',
            border: `1px solid ${ACCENT}55`,
            borderRadius: 6,
            padding: '2.5rem',
            boxShadow: `0 0 80px ${ACCENT}18`,
            position: 'relative',
          }}
        >
        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '6px 6px 0 0', background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />

        {/* Close */}
        <motion.button
          onClick={onClose}
          whileHover={{ color: '#fff' }}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
            color: '#aaa', background: 'none', border: '1px solid #2a2a2a',
            padding: '5px 10px', cursor: 'pointer', borderRadius: 3,
          }}
        >ESC ✕</motion.button>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '2rem 0' }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              border: `1px solid ${ACCENT_BRIGHT}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', color: ACCENT_BRIGHT,
            }}>✓</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#e8f5e0', lineHeight: 0.95 }}>ОТПРАВЛЕНО</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#c0c0c0', textAlign: 'center' }}>
              Отвечу в течение 24 часов
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#e8e8e8', lineHeight: 0.95, marginBottom: '1.5rem' }}>
                ОСТАВИТЬ ЗАЯВКУ
              </div>
            </div>

            {[
              { key: 'name', label: 'Имя или компания', placeholder: 'Сергей или ООО «Компания»' },
              { key: 'contact', label: 'Telegram или email', placeholder: '@username или email' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.12em', color: '#aaa' }}>
                  {label.toUpperCase()}
                </label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={formData[key as keyof typeof formData]}
                  onChange={e => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = ACCENT + '88' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
                />
              </div>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.12em', color: '#aaa' }}>
                ЗАДАЧА
              </label>
              <textarea
                placeholder="Коротко о проекте, задаче, сроках..."
                value={formData.message}
                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                onFocus={e => { e.target.style.borderColor = ACCENT + '88' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ background: ACCENT + '33', borderColor: ACCENT_BRIGHT }}
              whileTap={{ scale: 0.98 }}
              style={{
                height: 52, width: '100%',
                background: ACCENT + '18',
                border: `1px solid ${ACCENT}`,
                borderRadius: 4, cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: '0.88rem',
                letterSpacing: '0.14em', color: ACCENT_BRIGHT,
                transition: 'background 0.2s, border-color 0.2s',
                marginTop: 4,
              }}
            >
              {sending ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ ЗАЯВКУ ↵'}
            </motion.button>
          </form>
        )}
        </motion.div>
      </motion.div>
    </>
  )
}

export default function ContactSection() {
  const [formOpen, setFormOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const { services, links, subheading } = useContactSettings()

  useEffect(() => {
    const handler = () => setFormOpen(true)
    window.addEventListener('open-contact-form', handler)
    return () => window.removeEventListener('open-contact-form', handler)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => {
      const scrollTop = el.scrollTop
      const height = el.clientHeight
      const idx = Math.round(scrollTop / height)
      setActiveSection(Math.min(idx, SCROLL_SECTIONS.length - 1))
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d0d', display: 'flex', overflow: 'hidden', position: 'relative' }}>
      <GridBackground />
      {/* ── Left: sticky visual panel ─────────────────────── */}
      <div style={{
        width: '48%', height: '100%', flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        padding: '2.5rem 2rem 2.5rem 2.5rem',
        borderRight: '1px solid #141414',
        position: 'relative', overflow: 'hidden',
        zIndex: 1,
      }}>
        {/* Section label — animates on scroll */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', color: ACCENT }}>
            </div>
            <a href="/about" style={{
              display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.14em',
              color: '#aaa', border: '1px solid #1a1a1a', borderRadius: 3,
              padding: '0.35rem 0.7rem',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = ACCENT_BRIGHT; e.currentTarget.style.borderColor = ACCENT + '55' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.borderColor = '#1a1a1a' }}
            >
              ОБО МНЕ
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.6 }}>
                <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7 4.5L7 9.5M4.5 7H9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </a>
          </div>
          <AnimatePresence mode="wait">
            <motion.h2
              key={activeSection}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
                color: '#e8e8e8', lineHeight: 0.92, letterSpacing: '-0.02em',
                whiteSpace: 'pre-line',
              }}
            >
              {SCROLL_SECTIONS[activeSection].label}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* VIDEO PLACEHOLDER — place for future video */}
        <div style={{
          flex: 1,
          background: '#0a0a0a',
          border: '1px solid #1a1a1a',
          borderRadius: 4,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 12, position: 'relative', overflow: 'hidden',
        }}>
          {/* Grid lines */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: 0.4,
          }} />
          {/* Corner marks */}
          {[['0,0', '0'], ['0,100%', '0'], ['100%,0', '0'], ['100%,100%', '0']].map((_, i) => {
            const positions: React.CSSProperties[] = [
              { top: 12, left: 12 }, { bottom: 12, left: 12 },
              { top: 12, right: 12 }, { bottom: 12, right: 12 },
            ]
            const borders = [
              { borderTop: `1px solid ${ACCENT}55`, borderLeft: `1px solid ${ACCENT}55` },
              { borderBottom: `1px solid ${ACCENT}55`, borderLeft: `1px solid ${ACCENT}55` },
              { borderTop: `1px solid ${ACCENT}55`, borderRight: `1px solid ${ACCENT}55` },
              { borderBottom: `1px solid ${ACCENT}55`, borderRight: `1px solid ${ACCENT}55` },
            ]
            return (
              <div key={i} style={{
                position: 'absolute', width: 16, height: 16, ...positions[i], ...borders[i],
              }} />
            )
          })}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              border: `1px solid ${ACCENT}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: `14px solid ${ACCENT}88`, marginLeft: 3 }} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', color: '#2a2a2a' }}>
              SHOWREEL 2024
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ display: 'flex', gap: 6, marginTop: '1.25rem', alignItems: 'center' }}>
          {SCROLL_SECTIONS.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: activeSection === i ? 20 : 6, background: activeSection === i ? ACCENT_BRIGHT : '#2a2a2a' }}
              transition={{ duration: 0.3 }}
              style={{ height: 2, borderRadius: 1 }}
            />
          ))}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#2a2a2a', letterSpacing: '0.1em', marginLeft: 4 }}>
            СКРОЛЛ ВНИЗ
          </span>
        </div>
      </div>

      {/* ── Right: vertical scroll content ────────────────── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, height: '100%',
          overflowY: 'auto', overflowX: 'hidden',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          position: 'relative', zIndex: 1,
        }}
      >
        <style>{`.contact-scroll::-webkit-scrollbar{display:none}`}</style>

        {/* Section 1 — intro + CTA */}
        <div
          ref={el => { sectionRefs.current[0] = el }}
          style={{
            height: '100%', flexShrink: 0,
            scrollSnapAlign: 'start',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center',
            padding: '2.5rem 2.5rem 5rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '1.15rem',
              color: '#c0c0c0', lineHeight: 1.65, marginBottom: '3rem', maxWidth: 380,
            }}>
              {subheading}
            </p>

            <motion.button
              onClick={() => setFormOpen(true)}
              whileHover={{ scale: 1.02, borderColor: ACCENT_BRIGHT, color: ACCENT_BRIGHT }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                height: 60, padding: '0 2.5rem',
                background: ACCENT + '18',
                border: `1px solid ${ACCENT}`,
                borderRadius: 4, cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                letterSpacing: '0.14em', color: ACCENT,
                transition: 'all 0.2s', marginBottom: '2.5rem',
              }}
            >
              ОСТАВИТЬ ЗАЯВКУ ↵
            </motion.button>

            {/* Quick links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {links.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                  whileHover={{ x: 6 }}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1rem 0',
                    borderBottom: '1px solid #161616',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', color: '#aaa' }}>
                    {link.label.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#c0c0c0' }}>
                    {link.value} ↗
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Section 2 — services */}
        <div
          ref={el => { sectionRefs.current[1] = el }}
          style={{
            height: '100%', flexShrink: 0,
            scrollSnapAlign: 'start',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center',
            padding: '2.5rem 2.5rem 5rem',
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', letterSpacing: '0.18em', color: ACCENT, marginBottom: '1.5rem' }}>
            ЧТО ДЕЛАЮ
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {services.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  padding: '1.4rem 0',
                  borderBottom: '1px solid #161616',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#ccc', marginBottom: 5 }}>
                    {s.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#aaa', lineHeight: 1.5 }}>
                    {s.desc}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                  color: ACCENT, letterSpacing: '0.05em', whiteSpace: 'nowrap', paddingTop: 3,
                }}>{s.price}</div>
              </motion.div>
            ))}
          </div>
          <motion.button
            onClick={() => setFormOpen(true)}
            whileHover={{ borderColor: ACCENT, color: ACCENT }}
            whileTap={{ scale: 0.98 }}
            style={{
              alignSelf: 'flex-start',
              height: 48, padding: '0 2rem',
              background: 'transparent',
              border: '1px solid #2a2a2a',
              borderRadius: 3, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              letterSpacing: '0.12em', color: '#aaa',
              transition: 'all 0.2s', marginTop: '1.5rem',
            }}
          >
            ОБСУДИТЬ ПРОЕКТ →
          </motion.button>
        </div>

        {/* Section 3 — more info + logo */}
        <div
          ref={el => { sectionRefs.current[2] = el }}
          style={{
            height: '100%', flexShrink: 0,
            scrollSnapAlign: 'start',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center',
            padding: '2.5rem 2.5rem 5rem',
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', letterSpacing: '0.18em', color: ACCENT, marginBottom: '1.5rem' }}>
            КАК РАБОТАЕМ
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            {[
              { n: '01', t: 'Бриф и созвон', d: 'Разбираем задачу, аудиторию, конкурентов. 30 минут — и всё понятно.' },
              { n: '02', t: 'Концепция', d: 'Предлагаю 2-3 направления, выбираем вместе. Без ненужных итераций.' },
              { n: '03', t: 'Дизайн', d: 'Работаю в Figma с комментариями. Вы видите прогресс каждый день.' },
              { n: '04', t: 'Передача', d: 'Финальные файлы, гайдлайн, поддержка при внедрении.' },
            ].map(step => (
              <div key={step.n} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: '#2a2a2a', paddingTop: 3, minWidth: 20 }}>{step.n}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: '#ccc', marginBottom: 4 }}>{step.t}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#aaa', lineHeight: 1.5 }}>{step.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #161616' }}>
            <Image src="/logo.svg" alt="Рогов" width={70} height={22} style={{ opacity: 0.25 }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#2a2a2a', letterSpacing: '0.15em' }}>
              ВЕБ-ДИЗАЙН · НЕЙРОСЕТИ · МОУШЕН
            </div>
          </div>
        </div>
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {formOpen && <ContactForm onClose={() => setFormOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
