'use client'

import { motion } from 'framer-motion'
import { useCanvasStore } from '@/store/canvasStore'
import { 
  MousePointer2, 
  Sparkles, 
  StickyNote, 
  Code2, 
  Link2, 
  ListTodo, 
  Image,
  Lightbulb
} from 'lucide-react'

const quickStartItems = [
  { icon: StickyNote, label: 'Note', type: 'note' as const, color: 'lavender' },
  { icon: Code2, label: 'Code', type: 'code' as const, color: 'mint' },
  { icon: Link2, label: 'Link', type: 'link' as const, color: 'sky' },
  { icon: ListTodo, label: 'Tasks', type: 'task' as const, color: 'amber' },
  { icon: Image, label: 'Image', type: 'image' as const, color: 'rose' },
]

const colorClasses: Record<string, string> = {
  lavender: 'bg-accent-lavender/10 text-accent-lavender border-accent-lavender/30 hover:bg-accent-lavender/20',
  mint: 'bg-accent-mint/10 text-accent-mint border-accent-mint/30 hover:bg-accent-mint/20',
  sky: 'bg-accent-sky/10 text-accent-sky border-accent-sky/30 hover:bg-accent-sky/20',
  amber: 'bg-accent-amber/10 text-accent-amber border-accent-amber/30 hover:bg-accent-amber/20',
  rose: 'bg-accent-rose/10 text-accent-rose border-accent-rose/30 hover:bg-accent-rose/20',
}

export function EmptyState() {
  const { addNode, panX, panY, zoom } = useCanvasStore()

  const handleQuickAdd = (type: typeof quickStartItems[0]['type']) => {
    const centerX = (window.innerWidth / 2 - panX) / zoom - 140
    const centerY = (window.innerHeight / 2 - panY) / zoom - 90
    addNode(type, centerX, centerY)
  }

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <div className="text-center max-w-lg px-6">
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl 
            bg-gradient-to-br from-accent-lavender/20 to-accent-mint/20 mb-6 relative"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="w-10 h-10 text-accent-lavender" />
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-lavender/10 to-accent-mint/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
        
        <h2 className="font-display text-3xl font-bold text-white mb-3">
          Start creating
        </h2>
        
        <p className="text-white/50 text-base leading-relaxed mb-8">
          Double-click anywhere on the canvas to create a note, or choose a starting point below.
        </p>
        
        {/* Quick start buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 pointer-events-auto">
          {quickStartItems.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                onClick={() => handleQuickAdd(item.type)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${colorClasses[item.color]}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            )
          })}
        </div>
        
        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-white/30 text-sm">
            <MousePointer2 className="w-4 h-4" />
            <span>Double-click to create</span>
            <span className="text-white/20">•</span>
            <span>Scroll to pan</span>
            <span className="text-white/20">•</span>
            <span>⌘K for commands</span>
          </div>
        </motion.div>

        {/* Inspiration prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-10 p-4 rounded-xl bg-white/[0.03] border border-white/5"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent-amber/10">
              <Lightbulb className="w-4 h-4 text-accent-amber" />
            </div>
            <div className="text-left">
              <p className="text-sm text-white/70 font-medium mb-1">Need inspiration?</p>
              <p className="text-xs text-white/40">
                Try brain-dumping your current project ideas, create a reading list with links, 
                or organize your tasks visually.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
