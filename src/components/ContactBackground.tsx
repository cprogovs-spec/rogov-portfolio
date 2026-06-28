'use client'

import { useEffect, useRef } from 'react'

// Perlin noise — from 21st.dev Fluid Particles, adapted for green palette
function createNoise() {
  const perm = [
    151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,
    142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,
    203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,
    74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,
    220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,
    132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,
    186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,
    59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,
    70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
    178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,
    241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,
    176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,
    128,195,78,66,215,61,156,180,
  ]
  const p = new Array(512)
  for (let i = 0; i < 256; i++) p[256 + i] = p[i] = perm[i]

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
  const lerp = (t: number, a: number, b: number) => a + t * (b - a)
  const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : (h === 12 || h === 14 ? x : z)
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  return {
    simplex3: (x: number, y: number, z: number) => {
      const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255
      x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z)
      const u = fade(x), v = fade(y), w = fade(z)
      const A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z
      const B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z
      return lerp(w,
        lerp(v, lerp(u, grad(p[AA], x, y, z), grad(p[BA], x-1, y, z)),
               lerp(u, grad(p[AB], x, y-1, z), grad(p[BB], x-1, y-1, z))),
        lerp(v, lerp(u, grad(p[AA+1], x, y, z-1), grad(p[BA+1], x-1, y, z-1)),
               lerp(u, grad(p[AB+1], x, y-1, z-1), grad(p[BB+1], x-1, y-1, z-1))))
    }
  }
}

interface Particle {
  x: number; y: number
  size: number
  vx: number; vy: number
  life: number; maxLife: number
  hue: number // slight hue variation within green range
}

export default function ContactBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const noise = createNoise()
    const PARTICLE_COUNT = 600
    const NOISE_SCALE = 0.0025
    const SPEED = 1.2

    let raf: number
    let w = 0, h = 0

    const resize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w
      canvas.height = h
    }
    resize()

    const makeParticle = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5 + 0.4,
      vx: 0, vy: 0,
      life: Math.random() * 120,
      maxLife: 80 + Math.random() * 80,
      hue: 120 + Math.random() * 40, // green: 120–160
    })

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, makeParticle)

    // Subtle green glow hotspots — radial gradients at specific positions
    const hotspots = [
      { x: 0.15, y: 0.75, r: 0.45 }, // bottom-left
      { x: 0.85, y: 0.2,  r: 0.4  }, // top-right
    ]

    const t0 = Date.now()

    const loop = () => {
      const t = (Date.now() - t0) * 0.0001

      // Fade trail
      ctx.fillStyle = 'rgba(13,13,13,0.18)'
      ctx.fillRect(0, 0, w, h)

      for (const p of particles) {
        p.life++
        if (p.life > p.maxLife) {
          // respawn
          p.x = Math.random() * w
          p.y = Math.random() * h
          p.life = 0
          p.maxLife = 80 + Math.random() * 80
          p.size = Math.random() * 1.5 + 0.4
          p.hue = 120 + Math.random() * 40
        }

        const n = noise.simplex3(p.x * NOISE_SCALE, p.y * NOISE_SCALE, t)
        const angle = n * Math.PI * 4
        p.vx = p.vx * 0.9 + Math.cos(angle) * SPEED * 0.1
        p.vy = p.vy * 0.9 + Math.sin(angle) * SPEED * 0.1
        p.x += p.vx
        p.y += p.vy

        // Wrap edges
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        const lifeFrac = p.life / p.maxLife
        const alpha = Math.sin(lifeFrac * Math.PI) * 0.55

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 55%, 52%, ${alpha})`
        ctx.fill()
      }

      // Draw ambient green glow spots (very subtle)
      for (const hs of hotspots) {
        const gx = hs.x * w, gy = hs.y * h
        const gr = hs.r * Math.min(w, h)
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr)
        g.addColorStop(0, 'rgba(107,147,92,0.04)')
        g.addColorStop(1, 'rgba(107,147,92,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement ?? canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
