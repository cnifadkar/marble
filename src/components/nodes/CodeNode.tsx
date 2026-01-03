'use client'

import { useCallback } from 'react'
import { useCanvasStore, CanvasNode } from '@/store/canvasStore'
import { Code2 } from 'lucide-react'

interface CodeNodeProps {
  node: CanvasNode
}

export function CodeNode({ node }: CodeNodeProps) {
  const { updateNode } = useCanvasStore()

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNode(node.id, { content: e.target.value })
  }, [node.id, updateNode])

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-white/40">
        <Code2 className="w-3.5 h-3.5" />
        <span className="text-xs font-mono uppercase tracking-wider">Code</span>
      </div>
      <textarea
        value={node.content}
        onChange={handleChange}
        placeholder="// Your code here..."
        className="w-full min-h-[120px] bg-black/20 rounded-lg border border-white/5 p-3
          font-mono text-sm text-accent-mint/90 leading-relaxed placeholder:text-white/20
          focus:outline-none focus:border-accent-mint/30 resize-none"
        style={{ caretColor: '#4ecdc4' }}
        spellCheck={false}
      />
    </div>
  )
}

