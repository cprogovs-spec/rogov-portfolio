'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import GridBackground from '@/components/GridBackground'
import { supabase } from '@/lib/supabase'

const ACCENT = '#6B935C'
const ACCENT_BRIGHT = '#8cd66e'

type Service = { title: string; desc: string; price: string }
type Link = { label: string; value: string; href: string }

const DEFAULT_SERVICES: Service[] = [
  { title: 'UX/UI Дизайн', desc: 'Продуктовые интерфейсы, мобильные приложения, веб-платформы', price: 'от 80 000 ₽' },
  { title: 'Брендинг', desc: 'Фирменный стиль, логотип, гайдлайн', price: 'от 60 000 ₽' },
  { title: 'Motion Design', desc: 'Анимации для UI, видеоролики, шаблоны для соцсетей', price: 'от 40 000 ₽' },
  { title: 'AI-интеграция', desc: 'Автоматизация дизайн-процессов, AI Art Direction', price: 'по запросу' },
]

const DEFAULT_LINKS: Link[] = [
  { label: 'Telegram', value: '@rogovdesign', href: 'https://t.me/rogovdesign' },
  { label: 'Email', value: 'hello@rogov.design', href: 'mailto:hello@rogov.design' },
  { label: 'Behance', value: 'behance.net/rogov', href: 'https://behance.net' },
]

function MobileForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed', top: '5vh', left: '4vw', right: '4vw',
          bottom: 'calc(64px + env(safe-area-inset-bottom) + 2vh)',
          background: '#0d0d0d', border: `1px solid ${ACCENT}55`, borderRadius: 6,
          zIndex: 301, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#e8e8e8', letterSpacing: '-0.01em' }}>
              {sent ? 'ОТПРАВЛЕНО' : 'НОВЫЙ ПРОЕКТ'}
            </h3>
            <button onClick={onClose} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '50%', width: 36, height: 36, color: '#666', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', WebkitTapHighlightColor: 'transparent' }}>✕</button>
          </div>

          {sent ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', paddingTop: '2rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: ACCENT_BRIGHT, marginBottom: '1rem' }}>✓</div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#666', lineHeight: 1.7 }}>
                Заявка получена. Отвечу в течение 24 часов.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={async (e) => {
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
            }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'name', label: 'ИМЯ', placeholder: 'Как вас зовут?' },
                { key: 'contact', label: 'КАК СВЯЗАТЬСЯ', placeholder: 'Telegram или email' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.15em', color: '#444', marginBottom: 6 }}>{label}</div>
                  <input
                    value={formData[key as keyof typeof formData]}
                    onChange={e => setFormData(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    required
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 4, padding: '0.85rem 1rem', fontFamily: 'var(--font-sans)',
                      fontSize: '0.9rem', color: '#e0e0e0', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.15em', color: '#444', marginBottom: 6 }}>ЗАДАЧА</div>
                <textarea
                  value={formData.message}
                  onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                  placeholder="Расскажите про проект..."
                  rows={4}
                  required
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 4, padding: '0.85rem 1rem', fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem', color: '#e0e0e0', outline: 'none', resize: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                style={{
                  width: '100%', height: 52, background: `rgba(107,147,92,0.12)`,
                  border: `1px solid ${ACCENT}55`, borderRadius: 4,
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em',
                  color: ACCENT_BRIGHT, cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
                }}
              >{sending ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ →'}</motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </>
  )
}

export default function MobileContactSection({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  const [showForm, setShowForm] = useState(false)
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES)
  const [links, setLinks] = useState<Link[]>(DEFAULT_LINKS)

  useEffect(() => {
    supabase.from('settings').select('*').eq('id', 1).single()
      .then(({ data }) => {
        if (!data) return
        if (Array.isArray(data.services) && data.services.length > 0) setServices(data.services)
        if (Array.isArray(data.links) && data.links.length > 0) setLinks(data.links)
      })
  }, [])

  return (
    <div ref={sectionRef} id="contact" style={{ width: '100%', minHeight: '100svh', background: '#0d0d0d', position: 'relative', overflow: 'hidden', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <GridBackground />

      <div style={{ position: 'relative', zIndex: 1, flex: 1, padding: '2rem 1.25rem calc(80px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.18em', color: ACCENT, marginBottom: 8 }}>05 / КОНТАКТЫ</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 12vw, 4rem)', color: '#f0f0f0', lineHeight: 0.9, letterSpacing: '-0.02em' }}>ДАВАЙТЕ<br/>РАБОТАТЬ</h2>
        </motion.div>

        {/* Services */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.18em', color: '#333', marginBottom: '1rem' }}>УСЛУГИ</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1a1a1a', borderRadius: 3, padding: '0.9rem 1rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#bbb' }}>{s.title}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: ACCENT, letterSpacing: '0.06em' }}>{s.price}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.67rem', color: '#444', lineHeight: 1.5 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.18em', color: '#333', marginBottom: '1rem' }}>КОНТАКТЫ</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {links.map(l => (
              <motion.a
                key={l.label}
                href={l.href}
                target="_blank" rel="noopener noreferrer"
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid #1a1a1a',
                  borderRadius: 3, padding: '0.9rem 1rem', textDecoration: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', color: '#444' }}>{l.label}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: ACCENT_BRIGHT }}>{l.value}</span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.button
          onClick={() => setShowForm(true)}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%', height: 56, background: `rgba(107,147,92,0.12)`,
            border: `1px solid ${ACCENT}55`, borderRadius: 4,
            fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.14em',
            color: ACCENT_BRIGHT, cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
            marginTop: 'auto',
          }}
        >ОФОРМИТЬ ЗАЯВКУ ↵</motion.button>
      </div>

      <AnimatePresence>
        {showForm && <MobileForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  )
}
