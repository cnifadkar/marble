'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@/components/Canvas'
import { Onboarding, useOnboarding } from '@/components/Onboarding'

export default function CanvasPage() {
  const { showOnboarding, completeOnboarding, checked } = useOnboarding()

  // Add canvas-page class to body to disable scrolling
  useEffect(() => {
    document.body.classList.add('canvas-page')
    return () => {
      document.body.classList.remove('canvas-page')
    }
  }, [])

  if (!checked) {
    return (
      <div className="min-h-screen bg-marble-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-lavender/30 border-t-accent-lavender rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <Canvas />
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
    </main>
  )
}
