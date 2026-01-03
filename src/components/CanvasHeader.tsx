'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCanvasStore } from '@/store/canvasStore'
import { 
  ChevronDown, 
  Plus, 
  Check,
  LayoutGrid,
  Pencil
} from 'lucide-react'

export function CanvasHeader() {
  const { canvases, currentCanvasId, switchCanvas, createCanvas, renameCanvas } = useCanvasStore()
  const [showDropdown, setShowDropdown] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState('')
  
  const currentCanvas = canvases.find(c => c.id === currentCanvasId)

  const handleRename = () => {
    if (currentCanvas) {
      setRenameValue(currentCanvas.name)
      setIsRenaming(true)
    }
  }

  const handleRenameSubmit = () => {
    if (renameValue.trim() && currentCanvasId) {
      renameCanvas(currentCanvasId, renameValue.trim())
    }
    setIsRenaming(false)
  }

  const handleCreateNew = () => {
    createCanvas('Untitled Canvas')
    setShowDropdown(false)
  }

  const handleSwitch = (id: string) => {
    switchCanvas(id)
    setShowDropdown(false)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Logo and canvas name */}
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-lavender to-accent-mint flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="font-display font-bold text-white text-sm">M</span>
            </div>
          </Link>
          
          <div className="w-px h-6 bg-white/10" />
          
          {/* Canvas selector */}
          <div className="relative">
            {isRenaming ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={handleRenameSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubmit()
                    if (e.key === 'Escape') setIsRenaming(false)
                  }}
                  autoFocus
                  className="bg-white/5 border border-accent-lavender/50 rounded-lg px-3 py-1.5 text-sm font-medium outline-none w-48"
                />
                <button
                  onClick={handleRenameSubmit}
                  className="p-1.5 rounded-lg bg-accent-lavender/20 text-accent-lavender hover:bg-accent-lavender/30 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <span className="font-medium text-white/90">
                  {currentCanvas?.name || 'Select Canvas'}
                </span>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
            )}

            <AnimatePresence>
              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0" 
                    onClick={() => setShowDropdown(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-64 py-2 rounded-xl glass border border-white/10 shadow-2xl"
                  >
                    <div className="px-3 py-2 flex items-center justify-between">
                      <span className="text-xs text-white/40 uppercase tracking-wider">Canvases</span>
                      <Link
                        href="/dashboard"
                        className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <LayoutGrid className="w-3 h-3" />
                        Dashboard
                      </Link>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {canvases.map((canvas) => (
                        <button
                          key={canvas.id}
                          onClick={() => handleSwitch(canvas.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-colors ${
                            canvas.id === currentCanvasId ? 'bg-white/5' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="truncate text-sm">{canvas.name}</span>
                            <span className="text-xs text-white/30">{canvas.nodes.length}</span>
                          </div>
                          {canvas.id === currentCanvasId && (
                            <Check className="w-4 h-4 text-accent-lavender flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    
                    <hr className="my-2 border-white/5" />
                    
                    <button
                      onClick={handleCreateNew}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      New Canvas
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          {/* Rename button */}
          {!isRenaming && (
            <button
              onClick={handleRename}
              className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
              title="Rename canvas"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

