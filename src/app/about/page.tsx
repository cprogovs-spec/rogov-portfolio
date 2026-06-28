'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'

function ContactModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, backdropFilter: 'blur(8px)' }} />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed',
          top: '4vh', left: '4vw', right: '4vw',
          maxHeight: '92svh', overflowY: 'auto',
          margin: '0 auto',
          width: 'auto', maxWidth: 520,
          background: '#0d0d0d',
          border: '1px solid #6B935C33', borderRadius: 6, zIndex: 1001, padding: '1.5rem',
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#e8e8e8', letterSpacing: '-0.01em' }}>
            {sent ? 'ОТПРАВЛЕНО' : 'НОВЫЙ ПРОЕКТ'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '50%', width: 36, height: 36, color: '#c0c0c0', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>✕</button>
        </div>
        {sent ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: '#8cd66e', marginBottom: '1rem' }}>✓</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#c0c0c0', lineHeight: 1.7 }}>Заявка получена. Отвечу в течение 24 часов.</p>
          </motion.div>
        ) : (
          <form onSubmit={async e => {
            e.preventDefault(); setSending(true)
            try { await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) }) }
            finally { setSending(false); setSent(true) }
          }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[{ key: 'name', label: 'ИМЯ', placeholder: 'Как вас зовут?' }, { key: 'contact', label: 'КАК СВЯЗАТЬСЯ', placeholder: 'Telegram или email' }].map(({ key, label, placeholder }) => (
              <div key={key}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#aaa', marginBottom: 6 }}>{label}</div>
                <input value={formData[key as keyof typeof formData]} onChange={e => setFormData(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder} required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '0.85rem 1rem', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#e0e0e0', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#aaa', marginBottom: 6 }}>ЗАДАЧА</div>
              <textarea value={formData.message} onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                placeholder="Расскажите про проект..." rows={4} required
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '0.85rem 1rem', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#e0e0e0', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ height: 52, background: 'rgba(107,147,92,0.12)', border: '1px solid #6B935C55', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.14em', color: '#8cd66e', cursor: 'pointer' }}>
              {sending ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ →'}
            </button>
          </form>
        )}
      </motion.div>
    </>
  )
}

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }))
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 696 316" fill="none">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="#6B935C"
            strokeWidth={path.width}
            strokeOpacity={0.08 + path.id * 0.018}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{ pathLength: 1, opacity: [0.3, 0.6, 0.3], pathOffset: [0, 1, 0] }}
            transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </svg>
    </div>
  )
}

const ACCENT = '#6B935C'
const ACCENT_BRIGHT = '#8cd66e'
const BASE = '#0d0d0d'

const TOOLS = [
  { name: 'Figma', label: 'UI / ПРОТОТИПЫ', level: 99, icon: '◈' },
  { name: 'Photoshop', label: 'РЕТУШЬ / КОМПОУЗИНГ', level: 95, icon: '◉' },
  { name: 'Illustrator', label: 'ИЛЛЮСТРАЦИЯ / ВЕКТОР', level: 90, icon: '◎' },
  { name: 'After Effects', label: 'АНИМАЦИЯ / МОУШЕН', level: 88, icon: '◐' },
  { name: 'Premiere Pro', label: 'ВИДЕОМОНТАЖ', level: 80, icon: '◑' },
  { name: 'Cinema 4D', label: '3D / РЕНДЕР', level: 75, icon: '⬡' },
  { name: 'Blender', label: '3D / МОДЕЛИНГ', level: 70, icon: '⬢' },
  { name: 'Midjourney', label: 'AI-АРТ ДИРЕКШН', level: 95, icon: '⟁' },
  { name: 'ComfyUI', label: 'STABLE DIFFUSION', level: 80, icon: '⟆' },
]

const TIMELINE = [
  { year: '2012', title: 'Первый пиксель', desc: 'Открыл Photoshop и понял — это навсегда.' },
  { year: '2015', title: 'Первый клиент', desc: 'Логотип за 500 рублей. Научил меня больше, чем любой курс.' },
  { year: '2017', title: 'UX/UI', desc: 'Перешёл от графики к интерфейсам. Figma изменила всё.' },
  { year: '2019', title: 'Моушен', desc: 'After Effects + Cinema 4D. Дизайн ожил.' },
  { year: '2022', title: 'AI', desc: 'Midjourney, Stable Diffusion — новый инструментарий.' },
  { year: '2024', title: 'Сейчас', desc: 'Продуктовый дизайн, брендинг, AI-интеграция. Открыт для проектов.' },
]

