'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCanvasStore } from '@/store/canvasStore'
import { CanvasNode } from './nodes/CanvasNode'
import { Toolbar } from './Toolbar'
import { ConnectionLines } from './ConnectionLines'
import { ZoomControls } from './ZoomControls'
import { EmptyState } from './EmptyState'
import { CommandPalette } from './CommandPalette'
import { CanvasHeader } from './CanvasHeader'

export function Canvas() {
  const router = useRouter()
  const canvasRef = useRef<HTMLDivElement>(null)
  const { 
    nodes, 
    zoom, 
    panX, 
    panY, 
    setPan, 
    setZoom, 
    addNode, 
    selectNode, 
    selectedNodeId,
    currentCanvasId,
    canvases,
    createCanvas,
    switchCanvas,
  } = useCanvasStore()
  
  const [isPanning, setIsPanning] = useState(false)
  const [startPan, setStartPan] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize canvas on mount
  useEffect(() => {
    setMounted(true)
    
    if (canvases.length === 0) {
      createCanvas('My First Canvas')
    } else if (!currentCanvasId && canvases.length > 0) {
      switchCanvas(canvases[0].id)
    }
  }, [canvases.length, currentCanvasId, createCanvas, switchCanvas])

  // Handle mouse down for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    
    // Only pan if clicking on canvas background
    if (target === canvasRef.current || target.classList.contains('canvas-bg')) {
      if (e.button === 0) {
        // Left click - start panning or deselect
        if (e.altKey || e.shiftKey) {
          // Alt/Shift + click to pan
          setIsPanning(true)
          setStartPan({ x: panX, y: panY })
          setStartPos({ x: e.clientX, y: e.clientY })
          e.preventDefault()
        } else {
          // Normal click - deselect nodes
          selectNode(null)
        }
      } else if (e.button === 1) {
        // Middle mouse button - pan
        setIsPanning(true)
        setStartPan({ x: panX, y: panY })
        setStartPos({ x: e.clientX, y: e.clientY })
        e.preventDefault()
      }
    }
  }, [panX, panY, selectNode])

  // Handle mouse move for panning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - startPos.x
      const dy = e.clientY - startPos.y
      setPan(startPan.x + dx, startPan.y + dy)
    }
  }, [isPanning, startPos, startPan, setPan])

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  // Handle wheel for scrolling and zooming - THIS IS THE KEY FIX
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Prevent default to stop page scrolling
    e.preventDefault()
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom with Ctrl/Cmd + scroll
      const delta = -e.deltaY * 0.002
      const newZoom = Math.max(0.25, Math.min(2, zoom + delta))
      
      // Zoom toward mouse position
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        
        const zoomFactor = newZoom / zoom
        const newPanX = mouseX - (mouseX - panX) * zoomFactor
        const newPanY = mouseY - (mouseY - panY) * zoomFactor
        
        setPan(newPanX, newPanY)
      }
      setZoom(newZoom)
    } else {
      // Smooth pan with scroll
      setPan(panX - e.deltaX, panY - e.deltaY)
    }
  }, [zoom, panX, panY, setZoom, setPan])

  // Attach wheel event with { passive: false } to prevent default
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault()
      
      if (e.ctrlKey || e.metaKey) {
        const delta = -e.deltaY * 0.002
        const newZoom = Math.max(0.25, Math.min(2, useCanvasStore.getState().zoom + delta))
        
        const rect = canvas.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        
        const currentPanX = useCanvasStore.getState().panX
        const currentPanY = useCanvasStore.getState().panY
        const currentZoom = useCanvasStore.getState().zoom
        
        const zoomFactor = newZoom / currentZoom
        const newPanX = mouseX - (mouseX - currentPanX) * zoomFactor
        const newPanY = mouseY - (mouseY - currentPanY) * zoomFactor
        
        useCanvasStore.getState().setPan(newPanX, newPanY)
        useCanvasStore.getState().setZoom(newZoom)
      } else {
        const currentPanX = useCanvasStore.getState().panX
        const currentPanY = useCanvasStore.getState().panY
        useCanvasStore.getState().setPan(currentPanX - e.deltaX, currentPanY - e.deltaY)
      }
    }

    canvas.addEventListener('wheel', wheelHandler, { passive: false })
    return () => canvas.removeEventListener('wheel', wheelHandler)
  }, [])

  // Double click to create note
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target === canvasRef.current || target.classList.contains('canvas-bg')) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const x = (e.clientX - rect.left - panX) / zoom
        const y = (e.clientY - rect.top - panY) / zoom
        addNode('note', x - 140, y - 90)
      }
    }
  }, [addNode, panX, panY, zoom])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      
      // Delete node
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId && 
            document.activeElement?.tagName !== 'TEXTAREA' && 
            document.activeElement?.tagName !== 'INPUT') {
          useCanvasStore.getState().deleteNode(selectedNodeId)
        }
      }
      
      // Deselect
      if (e.key === 'Escape') {
        selectNode(null)
        setShowCommandPalette(false)
      }
      
      // Quick add nodes
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        const centerX = (window.innerWidth / 2 - panX) / zoom - 140
        const centerY = (window.innerHeight / 2 - panY) / zoom - 90
        
        if (e.key === 'n') {
          e.preventDefault()
          addNode('note', centerX, centerY)
        }
        if (e.key === 'l') {
          e.preventDefault()
          addNode('link', centerX, centerY)
        }
        if (e.key === 't') {
          e.preventDefault()
          addNode('task', centerX, centerY)
        }
      }
      
      // Reset view
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault()
        useCanvasStore.getState().resetView()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodeId, selectNode, panX, panY, zoom, addNode])

  // Loading state
  if (!mounted) {
    return (
      <div className="w-screen h-screen bg-marble-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent-lavender to-accent-mint flex items-center justify-center">
            <span className="font-display font-bold text-white text-xl">M</span>
          </div>
          <div className="w-6 h-6 mx-auto border-2 border-accent-lavender/30 border-t-accent-lavender rounded-full animate-spin" />
        </motion.div>
      </div>
    )
  }

  return (
    <div 
      ref={canvasRef}
      className="w-screen h-screen overflow-hidden relative noise-overlay"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      style={{ 
        cursor: isPanning ? 'grabbing' : 'default',
        touchAction: 'none', // Prevent touch scrolling
      }}
    >
      {/* Background with grid */}
      <div 
        className="canvas-bg absolute inset-0 canvas-grid"
        style={{
          backgroundPosition: `${panX}px ${panY}px`,
        }}
      />
      
      {/* Gradient orbs for ambiance */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, transparent 70%)',
            top: '10%',
            left: '60%',
          }}
          animate={{
            x: panX * 0.05,
            y: panY * 0.05,
          }}
          transition={{ type: 'tween', duration: 0 }}
        />
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(78, 205, 196, 0.3) 0%, transparent 70%)',
            bottom: '20%',
            left: '20%',
          }}
          animate={{
            x: panX * 0.03,
            y: panY * 0.03,
          }}
          transition={{ type: 'tween', duration: 0 }}
        />
        <motion.div 
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255, 107, 107, 0.3) 0%, transparent 70%)',
            top: '50%',
            right: '10%',
          }}
          animate={{
            x: panX * 0.04,
            y: panY * 0.04,
          }}
          transition={{ type: 'tween', duration: 0 }}
        />
      </div>

      {/* Canvas content */}
      <div
        className="absolute origin-top-left"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          willChange: 'transform',
        }}
      >
        <ConnectionLines />
        
        <AnimatePresence>
          {nodes.map((node) => (
            <CanvasNode key={node.id} node={node} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {nodes.length === 0 && <EmptyState />}

      {/* UI Overlays */}
      <CanvasHeader />
      <Toolbar />
      <ZoomControls />
      
      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <CommandPalette onClose={() => setShowCommandPalette(false)} />
        )}
      </AnimatePresence>
      
      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-6 left-6 text-xs text-white/30 flex items-center gap-3">
        <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono">⌘K</kbd> commands</span>
        <span className="text-white/20">•</span>
        <span>Scroll to pan</span>
        <span className="text-white/20">•</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono">⌘</kbd>+scroll to zoom</span>
      </div>
    </div>
  )
}
