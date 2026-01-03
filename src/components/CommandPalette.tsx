'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useCanvasStore } from '@/store/canvasStore'
import {
  Search,
  StickyNote,
  Code2,
  Link2,
  ListTodo,
  Image,
  Trash2,
  Download,
  Upload,
  Plus,
  LayoutGrid,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Command,
  Layers,
} from 'lucide-react'

interface Command {
  id: string
  label: string
  icon: typeof StickyNote
  shortcut?: string
  action: () => void
  category: string
}

interface CommandPaletteProps {
  onClose: () => void
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const { 
    addNode, 
    clearCanvas, 
    resetView, 
    setZoom, 
    zoom,
    panX,
    panY,
    exportCanvas,
    importCanvas,
    createCanvas,
    canvases,
    switchCanvas,
  } = useCanvasStore()

  const getCenterPosition = useCallback(() => {
    const centerX = (window.innerWidth / 2 - panX) / zoom - 140
    const centerY = (window.innerHeight / 2 - panY) / zoom - 90
    return { x: centerX, y: centerY }
  }, [panX, panY, zoom])

  const handleExport = useCallback(() => {
    const data = exportCanvas()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `marble-canvas-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [exportCanvas])

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          importCanvas(content)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [importCanvas])

  const commands: Command[] = [
    // Create nodes
    {
      id: 'add-note',
      label: 'Add Note',
      icon: StickyNote,
      shortcut: '⌘N',
      action: () => {
        const pos = getCenterPosition()
        addNode('note', pos.x, pos.y)
      },
      category: 'Create',
    },
    {
      id: 'add-code',
      label: 'Add Code Block',
      icon: Code2,
      action: () => {
        const pos = getCenterPosition()
        addNode('code', pos.x, pos.y)
      },
      category: 'Create',
    },
    {
      id: 'add-link',
      label: 'Add Link',
      icon: Link2,
      shortcut: '⌘L',
      action: () => {
        const pos = getCenterPosition()
        addNode('link', pos.x, pos.y)
      },
      category: 'Create',
    },
    {
      id: 'add-task',
      label: 'Add Task List',
      icon: ListTodo,
      shortcut: '⌘T',
      action: () => {
        const pos = getCenterPosition()
        addNode('task', pos.x, pos.y)
      },
      category: 'Create',
    },
    {
      id: 'add-image',
      label: 'Add Image',
      icon: Image,
      action: () => {
        const pos = getCenterPosition()
        addNode('image', pos.x, pos.y)
      },
      category: 'Create',
    },
    // Canvas actions
    {
      id: 'new-canvas',
      label: 'New Canvas',
      icon: Plus,
      action: () => {
        createCanvas('Untitled Canvas')
      },
      category: 'Canvas',
    },
    {
      id: 'go-dashboard',
      label: 'Go to Dashboard',
      icon: LayoutGrid,
      action: () => {
        router.push('/dashboard')
      },
      category: 'Navigation',
    },
    // View actions
    {
      id: 'zoom-in',
      label: 'Zoom In',
      icon: ZoomIn,
      action: () => setZoom(zoom + 0.25),
      category: 'View',
    },
    {
      id: 'zoom-out',
      label: 'Zoom Out',
      icon: ZoomOut,
      action: () => setZoom(zoom - 0.25),
      category: 'View',
    },
    {
      id: 'reset-view',
      label: 'Reset View',
      icon: Maximize2,
      shortcut: '⌘0',
      action: () => resetView(),
      category: 'View',
    },
    // File actions
    {
      id: 'export',
      label: 'Export Canvas',
      icon: Download,
      action: handleExport,
      category: 'File',
    },
    {
      id: 'import',
      label: 'Import Canvas',
      icon: Upload,
      action: handleImport,
      category: 'File',
    },
    {
      id: 'clear',
      label: 'Clear Canvas',
      icon: Trash2,
      action: () => {
        if (confirm('Are you sure you want to clear the canvas?')) {
          clearCanvas()
        }
      },
      category: 'Danger',
    },
    // Canvas switching
    ...canvases.map((canvas) => ({
      id: `switch-${canvas.id}`,
      label: `Switch to "${canvas.name}"`,
      icon: Layers,
      action: () => switchCanvas(canvas.id),
      category: 'Canvases',
    })),
  ]

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  )

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, Command[]>)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = filteredCommands[selectedIndex]
      if (cmd) {
        cmd.action()
        onClose()
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }, [filteredCommands, selectedIndex, onClose])

  const executeCommand = (cmd: Command) => {
    cmd.action()
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Palette */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg mx-4 rounded-2xl glass border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
          <Search className="w-5 h-5 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30"
          />
          <kbd className="px-2 py-1 rounded bg-white/5 text-xs text-white/30 font-mono">esc</kbd>
        </div>

        {/* Commands list */}
        <div className="max-h-80 overflow-y-auto py-2">
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category}>
              <div className="px-4 py-2 text-xs text-white/30 uppercase tracking-wider">
                {category}
              </div>
              {cmds.map((cmd) => {
                const Icon = cmd.icon
                const globalIndex = filteredCommands.indexOf(cmd)
                const isSelected = globalIndex === selectedIndex
                
                return (
                  <button
                    key={cmd.id}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                      isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-accent-lavender' : 'text-white/50'}`} />
                    <span className={`flex-1 text-left ${isSelected ? 'text-white' : 'text-white/80'}`}>
                      {cmd.label}
                    </span>
                    {cmd.shortcut && (
                      <kbd className="px-2 py-0.5 rounded bg-white/5 text-xs text-white/40 font-mono">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-white/40">
              No commands found
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between text-xs text-white/30">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 font-mono">↵</kbd>
              select
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Command className="w-3 h-3" />
            <span>Marble</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

