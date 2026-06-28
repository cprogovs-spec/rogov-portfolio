'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        setError('Неверный пароль')
      }
    } catch {
      setError('Ошибка соединения')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0d0d0d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
    }}>
      <div style={{
        backgroundColor: '#111',
        border: '1px solid #222',
        borderRadius: '8px',
        padding: '40px',
        width: '320px',
      }}>
        <h1 style={{ color: '#6B935C', fontSize: '18px', marginBottom: '8px', letterSpacing: '0.1em' }}>
          АДМИНКА
        </h1>
        <p style={{ color: '#555', fontSize: '12px', marginBottom: '32px' }}>РОГОВ — ПОРТФОЛИО</p>
        <form onSubmit={handleSubmit}>
          <label style={{ color: '#888', fontSize: '11px', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>
            ПАРОЛЬ
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '4px',
              color: '#fff',
              padding: '10px 12px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: '16px',
            }}
            autoFocus
          />
          {error && (
            <p style={{ color: '#c0392b', fontSize: '12px', marginBottom: '12px' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#6B935C',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '10px',
              fontSize: '13px',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'ВХОД...' : 'ВОЙТИ'}
          </button>
        </form>
      </div>
    </div>
  )
}
