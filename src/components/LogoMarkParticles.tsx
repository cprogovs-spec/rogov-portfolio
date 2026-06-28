'use client'

import { useEffect, useRef } from 'react'

const RECT_PATH = 'M39.1799 73.2992C40.3822 73.2992 41.2943 72.9882 41.9162 72.3663C42.5796 71.703 42.9113 70.7701 42.9113 69.5678L42.9113 50.9107C42.9113 49.7084 42.5796 48.7962 41.9162 48.1743C41.2943 47.511 40.3822 47.1793 39.1799 47.1793L13.0599 47.1793C11.8576 47.1793 10.9248 47.511 10.2614 48.1743C9.63949 48.7962 9.32854 49.7084 9.32854 50.9107L9.32854 69.5678C9.32854 70.7701 9.63949 71.703 10.2614 72.3663C10.9248 72.9882 11.8576 73.2992 13.0599 73.2992H39.1799ZM0 50.9107C0 42.6187 4.14602 38.4727 12.4381 38.4727L39.8017 38.4727C48.0938 38.4727 52.2398 42.6187 52.2398 50.9107L52.2398 69.5678C52.2398 77.8598 48.0938 82.0058 39.8017 82.0058H12.4381C4.14602 82.0058 0 77.8598 0 69.5678L0 50.9107Z'
const V_PATH = 'M0.174072 0L12.3595 0L27.101 27.9527L41.6894 0L53.5358 0L34.9177 35.706L19.0472 35.706L0.174072 0Z'

class Particle {
  pos = { x: 0, y: 0 }
  vel = { x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3 }
  target = { x: 0, y: 0 }

  maxSpeed = Math.random() * 6 + 4
  maxForce = 0.12
  closeEnough = 80

  colorWeight = 0
  colorBlendRate = Math.random() * 0.012 + 0.004
  size = Math.random() * 1.2 + 0.8

  move() {
    const dx = this.target.x - this.pos.x
    const dy = this.target.y - this.pos.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const slow = dist < this.closeEnough ? dist / this.closeEnough : 1
    const mag = dist || 1
    const tx = (dx / mag) * this.maxSpeed * slow - this.vel.x
    const ty = (dy / mag) * this.maxSpeed * slow - this.vel.y
    const fm = Math.sqrt(tx * tx + ty * ty) || 1
    this.vel.x += (tx / fm) * this.maxForce
    this.vel.y += (ty / fm) * this.maxForce
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1) this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1)
    const a = 0.4 + this.colorWeight * 0.6
    const g = Math.round(107 + (214 - 107) * this.colorWeight)
    ctx.shadowBlur = 5
    ctx.shadowColor = `rgba(140,214,110,${a * 0.7})`
    ctx.fillStyle = `rgba(${Math.round(107 + 33 * this.colorWeight)},${g},${Math.round(92 + 18 * this.colorWeight)},${a})`
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

export default function LogoMarkParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!

    // Logo scale & position — centered on screen, slight upward offset
    const SCALE = Math.min(W * 0.38, 460) / 54
    const logoW = 54 * SCALE
    const logoH = 82 * SCALE
    const offsetX = (W - logoW) / 2
    const offsetY = (H - logoH) / 2 - H * 0.08

    // Sample logo path pixels
    const samplePath = (pathStr: string) => {
      const off = document.createElement('canvas')
      off.width = Math.ceil(logoW)
      off.height = Math.ceil(logoH)
      const octx = off.getContext('2d')!
      octx.scale(SCALE, SCALE)
      octx.fillStyle = 'white'
      octx.fill(new Path2D(pathStr))
      const data = octx.getImageData(0, 0, off.width, off.height).data
      const coords: { x: number; y: number }[] = []
      const step = 5
      for (let i = 0; i < data.length; i += step * 4) {
        if (data[i + 3] > 0) {
          const x = (i / 4) % off.width
          const y = Math.floor(i / 4 / off.width)
          coords.push({ x: x + offsetX, y: y + offsetY })
        }
      }
      return coords
    }

    const allCoords = [...samplePath(RECT_PATH), ...samplePath(V_PATH)]
    for (let i = allCoords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCoords[i], allCoords[j]] = [allCoords[j], allCoords[i]]
    }

    // Create particles starting from random positions across full screen
    const particles = allCoords.map(coord => {
      const p = new Particle()
      p.pos.x = Math.random() * W
      p.pos.y = Math.random() * H
      p.target.x = coord.x
      p.target.y = coord.y
      p.maxSpeed = Math.random() * 7 + 4
      p.maxForce = p.maxSpeed * 0.03
      return p
    })

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.shadowBlur = 0
      for (const p of particles) {
        p.move()
        p.draw(ctx)
      }
      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    // After assembly: hold 1s → fade + shrink + rise
    const holdTimer = setTimeout(() => {
      if (!wrap) return
      wrap.style.transition = 'opacity 1.2s ease, transform 1.4s cubic-bezier(0.22,1,0.36,1)'
      wrap.style.opacity = '0.3'
      wrap.style.transform = 'scale(0.52) translateY(-38vh)'
    }, 4000) // 3s assembly + 1s hold

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      clearTimeout(holdTimer)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 0,
        opacity: 1,
        transformOrigin: '50% 42%',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
    </div>
  )
}