const STATS = [
  { value: '12+', label: 'ЛЕТ' },
  { value: '80+', label: 'ПРОЕКТОВ' },
  { value: '9', label: 'ИНСТРУМЕНТОВ' },
  { value: '∞', label: 'ИТЕРАЦИЙ' },
]

function ToolCard({ tool, index }: { tool: typeof TOOLS[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid #1a1a1a',
        borderRadius: 4,
        padding: '1rem',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', letterSpacing: '0.18em', color: '#c0c0c0', marginBottom: 3 }}>{tool.label}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#bbb', letterSpacing: '-0.01em' }}>{tool.name}</div>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: '#2a2a2a' }}>{tool.icon}</span>
      </div>
      <div style={{ height: 2, background: '#1a1a1a', borderRadius: 2 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${tool.level}%` } : {}}
          transition={{ duration: 0.8, delay: index * 0.05 + 0.3, ease: 'easeOut' }}
          style={{ height: '100%', background: ACCENT, borderRadius: 2 }}
        />
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.42rem', color: '#c0c0c0', marginTop: 4, textAlign: 'right', letterSpacing: '0.1em' }}>
        {tool.level}%
      </div>
    </motion.div>
  )
}

function TimelineItem({ item, index }: { item: typeof TIMELINE[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const isLast = index === TIMELINE.length - 1

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{ display: 'flex', gap: '1rem' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: isLast ? ACCENT_BRIGHT : ACCENT,
          boxShadow: isLast ? `0 0 10px ${ACCENT_BRIGHT}` : 'none',
          flexShrink: 0, marginTop: 4,
        }} />
        {!isLast && <div style={{ width: 1, flex: 1, background: '#1a1a1a', marginTop: 6 }} />}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', color: isLast ? ACCENT_BRIGHT : ACCENT }}>{item.year}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: '#e0e0e0', letterSpacing: '-0.01em' }}>{item.title}</span>
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#aaa', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
      </div>
    </motion.div>
  )
}

export default function AboutPage() {
  const [showForm, setShowForm] = useState(false)
  const [chars, setChars] = useState<string[]>([])
  const LETTERS = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
  const TITLE = 'СЕРГЕЙ РОГОВ'

  useEffect(() => {
    const letters = TITLE.split('')
    const resolved = letters.map(() => false)
    setChars(letters.map(() => LETTERS[Math.floor(Math.random() * LETTERS.length)]))
    const scrambleId = setInterval(() => {
      setChars(letters.map((ch, i) => resolved[i] ? ch : LETTERS[Math.floor(Math.random() * LETTERS.length)]))
    }, 60)
    letters.forEach((ch, i) => {
      if (ch === ' ') { resolved[i] = true; return }
      setTimeout(() => {
        resolved[i] = true
        setChars(prev => prev.map((c, j) => j === i ? ch : c))
      }, 400 + i * 80)
    })
    const stop = setTimeout(() => clearInterval(scrambleId), 400 + letters.length * 80 + 200)
    return () => { clearInterval(scrambleId); clearTimeout(stop) }
  }, [])

  return (
    <div style={{ background: BASE, minHeight: '100vh', color: '#e0e0e0' }}>

      {/* Nav */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '1rem 1.25rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(13,13,13,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #111',
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', letterSpacing: '0.2em', color: '#aaa', textDecoration: 'none' }}>
          ← РОГОВ
        </Link>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#222' }}>ОБО МНЕ</div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em',
            color: ACCENT, background: 'none', border: `1px solid ${ACCENT}44`,
            borderRadius: 3, padding: '0.4rem 0.7rem', cursor: 'pointer',
          }}
        >СВЯЗАТЬСЯ</button>
      </div>

      {/* Hero */}
      <section style={{
        position: 'relative', minHeight: '100svh',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '0 1.25rem 3rem', paddingTop: '70px', overflow: 'hidden',
      }}>
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', color: ACCENT, marginBottom: '1rem' }}>
          </motion.div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 14vw, 9rem)',
            lineHeight: 0.95, letterSpacing: '-0.03em',
            margin: '0 0 1.5rem',
          }}>
            <div>
              {chars.slice(0, 6).map((ch, i) => (
                <span key={i} style={{ color: ch !== TITLE[i] ? ACCENT_BRIGHT : '#f0f0f0', transition: 'color 0.1s', textShadow: ch !== TITLE[i] ? `0 0 20px ${ACCENT_BRIGHT}88` : 'none' }}>{ch}</span>
              ))}
            </div>
            <div>
              {chars.slice(7).map((ch, i) => (
                <span key={i} style={{ color: ch !== TITLE[i + 7] ? ACCENT_BRIGHT : '#f0f0f0', transition: 'color 0.1s', textShadow: ch !== TITLE[i + 7] ? `0 0 20px ${ACCENT_BRIGHT}88` : 'none' }}>{ch}</span>
              ))}
            </div>
          </h1>

          {/* Info rows — mobile friendly */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[['ЛОКАЦИЯ', 'Россия'], ['СТАТУС', 'Открыт для проектов'], ['СТЕК', 'Figma · Adobe · AI · 3D']].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a', padding: '0.7rem 0' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', letterSpacing: '0.15em', color: '#c0c0c0' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#c0c0c0' }}>{val}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '3rem 1.25rem', borderTop: '1px solid #111', borderBottom: '1px solid #111' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {STATS.map((s, i) => {
            const ref = useRef(null)
            const inView = useInView(ref, { once: true })
            return (
              <motion.div key={s.label} ref={ref}
                initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 10vw, 3.5rem)', color: '#f0f0f0', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', letterSpacing: '0.18em', color: '#c0c0c0', marginTop: 8 }}>{s.label}</div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* About text */}
      <section style={{ padding: '3rem 1.25rem', borderBottom: '1px solid #111' }}>
        {[
          'Я верю, что дизайн — это не украшение, а решение задач. Каждый пиксель должен работать.',
          'Начинал с графики и брендинга, вырос до продуктового дизайна и AI-арт дирекшна.',
          'Использую нейросети чтобы ускорить исследование и расширить творческие возможности.',
        ].map((text, i) => {
          const ref = useRef(null)
          const inView = useInView(ref, { once: true })
          return (
            <motion.p key={i} ref={ref}
              initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: i === 0 ? '#999' : '#aaa', lineHeight: 1.75, marginBottom: '1rem', margin: '0 0 1rem' }}>
              {text}
            </motion.p>
          )
        })}
      </section>

      {/* Stack */}
      <section style={{ padding: '3rem 1.25rem', borderBottom: '1px solid #111' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 9vw, 4rem)', color: '#f0f0f0', letterSpacing: '-0.02em', margin: 0 }}>СТЕК</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
          {TOOLS.map((tool, i) => <ToolCard key={tool.name} tool={tool} index={i} />)}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '3rem 1.25rem', borderBottom: '1px solid #111' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 9vw, 4rem)', color: '#f0f0f0', letterSpacing: '-0.02em', margin: 0 }}>ПУТЬ</h2>
        </div>
        <div>
          {TIMELINE.map((item, i) => <TimelineItem key={item.year} item={item} index={i} />)}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 1.25rem', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 10vw, 6rem)', color: '#f0f0f0', letterSpacing: '-0.02em', lineHeight: 0.9, margin: '0 0 2rem' }}>РАБОТАЕМ?</h2>
          <button
            onClick={() => setShowForm(true)}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.14em',
              color: ACCENT_BRIGHT, background: 'rgba(107,147,92,0.1)',
              border: `1px solid ${ACCENT}55`, borderRadius: 4,
              padding: '1rem 2rem', cursor: 'pointer', width: '100%', maxWidth: 320,
            }}
          >ОФОРМИТЬ ЗАЯВКУ ↵</button>
        </div>
      </section>

      <AnimatePresence>
        {showForm && <ContactModal onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  )
}
