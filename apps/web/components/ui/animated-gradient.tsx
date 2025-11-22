'use client'

import React, { useEffect, useRef } from 'react'

export const AnimatedGradient = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const colors = [
      { r: 255, g: 107, b: 107 }, // Solar Orange
      { r: 78, g: 205, b: 196 }, // Solar Teal
      { r: 69, g: 183, b: 209 }, // Solar Blue
      { r: 150, g: 206, b: 180 }, // Solar Green
    ]

    let time = 0

    const animate = () => {
      time += 0.002
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < width; i += 4) {
        for (let j = 0; j < height; j += 4) {
          // Simple noise/gradient logic for performance
          // In a real production app, use a shader or pre-rendered image for full screen
          // This is a simplified version for the demo
          if (Math.random() > 0.999) {
            ctx.fillStyle = `rgba(255, 255, 255, 0.1)`
            ctx.fillRect(i, j, 2, 2)
          }
        }
      }

      // Create a moving gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      const c1 = colors[Math.floor(time % colors.length)]
      const c2 = colors[Math.floor((time + 1) % colors.length)]

      if (!c1 || !c2) return

      // Interpolate colors (simplified)
      const r = Math.round(c1.r + (c2.r - c1.r) * (time % 1))
      const g = Math.round(c1.g + (c2.g - c1.g) * (time % 1))
      const b = Math.round(c1.b + (c2.b - c1.b) * (time % 1))

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.05)`
      ctx.fillRect(0, 0, width, height)

      requestAnimationFrame(animate)
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-30"
    />
  )
}
