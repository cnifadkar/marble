'use client'

import React, { useCallback, useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCanvasStore, CanvasNode as NodeType } from '@/store/canvasStore'
import { NoteNode } from './NoteNode'
import { CodeNode } from './CodeNode'
import { LinkNode } from './LinkNode'
import { TaskNode } from './TaskNode'
import { ImageNode } from './ImageNode'
import { X } from 'lucide-react'

interface CanvasNodeProps {
  node: NodeType
}

const colorClasses: Record<string, { bg: string; border: string; glow: string }> = {
  coral: { 
    bg: 'bg-accent-coral/10', 
    border: 'border-accent-coral/30',
    glow: 'shadow-[0_0_30px_rgba(255,107,107,0.15)]'
  },
  mint: { 
    bg: 'bg-accent-mint/10', 
    border: 'border-accent-mint/30',
    glow: 'shadow-[0_0_30px_rgba(78,205,196,0.15)]'
  },
  lavender: { 
    bg: 'bg-accent-lavender/10', 
    border: 'border-accent-lavender/30',
    glow: 'shadow-[0_0_30px_rgba(167,139,250,0.15)]'
  },
  amber: { 
    bg: 'bg-accent-amber/10', 
    border: 'border-accent-amber/30',
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.15)]'
  },
  rose: { 
    bg: 'bg-accent-rose/10', 
    border: 'border-accent-rose/30',
    glow: 'shadow-[0_0_30px_rgba(251,113,133,0.15)]'
  },
  sky: { 
    bg: 'bg-accent-sky/10', 
    border: 'border-accent-sky/30',
    glow: 'shadow-[0_0_30px_rgba(56,189,248,0.15)]'
  },
}

export function CanvasNode({ node }: CanvasNodeProps) {
  const { updateNode, deleteNode, selectNode, selectedNodeId, bringToFront } = useCanvasStore()
  const nodeRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [nodeStart, setNodeStart] = useState({ x: 0, y: 0 })

  const isSelected = selectedNodeId === node.id
  const colors = colorClasses[node.color || 'lavender']

  // Check if the click target is an interactive element
  const isInteractiveElement = (target: HTMLElement): boolean => {
    const interactiveTags = ['INPUT', 'TEXTAREA', 'BUTTON', 'A', 'SELECT']
    let current: HTMLElement | null = target
    
    while (current && current !== nodeRef.current) {
      if (interactiveTags.includes(current.tagName)) return true
      if (current.getAttribute('contenteditable') === 'true') return true
      if (current.classList.contains('no-drag')) return true
      current = current.parentElement
    }
    return false
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Don't start drag if clicking on interactive elements
    if (isInteractiveElement(e.target as HTMLElement)) return
    // Don't drag on right click
    if (e.button !== 0) return
    
    e.preventDefault()
    e.stopPropagation()
    
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setNodeStart({ x: node.x, y: node.y })
    selectNode(node.id)
    bringToFront(node.id)
  }, [node.id, node.x, node.y, selectNode, bringToFront])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const zoom = useCanvasStore.getState().zoom
      const dx = (e.clientX - dragStart.x) / zoom
      const dy = (e.clientY - dragStart.y) / zoom
      
      // Direct DOM update for smoothness (will be synced to state on mouseup)
      if (nodeRef.current) {
        nodeRef.current.style.left = `${nodeStart.x + dx}px`
        nodeRef.current.style.top = `${nodeStart.y + dy}px`
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      const zoom = useCanvasStore.getState().zoom
      const dx = (e.clientX - dragStart.x) / zoom
      const dy = (e.clientY - dragStart.y) / zoom
      
      // Sync final position to state
      updateNode(node.id, {
        x: nodeStart.x + dx,
        y: nodeStart.y + dy,
      })
      setIsDragging(false)
    }

    // Use capture phase for smoother response
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, nodeStart, node.id, updateNode])

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    selectNode(node.id)
    bringToFront(node.id)
  }, [node.id, selectNode, bringToFront])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    deleteNode(node.id)
  }, [node.id, deleteNode])

  const renderContent = () => {
    switch (node.type) {
      case 'note':
        return <NoteNode node={node} />
      case 'code':
        return <CodeNode node={node} />
      case 'link':
        return <LinkNode node={node} />
      case 'task':
        return <TaskNode node={node} />
      case 'image':
        return <ImageNode node={node} />
      default:
        return <NoteNode node={node} />
    }
  }

  return (
    <motion.div
      ref={nodeRef}
      className={`absolute rounded-xl border backdrop-blur-xl transition-shadow duration-200 group select-none
        ${colors.bg} ${colors.border} ${isSelected ? colors.glow : ''}
        ${isSelected ? 'ring-2 ring-white/20' : ''}
        ${isDragging ? 'cursor-grabbing !transition-none' : 'cursor-grab'}
      `}
      style={{
        left: node.x,
        top: node.y,
        width: node.width,
        minHeight: node.height,
        zIndex: node.zIndex,
        willChange: isDragging ? 'left, top' : 'auto',
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Delete button - top right corner */}
      <button
        onClick={handleDelete}
        onMouseDown={(e) => e.stopPropagation()}
        className={`absolute -top-2 -right-2 z-10 p-1.5 rounded-full bg-marble-800 border border-white/10 
          hover:bg-accent-coral/20 hover:border-accent-coral/30 transition-all shadow-lg
          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}
      >
        <X className="w-3 h-3 text-white/70 hover:text-accent-coral" />
      </button>

      {/* Node content */}
      <div className="p-4">
        {renderContent()}
      </div>
    </motion.div>
  )
}
