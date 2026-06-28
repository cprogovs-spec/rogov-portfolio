'use client'

import { useRef, useEffect } from 'react'

interface CoverMediaProps {
  src: string
  type: 'video' | 'image'
  hovered?: boolean
  /** 0-1 opacity for background mode */
  bgOpacity?: number
  style?: React.CSSProperties
}

export default function CoverMedia({ src, type, hovered = false, bgOpacity, style }: CoverMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (hovered) {
      v.currentTime = 0
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [hovered])

  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    opacity: bgOpacity ?? 1,
    transition: 'transform 0.5s ease, opacity 0.4s ease',
    transform: hovered && bgOpacity === undefined ? 'scale(1.05)' : 'scale(1)',
    ...style,
  }

  if (!src) return null

  if (type === 'video') {
    return (
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        style={baseStyle}
      />
    )
  }

  if (!src) return null
  return <img src={src} alt="" style={baseStyle} />
}
