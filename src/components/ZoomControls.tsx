'use client'

import { motion } from 'framer-motion'
import { useCanvasStore } from '@/store/canvasStore'
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react'

export function ZoomControls() {
  const { zoom, setZoom, resetView } = useCanvasStore()

  const handleZoomIn = () => setZoom(zoom + 0.25)
  const handleZoomOut = () => setZoom(zoom - 0.25)

  const zoomPresets = [0.5, 0.75, 1, 1.25, 1.5, 2]
  const currentPreset = zoomPresets.find(p => Math.abs(p - zoom) < 0.05)

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
    >
      <div className="glass rounded-xl p-1.5 flex flex-col gap-1 shadow-xl shadow-black/20">
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 2}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4 text-white/60" />
        </button>
        
        <button
          onClick={resetView}
          className={`px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors ${
            currentPreset === 1 ? 'bg-white/5' : ''
          }`}
          title="Reset view (⌘0)"
        >
          <span className="text-xs text-white/60 font-mono">
            {Math.round(zoom * 100)}%
          </span>
        </button>
        
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.25}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4 text-white/60" />
        </button>
        
        <div className="w-full h-px bg-white/10 my-1" />
        
        <button
          onClick={resetView}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Reset to default view"
        >
          <RotateCcw className="w-4 h-4 text-white/60" />
        </button>
      </div>
    </motion.div>
  )
}
