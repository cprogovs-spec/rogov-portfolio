'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type WeatherState = {
  temp: number | null
  icon: string
  loading: boolean
}

// WMO weather code → emoji
function weatherIcon(code: number): string {
  if (code === 0) return '☀'
  if (code <= 2) return '🌤'
  if (code <= 3) return '☁'
  if (code <= 48) return '🌫'
  if (code <= 57) return '🌧'
  if (code <= 67) return '🌧'
  if (code <= 77) return '❄'
  if (code <= 82) return '🌧'
  if (code <= 86) return '❄'
  if (code <= 99) return '⛈'
  return '🌡'
}

export default function WeatherClock() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [weather, setWeather] = useState<WeatherState>({ temp: null, icon: '☀', loading: true })

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      setDate(
        now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
            .replace(/\//g, '.')
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) {
      setWeather(w => ({ ...w, loading: false }))
      return
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weathercode&wind_speed_unit=ms`
          )
          const data = await res.json()
          const temp = Math.round(data.current.temperature_2m)
          const code = data.current.weathercode as number
          setWeather({ temp, icon: weatherIcon(code), loading: false })
        } catch {
          setWeather(w => ({ ...w, loading: false }))
        }
      },
      () => {
        setWeather(w => ({ ...w, loading: false }))
      },
      { timeout: 6000 }
    )
  }, [])

  const tempDisplay = weather.loading
    ? '...'
    : weather.temp !== null
      ? `${weather.temp > 0 ? '+' : ''}${weather.temp}°`
      : '—'

  return (
    <motion.div
      className="text-right"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="flex items-start justify-end gap-2">
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', lineHeight: 1, color: 'var(--foreground)' }}>
            {tempDisplay}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#888', marginTop: '2px' }}>
            {date}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#888' }}>
            {time}
          </div>
        </div>
        <div style={{ fontSize: '1.6rem', marginTop: '-2px' }}>{weather.icon}</div>
      </div>
    </motion.div>
  )
}
