'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCanvasStore, NodeType } from '@/store/canvasStore'
import { 
  StickyNote, 
  Code2, 
  Link2, 
  ListTodo, 
  Image,
  Sparkles,
  Command
} from 'lucide-react'

const tools: { type: NodeType; icon: typeof StickyNote; label: string; color: string; shortcut: string }[] = [
  { type: 'note', icon: StickyNote, label: 'Note', color: 'lavender', shortcut: '⌘N' },
  { type: 'code', icon: Code2, label: 'Code', color: 'mint', shortcut: '' },
  { type: 'link', icon: Link2, label: 'Link', color: 'sky', shortcut: '⌘L' },
  { type: 'task', icon: ListTodo, label: 'Tasks', color: 'amber', shortcut: '⌘T' },
  { type: 'image', icon: Image, label: 'Image', color: 'rose', shortcut: '' },
]

const colorMap: Record<string, string> = {
  lavender: 'hover:text-accent-lavender hover:bg-accent-lavender/10',
  mint: 'hover:text-accent-mint hover:bg-accent-mint/10',
  sky: 'hover:text-accent-sky hover:bg-accent-sky/10',
  amber: 'hover:text-accent-amber hover:bg-accent-amber/10',
  rose: 'hover:text-accent-rose hover:bg-accent-rose/10',
}

export function Toolbar() {
  const { addNode, panX, panY, zoom } = useCanvasStore()
  const [hoveredTool, setHoveredTool] = useState<string | null>(null)

  const handleAddNode = (type: NodeType) => {
    const centerX = (window.innerWidth / 2 - panX) / zoom - 140
    const centerY = (window.innerHeight / 2 - panY) / zoom - 90
    addNode(type, centerX, centerY)
  }

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
    >
      <div className="glass rounded-2xl p-2 flex items-center gap-1 shadow-xl shadow-black/20">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <div key={tool.type} className="relative">
              <button
                onClick={() => handleAddNode(tool.type)}
                onMouseEnter={() => setHoveredTool(tool.type)}
                onMouseLeave={() => setHoveredTool(null)}
                className={`group relative p-3 rounded-xl transition-all duration-200 ${colorMap[tool.color]}`}
              >
                <Icon className="w-5 h-5 text-white/60 transition-colors group-hover:scale-110 transform" />
              </button>
              
              {/* Enhanced Tooltip */}
              <AnimatePresence>
                {hoveredTool === tool.type && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none"
                  >
                    <div className="px-3 py-2 rounded-lg bg-marble-800 border border-white/10 shadow-xl">
                      <div className="text-white text-sm font-medium whitespace-nowrap">
                        {tool.label}
                      </div>
                      {tool.shortcut && (
                        <div className="text-white/40 text-xs mt-0.5 font-mono">
                          {tool.shortcut}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
        
        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />
        
        {/* AI button */}
        <div className="relative">
          <button
            onMouseEnter={() => setHoveredTool('ai')}
            onMouseLeave={() => setHoveredTool(null)}
            className="group relative p-3 rounded-xl transition-all duration-200 
              hover:bg-gradient-to-r hover:from-accent-lavender/20 hover:to-accent-mint/20"
          >
            <Sparkles className="w-5 h-5 text-white/60 group-hover:text-accent-lavender transition-colors" />
          </button>
          
          <AnimatePresence>
            {hoveredTool === 'ai' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none"
              >
                <div className="px-3 py-2 rounded-lg bg-marble-800 border border-white/10 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium whitespace-nowrap">
                      AI Assistant
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent-lavender/20 text-accent-lavender font-medium">
                      PRO
                    </span>
                  </div>
                  <div className="text-white/40 text-xs mt-0.5">
                    Coming soon
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Command palette trigger */}
        <button
          onClick={() => {
            const event = new KeyboardEvent('keydown', {
              key: 'k',
              metaKey: true,
              bubbles: true,
            })
            window.dispatchEvent(event)
          }}
          onMouseEnter={() => setHoveredTool('cmd')}
          onMouseLeave={() => setHoveredTool(null)}
          className="group relative p-3 rounded-xl transition-all duration-200 hover:bg-white/10"
        >
          <Command className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
        </button>
        
        <AnimatePresence>
          {hoveredTool === 'cmd' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute bottom-full right-0 mb-2 pointer-events-none"
            >
              <div className="px-3 py-2 rounded-lg bg-marble-800 border border-white/10 shadow-xl">
                <div className="text-white text-sm font-medium whitespace-nowrap">
                  Command Palette
                </div>
                <div className="text-white/40 text-xs mt-0.5 font-mono">
                  ⌘K
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
