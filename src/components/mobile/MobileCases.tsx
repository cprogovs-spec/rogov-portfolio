'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import { X } from 'lucide-react'

const CASES = [
  {
    id: 'logistics',
    num: '01',
    title: 'ЛОГИСТИК PRO',
    year: '2024',
    tags: ['UX/UI', 'B2B', 'SaaS'],
    desc: 'Платформа управления грузоперевозками. Дашборд реального времени, трекинг маршрутов, аналитика.',
    fullDesc: `Комплексная B2B-платформа для управления логистическими цепочками. Задача — сократить время обработки заявок с 4 часов до 20 минут.\n\nСпроектировал систему из 12 экранов: дашборд с картой маршрутов, модуль управления заявками, аналитика водителей, интеграция с 1С.\n\nРезультат: время обработки -78%, NPS вырос с 34 до 61.`,
    accent: '#6B935C',
    role: 'Lead UX/UI Designer',
    duration: '4 месяца',
  },
  {
    id: 'finova',
    num: '02',
    title: 'FINOVA',
    year: '2024',
    tags: ['UX/UI', 'Fintech', 'Mobile'],
    desc: 'Мобильное приложение личных финансов. Умная категоризация, прогнозы расходов, интеграция с банками.',
    fullDesc: `Мобильное приложение для управления личными финансами с AI-категоризацией. Аудитория — профессионалы 25-35 лет.\n\nГрафики расходов, прогнозы на основе паттернов, умные уведомления. Онбординг с конверсией 83%.\n\nРезультат: рейтинг 4.8 в App Store, retention D30 — 42%.`,
    accent: '#8B7355',
    role: 'Product Designer',
    duration: '3 месяца',
  },
  {
    id: 'medlink',
    num: '03',
    title: 'MEDLINK',
    year: '2023',
    tags: ['UX/UI', 'Healthcare', 'Web'],
    desc: 'Экосистема телемедицины для клиник. Запись, видеоприёмы, электронные карты пациентов.',
    fullDesc: `Платформа телемедицины для сети частных клиник. Три роли: пациент, врач, администратор.\n\nКабинет пациента с записью в 3 клика, рабочее место врача с историей болезни во время приёма, панель аналитики для руководства.\n\nРезультат: загрузка врачей +35%, отказы от записи -60%.`,
    accent: '#5C7A93',
    role: 'UX Designer',
    duration: '5 месяцев',
  },
  {
    id: 'studio-noir',
    num: '04',
    title: 'STUDIO NOIR',
    year: '2023',
    tags: ['Branding', 'Web', 'Motion'],
    desc: 'Сайт-портфолио для фотостудии. Иммерсивная галерея, кастомный курсор, плавные переходы.',
    fullDesc: `Имиджевый сайт для московской фотостудии премиум-класса. Задача — передать атмосферу через интерфейс.\n\nКурсор трансформируется по контексту, галерея с масштабированием, анимации через shared layout.\n\nРезультат: среднее время на сайте 4:20, конверсия в заявку 8.3%.`,
    accent: '#7A5C93',
    role: 'Web Designer',
    duration: '6 недель',
  },
]

type Case = typeof CASES[0]

function MobileCaseCard({ c, index, onOpen }: { c: Case; index: number; onOpen: (id: string) => void }) {
  return (
    <motion.div
      layoutId={`mobile-card-${c.id}`}
      onClick={() => onOpen(c.id)}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.985 }}
      style={{
        background: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: 3,
        padding: '1.25rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* left accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 2,
        background: `linear-gradient(to bottom, transparent, ${c.accent}, transparent)`,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {c.tags.map(t => (
            <span key={t} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em',
              color: c.accent, border: `1px solid ${c.accent}44`, padding: '2px 7px', borderRadius: 2,
            }}>{t}</span>
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#333' }}>{c.year}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#2a2a2a' }}>{c.num}</span>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.4rem, 7vw, 2rem)',
          color: '#ccc', lineHeight: 0.95, letterSpacing: '-0.01em',
        }}>{c.title}</h3>
      </div>

      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#555', lineHeight: 1.55, marginBottom: 14 }}>
        {c.desc}
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: c.accent }}>
          СМОТРЕТЬ ↗
        </span>
      </div>
    </motion.div>
  )
}

function MobileCaseExpanded({ c, onClose }: { c: Case; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          zIndex: 300,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      <motion.div
        layoutId={`mobile-card-${c.id}`}
        style={{
          position: 'fixed',
          top: '3vh', left: '3vw', right: '3vw',
          bottom: 'calc(64px + env(safe-area-inset-bottom) + 2vh)',
          background: '#0f0f0f',
          border: `1px solid ${c.accent}55`,
          borderRadius: 6,
          zIndex: 301,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      >
        {/* accent gradient */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 0%, ${c.accent}14 0%, transparent 60%)`,
        }} />

        {/* close button */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'flex-end', padding: '1rem 1rem 0' }}>
          <motion.button
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid #2a2a2a',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#666',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <X size={16} strokeWidth={1.5} />
          </motion.button>
        </div>

        {/* content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0.75rem 1.25rem 1.5rem', position: 'relative', zIndex: 1 }}>
          {/* tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
            {c.tags.map(t => (
              <span key={t} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em',
                color: c.accent, border: `1px solid ${c.accent}44`, padding: '3px 9px', borderRadius: 2,
              }}>{t}</span>
            ))}
          </div>

          {/* title */}
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 10vw, 3.5rem)',
            color: '#e8e8e8', lineHeight: 0.9,
            letterSpacing: '-0.02em', marginBottom: '1.25rem',
          }}>{c.title}</h2>

          {/* meta */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.25rem' }}>
            {[['Роль', c.role], ['Срок', c.duration]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.15em', color: '#383838', marginBottom: 3 }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#888' }}>{val}</div>
              </div>
            ))}
          </div>

          {/* divider */}
          <div style={{ height: 1, background: `linear-gradient(90deg, ${c.accent}55, transparent)`, marginBottom: '1.25rem' }} />

          {/* text */}
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
            color: '#666', lineHeight: 1.75, whiteSpace: 'pre-line',
          }}>{c.fullDesc}</p>
        </div>
      </motion.div>
    </>
  )
}

export default function MobileCases({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const openCase = CASES.find(c => c.id === openId) ?? null

  return (
    <div
      ref={sectionRef}
      style={{
        width: '100%',
        minHeight: '100svh',
        background: '#0d0d0d',
        padding: '2rem 1.25rem calc(80px + env(safe-area-inset-bottom))',
        flexShrink: 0,
      }}
    >
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '1.75rem' }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.18em', color: '#6B935C', marginBottom: 8 }}>
          01 / ВЕБ-ДИЗАЙН
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 12vw, 4rem)',
          color: '#f0f0f0', lineHeight: 0.9, letterSpacing: '-0.02em',
        }}>КЕЙСЫ</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#444', marginTop: 10, lineHeight: 1.55 }}>
          Проекты в сфере веб-дизайна — от b2b-платформ до продуктовых интерфейсов
        </p>
      </motion.div>

      {/* cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CASES.map((c, i) => (
          <MobileCaseCard key={c.id} c={c} index={i} onOpen={setOpenId} />
        ))}
      </div>

      <AnimatePresence>
        {openCase && <MobileCaseExpanded key={openCase.id} c={openCase} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
