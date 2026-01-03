'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ArrowRight, 
  MousePointer2, 
  Command, 
  Move, 
  Sparkles,
  Check
} from 'lucide-react'

interface OnboardingProps {
  onComplete: () => void
}

const steps = [
  {
    title: 'Welcome to Marble',
    description: 'Your spatial canvas for organizing ideas, notes, and everything in between.',
    icon: Sparkles,
    tip: null,
  },
  {
    title: 'Create Nodes',
    description: 'Double-click anywhere on the canvas to create a note. Use the toolbar to add different types of content.',
    icon: MousePointer2,
    tip: 'Try double-clicking!',
  },
  {
    title: 'Move & Organize',
    description: 'Drag nodes by their handle to arrange your ideas. Scroll to pan, and Ctrl+scroll to zoom.',
    icon: Move,
    tip: 'Drag the ⋮⋮ handle',
  },
  {
    title: 'Command Palette',
    description: 'Press ⌘K (or Ctrl+K) to open the command palette. Quickly access all features and switch between canvases.',
    icon: Command,
    tip: 'Press ⌘K now!',
  },
]

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    localStorage.setItem('marble-onboarding-complete', 'true')
    setTimeout(onComplete, 300)
  }

  const handleSkip = () => {
    handleComplete()
  }

  const step = steps[currentStep]
  const Icon = step.icon
  const isLastStep = currentStep === steps.length - 1

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md rounded-2xl glass border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-8">
              {/* Icon */}
              <motion.div
                key={currentStep}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-lavender/20 to-accent-mint/20 flex items-center justify-center"
              >
                <Icon className="w-8 h-8 text-accent-lavender" />
              </motion.div>

              {/* Text */}
              <motion.div
                key={`text-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <h2 className="font-display text-2xl font-bold text-white mb-3">
                  {step.title}
                </h2>
                <p className="text-white/60 leading-relaxed">
                  {step.description}
                </p>
                {step.tip && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-mint/10 border border-accent-mint/20">
                    <span className="text-sm text-accent-mint">{step.tip}</span>
                  </div>
                )}
              </motion.div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-6">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentStep 
                        ? 'w-6 bg-accent-lavender' 
                        : i < currentStep 
                          ? 'bg-accent-mint' 
                          : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-accent-lavender to-accent-mint text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {isLastStep ? (
                    <>
                      Get Started
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const completed = localStorage.getItem('marble-onboarding-complete')
    if (!completed) {
      setShowOnboarding(true)
    }
    setChecked(true)
  }, [])

  return {
    showOnboarding,
    setShowOnboarding,
    checked,
    completeOnboarding: () => {
      localStorage.setItem('marble-onboarding-complete', 'true')
      setShowOnboarding(false)
    },
  }
}

